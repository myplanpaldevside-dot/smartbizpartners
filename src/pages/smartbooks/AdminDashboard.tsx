import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  Users,
  FileText,
  TrendingUp,
  Shield,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  email: string | null;
  business_name: string;
  phone: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    setIsAdmin(data && data.length > 0);
    if (data && data.length > 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch all profiles
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (profiles) setUsers(profiles as UserProfile[]);

    // Fetch invoice stats (exclude quotes which use QT- prefix)
    const { data: invoices } = await supabase
      .from("invoices")
      .select("total, status, invoice_number")
      .not("invoice_number", "like", "QT-%");
    if (invoices) {
      setInvoiceCount(invoices.length);
      setTotalRevenue(
        invoices
          .filter((i: any) => i.status === "paid")
          .reduce((s: number, i: any) => s + Number(i.total), 0)
      );
    }
    setLoading(false);
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/smartbooks" replace />;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
    { label: "Total Invoices", value: invoiceCount, icon: FileText, color: "text-secondary" },
    { label: "Platform Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-primary" },
    { label: "Active Trials", value: users.filter(u => u.subscription_status === "trialing").length, icon: CreditCard, color: "text-secondary" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Admin Panel</p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Platform Overview
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border border-border bg-card p-5 rounded-lg"
          >
            <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trial Ends</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.business_name || "—"}</TableCell>
                  <TableCell>{u.email || "—"}</TableCell>
                  <TableCell>{u.phone || "—"}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.subscription_status === "active"
                        ? "bg-secondary/15 text-secondary"
                        : u.subscription_status === "trialing"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {u.subscription_status || "trialing"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.trial_ends_at ? new Date(u.trial_ends_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
