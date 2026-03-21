import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    desc: "Essential tools to get your business running",
    price: "₦100K",
    period: "month",
    features: ["Invoices & Payments", "Basic Dashboard", "1 User", "Email Support"],
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Growth",
    desc: "Scale your operations with powerful tools",
    price: "₦200K",
    period: "month",
    features: ["Everything in Starter", "Expenses & Profit", "Customer CRM", "Inventory Manager", "3 Users", "Priority Support"],
    highlighted: true,
    icon: Crown,
  },
  {
    name: "Premium",
    desc: "Full suite for serious businesses",
    price: "₦250K",
    period: "month",
    features: ["Everything in Growth", "Quotes & Proposals", "Website Generator", "Unlimited Users", "Dedicated Manager", "API Access"],
    highlighted: false,
    icon: Rocket,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start with a 14-day free trial. No credit card needed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative border bg-card p-8 rounded-xl transition-all duration-300 ${
                  p.highlighted
                    ? "border-primary/40 shadow-elevated scale-[1.02] ring-2 ring-primary/10"
                    : "border-border hover:border-primary/20 hover:shadow-elevated"
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    p.highlighted ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl">{p.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{p.desc}</p>

                <div className="mb-6">
                  <span className="font-display font-bold text-3xl sm:text-4xl">{p.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/{p.period}</span>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    p.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  onClick={() => navigate("/smartbooks/pricing")}
                >
                  Start Free Trial
                </Button>

                <div className="space-y-3">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-secondary shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
