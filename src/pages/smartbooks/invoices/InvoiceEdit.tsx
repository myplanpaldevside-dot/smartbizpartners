import { useParams } from "react-router-dom";
import { useInvoices } from "@/hooks/use-invoices";
import InvoiceForm from "./InvoiceForm";

export default function InvoiceEdit() {
  const { id } = useParams();
  const { invoices } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  return <InvoiceForm existing={invoice} />;
}
