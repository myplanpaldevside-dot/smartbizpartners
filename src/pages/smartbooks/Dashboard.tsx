import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Calculator, Users, Package, FileCheck, ArrowRight,
  LogOut, Settings, Camera, ShoppingBag, Wallet, BarChart3, Clock,
  ShoppingCart, Upload, ChartNoAxesCombined, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Eye, EyeOff, Copy, ExternalLink,
  CircleDollarSign, PackageCheck, UserPlus, Globe, MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const withTimeout = async <T,>(operation: PromiseLike<T>, timeoutMs = 10000): Promise<T> => {
  return await Promise.race([
    Promise.resolve(operation),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs)),
  ]);
};

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

export default function SmartBooksDashboard() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [stats, setStats] = useState({
    invoiceCount: 0,
    revenue: 0,
    pending: 0,
    customers: 0,
    expenses: 0,
    orders: 0,
    productsSold: 0,
    lowStockCount: 0,
    unpaidInvoices: 0,
    newCustomersThisMonth: 0,
    storeSlug: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user) fetchStats(); }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    try {
      const [invoiceRes, expenseRes, customerRes, inventoryRes, orderRes, storeRes] = await Promise.all([
        supabase.from("invoices").select("total,status,customer_name").eq("user_id", user.id),
        supabase.from("expenses").select("amount").eq("user_id", user.id),
        supabase.from("customers").select("created_at").eq("user_id", user.id),
        supabase.from("inventory").select("quantity,low_stock_threshold").eq("user_id", user.id),
        supabase.from("store_orders").select("total,status,payment_status").eq("store_user_id", user.id),
        supabase.from("store_settings").select("store_slug").eq("user_id", user.id).maybeSingle(),
      ]);

      const invoices = invoiceRes.data || [];
      const expenseData = expenseRes.data || [];
      const customerData = customerRes.data || [];
      const inventoryData = inventoryRes.data || [];
      const orderData = orderRes.data || [];

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      setStats({
        invoiceCount: invoices.length,
        revenue: invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.total), 0),
        pending: invoices.filter((i: any) => ["sent", "draft", "overdue"].includes(i.status)).reduce((s: number, i: any) => s + Number(i.total), 0),
        customers: customerData.length,
        expenses: expenseData.reduce((s: number, e: any) => s + Number(e.amount), 0),
        orders: orderData.length,
        productsSold: orderData.filter((o: any) => o.payment_status === "paid").length,
        lowStockCount: inventoryData.filter((i: any) => i.quantity <= i.low_stock_threshold).length,
        unpaidInvoices: invoices.filter((i: any) => i.status !== "paid").length,
        newCustomersThisMonth: customerData.filter((c: any) => c.created_at >= thisMonthStart).length,
        storeSlug: storeRes.data?.store_slug || "",
      });
    } catch (err) {
      console.error("fetchStats error:", err);
    }
  };

  const resolvedBusinessName =
    profile?.business_name?.trim() ||
    (typeof user?.user_metadata?.business_name === "string" ? user.user_metadata.business_name.trim() : "") ||
    user?.email?.split("@")[0] ||
    "My Business";

  const businessName = profile?.business_name || "Your Business";
  const logoUrl = profile?.logo_url;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // To-do / alerts
  const alerts = useMemo(() => {
    const items: { icon: any; text: string; link: string; type: "warning" | "info" }[] = [];
    if (stats.unpaidInvoices > 0) items.push({ icon: AlertCircle, text: `${stats.unpaidInvoices} unpaid invoice${stats.unpaidInvoices > 1 ? "s" : ""} need attention`, link: "/smartbooks/invoices", type: "warning" });
    if (stats.lowStockCount > 0) items.push({ icon: Package, text: `${stats.lowStockCount} product${stats.lowStockCount > 1 ? "s" : ""} running low on stock`, link: "/smartbooks/inventory", type: "warning" });
    if (!profile?.logo_url) items.push({ icon: Camera, text: "Upload your business logo", link: "#", type: "info" });
    if (!stats.storeSlug) items.push({ icon: ShoppingBag, text: "Set up your online store", link: "/smartbooks/store", type: "info" });
    return items;
  }, [stats, profile]);

  const netProfit = stats.revenue - stats.expenses;

  // --- handlers (logo, settings) ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Unsupported format", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Image must be under 5MB", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await withTimeout(supabase.storage.from("logos").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: true }));
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      const newLogoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error: profileError } = await withTimeout(supabase.from("profiles").upsert({ id: user.id, email: profile?.email || user.email || null, business_name: resolvedBusinessName, phone: profile?.phone || "", logo_url: newLogoUrl, updated_at: new Date().toISOString() }, { onConflict: "id" }));
      if (profileError) throw profileError;
      await refreshProfile();
      toast({ title: "✓ Logo updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    const cleanName = editName.trim();
    if (!cleanName) { toast({ title: "Business name is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const { error } = await withTimeout(supabase.from("profiles").upsert({ id: user.id, email: editEmail.trim() || user.email || null, business_name: cleanName, phone: editPhone.trim(), logo_url: profile?.logo_url ?? null, updated_at: new Date().toISOString() }, { onConflict: "id" }));
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

  const copyStoreLink = () => {
    if (stats.storeSlug) {
      navigator.clipboard.writeText(`${window.location.origin}/store/${stats.storeSlug}`);
      toast({ title: "Store link copied!" });
    }
  };

  const overviewStats = [
    { label: "Orders", value: String(stats.orders), icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
    { label: "Products Sold", value: String(stats.productsSold), icon: PackageCheck, color: "text-emerald-600 bg-emerald-100" },
    { label: "New Customers", value: String(stats.newCustomersThisMonth), icon: UserPlus, color: "text-orange-600 bg-orange-100" },
    { label: "Total Clients", value: String(stats.customers), icon: Users, color: "text-purple-600 bg-purple-100" },
  ];

  const quickLinks = [
    { title: "Invoices", desc: "Create & send", icon: FileText, url: "/smartbooks/invoices", color: "text-blue-600 bg-blue-50" },
    { title: "Expenses", desc: "Track spending", icon: Calculator, url: "/smartbooks/expenses", color: "text-orange-600 bg-orange-50" },
    { title: "Customers", desc: "Manage CRM", icon: Users, url: "/smartbooks/crm", color: "text-emerald-600 bg-emerald-50" },
    { title: "Inventory", desc: "Stock levels", icon: Package, url: "/smartbooks/inventory", color: "text-purple-600 bg-purple-50" },
    { title: "Quotes", desc: "Proposals", icon: FileCheck, url: "/smartbooks/quotes", color: "text-cyan-600 bg-cyan-50" },
    { title: "Store", desc: "Online shop", icon: ShoppingBag, url: "/smartbooks/store", color: "text-pink-600 bg-pink-50" },
    { title: "Orders", desc: "Track orders", icon: ShoppingCart, url: "/smartbooks/orders", color: "text-amber-600 bg-amber-50" },
    { title: "Reports", desc: "Analytics", icon: ChartNoAxesCombined, url: "/smartbooks/reports", color: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Greeting Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/40 transition-all shadow-sm">
              <AvatarImage src={logoUrl || undefined} alt={businessName} />
              <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-lg">{businessName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-4 w-4 text-white" />
            </div>
            {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Hello, {businessName.split(" ")[0]}</h1>
            {stats.storeSlug && (
              <button onClick={copyStoreLink} className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                <Globe className="h-3 w-3" /> Share your store link <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={openSettings}><Settings className="h-3.5 w-3.5" /> Settings</Button>
          <Button variant="ghost" size="sm" className="rounded-xl text-xs text-muted-foreground" onClick={signOut}><LogOut className="h-3.5 w-3.5" /></Button>
        </div>
      </motion.div>

      {/* Main Grid: Wallet + Alerts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Wallet / Revenue Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="rounded-2xl border-border overflow-hidden">
            <div className="bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Total Revenue</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px]">NGN</Badge>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="opacity-70 hover:opacity-100 transition-opacity">
                    {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {balanceVisible ? fmt(stats.revenue) : "••••••••••"}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Pending</p>
                  <p className="font-display text-sm font-bold mt-0.5">{balanceVisible ? fmt(stats.pending) : "••••••"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Expenses</p>
                  <p className="font-display text-sm font-bold mt-0.5">{balanceVisible ? fmt(stats.expenses) : "••••••"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">Net Profit</p>
                  <p className={`font-display text-sm font-bold mt-0.5 ${netProfit >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {balanceVisible ? fmt(netProfit) : "••••••"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* To-Do / Alerts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="rounded-2xl border-border h-full">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="font-display text-sm font-bold flex items-center justify-between">
                To-Do List
                <Badge variant="secondary" className="text-[10px]">{alerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1.5">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                  <p className="text-sm font-medium text-foreground">All clear!</p>
                  <p className="text-xs text-muted-foreground">No pending tasks</p>
                </div>
              ) : (
                alerts.map((alert, i) => (
                  <Link
                    key={i}
                    to={alert.link === "#" ? "#" : alert.link}
                    onClick={alert.link === "#" ? () => fileInputRef.current?.click() : undefined}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${alert.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
                      <alert.icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs text-foreground flex-1 leading-snug">{alert.text}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Business Overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">Business Overview</h2>
            <p className="text-xs text-muted-foreground">Here's how your business is doing today</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {overviewStats.map((stat, i) => (
            <Card key={stat.label} className="rounded-xl border-border">
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Financial Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-4 text-center">Overview of Your Business</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CircleDollarSign className="h-4 w-4" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Sales</p>
                <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmt(stats.revenue + stats.pending)}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Settled</p>
                <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmt(stats.revenue)}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Owed</p>
                <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmt(stats.pending)}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expenses</p>
                <p className="font-display text-lg font-bold text-foreground mt-0.5">{fmt(stats.expenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-display text-base font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quickLinks.map((tool, i) => (
            <Link
              key={tool.title}
              to={tool.url}
              className="group flex items-center gap-2.5 p-3 border border-border bg-card rounded-xl hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <tool.icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs group-hover:text-primary transition-colors">{tool.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug hidden sm:block">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

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
                  <AvatarFallback className="bg-primary/10 text-primary font-display font-bold text-2xl">{businessName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-xs rounded-lg">
                <Upload className="h-3 w-3 mr-1.5" />{uploading ? "Uploading..." : "Upload Logo"}
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
              <Button className="flex-1 rounded-lg" onClick={handleSaveSettings} disabled={saving || uploading}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
