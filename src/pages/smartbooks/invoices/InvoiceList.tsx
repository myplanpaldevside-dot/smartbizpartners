import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FileText, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useInvoices } from "@/hooks/use-invoices";
import { formatNaira, getTotal, statusColors, InvoiceStatus } from "@/lib/invoice-utils";

const statusTabs: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

export default function InvoiceList() {
  const { invoices, deleteInvoice } = useInvoices();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) => {
    if (filter !== "all" && inv.status !== filter) return false;
    if (search && !inv.customerName.toLowerCase().includes(search.toLowerCase()) && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalOutstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + getTotal(i), 0);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + getTotal(i), 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-emerald uppercase mb-1">Invoices & Payments</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Manage Invoices</h1>
        </div>
        <Link
          to="/smartbooks/invoices/new"
          className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="border border-border p-4 sm:p-5">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">Total Invoices</p>
          <p className="font-display text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="border border-border p-4 sm:p-5">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">Outstanding</p>
          <p className="font-display text-2xl font-bold text-yellow-600">{formatNaira(totalOutstanding)}</p>
        </div>
        <div className="border border-border p-4 sm:p-5 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">Total Paid</p>
          <p className="font-display text-2xl font-bold text-emerald">{formatNaira(totalPaid)}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border bg-background focus:border-emerald focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-2 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-colors ${
                filter === tab.value
                  ? "bg-foreground text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Invoice list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-border p-12 text-center"
        >
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display font-semibold text-foreground mb-1">No invoices yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first invoice to get started.</p>
          <Link
            to="/smartbooks/invoices/new"
            className="inline-flex items-center gap-2 bg-emerald text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-emerald/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </Link>
        </motion.div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              onClick={() => navigate(`/smartbooks/invoices/${inv.id}`)}
              className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/50 cursor-pointer transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-sm">{inv.invoiceNumber}</span>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{inv.customerName}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Due: {new Date(inv.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right pl-4">
                <p className="font-display font-bold text-base">{formatNaira(getTotal(inv))}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
