import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const FinalCTA = () => (
  <section id="contact" className="py-32 md:py-40 px-6 md:px-12 relative overflow-hidden">
    {/* Background glow */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald/5 blur-[150px]"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 6, repeat: Infinity }}
    />

    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-8">Let's Work Together</p>
        <h2 className="font-display text-5xl md:text-[8vw] font-bold text-foreground leading-[0.85] mb-4">
          Smart businesses
        </h2>
        <h2 className="font-display text-5xl md:text-[8vw] font-bold leading-[0.85] mb-4 text-stroke">
          don't grow by
        </h2>
        <h2 className="font-display text-5xl md:text-[8vw] font-bold text-foreground leading-[0.85] mb-8">
          accident<span className="text-emerald">.</span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-2xl md:text-4xl font-bold text-emerald mb-14"
        >
          They grow with structure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <a href="#contact" className="inline-flex items-center gap-2 bg-emerald text-primary-foreground px-8 py-4 font-display font-bold text-sm tracking-[0.1em] hover:bg-foreground transition-colors duration-300 group">
            START GROWING <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-8 py-4 font-display font-bold text-sm tracking-[0.1em] hover:bg-emerald transition-colors duration-300 group">
            PARTNER WITH US <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
