export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  notes: string;
}

export const getSubtotal = (items: InvoiceItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

export const getTotal = (invoice: Pick<Invoice, "items" | "taxRate" | "discount">) => {
  const subtotal = getSubtotal(invoice.items);
  const tax = subtotal * (invoice.taxRate / 100);
  const discountAmount = subtotal * (invoice.discount / 100);
  return subtotal + tax - discountAmount;
};

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const statusColors: Record<InvoiceStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/15 text-yellow-700",
  paid: "bg-emerald/15 text-emerald",
  overdue: "bg-destructive/15 text-destructive",
};

// Local storage helpers
const STORAGE_KEY = "smartbooks_invoices";

export const loadInvoices = (): Invoice[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

export const generateInvoiceNumber = () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${y}${m}-${rand}`;
};
