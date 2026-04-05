import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/pricing";

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
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Flexible plans for every stage of business.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Give SMEs an easy entry point, a clear growth option, and a premium full-package offer.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-3xl border bg-card p-8 shadow-card ${tier.highlight ? "border-primary/50 shadow-elevated" : "border-border"}`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{tier.badge}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{tier.label}</h3>
                </div>
                {tier.highlight && (
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Best Value
                  </span>
                )}
              </div>

              <div className="mb-4">
                <span className="font-display text-5xl font-bold text-foreground">{tier.priceLabel}</span>
                <span className="ml-2 text-sm text-muted-foreground">/month</span>
              </div>

              <p className="mb-6 text-sm leading-6 text-muted-foreground">{tier.summary}</p>

              <div className="space-y-3 border-y border-border py-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="mt-6 h-12 w-full text-base font-bold"
                variant={tier.highlight ? "default" : "outline"}
                onClick={() => navigate(`/smartbooks/pricing?plan=${tier.key}`)}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
