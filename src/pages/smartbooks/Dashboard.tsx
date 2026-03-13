import { motion } from "framer-motion";
import {
  FileText,
  Calculator,
  Users,
  Package,
  FileCheck,
  Globe,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickStats = [
  { label: "Total Revenue", value: "₦0.00", icon: TrendingUp, change: "Start tracking" },
  { label: "Invoices Sent", value: "0", icon: FileText, change: "Create your first" },
  { label: "Pending Payments", value: "₦0.00", icon: Clock, change: "No pending" },
  { label: "Customers", value: "0", icon: Users, change: "Add customers" },
];

const tools = [
  {
    title: "Invoices & Payments",
    desc: "Create professional invoices, track payments, and send reminders automatically.",
    icon: FileText,
    url: "/smartbooks/invoices",
    status: "live" as const,
  },
  {
    title: "Expenses & Profit",
    desc: "Log expenses, track revenue, and see your real margins at a glance.",
    icon: Calculator,
    url: "/smartbooks/expenses",
    status: "coming-soon" as const,
  },
  {
    title: "Customer CRM",
    desc: "Manage contacts, log interactions, and never miss a follow-up.",
    icon: Users,
    url: "/smartbooks/crm",
    status: "coming-soon" as const,
  },
  {
    title: "Inventory Manager",
    desc: "Track stock levels, get low-stock alerts, and see what's selling.",
    icon: Package,
    url: "/smartbooks/inventory",
    status: "coming-soon" as const,
  },
  {
    title: "Quotes & Proposals",
    desc: "Generate professional quotes and convert them to invoices instantly.",
    icon: FileCheck,
    url: "/smartbooks/quotes",
    status: "coming-soon" as const,
  },
  {
    title: "Website Generator",
    desc: "AI-powered website builder — get your business online in minutes.",
    icon: Globe,
    url: "/smartbooks/website",
    status: "coming-soon" as const,
  },
];

export default function SmartBooksDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-emerald" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-emerald uppercase">Dashboard</p>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Welcome to <span className="text-emerald">SmartBooks</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your business operations, simplified.
        </p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
            className="border border-border bg-card p-4 sm:p-5 hover:border-emerald/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-emerald transition-colors" />
              <CheckCircle2 className="h-3 w-3 text-emerald/40" />
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[9px] text-emerald/70 mt-1 font-medium">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Tools section */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Your Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
            >
              <Link
                to={tool.url}
                className={`group block p-5 sm:p-6 border border-border bg-card hover:border-emerald/40 transition-all duration-300 hover:shadow-elevated relative overflow-hidden ${
                  tool.status === "live" ? "ring-1 ring-emerald/20" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 flex items-center justify-center bg-emerald/10 text-emerald">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    {tool.status === "live" ? (
                      <span className="text-[9px] font-bold tracking-wider uppercase bg-emerald/15 text-emerald px-2 py-0.5">
                        Live
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground/60 px-2 py-0.5 border border-border">
                        Soon
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base mb-1 group-hover:text-emerald transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mb-3">
                    {tool.desc}
                  </p>

                  <div className="flex items-center text-[10px] font-semibold tracking-wider uppercase text-muted-foreground group-hover:text-emerald transition-colors">
                    <span>{tool.status === "live" ? "Open" : "Preview"}</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[10px] tracking-[0.3em] text-muted-foreground uppercase pt-4"
      >
        Powered by SmartBiz Partners
      </motion.p>
    </div>
  );
}
