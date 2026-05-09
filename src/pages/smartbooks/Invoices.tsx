import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, FileText, Search, Filter, MoreVertical, Send, CheckCircle2,
  AlertCircle, X, Trash2, Eye, Printer, UserCheck,
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
interface Customer { id: string; name: string; email: string | null; phone: string | null; address: string | null; }

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  draft:     { icon: FileText,     color: "text-muted-foreground", label: "Draft" },
  sent:      { icon: Send,         color: "text-blue-500",         label: "Sent" },
  paid:      { icon: CheckCircle2, color: "text-emerald-500",      label: "Paid" },
  overdue:   { icon: AlertCircle,  color: "text-destructive",      label: "Overdue" },
  cancelled: { icon: X,            color: "text-muted-foreground", label: "Cancelled" },
};

export default function Invoices() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState<Invoice | null>(null);
  const [viewItems, setViewItems] = useState<InvoiceItem[]>([]);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [customerPickerSearch, setCustomerPickerSearch] = useState("");
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

  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);

  const fetchInvoices = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .not("invoice_number", "like", "QT-%")
      .order("created_at", { ascending: false });
    if (!error && data) setInvoices(data as Invoice[]);
    setLoading(false);
  }, [user]);

  const fetchCustomers = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("customers")
      .select("id,name,email,phone,address")
      .eq("user_id", user.id)
      .order("name");
    if (data) setCustomers(data as Customer[]);
  }, [user]);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, [fetchInvoices, fetchCustomers]);

  const generateInvoiceNumber = async () => {
    const prefix = (profile?.business_name || "SB").substring(0, 3).toUpperCase();
    const { data } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user!.id)
      .not("invoice_number", "like", "QT-%")
      .order("created_at", { ascending: false })
      .limit(1);
    let nextNum = 1;
    if (data && data.length > 0) {
      const match = data[0].invoice_number.match(/(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    return `${prefix}-${String(nextNum).padStart(4, "0")}`;
  };

  const pickCustomer = (c: Customer) => {
    setCustomerName(c.name);
    setCustomerEmail(c.email || "");
    setCustomerPhone(c.phone || "");
    setCustomerAddress(c.address || "");
    setShowCustomerPicker(false);
    setCustomerPickerSearch("");
  };

  const printInvoice = (invoice: Invoice, lineItems: InvoiceItem[]) => {
    const win = window.open("", "_blank", "width=860,height=720");
    if (!win) { toast({ title: "Allow popups to print", variant: "destructive" }); return; }
    const fmtDate = (d: string) =>
      new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Invoice ${invoice.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#111827;padding:48px;max-width:820px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
.biz-name{font-size:22px;font-weight:800;letter-spacing:-0.02em}
.biz-info{font-size:12px;color:#6b7280;margin-top:6px;line-height:1.7}
.inv-label{font-size:34px;font-weight:800;color:#7c3aed;letter-spacing:-0.04em}
.inv-meta{text-align:right;font-size:12px;color:#6b7280;margin-top:4px}
.badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-top:8px}
.badge-paid{background:#d1fae5;color:#065f46}
.badge-draft{background:#f3f4f6;color:#6b7280}
.badge-sent{background:#dbeafe;color:#1e40af}
.badge-overdue{background:#fee2e2;color:#991b1b}
.badge-cancelled{background:#f3f4f6;color:#6b7280}
.divider{border:none;border-top:1px solid #f3f4f6;margin:28px 0}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:28px}
.label{font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;font-weight:600;margin-bottom:6px}
.party-name{font-size:15px;font-weight:700}
.party-info{font-size:12px;color:#6b7280;line-height:1.7;margin-top:4px}
.dates{display:flex;gap:32px;background:#f9fafb;border-radius:12px;padding:16px 20px;margin-bottom:28px}
.date-val{font-size:13px;font-weight:600;margin-top:3px}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
thead tr{background:#f9fafb}
th{padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;font-weight:600}
td{padding:11px 14px;border-bottom:1px solid #f9fafb;font-size:13px}
.text-right{text-align:right}
.font-bold{font-weight:700}
.totals{margin-left:auto;width:260px;margin-top:8px}
.total-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
.grand-total{display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#111827;border-top:2px solid #e5e7eb;padding-top:10px;margin-top:8px}
.grand-total span:last-child{color:#7c3aed}
.notes-box{background:#f9fafb;border-radius:12px;padding:16px 20px;margin-top:28px}
.footer{margin-top:40px;text-align:center;font-size:11px;color:#d1d5db;border-top:1px solid #f3f4f6;padding-top:20px}
@media print{body{padding:24px}@page{margin:1.5cm}}
</style></head><body>
<div class="header">
  <div>
    <div class="biz-name">${profile?.business_name || "Your Business"}</div>
    <div class="biz-info">${[profile?.email, profile?.phone].filter(Boolean).join("<br>")}</div>
  </div>
  <div style="text-align:right">
    <div class="inv-label">INVOICE</div>
    <div class="inv-meta">#${invoice.invoice_number}</div>
    <div><span class="badge badge-${invoice.status}">${invoice.status}</span></div>
  </div>
</div>
<hr class="divider">
<div class="parties">
  <div>
    <div class="label">From</div>
    <div class="party-name">${profile?.business_name || "Your Business"}</div>
    <div class="party-info">${[profile?.email, profile?.phone].filter(Boolean).join("<br>")}</div>
  </div>
  <div>
    <div class="label">Bill To</div>
    <div class="party-name">${invoice.customer_name}</div>
    <div class="party-info">${[invoice.customer_email, invoice.customer_phone, invoice.customer_address].filter(Boolean).join("<br>")}</div>
  </div>
</div>
<div class="dates">
  <div><div class="label">Issue Date</div><div class="date-val">${fmtDate(invoice.issue_date)}</div></div>
  ${invoice.due_date ? `<div><div class="label">Due Date</div><div class="date-val">${fmtDate(invoice.due_date)}</div></div>` : ""}
</div>
<table>
  <thead><tr>
    <th>Description</th>
    <th style="text-align:center">Qty</th>
    <th class="text-right">Unit Price</th>
    <th class="text-right">Amount</th>
  </tr></thead>
  <tbody>${lineItems.map(it => `<tr>
    <td>${it.description}</td>
    <td style="text-align:center">${it.quantity}</td>
    <td class="text-right">${fmt(Number(it.unit_price))}</td>
    <td class="text-right font-bold">${fmt(Number(it.amount))}</td>
  </tr>`).join("")}</tbody>
</table>
<div class="totals">
  <div class="total-row"><span>Subtotal</span><span>${fmt(Number(invoice.subtotal))}</span></div>
  ${Number(invoice.tax_rate) > 0 ? `<div class="total-row"><span>Tax (${invoice.tax_rate}%)</span><span>${fmt(Number(invoice.tax_amount))}</span></div>` : ""}
  ${Number(invoice.discount_amount) > 0 ? `<div class="total-row"><span>Discount</span><span>-${fmt(Number(invoice.discount_amount))}</span></div>` : ""}
  <div class="grand-total"><span>Total</span><span>${fmt(Number(invoice.total))}</span></div>
</div>
${invoice.notes ? `<div class="notes-box"><div class="label">Notes</div><div style="margin-top:6px;font-size:12px;color:#6b7280">${invoice.notes}</div></div>` : ""}
<div class="footer">Generated by SmartBiz Partners &nbsp;•&nbsp; smartbiz.team</div>
<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script>
</body></html>`);
    win.document.close();
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price")
      updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_price);
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  const handleCreate = async () => {
    if (!customerName.trim()) { toast({ title: "Customer name required", variant: "destructive" }); return; }
    if (items.every((i) => !i.description.trim())) { toast({ title: "Add at least one item", variant: "destructive" }); return; }
    setSaving(true);
    const invoiceNumber = await generateInvoiceNumber();
    const { data: inv, error } = await supabase.from("invoices").insert({
      user_id: user!.id, invoice_number: invoiceNumber, customer_name: customerName,
      customer_email: customerEmail, customer_phone: customerPhone, customer_address: customerAddress,
      due_date: dueDate || null, notes, tax_rate: taxRate, tax_amount: taxAmount,
      discount_amount: discountAmount, subtotal, total, status: "draft",
    }).select().single();
    if (error || !inv) { toast({ title: "Error creating invoice", description: error?.message, variant: "destructive" }); setSaving(false); return; }
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
    await supabase.from("invoices").update({ status }).eq("id", id).eq("user_id", user!.id);
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

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterStatus === "all" || inv.status === filterStatus);
  });

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerPickerSearch.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(customerPickerSearch.toLowerCase())
  );

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
        <Button size="sm" className="rounded-lg" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New Invoice
        </Button>
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
          <SelectTrigger className="w-full sm:w-36 rounded-lg">
            <Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue />
          </SelectTrigger>
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
          <Button size="sm" className="mt-3 rounded-lg" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Create Invoice
          </Button>
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
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); viewInvoice(inv); }}>
                        <Eye className="h-3.5 w-3.5 mr-2" /> View
                      </DropdownMenuItem>
                      {inv.status === "draft" && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "sent"); }}>
                          <Send className="h-3.5 w-3.5 mr-2" /> Mark Sent
                        </DropdownMenuItem>
                      )}
                      {["sent", "overdue"].includes(inv.status) && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "paid"); }}>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Mark Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(inv.id); }}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
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
            <DialogDescription>This will permanently delete the invoice and all its items. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-lg" onClick={() => deleteConfirm && deleteInvoice(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Picker */}
      <Dialog open={showCustomerPicker} onOpenChange={(o) => { setShowCustomerPicker(o); setCustomerPickerSearch(""); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Pick from CRM</DialogTitle>
            <DialogDescription>Select a customer to auto-fill their details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." value={customerPickerSearch} onChange={(e) => setCustomerPickerSearch(e.target.value)} className="pl-9 rounded-lg" autoFocus />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No customers found</p>
              ) : filteredCustomers.map((c) => (
                <button key={c.id} onClick={() => pickCustomer(c)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-muted/60 transition-colors"
                >
                  <p className="font-medium text-sm">{c.name}</p>
                  {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice */}
      <Dialog open={showCreate} onOpenChange={(o) => { setShowCreate(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">New Invoice</DialogTitle>
            <DialogDescription>Create a professional invoice for your customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Customer Details</Label>
              {customers.length > 0 && (
                <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg gap-1.5" onClick={() => setShowCustomerPicker(true)}>
                  <UserCheck className="h-3 w-3" /> Pick from CRM
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Customer Name *</Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+234..." className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Address</Label>
              <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Customer address" className="rounded-lg" />
            </div>

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
                      {items.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2.5 rounded-lg"
                onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}>
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Tax Rate (%)</Label>
                <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} min={0} max={100} className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Discount (₦)</Label>
                <Input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} min={0} className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms or additional notes..." className="rounded-lg" />
            </div>

            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
              {taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>{fmt(taxAmount)}</span></div>}
              {discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span>-{fmt(discountAmount)}</span></div>}
              <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-2">
                <span>Total</span><span className="text-primary">{fmt(total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => { resetForm(); setShowCreate(false); }}>Cancel</Button>
              <Button className="flex-1 rounded-lg" onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice */}
      <Dialog open={!!showView} onOpenChange={() => setShowView(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {showView && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-display">Invoice {showView.invoice_number}</DialogTitle>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig[showView.status]?.color}`}>
                    {statusConfig[showView.status]?.label}
                  </span>
                </div>
                <DialogDescription>{showView.customer_name} • {new Date(showView.issue_date).toLocaleDateString()}</DialogDescription>
              </DialogHeader>
              <div className="mt-3 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">From</p>
                    <p className="font-display font-bold text-sm">{profile?.business_name || "Your Business"}</p>
                    {profile?.email && <p className="text-xs text-muted-foreground">{profile.email}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Bill To</p>
                    <p className="font-display font-bold text-sm">{showView.customer_name}</p>
                    {showView.customer_email && <p className="text-xs text-muted-foreground">{showView.customer_email}</p>}
                    {showView.customer_phone && <p className="text-xs text-muted-foreground">{showView.customer_phone}</p>}
                    {showView.customer_address && <p className="text-xs text-muted-foreground">{showView.customer_address}</p>}
                  </div>
                </div>

                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-3">Price</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  {viewItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 p-3 border-t border-border text-sm">
                      <div className="col-span-5">{item.description}</div>
                      <div className="col-span-2">{item.quantity}</div>
                      <div className="col-span-3">{fmt(Number(item.unit_price))}</div>
                      <div className="col-span-2 text-right font-bold">{fmt(Number(item.amount))}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(Number(showView.subtotal))}</span></div>
                  {Number(showView.tax_rate) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax ({showView.tax_rate}%)</span><span>{fmt(Number(showView.tax_amount))}</span></div>}
                  {Number(showView.discount_amount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{fmt(Number(showView.discount_amount))}</span></div>}
                  <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-2">
                    <span>Total</span><span className="text-primary">{fmt(Number(showView.total))}</span>
                  </div>
                </div>

                {showView.notes && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{showView.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-lg gap-1.5" onClick={() => printInvoice(showView, viewItems)}>
                    <Printer className="h-3.5 w-3.5" /> Print / PDF
                  </Button>
                  {showView.status === "draft" && (
                    <Button className="flex-1 rounded-lg" onClick={() => { updateStatus(showView.id, "sent"); setShowView(null); }}>
                      <Send className="h-3.5 w-3.5 mr-1.5" /> Mark Sent
                    </Button>
                  )}
                  {["sent", "overdue"].includes(showView.status) && (
                    <Button className="flex-1 rounded-lg" onClick={() => { updateStatus(showView.id, "paid"); setShowView(null); }}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark Paid
                    </Button>
                  )}
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
