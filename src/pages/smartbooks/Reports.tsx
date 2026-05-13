import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BarChart3, Receipt, Users, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis } from "recharts";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type InvoiceRow = {
  total: number;
  status: string;
  issue_date: string;
};

type ExpenseRow = {
  amount: number;
  category: string;
  date: string;
};

type CustomerRow = {
  created_at: string;
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const monthLabel = (date: Date) =>
  date.toLocaleDateString("en-NG", {
    month: "short",
  });

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [invoiceRes, expenseRes, customerRes] = await Promise.all([
        supabase.from("invoices").select("total,status,issue_date").eq("user_id", user.id).not("invoice_number", "like", "QT-%"),
        supabase.from("expenses").select("amount,category,date").eq("user_id", user.id),
        supabase.from("customers").select("created_at").eq("user_id", user.id),
      ]);

      if (invoiceRes.error) toast({ title: "Failed to load invoice data", description: invoiceRes.error.message, variant: "destructive" });
      if (expenseRes.error) toast({ title: "Failed to load expense data", description: expenseRes.error.message, variant: "destructive" });
      if (customerRes.error) toast({ title: "Failed to load customer data", description: customerRes.error.message, variant: "destructive" });

      setInvoices((invoiceRes.data as InvoiceRow[] | null) || []);
      setExpenses((expenseRes.data as ExpenseRow[] | null) || []);
      setCustomers((customerRes.data as CustomerRow[] | null) || []);
      setLoading(false);
    };

    fetchAnalytics();
  }, [user]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      return {
        key,
        month: monthLabel(date),
        revenue: 0,
        customers: 0,
      };
    });

    invoices.forEach((invoice) => {
      const date = new Date(invoice.issue_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = months.find((item) => item.key === key);

      if (bucket && invoice.status === "paid") {
        bucket.revenue += Number(invoice.total || 0);
      }
    });

    customers.forEach((customer) => {
      const date = new Date(customer.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = months.find((item) => item.key === key);

      if (bucket) {
        bucket.customers += 1;
      }
    });

    return months;
  }, [customers, invoices]);

  const expenseBreakdown = useMemo(() => {
    const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
      const key = expense.category?.trim() || "Other";
      acc[key] = (acc[key] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});

    const fills = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
      "hsl(var(--muted-foreground))",
      "hsl(var(--foreground))",
    ];

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        fill: fills[index % fills.length],
      }));
  }, [expenses]);

  const overview = useMemo(() => {
    const revenue = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

    const pending = invoices
      .filter((invoice) => invoice.status !== "paid")
      .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return {
      revenue,
      pending,
      totalExpenses,
      customers: customers.length,
    };
  }, [customers.length, expenses, invoices]);

  const statCards = [
    {
      label: "Paid Revenue",
      value: currencyFormatter.format(overview.revenue),
      description: "Closed invoice value",
      icon: Wallet,
    },
    {
      label: "Pending Value",
      value: currencyFormatter.format(overview.pending),
      description: "Open invoice pipeline",
      icon: Receipt,
    },
    {
      label: "Expenses",
      value: currencyFormatter.format(overview.totalExpenses),
      description: "Tracked business spend",
      icon: BarChart3,
    },
    {
      label: "Customers",
      value: overview.customers.toString(),
      description: "Total CRM contacts",
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-subtle p-6 shadow-card">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Reports</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Revenue, expenses, and customer growth</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A cleaner analytics view for SmartBooks, built to work well on mobile and desktop.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card className="rounded-2xl border-border shadow-card">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-3xl border-border shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">Revenue trend</CardTitle>
            <CardDescription>Paid invoice performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[280px] w-full"
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--primary))" },
              }}
            >
              <BarChart data={monthlyTrend}>
                <CartesianGrid vertical={false} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">Expense breakdown</CardTitle>
            <CardDescription>Top categories by spend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer
              className="mx-auto h-[240px] max-w-[280px]"
              config={{
                value: { label: "Amount", color: "hsl(var(--secondary))" },
              }}
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="hsl(var(--background))" />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2">
              {expenseBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
              ) : (
                expenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-muted/40 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-muted-foreground">{currencyFormatter.format(item.value)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Customer growth</CardTitle>
          <CardDescription>How your customer base has grown month by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[280px] w-full"
            config={{
              customers: { label: "Customers", color: "hsl(var(--primary))" },
            }}
          >
            <LineChart data={monthlyTrend}>
              <CartesianGrid vertical={false} />
              <XAxis axisLine={false} dataKey="month" tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Line dataKey="customers" stroke="var(--color-customers)" strokeWidth={3} dot={{ fill: "hsl(var(--background))", stroke: "var(--color-customers)", strokeWidth: 2, r: 4 }} type="monotone" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}