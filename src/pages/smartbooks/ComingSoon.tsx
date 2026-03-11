import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FileText, Calculator, Users, Package, FileCheck, Globe } from "lucide-react";

const toolMeta: Record<string, { title: string; desc: string; icon: any }> = {
  "/smartbooks/invoices": {
    title: "Invoices & Payments",
    desc: "Create professional invoices, track payments in real-time, and send automated reminders to clients who owe you.",
    icon: FileText,
  },
  "/smartbooks/expenses": {
    title: "Expenses & Profit",
    desc: "Log every naira spent, track your revenue streams, and finally see your real profit margins — daily, weekly, or monthly.",
    icon: Calculator,
  },
  "/smartbooks/crm": {
    title: "Customer CRM",
    desc: "Keep all your customer interactions in one place. Log calls, messages, and deals. Set WhatsApp follow-up reminders.",
    icon: Users,
  },
  "/smartbooks/inventory": {
    title: "Inventory Manager",
    desc: "Track stock levels across locations, get low-stock alerts, and see which products are moving fastest.",
    icon: Package,
  },
  "/smartbooks/quotes": {
    title: "Quotes & Proposals",
    desc: "Generate professional quotes in seconds, send to clients, and convert accepted quotes directly into invoices.",
    icon: FileCheck,
  },
  "/smartbooks/website": {
    title: "Website Generator",
    desc: "Answer a few questions about your business and let AI build you a professional, mobile-friendly website in minutes.",
    icon: Globe,
  },
};

export default function ComingSoon() {
  const location = useLocation();
  const meta = toolMeta[location.pathname] || { title: "Coming Soon", desc: "", icon: FileText };
  const Icon = meta.icon;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-16 h-16 border border-border flex items-center justify-center mb-8 mx-auto">
          <Icon className="h-7 w-7 text-emerald" />
        </div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-3">Coming Soon</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{meta.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-8">{meta.desc}</p>
        <div className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          <span className="w-2 h-2 bg-emerald animate-pulse rounded-full" />
          Under Development
        </div>
      </motion.div>
    </div>
  );
}
