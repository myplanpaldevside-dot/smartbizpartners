import { motion } from "framer-motion";
import { BookOpen, Hammer, Rocket } from "lucide-react";

const steps = [
  { icon: BookOpen, step: "01", title: "Learn", desc: "Build foundational knowledge through bootcamps, courses, and masterclasses." },
  { icon: Hammer, step: "02", title: "Build", desc: "Get your website, brand, and digital presence professionally developed." },
  { icon: Rocket, step: "03", title: "Scale", desc: "Leverage growth tools, analytics, and community to scale sustainably." },
];

const HowItWorksSection = () => (
  <section className="py-24 gradient-subtle">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">How It Works</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Three Steps to Growth</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-border" />

        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            className="text-center relative"
          >
            <div className="w-16 h-16 rounded-2xl gradient-emerald flex items-center justify-center mx-auto mb-6 shadow-glow relative z-10">
              <s.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="text-xs font-bold text-emerald uppercase tracking-widest mb-2">Step {s.step}</p>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
