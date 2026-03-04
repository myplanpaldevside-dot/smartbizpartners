import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Learn", desc: "Build foundational knowledge through bootcamps, courses, and masterclasses designed for African entrepreneurs." },
  { num: "02", title: "Build", desc: "Get your website, brand, and digital presence professionally developed by our expert team." },
  { num: "03", title: "Scale", desc: "Leverage growth tools, analytics, and community to scale your business sustainably." },
];

const HowItWorksSection = () => (
  <section className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">The Process</p>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95]">
          How It <span className="text-stroke-emerald">Works</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-0">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border border-border p-10 md:p-12 group hover:bg-foreground hover:text-primary-foreground transition-all duration-500 cursor-default"
          >
            <span className="font-display text-7xl md:text-8xl font-bold text-emerald/15 group-hover:text-emerald/30 transition-colors block mb-6">
              {s.num}
            </span>
            <h3 className="font-display font-bold text-3xl mb-4">{s.title}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors leading-relaxed">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
