import { motion } from "framer-motion";
import { FileText, Calculator, Users, Package, FileCheck, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Invoices & Payments",
    desc: "Create invoices, track payments, send reminders automatically",
    icon: FileText,
    url: "/smartbooks/invoices",
    status: "live",
    color: "bg-emerald/10 text-emerald",
  },
  {
    title: "Expenses & Profit",
    desc: "Log expenses, track revenue, see your real margins at a glance",
    icon: Calculator,
    url: "/smartbooks/expenses",
    status: "coming-soon",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Customer CRM",
    desc: "Manage contacts, log interactions, never miss a follow up",
    icon: Users,
    url: "/smartbooks/crm",
    status: "coming-soon",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Inventory Manager",
    desc: "Track stock levels, get low-stock alerts, see what's selling",
    icon: Package,
    url: "/smartbooks/inventory",
    status: "coming-soon",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Quotes & Proposals",
    desc: "Generate professional quotes and convert them to invoices",
    icon: FileCheck,
    url: "/smartbooks/quotes",
    status: "coming-soon",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Website Generator",
    desc: "AI-powered website builder — go live in minutes",
    icon: Globe,
    url: "/smartbooks/website",
    status: "coming-soon",
    color: "bg-accent/10 text-accent",
  },
];

export default function SmartBooksDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-emerald" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-emerald uppercase">SmartBooks</p>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Your Business,<br />
          <span className="text-gradient">Simplified.</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-3 max-w-md">
          Everything you need to run, track, and grow — all in one place.
        </p>
      </motion.div>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={tool.url}
              className={`group block p-6 border border-border bg-card hover:border-emerald/40 transition-all duration-300 hover:shadow-elevated relative overflow-hidden ${
                tool.status === "live" ? "ring-1 ring-emerald/20" : ""
              }`}
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 flex items-center justify-center ${tool.color} transition-colors`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  {tool.status === "live" ? (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-emerald/15 text-emerald px-2.5 py-1">
                      Live
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground/60 px-2.5 py-1 border border-border">
                      Soon
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base mb-1.5 group-hover:text-emerald transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {tool.desc}
                </p>

                <div className="flex items-center text-[10px] font-semibold tracking-wider uppercase text-muted-foreground group-hover:text-emerald transition-colors">
                  <span>{tool.status === "live" ? "Open" : "Preview"}</span>
                  <ArrowRight className="h-3 w-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-10"
      >
        Powered by SmartBiz Partners
      </motion.p>
    </div>
  );
}
