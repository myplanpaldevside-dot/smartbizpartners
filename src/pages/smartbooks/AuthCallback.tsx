import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase/Google returned an error in the URL, bail out immediately
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get("error") || params.get("error_description");
    if (urlError) {
      console.error("OAuth callback error:", urlError);
      navigate("/smartbooks/auth?error=" + encodeURIComponent(urlError), { replace: true });
      return;
    }

    // Supabase detects the ?code= param and exchanges it for a session automatically.
    // onAuthStateChange fires with SIGNED_IN once that's done.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/smartbooks", { replace: true });
      } else if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        navigate("/smartbooks/auth", { replace: true });
      }
    });

    // Fallback: if session already exists (e.g. page refresh), go straight in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/smartbooks", { replace: true });
    });

    // Safety net: if nothing fires after 8 seconds, redirect to auth
    const timeout = setTimeout(() => {
      navigate("/smartbooks/auth", { replace: true });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
