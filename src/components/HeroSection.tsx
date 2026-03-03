import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, Globe, Calendar, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-emerald/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-navy/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              Now Accepting Partners & Investors
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-6">
              Building the Growth Infrastructure for{" "}
              <span className="text-gradient">African Small Businesses</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              SmartBiz combines business education, website development, and subscription-based digital growth tools to help SMEs scale sustainably.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl">Work With Us</Button>
              <Button variant="hero-outline" size="xl">Invest in SmartBiz</Button>
            </div>

            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-border">
              {[
                { num: "5+", label: "Paying Clients" },
                { num: "200", label: "SME Target (12mo)" },
                { num: "3x", label: "Revenue Growth" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-foreground">{s.num}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 animate-float">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">SME Growth Dashboard</p>
                    <p className="font-display font-bold text-xl text-foreground">₦2.4M Revenue</p>
                  </div>
                  <span className="bg-emerald/10 text-emerald text-xs font-semibold px-3 py-1 rounded-full">+34%</span>
                </div>

                {/* Chart bars */}
                <div className="flex items-end gap-3 h-32 mb-6">
                  {[40, 55, 35, 65, 50, 80, 70, 90, 75, 95, 85, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                      className="flex-1 rounded-t-md gradient-emerald opacity-80"
                    />
                  ))}
                </div>

                {/* Cards row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Globe, label: "Websites", val: "12" },
                    { icon: Calendar, label: "Content", val: "48" },
                    { icon: TrendingUp, label: "Growth", val: "+27%" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="bg-muted rounded-xl p-3 text-center">
                      <Icon className="h-4 w-4 mx-auto mb-1 text-emerald" />
                      <p className="font-display font-bold text-sm text-foreground">{val}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-card border border-border p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full gradient-emerald flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Growth Score</p>
                  <p className="text-xs text-muted-foreground">Top 15% of SMEs</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
