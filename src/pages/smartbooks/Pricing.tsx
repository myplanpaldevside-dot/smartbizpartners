import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, Rocket, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/smartbooks/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-checkout", {
        body: { email: user.email, amount: 10000000, plan_name: "SmartBooks Pro" },
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
    setLoading(false);
  };

  const handleStartTrial = async () => {
    if (!user) {
      navigate("/smartbooks/auth");
      return;
    }

    // Check if already has subscription
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      toast({ title: "You already have an active plan!" });
      navigate("/smartbooks");
      return;
    }

    // Get plan ID
    const { data: plans } = await supabase
      .from("subscription_plans")
      .select("id")
      .limit(1);

    if (!plans || plans.length === 0) {
      toast({ title: "No plans available", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: plans[0].id,
      status: "trialing",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome! Your 14-day free trial has started." });
      navigate("/smartbooks");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
            One plan. Full access.
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start with a 14-day free trial, then ₦100,000/month for the complete business toolkit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              <p className="text-xs text-muted-foreground">Everything included, zero surprises</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="font-display font-bold text-5xl sm:text-6xl">₦100,000</span>
            <span className="text-sm text-muted-foreground ml-2">/month</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-bold"
              onClick={handleStartTrial}
              disabled={loading}
            >
              Start 14-Day Free Trial
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 text-base font-bold"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {allFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-foreground/80">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-border pt-6">
            <Shield className="h-3.5 w-3.5" />
            Secured by Paystack. Cancel anytime. No hidden fees.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
