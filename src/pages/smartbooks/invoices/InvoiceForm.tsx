import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useInvoices } from "@/hooks/use-invoices";
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  formatNaira,
  getSubtotal,
  getTotal,
  generateInvoiceNumber,
} from "@/lib/invoice-utils";

const emptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

interface Props {
  existing?: Invoice;
}

export default function InvoiceForm({ existing }: Props) {
  const navigate = useNavigate();
  const { addInvoice, updateInvoice } = useInvoices();
  const isEdit = !!existing;

  const [customerName, setCustomerName] = useState(existing?.customerName ?? "");
  const [customerEmail, setCustomerEmail] = useState(existing?.customerEmail ?? "");
  const [customerPhone, setCustomerPhone] = useState(existing?.customerPhone ?? "");
  const [items, setItems] = useState<InvoiceItem[]>(existing?.items ?? [emptyItem()]);
  const [taxRate, setTaxRate] = useState(existing?.taxRate ?? 0);
  const [discount, setDiscount] = useState(existing?.discount ?? 0);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
  const [status, setStatus] = useState<InvoiceStatus>(existing?.status ?? "draft");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = getSubtotal(items);
  const total = getTotal({ items, taxRate, discount });

  const handleSave = (saveStatus: InvoiceStatus) => {
    const invoice: Invoice = {
      id: existing?.id ?? crypto.randomUUID(),
      invoiceNumber: existing?.invoiceNumber ?? generateInvoiceNumber(),
      customerName,
      customerEmail,
      customerPhone,
      items: items.filter((i) => i.description.trim()),
      taxRate,
      discount,
      status: saveStatus,
      dueDate,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      notes,
    };

    if (isEdit) {
      updateInvoice(invoice);
    } else {
      addInvoice(invoice);
    }
    navigate("/smartbooks/invoices");
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-border bg-background focus:border-emerald focus:outline-none transition-colors";
  const labelClass = "text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1.5 block";

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <button
          onClick={() => navigate("/smartbooks/invoices")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </button>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {isEdit ? "Edit Invoice" : "Create Invoice"}
        </h1>

        {/* Customer details */}
        <div className="border border-border p-5 sm:p-6 mb-6">
          <h2 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-foreground text-primary-foreground text-[10px] font-bold flex items-center justify-center">1</span>
            Customer Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Customer Name *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Adewale & Sons Ltd" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+234 800 000 0000" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="border border-border p-5 sm:p-6 mb-6">
          <h2 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-foreground text-primary-foreground text-[10px] font-bold flex items-center justify-center">2</span>
            Line Items
          </h2>

          {/* Header row - desktop */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_80px_120px_100px_40px] gap-3 mb-2">
            <span className={labelClass}>Description</span>
            <span className={labelClass}>Qty</span>
            <span className={labelClass}>Unit Price (₦)</span>
            <span className={labelClass}>Total</span>
            <span />
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid sm:grid-cols-[1fr_80px_120px_100px_40px] gap-3 mb-3">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                placeholder="Item description"
                className={inputClass}
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                className={inputClass}
              />
              <input
                type="number"
                min="0"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                className={inputClass}
              />
              <div className="flex items-center text-sm font-semibold">
                {formatNaira(item.quantity * item.unitPrice)}
              </div>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setItems([...items, emptyItem()])}
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald hover:text-emerald/80 transition-colors mt-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Summary & settings */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="border border-border p-5 sm:p-6">
            <h2 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-foreground text-primary-foreground text-[10px] font-bold flex items-center justify-center">3</span>
              Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tax (%)</label>
                  <input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Discount (%)</label>
                  <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, bank details, etc." rows={3} className={inputClass + " resize-none"} />
              </div>
            </div>
          </div>

          <div className="border border-border p-5 sm:p-6">
            <h2 className="font-display font-bold text-sm mb-4">Invoice Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span>{formatNaira(subtotal * (taxRate / 100))}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount ({discount}%)</span>
                  <span className="text-destructive">-{formatNaira(subtotal * (discount / 100))}</span>
                </div>
              )}
              <div className="h-[1px] bg-border" />
              <div className="flex justify-between font-display font-bold text-xl">
                <span>Total</span>
                <span className="text-emerald">{formatNaira(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={!customerName.trim()}
            className="px-6 py-3 text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave("pending")}
            disabled={!customerName.trim() || items.every((i) => !i.description.trim())}
            className="px-6 py-3 text-sm font-semibold bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors disabled:opacity-40"
          >
            Send Invoice
          </button>
          {isEdit && (
            <button
              onClick={() => handleSave("paid")}
              className="px-6 py-3 text-sm font-semibold bg-emerald text-primary-foreground hover:bg-emerald/90 transition-colors"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
