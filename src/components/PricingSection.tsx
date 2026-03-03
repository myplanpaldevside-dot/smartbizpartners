import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    desc: "For early-stage SMEs getting started",
    price: "₦150K",
    period: "one-time",
    features: ["Basic business website", "Logo & brand identity", "Social media setup", "1 month support"],
    highlighted: false,
  },
  {
    name: "Growth",
    desc: "For scaling businesses ready to grow",
    price: "₦400K",
    period: "one-time",
    features: ["Custom website + SEO", "Full brand package", "Content strategy", "Growth funnel setup", "3 months support"],
    highlighted: true,
  },
  {
    name: "Premium",
    desc: "Full digital transformation",
    price: "₦750K+",
    period: "retainer",
    features: ["Everything in Growth", "Monthly retainer services", "Dedicated growth manager", "Analytics & reporting", "Priority support", "Quarterly strategy sessions"],
    highlighted: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">Pricing</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground">Choose the package that fits your business stage.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-8 relative ${p.highlighted ? "border-emerald shadow-glow bg-card scale-105" : "border-border shadow-card bg-card"}`}
          >
            {p.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-emerald text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="font-display font-bold text-xl text-foreground">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{p.desc}</p>
            <div className="mb-6">
              <span className="font-display font-extrabold text-3xl text-foreground">{p.price}</span>
              <span className="text-sm text-muted-foreground ml-1">/{p.period}</span>
            </div>
            <Button variant={p.highlighted ? "hero" : "outline"} className="w-full mb-6">Get Started</Button>
            <div className="space-y-3">
              {p.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-emerald shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
