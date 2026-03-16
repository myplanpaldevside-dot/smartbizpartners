import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes: string;
  currency: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  draft: { icon: FileText, color: "text-muted-foreground", label: "Draft" },
  sent: { icon: Send, color: "text-blue-500", label: "Sent" },
  paid: { icon: CheckCircle2, color: "text-emerald", label: "Paid" },
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

  // Create form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unit_price: 0, amount: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading invoices", variant: "destructive" });
    } else {
      setInvoices((data as Invoice[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const generateInvoiceNumber = () => {
    const prefix = (profile?.business_name || "SB").substring(0, 3).toUpperCase();
    const num = String(invoices.length + 1).padStart(4, "0");
    return `${prefix}-${num}`;
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") {
      updated[index].amount = Number(updated[index].quantity) * Number(updated[index].unit_price);
    }
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discountAmount;

  const handleCreate = async () => {
    if (!customerName.trim()) {
      toast({ title: "Customer name is required", variant: "destructive" });
      return;
    }
    if (items.every((i) => !i.description.trim())) {
      toast({ title: "Add at least one item", variant: "destructive" });
      return;
    }

    setSaving(true);
    const invoiceNumber = generateInvoiceNumber();

    const { data: inv, error } = await supabase
      .from("invoices")
      .insert({
        user_id: user!.id,
        invoice_number: invoiceNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        due_date: dueDate || null,
        notes,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        subtotal,
        total,
        status: "draft",
      })
      .select()
      .single();

    if (error || !inv) {
      toast({ title: "Error creating invoice", description: error?.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    const validItems = items.filter((i) => i.description.trim());
    if (validItems.length > 0) {
      await supabase.from("invoice_items").insert(
        validItems.map((i) => ({
          invoice_id: (inv as any).id,
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
          amount: i.amount,
        }))
      );
    }

    toast({ title: "Invoice created!", description: `#${invoiceNumber}` });
    resetForm();
    setShowCreate(false);
    fetchInvoices();
    setSaving(false);
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setDueDate("");
    setNotes("");
    setTaxRate(0);
    setDiscountAmount(0);
    setItems([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("invoices").update({ status }).eq("id", id);
    fetchInvoices();
    toast({ title: `Invoice marked as ${status}` });
  };

  const deleteInvoice = async (id: string) => {
    await supabase.from("invoices").delete().eq("id", id);
    fetchInvoices();
    toast({ title: "Invoice deleted" });
  };

  const viewInvoice = async (invoice: Invoice) => {
    setShowView(invoice);
    const { data } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.id);
    setViewItems((data as InvoiceItem[]) || []);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total), 0),
    pending: invoices.filter((i) => ["sent", "draft"].includes(i.status)).reduce((s, i) => s + Number(i.total), 0),
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Invoices & Payments</h1>
          <p className="text-sm text-muted-foreground">Create, track and manage your invoices</p>
        </div>
        <Button variant="hero" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", value: stats.total },
          { label: "Revenue Collected", value: formatCurrency(stats.paid) },
          { label: "Pending Amount", value: formatCurrency(stats.pending) },
          { label: "Overdue", value: stats.overdue },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</p>
            <p className="font-display text-lg font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filteredInvoices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border"
        >
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-display font-bold text-foreground">No invoices yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first invoice to get started</p>
          <Button variant="hero" size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filteredInvoices.map((inv, i) => {
            const sc = statusConfig[inv.status] || statusConfig.draft;
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border border-border bg-card p-4 flex items-center justify-between hover:border-emerald/30 transition-colors cursor-pointer"
                onClick={() => viewInvoice(inv)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`flex items-center gap-1.5 ${sc.color}`}>
                    <StatusIcon className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                      {sc.label}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {inv.customer_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{inv.invoice_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-display font-bold text-sm">{formatCurrency(Number(inv.total))}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); viewInvoice(inv); }}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </DropdownMenuItem>
                      {inv.status === "draft" && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "sent"); }}>
                          <Send className="h-4 w-4 mr-2" /> Mark as Sent
                        </DropdownMenuItem>
                      )}
                      {["sent", "overdue"].includes(inv.status) && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, "paid"); }}>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteInvoice(inv.id); }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">New Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer Name *
                </Label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@email.com" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone
                </Label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+234..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Due Date
                </Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Address
              </Label>
              <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Customer address" />
            </div>

            {/* Line Items */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                Items
              </Label>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Description</span>}
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(idx, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Qty</span>}
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="col-span-3">
                      {idx === 0 && <span className="text-[10px] text-muted-foreground">Price (₦)</span>}
                      <Input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(idx, "unit_price", Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div className="col-span-1 text-right font-display font-bold text-sm pt-1">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])}
              >
                <Plus className="h-3 w-3" /> Add Item
              </Button>
            </div>

            {/* Tax & Discount */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tax Rate (%)
                </Label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Discount (₦)
                </Label>
                <Input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-bold text-lg border-t border-border pt-2">
                <span>Total</span>
                <span className="text-emerald">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!showView} onOpenChange={() => setShowView(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {showView && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-display">
                    Invoice {showView.invoice_number}
                  </DialogTitle>
                  <div className={`flex items-center gap-1.5 ${statusConfig[showView.status]?.color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {statusConfig[showView.status]?.label}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {/* Business & Customer Info */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">From</p>
                    <p className="font-display font-bold">{profile?.business_name || "Your Business"}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Bill To</p>
                    <p className="font-display font-bold">{showView.customer_name}</p>
                    {showView.customer_email && <p className="text-sm text-muted-foreground">{showView.customer_email}</p>}
                    {showView.customer_phone && <p className="text-sm text-muted-foreground">{showView.customer_phone}</p>}
                    {showView.customer_address && <p className="text-sm text-muted-foreground">{showView.customer_address}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Issue Date: </span>
                    {new Date(showView.issue_date).toLocaleDateString()}
                  </div>
                  {showView.due_date && (
                    <div>
                      <span className="text-muted-foreground">Due Date: </span>
                      {new Date(showView.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="border border-border">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-3">Price</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  {viewItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 p-3 border-t border-border text-sm">
                      <div className="col-span-5">{item.description}</div>
                      <div className="col-span-2">{item.quantity}</div>
                      <div className="col-span-3">{formatCurrency(Number(item.unit_price))}</div>
                      <div className="col-span-2 text-right font-bold">{formatCurrency(Number(item.amount))}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(Number(showView.subtotal))}</span>
                  </div>
                  {Number(showView.tax_rate) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({showView.tax_rate}%)</span>
                      <span>{formatCurrency(Number(showView.tax_amount))}</span>
                    </div>
                  )}
                  {Number(showView.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>-{formatCurrency(Number(showView.discount_amount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display font-bold text-xl border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-emerald">{formatCurrency(Number(showView.total))}</span>
                  </div>
                </div>

                {showView.notes && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{showView.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {showView.status === "draft" && (
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => {
                        updateStatus(showView.id, "sent");
                        setShowView(null);
                      }}
                    >
                      <Send className="h-4 w-4" /> Mark as Sent
                    </Button>
                  )}
                  {["sent", "overdue"].includes(showView.status) && (
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => {
                        updateStatus(showView.id, "paid");
                        setShowView(null);
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Mark as Paid
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowView(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
