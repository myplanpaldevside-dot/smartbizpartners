import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Edit, Trash2, Send, CheckCircle } from "lucide-react";
import { useInvoices } from "@/hooks/use-invoices";
import { formatNaira, getSubtotal, getTotal, statusColors } from "@/lib/invoice-utils";
import { toast } from "sonner";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Invoice not found.</p>
        <Link to="/smartbooks/invoices" className="text-emerald text-sm mt-2 inline-block">
          ← Back to invoices
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal(invoice.items);
  const total = getTotal(invoice);

  const handleDownloadPDF = () => {
    // Generate a printable view
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `<!DOCTYPE html>
<html><head><title>${invoice.invoiceNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #0d0d0d; max-width: 800px; margin: auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #0d0d0d; padding-bottom: 20px; }
  .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
  .brand span { color: #0f9b6e; }
  .inv-num { font-size: 12px; color: #666; margin-top: 4px; }
  .status { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; background: ${invoice.status === 'paid' ? '#e6f7f0' : invoice.status === 'overdue' ? '#fde8e8' : '#fef9e7'}; color: ${invoice.status === 'paid' ? '#0f9b6e' : invoice.status === 'overdue' ? '#e53e3e' : '#b7791f'}; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .info-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 6px; }
  .info-value { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #999; text-align: left; padding: 10px 0; border-bottom: 1px solid #ddd; }
  td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
  .right { text-align: right; }
  .summary { max-width: 280px; margin-left: auto; }
  .summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .summary-total { display: flex; justify-content: space-between; padding: 12px 0; font-size: 20px; font-weight: 800; border-top: 2px solid #0d0d0d; margin-top: 8px; color: #0f9b6e; }
  .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; font-size: 12px; color: #666; }
  .notes-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 6px; }
  .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #ccc; letter-spacing: 0.2em; text-transform: uppercase; }
  @media print { body { padding: 20px; } }
</style></head><body>
<div class="header">
  <div>
    <div class="brand">SMART<span>BOOKS</span></div>
    <div class="inv-num">${invoice.invoiceNumber}</div>
  </div>
  <span class="status">${invoice.status}</span>
</div>
<div class="info-grid">
  <div>
    <div class="info-label">Bill To</div>
    <div class="info-value"><strong>${invoice.customerName}</strong></div>
    ${invoice.customerEmail ? `<div class="info-value">${invoice.customerEmail}</div>` : ""}
    ${invoice.customerPhone ? `<div class="info-value">${invoice.customerPhone}</div>` : ""}
  </div>
  <div class="right">
    <div class="info-label">Invoice Date</div>
    <div class="info-value">${new Date(invoice.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</div>
    <div class="info-label" style="margin-top:12px;">Due Date</div>
    <div class="info-value">${new Date(invoice.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
</div>
<table>
  <thead><tr><th>Description</th><th class="right">Qty</th><th class="right">Unit Price</th><th class="right">Total</th></tr></thead>
  <tbody>${invoice.items.map((item) => `<tr><td>${item.description}</td><td class="right">${item.quantity}</td><td class="right">₦${item.unitPrice.toLocaleString()}</td><td class="right">₦${(item.quantity * item.unitPrice).toLocaleString()}</td></tr>`).join("")}</tbody>
</table>
<div class="summary">
  <div class="summary-row"><span>Subtotal</span><span>₦${subtotal.toLocaleString()}</span></div>
  ${invoice.taxRate > 0 ? `<div class="summary-row"><span>Tax (${invoice.taxRate}%)</span><span>₦${(subtotal * invoice.taxRate / 100).toLocaleString()}</span></div>` : ""}
  ${invoice.discount > 0 ? `<div class="summary-row"><span>Discount (${invoice.discount}%)</span><span>-₦${(subtotal * invoice.discount / 100).toLocaleString()}</span></div>` : ""}
  <div class="summary-total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>
</div>
${invoice.notes ? `<div class="notes"><div class="notes-label">Notes</div>${invoice.notes}</div>` : ""}
<div class="footer">Powered by SmartBiz Partners</div>
<script>window.print();</script>
</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleMarkPaid = () => {
    updateInvoice({ ...invoice, status: "paid" });
    toast.success("Invoice marked as paid!");
  };

  const handleSendReminder = () => {
    const msg = `Hi ${invoice.customerName}, this is a reminder that invoice ${invoice.invoiceNumber} for ${formatNaira(total)} is ${invoice.status === "overdue" ? "overdue" : "pending"}. Due: ${new Date(invoice.dueDate).toLocaleDateString("en-NG")}. Thank you!`;
    const whatsappUrl = `https://wa.me/${invoice.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDelete = () => {
    if (confirm("Delete this invoice? This cannot be undone.")) {
      deleteInvoice(invoice.id);
      navigate("/smartbooks/invoices");
      toast.success("Invoice deleted.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/smartbooks/invoices" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Invoices
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadPDF} className="p-2 border border-border hover:bg-muted transition-colors" title="Download PDF">
              <Download className="h-4 w-4" />
            </button>
            <Link to={`/smartbooks/invoices/${invoice.id}/edit`} className="p-2 border border-border hover:bg-muted transition-colors" title="Edit">
              <Edit className="h-4 w-4" />
            </Link>
            <button onClick={handleDelete} className="p-2 border border-border hover:bg-destructive/10 hover:text-destructive transition-colors" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Invoice header */}
        <div className="border border-border p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold">{invoice.invoiceNumber}</h1>
              <span className={`inline-block text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 mt-2 ${statusColors[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Created: {new Date(invoice.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
              <p>Due: {new Date(invoice.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Bill To</p>
            <p className="font-display font-bold text-base">{invoice.customerName}</p>
            {invoice.customerEmail && <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>}
            {invoice.customerPhone && <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>}
          </div>

          {/* Items table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-bold tracking-wider uppercase text-muted-foreground py-3">Description</th>
                  <th className="text-right text-[10px] font-bold tracking-wider uppercase text-muted-foreground py-3">Qty</th>
                  <th className="text-right text-[10px] font-bold tracking-wider uppercase text-muted-foreground py-3">Price</th>
                  <th className="text-right text-[10px] font-bold tracking-wider uppercase text-muted-foreground py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatNaira(item.unitPrice)}</td>
                    <td className="py-3 text-right font-semibold">{formatNaira(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 max-w-xs ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                <span>{formatNaira(subtotal * (invoice.taxRate / 100))}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount ({invoice.discount}%)</span>
                <span className="text-destructive">-{formatNaira(subtotal * (invoice.discount / 100))}</span>
              </div>
            )}
            <div className="h-[1px] bg-border" />
            <div className="flex justify-between font-display font-bold text-xl">
              <span>Total</span>
              <span className="text-emerald">{formatNaira(total)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 p-4 bg-muted/50 text-sm text-muted-foreground">
              <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1">Notes</p>
              {invoice.notes}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {invoice.status !== "paid" && (
            <>
              <button
                onClick={handleMarkPaid}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-emerald text-primary-foreground hover:bg-emerald/90 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Paid
              </button>
              {invoice.customerPhone && (
                <button
                  onClick={handleSendReminder}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold border border-border hover:bg-muted transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send WhatsApp Reminder
                </button>
              )}
            </>
          )}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold border border-border hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            Download / Print
          </button>
        </div>
      </motion.div>
    </div>
  );
}
