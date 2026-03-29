import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileCheck, Search, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface QuoteItem { description: string; quantity: number; unit_price: number; amount: number; }
interface Quote {
  id: string; quote_number: string; customer_name: string; customer_email: string; items: QuoteItem[];
  subtotal: number; total: number; status: "draft" | "sent" | "accepted" | "declined";
  valid_until: string; created_at: string; notes: string;
}

export default function Quotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState("30");
  const [items, setItems] = useState<QuoteItem[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);

  useEffect(() => {
    const stored = localStorage.getItem(`quotes_${user?.id}`);
    if (stored) setQuotes(JSON.parse(stored));
    setLoading(false);
  }, [user]);

  const saveQuotes = (updated: Quote[]) => { setQuotes(updated); localStorage.setItem(`quotes_${user?.id}`, JSON.stringify(updated)); };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_price);
    setItems(updated);
  };

  const fmt = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const handleCreate = () => {
    if (!customerName.trim()) { toast({ title: "Customer name required", variant: "destructive" }); return; }
    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length === 0) { toast({ title: "Add at least one item", variant: "destructive" }); return; }
    const subtotal = validItems.reduce((s, i) => s + i.amount, 0);
    const validUntil = new Date(); validUntil.setDate(validUntil.getDate() + parseInt(validDays));
    const newQuote: Quote = {
      id: crypto.randomUUID(), quote_number: `QT-${String(quotes.length + 1).padStart(4, "0")}`,
      customer_name: customerName, customer_email: customerEmail, items: validItems,
      subtotal, total: subtotal, status: "draft", valid_until: validUntil.toISOString(),
      created_at: new Date().toISOString(), notes,
    };
    saveQuotes([newQuote, ...quotes]);
    toast({ title: "✓ Quote created!" });
    setShowCreate(false); resetForm();
  };

  const resetForm = () => { setCustomerName(""); setCustomerEmail(""); setNotes(""); setValidDays("30"); setItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]); };
  const deleteQuote = (id: string) => { saveQuotes(quotes.filter((q) => q.id !== id)); toast({ title: "Quote deleted" }); };
  const filtered = quotes.filter((q) => q.customer_name.toLowerCase().includes(search.toLowerCase()) || q.quote_number.toLowerCase().includes(search.toLowerCase()));

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground", sent: "bg-blue-500/10 text-blue-600",
    accepted: "bg-emerald-500/10 text-emerald-600", declined: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Quotes</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Create proposals and convert to invoices</p>
        </div>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> New Quote</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Quotes", value: String(quotes.length) },
          { label: "Accepted", value: String(quotes.filter((q) => q.status === "accepted").length) },
          { label: "Pending", value: String(quotes.filter((q) => ["draft", "sent"].includes(q.status)).length) },
        ].map((stat) => (
          <div key={stat.label} className="border border-border bg-card p-3.5 rounded-xl">
            <p className="font-display text-base font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes..." className="pl-9 rounded-lg" />
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-xl">
          <FileCheck className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium">No quotes yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first quote!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((quote, i) => (
            <motion.div key={quote.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
              className="border border-border bg-card p-3.5 rounded-xl flex items-center justify-between hover:border-primary/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-bold text-sm">{quote.quote_number}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${statusColors[quote.status]}`}>{quote.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{quote.customer_name}</p>
                <p className="text-[10px] text-muted-foreground/60">Valid until {new Date(quote.valid_until).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-display font-bold text-sm">{fmt(quote.total)}</p>
                  <p className="text-[10px] text-muted-foreground">{quote.items.length} item{quote.items.length !== 1 && "s"}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => deleteQuote(quote.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">New Quote</DialogTitle>
            <DialogDescription>Create a professional quote for your customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Customer Name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" className="rounded-lg" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Email</Label><Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" className="rounded-lg" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Valid For (days)</Label><Input type="number" value={validDays} onChange={(e) => setValidDays(e.target.value)} className="rounded-lg" /></div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Items</Label>
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <Input className="flex-1 rounded-lg" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
                  <Input className="w-16 rounded-lg" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 0)} />
                  <Input className="w-24 rounded-lg" type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)} />
                  <span className="text-[10px] text-muted-foreground w-20 text-right shrink-0">{fmt(item.amount)}</span>
                  {items.length > 1 && <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7 rounded-lg" onClick={() => setItems(items.filter((_, i) => i !== idx))}><X className="h-3 w-3" /></Button>}
                </div>
              ))}
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}>
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-display font-bold text-lg"><span>Total</span><span className="text-primary">{fmt(items.reduce((s, i) => s + i.amount, 0))}</span></div>
            </div>

            <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Terms or notes..." className="rounded-lg" /></div>

            <Button onClick={handleCreate} className="w-full rounded-lg">Create Quote</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
