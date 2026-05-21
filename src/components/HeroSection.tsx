import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Bell,
  Package,
  BarChart3,
} from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center px-4 sm:px-6 md:px-12 overflow-hidden pt-24 pb-16">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow */}
      <motion.div
        className="absolute -top-32 right-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(170 70% 40% / 0.07) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(213 84% 55% / 0.04) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 border border-primary/25 bg-primary/5 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                Now live · Built for Nigerian SMEs
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-bold text-foreground leading-[1.0] mb-6"
            >
              Stop juggling apps.
              <br />
              <span className="text-gradient">Start growing.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
            >
              SmartBiz brings your invoices, expenses, customers, and inventory
              under one roof — purpose-built for ambitious Nigerian business
              owners who are done with the chaos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Button
                size="lg"
                className="rounded-full px-8 gradient-brand text-primary-foreground hover:opacity-90 font-semibold shadow-lg shadow-primary/20 group h-12"
                onClick={() => navigate("/smartbooks")}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-border hover:border-primary/40 h-12"
                onClick={() =>
                  document
                    .getElementById("solution")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See What's Inside
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap items-center gap-5"
            >
              {[
                "Free to start",
                "No credit card",
                "Cancel anytime",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Dashboard Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            {/* Revenue card */}
            <div className="relative bg-card border border-border rounded-2xl shadow-elevated p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Revenue This Month
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground mt-1">
                    ₦ 847,500
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-1 h-16">
                {[38, 62, 44, 78, 52, 88, 68, 82, 58, 92, 72, 100].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.9 + i * 0.05, duration: 0.4, origin: "bottom" }}
                      style={{
                        height: `${h}%`,
                        background:
                          i === 11
                            ? "hsl(170 70% 40%)"
                            : `hsl(170 70% 40% / ${0.12 + h * 0.006})`,
                        transformOrigin: "bottom",
                      }}
                      className="flex-1 rounded-sm"
                    />
                  )
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-xs text-primary font-semibold">↑ 24%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>

            {/* Quick-stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: FileText, label: "Invoices", value: "14", sub: "Pending", color: "text-orange-500 bg-orange-500/10" },
                { icon: Users, label: "Customers", value: "203", sub: "Active", color: "text-blue-500 bg-blue-500/10" },
                { icon: Package, label: "Products", value: "58", sub: "In stock", color: "text-purple-500 bg-purple-500/10" },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>

            {/* Recent transactions */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Activity
              </p>
              {[
                { name: "Chioma Obi", amount: "₦45,000", type: "Invoice paid", positive: true },
                { name: "Lagos Tech Hub", amount: "₦120,000", type: "New order", positive: true },
                { name: "Office Supplies", amount: "₦8,500", type: "Expense logged", positive: false },
              ].map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.12, duration: 0.4 }}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {tx.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{tx.name}</p>
                      <p className="text-[10px] text-muted-foreground">{tx.type}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      tx.positive ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {tx.positive ? "+" : "-"}{tx.amount}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Floating notification badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl px-3 py-2 shadow-lg shadow-primary/30 flex items-center gap-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold whitespace-nowrap">
                Payment received · ₦35,000
              </span>
            </motion.div>

            {/* Analytics badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-3 py-2 shadow-elevated flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Profit up <span className="text-primary">₦312k</span> this week
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
