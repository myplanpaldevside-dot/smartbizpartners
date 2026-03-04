import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const uses = [
  { pct: "40%", label: "Product & Tech (MVP)" },
  { pct: "30%", label: "Customer Acquisition" },
  { pct: "20%", label: "Operations & Team" },
  { pct: "10%", label: "Legal & Admin" },
];

const InvestorSection = () => (
  <section id="investor" className="py-32 px-6 md:px-12 bg-foreground text-primary-foreground">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">For Investors</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95]">
            Investment<br />Opportunity
          </h2>
        </div>
        <p className="text-sm text-primary-foreground/50 max-w-sm leading-relaxed">
          SmartBiz is raising ₦5M – ₦15M in a validation round to scale customer acquisition and build its MVP platform.
        </p>
      </motion.div>

      {/* Use of funds */}
      <div className="grid md:grid-cols-2 gap-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-display font-bold text-lg mb-8 tracking-[0.1em] uppercase">Use of Funds</h3>
          <div className="space-y-6">
            {uses.map((u) => (
              <div key={u.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-primary-foreground/70">{u.label}</span>
                  <span className="font-display font-bold text-emerald">{u.pct}</span>
                </div>
                <div className="h-[2px] bg-primary-foreground/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: u.pct }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[2px] bg-emerald"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue projection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <h3 className="font-display font-bold text-lg mb-8 tracking-[0.1em] uppercase">Projected Revenue</h3>
          <div className="flex items-end gap-6 h-48 mb-8">
            {[
              { year: "Y1", val: 20 },
              { year: "Y2", val: 55 },
              { year: "Y3", val: 100 },
            ].map((d) => (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${d.val}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-emerald"
                />
                <span className="text-xs font-display font-semibold tracking-wider">{d.year}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary-foreground/10 pt-6">
            <p className="text-sm font-semibold mb-1">Hybrid Revenue Model</p>
            <p className="text-xs text-primary-foreground/50">Services + Education + Subscriptions = resilient multi-stream revenue.</p>
          </div>
          <p className="text-xs text-primary-foreground/30 mt-4 italic">*Projected 20x+ potential upside. This is a projection, not a guarantee.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button variant="hero" size="xl" className="group">
          Request Investor Deck <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default InvestorSection;
