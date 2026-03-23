import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const allFeatures = [
  "Unlimited Invoices & Receipts",
  "Expense & Profit Tracking",
  "Customer CRM",
  "Inventory Management",
  "Quotes & Proposals",
  "Business Website Generator",
  "Unlimited Users",
  "Weekly Content Creation",
  "Priority Support",
  "Analytics Dashboard",
  "Multi-Currency Support",
  "API Access",
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            One plan. Everything included.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            No confusing tiers. No hidden fees. Just one price that gives you the full toolkit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-2 border-primary/40 bg-card p-8 sm:p-10 rounded-2xl shadow-elevated"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-5 py-1 rounded-full">
              All Access
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl">SmartBooks Pro</h3>
              <p className="text-xs text-muted-foreground">Everything your business needs to thrive</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="font-display font-bold text-5xl sm:text-6xl">₦100K</span>
            <span className="text-sm text-muted-foreground ml-2">/month</span>
          </div>

          <Button
            className="w-full mb-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
            onClick={() => navigate("/smartbooks/pricing")}
          >
            Start 14-Day Free Trial
          </Button>

          <div className="grid sm:grid-cols-2 gap-3">
            {allFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-foreground/80">{f}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
