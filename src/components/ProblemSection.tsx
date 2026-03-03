import { motion } from "framer-motion";
import { AlertTriangle, Globe, DollarSign, Users } from "lucide-react";

const problems = [
  { icon: AlertTriangle, title: "No Structured Systems", desc: "Most SMEs lack organized business processes and frameworks to manage growth." },
  { icon: Globe, title: "Weak Digital Presence", desc: "Without websites or branding, SMEs remain invisible to their target market." },
  { icon: DollarSign, title: "Expensive Agencies", desc: "Traditional agencies charge premium prices that small businesses simply can't afford." },
  { icon: Users, title: "Inconsistent Freelancers", desc: "Freelancers deliver unpredictable quality and often disappear mid-project." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const ProblemSection = () => (
  <section id="problem" className="py-24 gradient-subtle">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">The Problem</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Small Businesses Are Underserved</h2>
        <p className="text-muted-foreground">Over 40 million SMEs in Nigeria struggle to grow due to systemic challenges in access, education, and digital tools.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((p, i) => (
          <motion.div key={p.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mb-4 group-hover:bg-emerald/20 transition-colors">
              <p.icon className="h-6 w-6 text-emerald" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
