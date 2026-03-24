import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileCheck, Search, Trash2, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  items: QuoteItem[];
  subtotal: number;
  total: number;
  status: "draft" | "sent" | "accepted" | "declined";
  valid_until: string;
  created_at: string;
  notes: string;
}

export default function Quotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState("30");
  const [items, setItems] = useState<QuoteItem[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);

  // We'll store quotes in localStorage since there's no quotes table yet
  useEffect(() => {
    const stored = localStorage.getItem(`quotes_${user?.id}`);
    if (stored) setQuotes(JSON.parse(stored));
    setLoading(false);
  }, [user]);

  const saveQuotes = (updated: Quote[]) => {
    setQuotes(updated);
    localStorage.setItem(`quotes_${user?.id}`, JSON.stringify(updated));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") {
      updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_price);
    }
    setItems(updated);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const handleCreate = () => {
    if (!customerName.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }
    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length === 0) {
      toast({ title: "Add at least one item", variant: "destructive" });
      return;
    }
    const subtotal = validItems.reduce((s, i) => s + i.amount, 0);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(validDays));

    const newQuote: Quote = {
      id: crypto.randomUUID(),
      quote_number: `QT-${String(quotes.length + 1).padStart(4, "0")}`,
      customer_name: customerName,
      customer_email: customerEmail,
      items: validItems,
      subtotal,
      total: subtotal,
      status: "draft",
      valid_until: validUntil.toISOString(),
      created_at: new Date().toISOString(),
      notes,
    };

    saveQuotes([newQuote, ...quotes]);
    toast({ title: "Quote created!" });
    setShowCreate(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setNotes("");
    setValidDays("30");
    setItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const deleteQuote = (id: string) => {
    saveQuotes(quotes.filter((q) => q.id !== id));
    toast({ title: "Quote deleted" });
  };

  const convertToInvoice = (quote: Quote) => {
    // Navigate to invoices with quote data in state
    toast({ title: "Navigate to Invoices to create from this quote's data" });
    navigate("/smartbooks/invoices");
  };

  const filtered = quotes.filter((q) =>
    q.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    q.quote_number.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-primary/15 text-primary",
    accepted: "bg-emerald/15 text-emerald",
    declined: "bg-destructive/15 text-destructive",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Quotes & Proposals</h1>
          <p className="text-sm text-muted-foreground">Create professional quotes and convert to invoices</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-brand text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> New Quote
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Total Quotes", value: String(quotes.length) },
          { label: "Accepted", value: String(quotes.filter((q) => q.status === "accepted").length) },
          { label: "Pending", value: String(quotes.filter((q) => ["draft", "sent"].includes(q.status)).length) },
        ].map((stat) => (
          <div key={stat.label} className="border border-border bg-card p-4 rounded-lg">
            <p className="font-display text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes..." className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <FileCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No quotes yet. Create your first quote!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote, i) => (
            <motion.div key={quote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="border border-border bg-card p-4 rounded-lg flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-sm">{quote.quote_number}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[quote.status]}`}>{quote.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{quote.customer_name}</p>
                <p className="text-xs text-muted-foreground/60">Valid until {new Date(quote.valid_until).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-display font-bold">{formatCurrency(quote.total)}</p>
                  <p className="text-[10px] text-muted-foreground">{quote.items.length} item(s)</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteQuote(quote.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">New Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Name</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Business name" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valid For (days)</Label>
              <Input type="number" value={validDays} onChange={(e) => setValidDays(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</Label>
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <Input className="flex-1" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
                  <Input className="w-16" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 0)} />
                  <Input className="w-24" type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)} />
                  <span className="text-xs text-muted-foreground w-20 text-right">{formatCurrency(item.amount)}</span>
                  {items.length > 1 && (
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}>
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(items.reduce((s, i) => s + i.amount, 0))}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional terms or notes..." />
            </div>

            <Button onClick={handleCreate} className="w-full gradient-brand text-primary-foreground">
              Create Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
