import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import dashboardMockup from "@/assets/smartbooks-dashboard-mockup.png";
import {
  FileText,
  Calculator,
  Users,
  Package,
  FileCheck,
  Globe,
  BarChart3,
  CreditCard,
  Bell,
  Shield,
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
      {/* Background glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Centered hero content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 bg-primary/5 rounded-full mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Built for African SMEs
          </span>
        </motion.div>

        {/* Main headline with rotating word */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-4 sm:mb-6"
        >
          Solving your{" "}
          <span className="relative inline-block">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-primary"
            >
              {rotatingWords[wordIndex]}
            </motion.span>
          </span>{" "}
          problems, one solution at a time.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Simplify your business operations with tools that make invoicing, sales,
          expenses & customer management easy.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            variant="hero"
            size="xl"
            className="rounded-full px-12"
            onClick={() => navigate("/smartbooks")}
          >
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* Feature pills marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="w-full overflow-hidden mt-12 sm:mt-16"
      >
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[...featurePills, ...featurePills, ...featurePills].map((pill, i) => (
            <div
              key={`pill-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-card mx-2 shrink-0 hover:border-primary/40 transition-colors rounded-full"
            >
              <pill.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{pill.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Phone mockup with dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-10 sm:mt-16 w-full max-w-4xl mx-auto"
      >
        {/* Glow behind mockup */}
        <div className="absolute inset-0 bg-emerald/10 blur-[80px] rounded-full scale-75" />
        
        {/* Desktop + mobile combo mockup */}
        <div className="relative flex justify-center">
          <motion.img
            src={dashboardMockup}
            alt="SmartBooks Dashboard"
            className="relative w-48 sm:w-56 md:w-72 lg:w-80 drop-shadow-2xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
