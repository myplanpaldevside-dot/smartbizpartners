import { motion } from "framer-motion";

const visions = [
  { label: "Subscription Platform", desc: "Recurring revenue through digital growth tools for SMEs across Africa." },
  { label: "Pan-African Expansion", desc: "Scaling across West Africa and beyond to serve millions of entrepreneurs." },
  { label: "SME Infrastructure", desc: "The backbone for Africa's emerging businesses — systems, tools, support." },
  { label: "App Ecosystem", desc: "Mobile-first tools for SMEs on the go, accessible from anywhere." },
];

const VisionSection = () => (
  <section className="py-32 px-6 md:px-12 bg-muted">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">Our Vision</p>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95] max-w-4xl">
          The Operating System for <span className="text-gradient">African SMEs</span>
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl leading-relaxed">
          We're building long-term infrastructure — not a one-time service. SmartBiz will become the default growth engine for SMEs across the continent.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-0 border-t border-border">
        {visions.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="border-b border-border p-10 md:p-14 group hover:bg-background transition-colors md:odd:border-r"
          >
            <span className="font-display text-5xl font-bold text-emerald/15 group-hover:text-emerald/30 transition-colors">
              0{i + 1}
            </span>
            <h3 className="font-display font-bold text-xl text-foreground mt-4 mb-3">{v.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default VisionSection;
