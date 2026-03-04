import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section id="contact" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9] mb-6">
          Smart businesses<br />
          don't grow by<br />
          <span className="text-stroke">accident.</span>
        </h2>
        <p className="font-display text-3xl md:text-5xl font-bold text-emerald mt-8 mb-12">
          They grow with structure.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="hero" size="xl" className="group">
            Start Growing <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="navy" size="xl">Partner With Us</Button>
          <Button variant="hero-outline" size="xl">Invest in SmartBiz</Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
