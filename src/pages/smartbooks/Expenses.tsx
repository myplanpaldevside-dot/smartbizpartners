import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calculator, TrendingDown, Search, Trash2, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Expense {
  id: string; description: string; amount: number; category: string; date: string; created_at: string;
}

const categories = ["Rent", "Utilities", "Transport", "Supplies", "Marketing", "Salary", "Equipment", "Food", "Internet", "Other"];

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;
    const { data } = await supabase.from("expenses").select("*").eq("user_id", user.id).order("date", { ascending: false });
    if (data) setExpenses(data as Expense[]);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchExpenses(); }, [user]);

  const handleCreate = async () => {
    if (!description.trim() || !amount) { toast({ title: "Fill in all fields", variant: "destructive" }); return; }
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({ user_id: user!.id, description, amount: Number(amount), category, date });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "✓ Expense added!" }); setShowCreate(false); setDescription(""); setAmount(""); setCategory("Other"); fetchExpenses(); }
    setSaving(false);
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user!.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    setDeleteConfirm(null);
    fetchExpenses();
    toast({ title: "Expense deleted" });
  };

  const fmt = (amt: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amt);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const now = new Date();
  const thisMonth = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, e) => s + Number(e.amount), 0);
  const filtered = expenses.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Expenses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Track your business spending</p>
        </div>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Expense</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Expenses", value: fmt(totalExpenses), icon: TrendingDown, color: "text-red-500 bg-red-500/10" },
          { label: "This Month", value: fmt(thisMonth), icon: Calculator, color: "text-blue-500 bg-blue-500/10" },
          { label: "Total Entries", value: String(expenses.length), icon: Receipt, color: "text-purple-500 bg-purple-500/10" },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-3.5 rounded-xl">
            <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="h-3.5 w-3.5" /></div>
            <p className="font-display text-sm sm:text-base font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-xl">
          <Calculator className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-sm">No expenses yet</p>
          <p className="text-xs text-muted-foreground mt-1">Start tracking your spending</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between p-3.5 border border-border bg-card rounded-xl hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">{exp.category}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{exp.description}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-sm text-destructive">-{fmt(Number(exp.amount))}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setDeleteConfirm(exp.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Expense?</DialogTitle>
            <DialogDescription>This will permanently remove this expense entry. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-lg" onClick={() => deleteConfirm && deleteExpense(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Add Expense</DialogTitle>
            <DialogDescription>Record a new business expense.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was it for?" className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Amount (₦)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button className="w-full rounded-lg" onClick={handleCreate} disabled={saving}>
              {saving ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
