import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const awards = [
  { org: "Clients", category: "Active Businesses", count: "5", desc: "Paying Customers" },
  { org: "Projects", category: "Delivered", count: "10+", desc: "Completed Projects" },
  { org: "Community", category: "Entrepreneurs", count: "500+", desc: "Community Members" },
  { org: "Content", category: "Education", count: "100+", desc: "Resources Created" },
];

const AwardsSection = () => (
  <section className="py-24 sm:py-32 px-4 sm:px-6 md:px-12 bg-background">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
      >
        <div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.9]">
            Our
          </h2>
          <h2 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.9] text-stroke">
            Progress
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            We're just getting started — here's where we are today.
          </p>
          <a href="#contact" className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary hover:text-foreground transition-colors group">
            WORK WITH US <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
        {awards.map((award, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="border border-border p-6 sm:p-8 group hover:bg-foreground hover:text-primary-foreground transition-colors duration-500"
          >
            <p className="text-[10px] font-semibold tracking-[0.3em] text-primary uppercase mb-4">
              {award.org}
            </p>
            <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/50 mb-6 transition-colors">
              {award.category}
            </p>
            <p className="font-display text-4xl sm:text-5xl font-bold text-primary mb-2">
              {award.count}
            </p>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/60 transition-colors">
              {award.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AwardsSection;
