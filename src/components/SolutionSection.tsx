import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const columns = [
  {
    letter: "A",
    title: "SmartBooks Platform",
    desc: "Your all-in-one business command center — invoicing, expenses, CRM, inventory, and analytics in one clean dashboard.",
    items: ["Invoice & Receipt Builder", "Expense Tracker", "Customer CRM", "Business Analytics"],
    badge: "Live Now",
  },
  {
    letter: "B",
    title: "Growth Services",
    desc: "Professional digital solutions priced for SMEs — not agency budgets. Websites, branding, and growth funnels that convert.",
    items: ["Website Development", "Branding & Identity", "Growth Funnels", "Retainer Packages"],
    badge: "Active",
  },
  {
    letter: "C",
    title: "Business Education",
    desc: "Practical, no-fluff learning for African entrepreneurs. Bootcamps, templates, and masterclasses that drive real results.",
    items: ["Bootcamps", "Online Courses", "Business Templates", "Masterclasses"],
    badge: "Active",
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
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">What We Offer</p>
          <h2 className="font-display text-5xl md:text-8xl font-bold leading-[0.9]">
            Everything your<br />
            business needs to{" "}
            <span style={{ WebkitTextStroke: "2px hsl(160 84% 39%)", color: "transparent" }}>
              thrive.
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-primary-foreground/50 max-w-sm leading-relaxed">
            Tools, services, and education — working together so you never have to choose.
          </p>
          <a
            href="#contact"
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald hover:text-primary-foreground transition-colors group"
          >
            GET STARTED{" "}
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>

      <div className="space-y-0">
        {columns.map((col, ci) => (
          <motion.div
            key={col.letter}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-primary-foreground/10 py-12 md:py-16 grid md:grid-cols-12 gap-8 items-start group hover:bg-primary-foreground/5 transition-colors duration-500 px-4 -mx-4"
          >
            <div className="md:col-span-1">
              <span className="font-display text-5xl font-bold text-emerald group-hover:text-primary-foreground transition-colors duration-500">
                {col.letter}/
              </span>
            </div>
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display font-bold text-2xl md:text-3xl">{col.title}</h3>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-emerald/20 text-emerald px-3 py-1">
                  {col.badge}
                </span>
              </div>
              <p className="text-sm text-primary-foreground/50 leading-relaxed">{col.desc}</p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {col.items.map((item) => (
                <div
                  key={item}
                  className="text-sm font-medium text-primary-foreground/60 group-hover:text-primary-foreground transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-emerald text-[8px]">●</span> {item}
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
