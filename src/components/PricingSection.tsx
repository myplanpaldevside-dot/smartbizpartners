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
  <section id="pricing" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">Pricing</p>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95]">
          Simple,<br /><span className="text-stroke">Transparent</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-0">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`border border-border p-10 md:p-12 group transition-all duration-500 ${
              p.highlighted
                ? "bg-foreground text-primary-foreground border-foreground"
                : "hover:bg-muted"
            }`}
          >
            {p.highlighted && (
              <span className="inline-block text-[10px] font-semibold tracking-wider uppercase bg-emerald text-primary-foreground px-3 py-1 mb-6">
                Most Popular
              </span>
            )}
            <h3 className="font-display font-bold text-2xl mb-1">{p.name}</h3>
            <p className={`text-sm mb-8 ${p.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{p.desc}</p>
            <div className="mb-8">
              <span className="font-display font-bold text-4xl">{p.price}</span>
              <span className={`text-sm ml-2 ${p.highlighted ? "text-primary-foreground/50" : "text-muted-foreground"}`}>/{p.period}</span>
            </div>
            <Button
              variant={p.highlighted ? "hero" : "outline"}
              className={`w-full mb-8 ${!p.highlighted ? "border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground" : ""}`}
            >
              Get Started
            </Button>
            <div className="space-y-4">
              {p.features.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm">
                  <Check className={`h-4 w-4 shrink-0 ${p.highlighted ? "text-emerald" : "text-emerald"}`} />
                  <span className={p.highlighted ? "text-primary-foreground/80" : "text-foreground"}>{f}</span>
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
