import { motion } from "framer-motion";

const problems = [
  {
    num: "01",
    title: "Tracking sales in a notebook",
    desc: "You're recording orders in WhatsApp chats, Excel sheets, or jotters — and something always falls through the cracks.",
    icon: "◇",
  },
  {
    num: "02",
    title: "Never knowing your true profit",
    desc: "Revenue looks good but money disappears. Without tracking every expense, you can't tell what you actually made.",
    icon: "△",
  },
  {
    num: "03",
    title: "Losing customers to follow-up failure",
    desc: "You forget to chase that invoice. You forget who bought what. Customers feel forgotten — and they leave.",
    icon: "○",
  },
  {
    num: "04",
    title: "Too many apps, zero clarity",
    desc: "Invoicing in one app, expenses in another, customers in a spreadsheet. Nothing talks to each other.",
    icon: "□",
  },
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
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">Sound Familiar?</p>
          <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9] max-w-3xl">
            Running a business<br />shouldn't feel like{" "}
            <span className="text-stroke-emerald">this.</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:pb-2">
          We hear these exact stories from Nigerian business owners every single week.
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
              <span className="font-display text-6xl font-bold text-emerald/15 group-hover:text-emerald/40 transition-colors">
                {p.num}
              </span>
              <span className="text-2xl text-muted-foreground/30 group-hover:text-emerald transition-colors">
                {p.icon}
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">{p.title}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
