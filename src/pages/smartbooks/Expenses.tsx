import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Calculator,
  TrendingUp,
  TrendingDown,
  Search,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
}

const categories = [
  "Rent", "Utilities", "Transport", "Supplies", "Marketing",
  "Salary", "Equipment", "Food", "Internet", "Other",
];

export default function Expenses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });
    if (data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleCreate = async () => {
    if (!description.trim() || !amount) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({
      user_id: user!.id,
      description,
      amount: Number(amount),
      category,
      date,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Expense added!" });
      setShowCreate(false);
      setDescription(""); setAmount(""); setCategory("Other");
      fetchExpenses();
    }
    setSaving(false);
  };

  const deleteExpense = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    fetchExpenses();
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amt);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const thisMonth = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((s, e) => s + Number(e.amount), 0);

  const filtered = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Expenses & Profit</h1>
          <p className="text-sm text-muted-foreground">Track your business spending</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="border border-border bg-card p-4 rounded-lg">
          <TrendingDown className="h-4 w-4 text-destructive mb-2" />
          <p className="font-display text-xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Expenses</p>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <Calculator className="h-4 w-4 text-primary mb-2" />
          <p className="font-display text-xl font-bold">{formatCurrency(thisMonth)}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">This Month</p>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <TrendingUp className="h-4 w-4 text-secondary mb-2" />
          <p className="font-display text-xl font-bold">{expenses.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Entries</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <Calculator className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-display font-bold">No expenses yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your spending</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 border border-border bg-card rounded-lg hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {exp.category}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{exp.description}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-destructive">-{formatCurrency(Number(exp.amount))}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteExpense(exp.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Add Expense</DialogTitle>
            <DialogDescription>Record a new business expense.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was it for?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (₦)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
