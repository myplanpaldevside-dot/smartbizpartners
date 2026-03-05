import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const visions = [
  { label: "Subscription Platform", desc: "Recurring revenue through digital growth tools for SMEs across Africa." },
  { label: "Pan-African Expansion", desc: "Scaling across West Africa and beyond to serve millions of entrepreneurs." },
  { label: "SME Infrastructure", desc: "The backbone for Africa's emerging businesses — systems, tools, support." },
  { label: "App Ecosystem", desc: "Mobile-first tools for SMEs on the go, accessible from anywhere." },
];

const VisionSection = () => (
  <section className="py-32 px-6 md:px-12 bg-muted relative overflow-hidden">
    {/* Background decorative element */}
    <motion.div
      className="absolute -right-40 top-1/4 text-[30vw] font-display font-bold text-foreground/[0.02] leading-none select-none pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
    >
      OS
    </motion.div>

    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">Our Vision</p>
        <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9] max-w-4xl">
          The Operating System<br />for <span className="text-gradient">African SMEs</span>
        </h2>
        <p className="text-muted-foreground mt-8 max-w-xl leading-relaxed">
          We're building long-term infrastructure — not a one-time service. SmartBiz will become the default growth engine for SMEs across the continent.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-0 border-t border-border">
        {visions.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border p-10 md:p-14 group hover:bg-foreground hover:text-primary-foreground transition-all duration-500 cursor-default md:odd:border-r"
          >
            <div className="flex items-start justify-between mb-6">
              <span className="font-display text-6xl font-bold text-emerald/10 group-hover:text-emerald/30 transition-colors">
                0{i + 1}
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-emerald group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl mt-4 mb-3">{v.label}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default VisionSection;
