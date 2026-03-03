import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, Target, ArrowRight } from "lucide-react";

const uses = [
  { pct: "40%", label: "Product & Tech (MVP)" },
  { pct: "30%", label: "Customer Acquisition" },
  { pct: "20%", label: "Operations & Team" },
  { pct: "10%", label: "Legal & Admin" },
];

const InvestorSection = () => (
  <section id="investor" className="py-24 gradient-hero text-primary-foreground relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(160_84%_39%_/_0.1),_transparent_50%)]" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald-light uppercase tracking-wider">For Investors</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">Investment Opportunity</h2>
        <p className="text-primary-foreground/70">SmartBiz is raising ₦5M – ₦15M in a validation round to scale customer acquisition and build its MVP platform.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Use of funds */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-emerald-light" />
            <h3 className="font-display font-bold text-lg">Use of Funds</h3>
          </div>
          <div className="space-y-4">
            {uses.map((u) => (
              <div key={u.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{u.label}</span>
                  <span className="font-semibold text-emerald-light">{u.pct}</span>
                </div>
                <div className="h-2 rounded-full bg-primary-foreground/10">
                  <div className="h-2 rounded-full gradient-emerald" style={{ width: u.pct }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue projection */}
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-emerald-light" />
            <h3 className="font-display font-bold text-lg">Projected Revenue Growth</h3>
          </div>

          <div className="flex items-end gap-4 h-48 mb-6">
            {[
              { year: "Y1", val: 20 },
              { year: "Y2", val: 55 },
              { year: "Y3", val: 100 },
            ].map((d) => (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${d.val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full rounded-t-lg gradient-emerald"
                />
                <span className="text-xs font-medium">{d.year}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
            <Target className="h-5 w-5 text-emerald-light shrink-0" />
            <div>
              <p className="text-sm font-semibold">Hybrid Revenue Model</p>
              <p className="text-xs text-primary-foreground/60">Services + Education + Subscriptions = resilient multi-stream revenue.</p>
            </div>
          </div>

          <p className="text-xs text-primary-foreground/40 mt-4 italic">*Projected 20x+ potential upside. This is a projection, not a guarantee.</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
        <Button variant="hero" size="xl" className="group">
          Request Investor Deck <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default InvestorSection;
