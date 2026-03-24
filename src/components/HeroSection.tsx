import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calculator,
  Users,
  Package,
  BarChart3,
  CreditCard,
  Bell,
  Globe,
  FileCheck,
  Shield,
  ArrowRight,
  Play,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const rotatingWords = ["management", "invoicing", "growth", "analytics"];

const featurePills = [
  { icon: FileText, label: "Invoices & Receipts" },
  { icon: Calculator, label: "Expense Tracking" },
  { icon: Users, label: "Customer CRM" },
  { icon: Package, label: "Inventory" },
  { icon: BarChart3, label: "Analytics" },
  { icon: CreditCard, label: "Multi-Currency" },
  { icon: Bell, label: "Payment Reminders" },
  { icon: Globe, label: "Business Website" },
  { icon: FileCheck, label: "Quotes & Proposals" },
  { icon: Shield, label: "Secure Data" },
];

const stats = [
  { value: "10x", label: "Faster Invoicing" },
  { value: "₦0", label: "To Start" },
  { value: "24/7", label: "Always Available" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 overflow-hidden pt-20 pb-10">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]"
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px]"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating grid dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-5 py-2 border border-primary/20 bg-primary/5 rounded-full mb-8 sm:mb-10 backdrop-blur-sm"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            The #1 Business OS for African SMEs
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.05] mb-6 sm:mb-8"
        >
          Your business{" "}
          <span className="relative inline-block min-w-[200px] sm:min-w-[280px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 30, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: 90 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-gradient"
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary/30 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </span>
          <br className="hidden sm:block" />
          partner, from day one.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Everything you need to run, grow, and scale your business — 
          invoicing, expenses, CRM, inventory, and more — all in one powerful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="xl"
            className="rounded-full px-10 gradient-brand text-primary-foreground hover:opacity-90 font-semibold shadow-lg shadow-primary/20 group"
            onClick={() => navigate("/smartbooks")}
          >
            Start Growing Free
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border hover:border-primary/40 group"
            onClick={() => {
              document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Play className="w-4 h-4 mr-1 text-primary" />
            See How It Works
          </Button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl sm:text-2xl font-display font-bold text-primary">{stat.value}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          <span>No credit card required · 14-day free trial · Cancel anytime</span>
        </motion.div>
      </div>

      {/* Feature pills marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="w-full overflow-hidden mt-14 sm:mt-16"
      >
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...featurePills, ...featurePills, ...featurePills].map((pill, i) => (
            <div
              key={`pill-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-card/50 backdrop-blur-sm mx-2 shrink-0 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-full group"
            >
              <pill.icon className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{pill.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
