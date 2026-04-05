import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, Calculator, Users, Package, FileCheck, ArrowRight,
  LogOut, Settings, Camera, ShoppingBag, Wallet, BarChart3, Clock,
  ShoppingCart, Upload, ChartNoAxesCombined,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const tools = [
  { title: "Invoices", desc: "Create & send invoices", icon: FileText, url: "/smartbooks/invoices", color: "text-blue-500 bg-blue-500/10" },
  { title: "Expenses", desc: "Track spending", icon: Calculator, url: "/smartbooks/expenses", color: "text-orange-500 bg-orange-500/10" },
  { title: "Customers", desc: "Manage contacts", icon: Users, url: "/smartbooks/crm", color: "text-emerald-500 bg-emerald-500/10" },
  { title: "Inventory", desc: "Stock levels", icon: Package, url: "/smartbooks/inventory", color: "text-purple-500 bg-purple-500/10" },
  { title: "Quotes", desc: "Send proposals", icon: FileCheck, url: "/smartbooks/quotes", color: "text-cyan-500 bg-cyan-500/10" },
  { title: "Store", desc: "Online shop", icon: ShoppingBag, url: "/smartbooks/store", color: "text-pink-500 bg-pink-500/10" },
  { title: "Orders", desc: "Manage orders", icon: ShoppingCart, url: "/smartbooks/orders", color: "text-amber-500 bg-amber-500/10" },
  { title: "Reports", desc: "Business analytics", icon: ChartNoAxesCombined, url: "/smartbooks/reports", color: "text-violet-500 bg-violet-500/10" },
];

export default function SmartBooksDashboard() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ count: 0, revenue: 0, pending: 0, customers: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const withTimeout = async <T,>(operation: PromiseLike<T>, timeoutMs = 25000): Promise<T> => {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs)),
    ]);
  };

  useEffect(() => { fetchStats(); }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from("invoices").select("*").eq("user_id", user.id);
      if (data) {
        setStats({
          count: data.length,
          revenue: data.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.total), 0),
          pending: data.filter((i: any) => ["sent", "draft", "overdue"].includes(i.status)).reduce((s: number, i: any) => s + Number(i.total), 0),
          customers: new Set(data.map((i: any) => i.customer_name)).size,
        });
      }
    } catch {}
  };

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

  const resolvedBusinessName =
    profile?.business_name?.trim() ||
    (typeof user?.user_metadata?.business_name === "string" ? user.user_metadata.business_name.trim() : "") ||
    user?.email?.split("@")[0] ||
    "My Business";

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported image format",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/logo-${Date.now()}.${ext}`;

      const { error: uploadError } = await withTimeout(
        supabase.storage.from("logos").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: true }),
      );

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: profileError } = await withTimeout(
        supabase.from("profiles").upsert({
          id: user.id,
          email: profile?.email || user.email || null,
          business_name: resolvedBusinessName,
          phone: profile?.phone || "",
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" }),
      );

      if (profileError) throw profileError;

      await refreshProfile();
      toast({ title: "✓ Logo updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message || "Try again", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    const cleanName = editName.trim();
    if (!cleanName) { toast({ title: "Business name is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const { error } = await withTimeout(
        supabase.from("profiles").upsert({
          id: user.id,
          email: editEmail.trim() || user.email || null,
          business_name: cleanName,
          phone: editPhone.trim(),
          logo_url: profile?.logo_url ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" }),
      );
      if (error) throw error;
      await refreshProfile();
      toast({ title: "✓ Settings saved!" });
      setShowSettings(false);
    } catch (err: any) {
      toast({ title: "Error saving", description: err?.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const openSettings = () => {
    setEditName(profile?.business_name || "");
    setEditPhone(profile?.phone || "");
    setEditEmail(profile?.email || user?.email || "");
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
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-border group-hover:border-primary/40 transition-all shadow-sm">
                <AvatarImage src={logoUrl || undefined} alt={businessName} />
                <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-lg">
                  {businessName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{greeting} 👋</p>
              <h1 className="font-display text-lg sm:text-2xl font-bold text-foreground leading-tight">{businessName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={openSettings} className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.04, duration: 0.35 }}
            className="border border-border bg-card p-3.5 sm:p-4 rounded-xl hover:shadow-sm transition-shadow"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2.5`}>
              <stat.icon className={`h-4 w-4 ${stat.accent}`} />
            </div>
            <p className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-sm font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {tools.map((tool, i) => (
            <motion.div key={tool.title} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 + i * 0.03, duration: 0.3 }}>
              <Link
                to={tool.url}
                className="group flex items-center gap-3 p-3 sm:p-3.5 border border-border bg-card rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className={`w-9 h-9 rounded-lg ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <tool.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xs sm:text-sm group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-snug hidden sm:block">{tool.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Business Settings</DialogTitle>
            <DialogDescription>Update your business details and branding.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-20 w-20 border-2 border-border group-hover:border-primary/40 transition-colors">
                  <AvatarImage src={logoUrl || undefined} alt={businessName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-2xl">
                    {businessName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs rounded-lg">
                <Upload className="h-3 w-3 mr-1.5" />
                {uploading ? "Uploading..." : "Upload Logo"}
              </Button>
              <p className="text-[10px] text-muted-foreground">JPG, PNG, WEBP • max 5MB</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Business Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-lg" placeholder="Your business name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="rounded-lg" placeholder="you@business.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Phone Number</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="rounded-lg" placeholder="+234..." />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleSaveSettings} disabled={saving || uploading}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
