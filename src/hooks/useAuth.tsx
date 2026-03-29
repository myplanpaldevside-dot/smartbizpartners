import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string | null;
  business_name: string;
  phone: string | null;
  logo_url?: string | null;
  subscription_status?: string | null;
  trial_ends_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async (currentUser: User) => {
    const userId = currentUser.id;

    try {
      const [{ data: profileData, error: profileError }, { data: roles, error: rolesError }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin"),
      ]);

      if (rolesError) throw rolesError;
      if (profileError && profileError.code !== "PGRST116") throw profileError;

      let nextProfile = profileData as unknown as Profile | null;

      if (!nextProfile) {
        const metadataBusinessName =
          typeof currentUser.user_metadata?.business_name === "string"
            ? currentUser.user_metadata.business_name.trim()
            : "";
        const metadataPhone =
          typeof currentUser.user_metadata?.phone === "string"
            ? currentUser.user_metadata.phone.trim()
            : "";

        const { data: createdProfile, error: createProfileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              email: currentUser.email ?? null,
              business_name: metadataBusinessName || (currentUser.email?.split("@")[0] ?? "My Business"),
              phone: metadataPhone,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )
          .select("*")
          .single();

        if (createProfileError) throw createProfileError;
        nextProfile = createdProfile as unknown as Profile;
      }

      setProfile(nextProfile);
      setIsAdmin(!!(roles && roles.length > 0));
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setProfile(null);
      setIsAdmin(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Safety timeout - never stay loading for more than 3 seconds
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 3000);

    // Get initial session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Then listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
