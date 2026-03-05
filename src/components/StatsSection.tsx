import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "5+", label: "Paying Clients", suffix: "" },
  { value: "200", label: "SME Target (12mo)", suffix: "+" },
  { value: "3", label: "Revenue Growth", suffix: "x" },
  { value: "40M", label: "Nigerian SMEs", suffix: "+" },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 px-6 md:px-12 bg-foreground text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.9]">
              SmartBiz<br /><span className="text-emerald">In Numbers</span>
            </h2>
          </div>
          <p className="text-sm text-primary-foreground/40 max-w-sm leading-relaxed">
            A closer look at the milestones and impact that define our ongoing practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-primary-foreground/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-primary-foreground/10 md:border-r last:border-r-0 p-8 md:p-12 group hover:bg-emerald/10 transition-colors duration-500"
            >
              <p className="font-display text-5xl md:text-7xl font-bold text-primary-foreground group-hover:text-emerald transition-colors duration-500">
                {s.value}<span className="text-emerald">{s.suffix}</span>
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/40 mt-4">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
