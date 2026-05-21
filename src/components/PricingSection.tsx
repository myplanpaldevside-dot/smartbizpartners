import { motion } from "framer-motion";
import { Check, Zap, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/pricing";

const tier = pricingTiers[0];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
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
          <p className="text-muted-foreground max-w-xl mx-auto">
            No tiers to compare, no features locked away. Every SmartBiz tool is yours from day one.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-primary/30 bg-card shadow-elevated overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full gradient-brand" />

          {/* Badge */}
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Most Popular
            </span>
          </div>

          <div className="p-8 sm:p-12">
            {/* Price hero */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-2">
                {tier.badge}
              </p>
              <h3 className="font-display text-3xl font-bold text-foreground mb-4">{tier.label}</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-display text-6xl sm:text-7xl font-bold text-foreground">
                  ₦20k
                </span>
                <span className="text-muted-foreground mb-3 text-lg">/month</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                {tier.summary}
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-10 border-y border-border py-8">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="h-13 flex-1 text-base font-bold rounded-full gradient-brand hover:opacity-90 group"
                onClick={() => navigate(`/smartbooks/pricing?plan=${tier.key}`)}
              >
                Start 14-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 flex-1 text-base font-bold rounded-full hover:border-primary/40"
                onClick={() => navigate(`/smartbooks/pricing?plan=${tier.key}`)}
              >
                Subscribe at ₦20k/mo
              </Button>
            </div>

            {/* Trust footer */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Secured by Paystack
              </div>
              <span>No credit card for trial</span>
              <span>Cancel anytime</span>
              <span>No hidden fees</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
