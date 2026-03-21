import { useState, useEffect } from "react";
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
  Globe,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  LogOut,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const tools = [
  { title: "Invoices & Payments", desc: "Create professional invoices, track payments, and send reminders.", icon: FileText, url: "/smartbooks/invoices", status: "live" as const },
  { title: "Expenses & Profit", desc: "Log expenses, track revenue, and see real margins.", icon: Calculator, url: "/smartbooks/expenses", status: "live" as const },
  { title: "Customer CRM", desc: "Manage contacts, log interactions, never miss a follow-up.", icon: Users, url: "/smartbooks/crm", status: "live" as const },
  { title: "Inventory Manager", desc: "Track stock levels, get alerts, see what's selling.", icon: Package, url: "/smartbooks/inventory", status: "live" as const },
  { title: "Quotes & Proposals", desc: "Generate professional quotes and convert to invoices.", icon: FileCheck, url: "/smartbooks/quotes", status: "coming-soon" as const },
  { title: "Website Generator", desc: "AI-powered website builder — online in minutes.", icon: Globe, url: "/smartbooks/website", status: "coming-soon" as const },
];

export default function SmartBooksDashboard() {
  const { profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [invoiceStats, setInvoiceStats] = useState({ count: 0, revenue: 0, pending: 0, customers: 0 });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const { data } = await supabase.from("invoices").select("*");
    if (data) {
      const invoices = data as any[];
      setInvoiceStats({
        count: invoices.length,
        revenue: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total), 0),
        pending: invoices.filter((i) => ["sent", "draft", "overdue"].includes(i.status)).reduce((s, i) => s + Number(i.total), 0),
        customers: new Set(invoices.map((i) => i.customer_name)).size,
      });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ business_name: editName, phone: editPhone, updated_at: new Date().toISOString() })
      .eq("id", profile!.id);
    if (error) {
      toast({ title: "Error updating profile", variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
      setShowSettings(false);
    }
    setSaving(false);
  };

  const openSettings = () => {
    setEditName(profile?.business_name || "");
    setEditPhone(profile?.phone || "");
    setShowSettings(true);
  };

  const businessName = profile?.business_name || "Your Business";

  const quickStats = [
    { label: "Total Revenue", value: formatCurrency(invoiceStats.revenue), icon: TrendingUp, sub: invoiceStats.revenue > 0 ? "Collected" : "Start tracking" },
    { label: "Invoices", value: String(invoiceStats.count), icon: FileText, sub: invoiceStats.count > 0 ? "Total created" : "Create your first" },
    { label: "Pending", value: formatCurrency(invoiceStats.pending), icon: Clock, sub: invoiceStats.pending > 0 ? "Awaiting payment" : "No pending" },
    { label: "Customers", value: String(invoiceStats.customers), icon: Users, sub: invoiceStats.customers > 0 ? "Unique clients" : "Add customers" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Dashboard</p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {businessName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back! Here's your business overview.
            </p>
            {profile?.trial_ends_at && profile?.subscription_status === "trialing" && (
              <p className="text-xs text-primary mt-1 font-medium">
                Free trial ends {new Date(profile.trial_ends_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={openSettings} title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
            className="border border-border bg-card p-4 sm:p-5 rounded-lg hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <CheckCircle2 className="h-3 w-3 text-secondary/40" />
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[9px] text-primary/70 mt-1 font-medium">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Your Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tools.map((tool, i) => (
            <motion.div key={tool.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}>
              <Link
                to={tool.url}
                className={`group block p-5 sm:p-6 border border-border bg-card rounded-lg hover:border-primary/40 transition-all duration-300 hover:shadow-elevated relative overflow-hidden ${
                  tool.status === "live" ? "ring-1 ring-primary/10" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    {tool.status === "live" ? (
                      <span className="text-[9px] font-bold tracking-wider uppercase bg-secondary/15 text-secondary px-2 py-0.5 rounded-full">Live</span>
                    ) : (
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground/60 px-2 py-0.5 border border-border rounded-full">Soon</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                  <div className="flex items-center text-[10px] font-semibold tracking-wider uppercase text-muted-foreground group-hover:text-primary transition-colors">
                    <span>{tool.status === "live" ? "Open" : "Preview"}</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Business Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input value={profile?.email || ""} disabled className="opacity-60" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
