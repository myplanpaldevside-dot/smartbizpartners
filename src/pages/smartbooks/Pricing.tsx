import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Rocket, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  access_level: number;
}

const planIcons: Record<string, any> = {
  Starter: Zap,
  Growth: Crown,
  Premium: Rocket,
};

const planColors: Record<string, string> = {
  Starter: "border-secondary/30 hover:border-secondary",
  Growth: "border-primary/30 hover:border-primary ring-2 ring-primary/10",
  Premium: "border-brand-yellow/30 hover:border-brand-yellow",
};

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("subscription_plans")
      .select("*")
      .order("access_level")
      .then(({ data }) => {
        if (data) {
          setPlans(
            data.map((p: any) => ({
              ...p,
              features: Array.isArray(p.features) ? p.features : JSON.parse(p.features),
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);

  const handleSelectPlan = async (plan: Plan) => {
    if (!user) {
      navigate("/smartbooks/auth");
      return;
    }
    // Create subscription record
    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: plan.id,
      status: "trialing",
    });
    if (error) {
      toast({ title: "Error selecting plan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${plan.name} plan selected!`, description: "Your 14-day free trial has started." });
      navigate("/smartbooks");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">Pricing</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose your plan
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const Icon = planIcons[plan.name] || Zap;
            const isPopular = plan.name === "Growth";
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative border bg-card p-6 sm:p-8 rounded-xl transition-all duration-300 ${planColors[plan.name] || ""} ${
                  isPopular ? "shadow-elevated scale-[1.02]" : "hover:shadow-elevated"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isPopular ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="font-display font-bold text-3xl sm:text-4xl">{formatPrice(plan.price)}</span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Start Free Trial
                </Button>

                <div className="space-y-3">
                  {plan.features.map((f: string) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
