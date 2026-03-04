import { motion } from "framer-motion";

const stats = [
  { value: "5+", label: "Paying Clients" },
  { value: "200", label: "SME Target (12mo)" },
  { value: "3x", label: "Revenue Growth" },
  { value: "40M+", label: "Nigerian SMEs" },
];

const StatsSection = () => (
  <section className="py-24 px-6 md:px-12 border-y border-border">
    <div className="max-w-7xl mx-auto">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-12"
      >
        SmartBiz In Numbers
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-5xl md:text-7xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
