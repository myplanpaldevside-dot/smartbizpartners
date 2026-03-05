import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Discovery", desc: "We start by listening. Understanding your goals, audience, and challenges — finding clarity before we begin building." },
  { num: "02", title: "Build", desc: "Ideas take form. From websites to brand identity, we design, prototype, and develop with precision and care." },
  { num: "03", title: "Scale", desc: "Delivery is only the beginning. We provide growth tools, analytics, and support to ensure your business thrives." },
];

const HowItWorksSection = () => (
  <section id="process" className="py-32 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">The Process</p>
          <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9]">
            How We <span className="text-stroke-emerald">Work</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          A proven methodology refined through dozens of projects with ambitious African brands.
        </p>
      </motion.div>

      {/* Interactive numbered process */}
      <div className="relative">
        {/* Vertical line connector */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[1px] bg-border hidden md:block" />
        
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid md:grid-cols-12 gap-6 md:gap-12 py-12 md:py-16 border-b border-border group cursor-default"
          >
            {/* Number */}
            <div className="md:col-span-2 flex items-start">
              <span className="font-display text-7xl md:text-9xl font-bold text-emerald/10 group-hover:text-emerald/30 transition-all duration-700 leading-none">
                {s.num}
              </span>
            </div>
            
            {/* Content */}
            <div className="md:col-span-4 flex items-center">
              <h3 className="font-display font-bold text-3xl md:text-4xl text-foreground group-hover:text-emerald transition-colors duration-500">
                {s.title}
              </h3>
            </div>
            
            <div className="md:col-span-6 flex items-center">
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-500">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
