import { motion } from "framer-motion";
import { FileText, Calculator, Users, Package, FileCheck, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Invoices & Payments",
    desc: "Create invoices, track payments, send reminders",
    icon: FileText,
    url: "/smartbooks/invoices",
    status: "coming-soon",
  },
  {
    title: "Expenses & Profit",
    desc: "Log expenses, track revenue, see real margins",
    icon: Calculator,
    url: "/smartbooks/expenses",
    status: "coming-soon",
  },
  {
    title: "Customer CRM",
    desc: "Manage contacts, log interactions, follow up",
    icon: Users,
    url: "/smartbooks/crm",
    status: "coming-soon",
  },
  {
    title: "Inventory Manager",
    desc: "Track stock, get alerts, see what's selling",
    icon: Package,
    url: "/smartbooks/inventory",
    status: "coming-soon",
  },
  {
    title: "Quotes & Proposals",
    desc: "Generate quotes, convert to invoices",
    icon: FileCheck,
    url: "/smartbooks/quotes",
    status: "coming-soon",
  },
  {
    title: "Website Generator",
    desc: "AI-powered website builder for your business",
    icon: Globe,
    url: "/smartbooks/website",
    status: "coming-soon",
  },
];

export default function SmartBooksDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-2">SmartBooks</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          Your Business Tools
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mb-12">
          Everything you need to run, track, and grow your business — all in one place.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={tool.url}
              className="block border-r border-b border-border p-8 group hover:bg-foreground hover:text-primary-foreground transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-6">
                <tool.icon className="h-6 w-6 text-emerald group-hover:text-emerald-light transition-colors" />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold tracking-wider uppercase bg-accent/10 text-accent px-2 py-0.5 group-hover:bg-emerald/30">
                    Coming Soon
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{tool.title}</h3>
              <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/60 transition-colors leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
