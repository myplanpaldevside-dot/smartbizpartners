import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section id="contact" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
          Smart businesses don't grow by accident.
          <br />
          <span className="text-gradient">They grow with structure.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Whether you're an SME ready to scale, a partner, or an investor — there's a seat at the table for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
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
