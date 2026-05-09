import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, FileText, Search, Filter, MoreVertical, Send, CheckCircle2, AlertCircle, X, Trash2, Eye,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvoiceItem { id?: string; description: string; quantity: number; unit_price: number; amount: number; }
interface Invoice {
  id: string; invoice_number: string; customer_name: string; customer_email: string; customer_phone: string;
  customer_address: string; status: string; issue_date: string; due_date: string | null; subtotal: number;
  tax_rate: number; tax_amount: number; discount_amount: number; total: number; notes: string; currency: string; created_at: string;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  draft: { icon: FileText, color: "text-muted-foreground", label: "Draft" },
  sent: { icon: Send, color: "text-blue-500", label: "Sent" },
  paid: { icon: CheckCircle2, color: "text-emerald-500", label: "Paid" },
  overdue: { icon: AlertCircle, color: "text-destructive", label: "Overdue" },
  cancelled: { icon: X, color: "text-muted-foreground", label: "Cancelled" },
};

export default function Invoices() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState<Invoice | null>(null);
  const [viewItems, setViewItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchInvoices = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (!error && data) setInvoices(data as Invoice[]);
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, []);

  const generateInvoiceNumber = () => {
    const prefix = (profile?.business_name || "SB").substring(0, 3).toUpperCase();
    return `${prefix}-${String(invoices.length + 1).padStart(4, "0")}`;
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_price);
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  const handleCreate = async () => {
    if (!customerName.trim()) { toast({ title: "Customer name required", variant: "destructive" }); return; }
    if (items.every((i) => !i.description.trim())) { toast({ title: "Add at least one item", variant: "destructive" }); return; }
    setSaving(true);
    const invoiceNumber = generateInvoiceNumber();
    const { data: inv, error } = await supabase.from("invoices").insert({
      user_id: user!.id, invoice_number: invoiceNumber, customer_name: customerName,
      customer_email: customerEmail, customer_phone: customerPhone, customer_address: customerAddress,
      due_date: dueDate || null, notes, tax_rate: taxRate, tax_amount: taxAmount,
      discount_amount: discountAmount, subtotal, total, status: "draft",
    }).select().single();
    if (error || !inv) { toast({ title: "Error creating invoice", variant: "destructive" }); setSaving(false); return; }
    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length > 0) {
      await supabase.from("invoice_items").insert(validItems.map((i) => ({
        invoice_id: (inv as any).id, description: i.description, quantity: i.quantity, unit_price: i.unit_price, amount: i.amount,
      })));
    }
    toast({ title: `✓ Invoice ${invoiceNumber} created!` });
    resetForm(); setShowCreate(false); fetchInvoices(); setSaving(false);
  };

  const resetForm = () => {
    setCustomerName(""); setCustomerEmail(""); setCustomerPhone(""); setCustomerAddress("");
    setDueDate(""); setNotes(""); setTaxRate(0); setDiscountAmount(0);
    setItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("invoices").update({ status }).eq("id", id);
    fetchInvoices(); toast({ title: `Invoice marked as ${status}` });
  };

  const deleteInvoice = async (id: string) => {
    await supabase.from("invoice_items").delete().eq("invoice_id", id);
    await supabase.from("invoices").delete().eq("id", id).eq("user_id", user!.id);
    setDeleteConfirm(null);
    fetchInvoices();
    toast({ title: "Invoice deleted" });
  };

  const viewInvoice = async (invoice: Invoice) => {
    setShowView(invoice);
    const { data } = await supabase.from("invoice_items").select("*").eq("invoice_id", invoice.id);
    setViewItems((data as InvoiceItem[]) || []);
  };

  const fmt = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch = inv.customer_name.toLowerCase().includes(search.toLowerCase()) || inv.invoice_number.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterStatus === "all" || inv.status === filterStatus);
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total), 0),
    pending: invoices.filter((i) => ["sent", "draft"].includes(i.status)).reduce((s, i) => s + Number(i.total), 0),
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Create, track and manage invoices</p>
        </div>
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> New Invoice</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Revenue", value: fmt(stats.paid) },
          { label: "Pending", value: fmt(stats.pending) },
          { label: "Overdue", value: stats.overdue },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-3.5 rounded-xl">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</p>
            <p className="font-display text-base font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-lg" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-36 rounded-lg"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-border rounded-xl">
          <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-bold text-sm">No invoices yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first invoice</p>
          <Button size="sm" className="mt-3 rounded-lg" onClick={() => setShowCreate(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Create Invoice</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredInvoices.map((inv, i) => {
            const sc = statusConfig[inv.status] || statusConfig.draft;
            const StatusIcon = sc.icon;
            return (
              <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                className="border border-border bg-card p-3.5 rounded-xl flex items-center justify-between hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => viewInvoice(inv)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex items-center gap-1.5 ${sc.color}`}>
                    <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">{sc.label}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm truncate">{inv.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground">{inv.invoice_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-display font-bold text-sm">{fmt(Number(inv.total))}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(inv.issue_date).toLocaleDateString()}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><MoreVertical className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); viewInvoice(inv); }}><Eye className="h-3.5 w-3.5 mr-2" /> View</DropdownMenuItem>
                      {inv.status === "draft" && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "sent"); }}><Send className="h-3.5 w-3.5 mr-2" /> Mark Sent</DropdownMenuItem>}
                      {["sent", "overdue"].includes(inv.status) && <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "paid"); }}><CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Mark Paid</DropdownMenuItem>}
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(inv.id); }}><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Invoice?</DialogTitle>
            <DialogDescription>This will permanently delete the invoice and all its line items. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-lg" onClick={() => deleteConfirm && deleteInvoice(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">New Invoice</DialogTitle>
            <DialogDescription>Create a professional invoice for your customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Customer Name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" className="rounded-lg" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Email</Label><Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" className="rounded-lg" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Phone</Label><Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+234..." className="rounded-lg" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Due Date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Address</Label><Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Customer address" className="rounded-lg" /></div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-2 block">Line Items</Label>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Description</span>}
                      <Input value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="Item" className="rounded-lg" />
                    </div>
                    <div className="col-span-2">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Qty</span>}
                      <Input type="number" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} min={1} className="rounded-lg" />
                    </div>
                    <div className="col-span-3">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Price (₦)</span>}
                      <Input type="number" value={item.unit_price} onChange={(e) => updateItem(idx, "unit_price", Number(e.target.value))} min={0} className="rounded-lg" />
                    </div>
                    <div className="col-span-1 text-right font-display font-bold text-xs pt-1">{fmt(item.amount)}</div>
                    <div className="col-span-1">
                      {items.length > 1 && <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setItems(items.filter((_, i) => i !== idx))}><X className="h-3 w-3" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2.5 rounded-lg" onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}>
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Tax Rate (%)</Label><Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} min={0} max={100} className="rounded-lg" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Discount (₦)</Label><Input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} min={0} className="rounded-lg" /></div>
            </div>

            <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." className="rounded-lg" /></div>

            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
              {taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>{fmt(taxAmount)}</span></div>}
              {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span>-{fmt(discountAmount)}</span></div>}
              <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-2"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleCreate} disabled={saving}>{saving ? "Creating..." : "Create Invoice"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!showView} onOpenChange={() => setShowView(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {showView && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-display">Invoice {showView.invoice_number}</DialogTitle>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig[showView.status]?.color}`}>{statusConfig[showView.status]?.label}</span>
                </div>
              </DialogHeader>
              <div className="mt-3 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">From</p>
                    <p className="font-display font-bold text-sm">{profile?.business_name || "Your Business"}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Bill To</p>
                    <p className="font-display font-bold text-sm">{showView.customer_name}</p>
                    {showView.customer_email && <p className="text-xs text-muted-foreground">{showView.customer_email}</p>}
                    {showView.customer_phone && <p className="text-xs text-muted-foreground">{showView.customer_phone}</p>}
                  </div>
                </div>

                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                    <div className="col-span-5">Item</div><div className="col-span-2">Qty</div><div className="col-span-3">Price</div><div className="col-span-2 text-right">Amount</div>
                  </div>
                  {viewItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 p-3 border-t border-border text-sm">
                      <div className="col-span-5">{item.description}</div><div className="col-span-2">{item.quantity}</div>
                      <div className="col-span-3">{fmt(Number(item.unit_price))}</div><div className="col-span-2 text-right font-bold">{fmt(Number(item.amount))}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(Number(showView.subtotal))}</span></div>
                  {Number(showView.tax_rate) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax ({showView.tax_rate}%)</span><span>{fmt(Number(showView.tax_amount))}</span></div>}
                  {Number(showView.discount_amount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{fmt(Number(showView.discount_amount))}</span></div>}
                  <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-2"><span>Total</span><span className="text-primary">{fmt(Number(showView.total))}</span></div>
                </div>

                {showView.notes && <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Notes</p><p className="text-sm text-muted-foreground">{showView.notes}</p></div>}

                <div className="flex gap-3">
                  {showView.status === "draft" && <Button className="flex-1 rounded-lg" onClick={() => { updateStatus(showView.id, "sent"); setShowView(null); }}><Send className="h-3.5 w-3.5 mr-1.5" /> Mark Sent</Button>}
                  {["sent", "overdue"].includes(showView.status) && <Button className="flex-1 rounded-lg" onClick={() => { updateStatus(showView.id, "paid"); setShowView(null); }}><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Paid</Button>}
                  <Button variant="outline" className="rounded-lg" onClick={() => setShowView(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
