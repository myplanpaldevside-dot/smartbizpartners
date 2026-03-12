import { useState, useCallback } from "react";
import { Invoice, loadInvoices, saveInvoices } from "@/lib/invoice-utils";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);

  const save = useCallback((updated: Invoice[]) => {
    setInvoices(updated);
    saveInvoices(updated);
  }, []);

  const addInvoice = useCallback((invoice: Invoice) => {
    const updated = [invoice, ...loadInvoices()];
    save(updated);
  }, [save]);

  const updateInvoice = useCallback((invoice: Invoice) => {
    const updated = loadInvoices().map((inv) => (inv.id === invoice.id ? invoice : inv));
    save(updated);
  }, [save]);

  const deleteInvoice = useCallback((id: string) => {
    const updated = loadInvoices().filter((inv) => inv.id !== id);
    save(updated);
  }, [save]);

  const refresh = useCallback(() => {
    setInvoices(loadInvoices());
  }, []);

  return { invoices, addInvoice, updateInvoice, deleteInvoice, refresh };
}
