import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Calculator,
  Users,
  Package,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  LogOut,
  Settings,
  Upload,
  Camera,
  ShoppingBag,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const tools = [
  { title: "Invoices", desc: "Create & track invoices", icon: FileText, url: "/smartbooks/invoices", color: "text-blue-500 bg-blue-500/10" },
  { title: "Expenses", desc: "Track spending & profit", icon: Calculator, url: "/smartbooks/expenses", color: "text-orange-500 bg-orange-500/10" },
  { title: "Customers", desc: "Manage your CRM", icon: Users, url: "/smartbooks/crm", color: "text-emerald-500 bg-emerald-500/10" },
  { title: "Inventory", desc: "Stock management", icon: Package, url: "/smartbooks/inventory", color: "text-purple-500 bg-purple-500/10" },
  { title: "Quotes", desc: "Proposals & estimates", icon: FileCheck, url: "/smartbooks/quotes", color: "text-cyan-500 bg-cyan-500/10" },
  { title: "Store", desc: "Your online shop", icon: ShoppingBag, url: "/smartbooks/store", color: "text-pink-500 bg-pink-500/10" },
];

const withTimeout = async <T,>(operation: () => Promise<T>, ms = 20000) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export default function SmartBooksDashboard() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ count: 0, revenue: 0, pending: 0, customers: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const { data } = await supabase.from("invoices").select("*");
    if (data) {
      const invoices = data as any[];
      setStats({
        count: invoices.length,
        revenue: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total), 0),
        pending: invoices.filter((i) => ["sent", "draft", "overdue"].includes(i.status)).reduce((s, i) => s + Number(i.total), 0),
        customers: new Set(invoices.map((i) => i.customer_name)).size,
      });
    }
  };

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Please upload an image file", variant: "destructive" }); return; }
    if (file.size > 2 * 1024 * 1024) { toast({ title: "Image must be under 2MB", variant: "destructive" }); return; }
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/logo.${ext}`;

      const { error: uploadError } = await withTimeout(() =>
        supabase.storage.from("logos").upload(path, file, { upsert: true })
      );
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: profileError } = await withTimeout(() =>
        supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email ?? profile?.email ?? null,
            business_name: profile?.business_name || user.user_metadata?.business_name || "My Business",
            phone: profile?.phone || user.user_metadata?.phone || "",
            logo_url: logoUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
      );
      if (profileError) throw profileError;

      await withTimeout(() => refreshProfile(), 10000);
      toast({ title: "Logo updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message || "Please try again", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast({ title: "Please sign in again", variant: "destructive" });
      return;
    }

    const cleanName = editName.trim();
    if (!cleanName) {
      toast({ title: "Business name is required", variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const { error } = await withTimeout(() =>
        supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email ?? profile?.email ?? null,
            business_name: cleanName,
            phone: editPhone.trim(),
            logo_url: profile?.logo_url ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
      );

      if (error) throw error;

      await withTimeout(() => refreshProfile(), 10000);
      toast({ title: "Profile updated!" });
      setShowSettings(false);
    } catch (err: any) {
      toast({ title: "Error updating profile", description: err?.message || "Please try again", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openSettings = () => {
    const metaName = typeof user?.user_metadata?.business_name === "string" ? user.user_metadata.business_name : "";
    const metaPhone = typeof user?.user_metadata?.phone === "string" ? user.user_metadata.phone : "";
    setEditName(profile?.business_name || metaName || "");
    setEditPhone(profile?.phone || metaPhone || "");
    setShowSettings(true);
  };

  const businessName = profile?.business_name || "Your Business";
  const logoUrl = profile?.logo_url;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickStats = [
    { label: "Revenue", value: fmt(stats.revenue), icon: Wallet, accent: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Invoices", value: String(stats.count), icon: BarChart3, accent: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending", value: fmt(stats.pending), icon: Clock, accent: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Clients", value: String(stats.customers), icon: Users, accent: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-14 w-14 border-2 border-border shadow-sm group-hover:border-primary/50 transition-all">
                <AvatarImage src={logoUrl || undefined} alt={businessName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-display font-bold text-lg">
                  {businessName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <div>
              <p className="text-sm text-muted-foreground">{greeting} 👋</p>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">{businessName}</h1>
              {profile?.trial_ends_at && profile?.subscription_status === "trialing" && (
                <p className="text-xs text-primary mt-0.5 font-medium">
                  Trial ends {new Date(profile.trial_ends_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={openSettings} className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
            className="relative overflow-hidden border border-border bg-card p-4 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`h-4 w-4 ${stat.accent}`} />
            </div>
            <p className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-base font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tools.map((tool, i) => (
            <motion.div key={tool.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.04, duration: 0.35 }}>
              <Link
                to={tool.url}
                className="group flex flex-col items-center text-center p-4 sm:p-5 border border-border bg-card rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-xs sm:text-sm mb-0.5 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-snug hidden sm:block">{tool.desc}</p>
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary mt-2 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Business Settings</DialogTitle>
            <DialogDescription>Update your business info and logo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-20 w-20 border-2 border-border group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={logoUrl || undefined} alt={businessName} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-display font-bold text-2xl">
                    {businessName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs">
                <Upload className="h-3 w-3 mr-1" />
                {uploading ? "Uploading..." : "Upload Logo"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Business Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Phone Number</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Email</Label>
              <Input value={profile?.email || ""} disabled className="opacity-60" />
              <p className="text-[10px] text-muted-foreground">Email can't be changed here. Contact support to update.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
