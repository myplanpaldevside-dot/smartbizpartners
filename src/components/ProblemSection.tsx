import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const problems = [
  { num: "01", title: "No Structured Systems", desc: "Most SMEs lack organized business processes and frameworks to manage growth.", icon: "◇" },
  { num: "02", title: "Weak Digital Presence", desc: "Without websites or branding, SMEs remain invisible to their target market.", icon: "△" },
  { num: "03", title: "Expensive Agencies", desc: "Traditional agencies charge premium prices that small businesses simply can't afford.", icon: "○" },
  { num: "04", title: "Inconsistent Freelancers", desc: "Freelancers deliver unpredictable quality and often disappear mid-project.", icon: "□" },
];

const ProblemSection = () => (
  <section id="problem" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">The Problem</p>
          <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9] max-w-3xl">
            Small Businesses<br />Are <span className="text-stroke-emerald">Underserved</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:pb-2">
          Over 40 million Nigerian SMEs lack access to affordable, quality digital growth tools.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-0 border-t border-border">
        {problems.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border p-8 md:p-14 group hover:bg-foreground hover:text-primary-foreground transition-all duration-500 cursor-default md:odd:border-r"
          >
            <div className="flex items-start justify-between mb-8">
              <span className="font-display text-6xl font-bold text-emerald/15 group-hover:text-emerald/40 transition-colors">{p.num}</span>
              <span className="text-2xl text-muted-foreground/30 group-hover:text-emerald transition-colors">{p.icon}</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">{p.title}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
