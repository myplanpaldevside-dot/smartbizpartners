import { motion } from "framer-motion";

const columns = [
  {
    letter: "A",
    title: "Premium Execution Services",
    desc: "Professional digital solutions at SME-friendly prices — from websites to growth funnels.",
    items: ["Website Development", "Branding & Content Creation", "Growth Funnels", "Retainer Services"],
    badge: "Active",
  },
  {
    letter: "B",
    title: "Business Education",
    desc: "Hands-on learning designed for African entrepreneurs who want real, actionable growth.",
    items: ["Bootcamps", "Courses", "Templates", "Masterclasses"],
    badge: "Active",
  },
  {
    letter: "C",
    title: "SmartBiz Platform",
    desc: "The subscription engine for sustained SME growth — dashboards, tools, and community.",
    items: ["SME Dashboard", "Subscription Tools", "Growth Tracking", "Community Support"],
    badge: "Coming Soon",
  },
];

const SolutionSection = () => (
  <section id="solution" className="py-32 px-6 md:px-12 bg-foreground text-primary-foreground">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">Our Services</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95]">
            A Complete<br />Growth Ecosystem
          </h2>
        </div>
        <p className="text-sm text-primary-foreground/50 max-w-sm leading-relaxed">
          If you're looking for clarity in growth, let's build it together.
        </p>
      </motion.div>

      <div className="space-y-0">
        {columns.map((col, ci) => (
          <motion.div
            key={col.letter}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-primary-foreground/10 py-12 md:py-16 grid md:grid-cols-12 gap-8 items-start group"
          >
            <div className="md:col-span-1">
              <span className="font-display text-4xl font-bold text-emerald">{col.letter}/</span>
            </div>
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-display font-bold text-2xl">{col.title}</h3>
                {col.badge === "Coming Soon" && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-emerald/20 text-emerald px-2 py-0.5">
                    Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-primary-foreground/50 leading-relaxed">{col.desc}</p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 gap-3">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="text-sm font-medium text-primary-foreground/70 group-hover:text-primary-foreground transition-colors"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
