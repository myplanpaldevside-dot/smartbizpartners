import { motion } from "framer-motion";

const problems = [
  { num: "01", title: "No Structured Systems", desc: "Most SMEs lack organized business processes and frameworks to manage growth." },
  { num: "02", title: "Weak Digital Presence", desc: "Without websites or branding, SMEs remain invisible to their target market." },
  { num: "03", title: "Expensive Agencies", desc: "Traditional agencies charge premium prices that small businesses simply can't afford." },
  { num: "04", title: "Inconsistent Freelancers", desc: "Freelancers deliver unpredictable quality and often disappear mid-project." },
];

const ProblemSection = () => (
  <section id="problem" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">The Problem</p>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95] max-w-3xl">
          Small Businesses Are <span className="text-gradient">Underserved</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-0 border-t border-border">
        {problems.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border p-8 md:p-12 group hover:bg-muted transition-colors md:border-r last:border-r-0 [&:nth-child(2)]:border-r-0 [&:nth-child(even)]:md:border-r-0"
          >
            <span className="font-display text-5xl font-bold text-emerald/20 group-hover:text-emerald/40 transition-colors">{p.num}</span>
            <h3 className="font-display font-bold text-xl text-foreground mt-4 mb-3">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
