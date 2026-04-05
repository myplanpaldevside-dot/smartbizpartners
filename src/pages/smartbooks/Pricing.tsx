import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { getTierAmountKobo, pricingTiers, type PricingTier, type PricingTierKey } from "@/lib/pricing";

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const initialPlan = useMemo<PricingTierKey>(() => {
    if (typeof window === "undefined") return "growth";
    const requestedPlan = new URLSearchParams(window.location.search).get("plan");
    return requestedPlan === "starter" || requestedPlan === "growth" || requestedPlan === "premium"
      ? requestedPlan
      : "growth";
  }, []);
  const [selectedPlan, setSelectedPlan] = useState<PricingTierKey>(initialPlan);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const activeTier = pricingTiers.find((tier) => tier.key === selectedPlan) || pricingTiers[1];

  const getPlanId = async (tier: PricingTier) => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("name", tier.planName)
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Selected plan is not available yet.");

    return data[0].id;
  };

  const handleSubscribe = async (tier: PricingTier) => {
    if (!user) {
      navigate("/smartbooks/auth");
      return;
    }

    setLoadingAction(`subscribe-${tier.key}`);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-checkout", {
        body: {
          email: user.email,
          amount: getTierAmountKobo(tier),
          plan_name: tier.planName,
        },
      });
      if (error) throw error;
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err: any) {
      toast({ title: "Payment error", description: err.message, variant: "destructive" });
    }
    setLoadingAction(null);
  };

  const handleStartTrial = async (tier: PricingTier) => {
    if (!user) {
      navigate("/smartbooks/auth");
      return;
    }

    setLoadingAction(`trial-${tier.key}`);

    try {
      const { data: existing, error: existingError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (existingError) throw existingError;

      if (existing && existing.length > 0) {
        toast({ title: "You already have an active plan!" });
        navigate("/smartbooks");
        return;
      }

      const planId = await getPlanId(tier);
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_id: planId,
        status: "trialing",
      });

      if (error) throw error;

      toast({ title: `${tier.label} trial started successfully.` });
      navigate("/smartbooks");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to SmartBiz
        </a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tiered pricing built to convert more SMEs.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Starter removes friction, Growth is the main seller, and Premium closes serious businesses.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid gap-4 md:grid-cols-3 lg:grid-cols-1"
          >
            {pricingTiers.map((tier, index) => (
              <button
                key={tier.key}
                type="button"
                onClick={() => setSelectedPlan(tier.key)}
                className={`rounded-3xl border p-5 text-left transition-all ${selectedPlan === tier.key ? "border-primary bg-primary/5 shadow-card" : "border-border bg-card hover:border-primary/30"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{tier.badge}</p>
                    <h2 className="mt-2 font-display text-xl font-bold text-foreground">{tier.label}</h2>
                  </div>
                  {tier.highlight && (
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Best Value
                    </span>
                  )}
                </div>
                <p className="mt-3 font-display text-4xl font-bold text-foreground">{tier.priceLabel}<span className="ml-1 text-sm font-medium text-muted-foreground">/month</span></p>
                <p className="mt-2 text-sm text-muted-foreground">{tier.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tier.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-3xl border border-primary/40 bg-card p-8 shadow-elevated"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Selected Plan</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{activeTier.label}</h3>
              </div>
              {activeTier.highlight && (
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Recommended
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="font-display text-5xl font-bold text-foreground">{activeTier.priceLabel}</span>
              <span className="ml-2 text-sm text-muted-foreground">/month</span>
            </div>

            <p className="mb-8 text-sm leading-6 text-muted-foreground">{activeTier.summary}</p>

            <div className="mb-8 space-y-3">
              {activeTier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 flex-1 text-base font-bold"
                onClick={() => handleStartTrial(activeTier)}
                disabled={loadingAction !== null}
              >
                {loadingAction === `trial-${activeTier.key}` ? "Starting..." : "Start 14-Day Free Trial"}
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 text-base font-bold"
                onClick={() => handleSubscribe(activeTier)}
                disabled={loadingAction !== null}
              >
                {loadingAction === `subscribe-${activeTier.key}` ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              Secured by Paystack. Cancel anytime. No hidden fees.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
