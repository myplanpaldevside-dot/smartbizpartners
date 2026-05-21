import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { getTierAmountKobo, pricingTiers, type PricingTier } from "@/lib/pricing";

const tier = pricingTiers[0];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const getPlanId = async (t: PricingTier) => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("name", t.planName)
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Selected plan is not available yet.");
    return data[0].id;
  };

  const handleSubscribe = async () => {
    if (!user) { navigate("/smartbooks/auth"); return; }
    setLoadingAction("subscribe");
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

  const handleStartTrial = async () => {
    if (!user) { navigate("/smartbooks/auth"); return; }
    setLoadingAction("trial");
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
      toast({ title: "14-day trial started. Welcome to SmartBooks!" });
      navigate("/smartbooks");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoadingAction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to SmartBiz
        </a>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
            One plan. Everything included.
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            No upsells, no feature gates. Every SmartBiz tool is yours from day one.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl border border-primary/30 bg-card shadow-elevated overflow-hidden"
        >
          <div className="h-1 w-full gradient-brand" />

          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Full Access
            </span>
          </div>

          <div className="p-8 sm:p-12">
            <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-2">SmartBooks Plan</p>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">SmartBooks</h2>

            <div className="flex items-end gap-2 mb-2">
              <span className="font-display text-6xl font-bold text-foreground">₦20k</span>
              <span className="text-muted-foreground mb-3 text-lg">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{tier.summary}</p>

            <div className="grid sm:grid-cols-2 gap-3 border-y border-border py-8 mb-8">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="h-12 flex-1 text-base font-bold rounded-full gradient-brand hover:opacity-90"
                onClick={handleStartTrial}
                disabled={loadingAction !== null}
              >
                {loadingAction === "trial" ? "Starting trial..." : "Start 14-Day Free Trial"}
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 text-base font-bold rounded-full hover:border-primary/40"
                onClick={handleSubscribe}
                disabled={loadingAction !== null}
              >
                {loadingAction === "subscribe" ? "Processing..." : "Subscribe at ₦20k/mo"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Secured by Paystack
              </div>
              <span>No credit card for trial</span>
              <span>Cancel anytime</span>
              <span>No hidden fees</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
