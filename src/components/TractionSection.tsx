import { motion } from "framer-motion";
import { CheckCircle, Quote } from "lucide-react";

const milestones = [
  "5 paying customers acquired",
  "Early market validation complete",
  "Structured product roadmap defined",
  "Target: 200 SMEs in 12 months",
  "Revenue growth on track",
];

const testimonials = [
  { name: "Adebayo O.", role: "Fashion Brand Owner", quote: "SmartBiz helped us build a website that actually converts. Our online sales tripled." },
  { name: "Chioma E.", role: "Food Business CEO", quote: "The bootcamp changed how I think about my business. Now I have real systems in place." },
  { name: "Emeka U.", role: "Tech Startup Founder", quote: "Finally, affordable and professional digital services tailored for Nigerian SMEs." },
];

const TractionSection = () => (
  <section className="py-32 px-6 md:px-12 bg-muted">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">Client Reflections</p>
          <h2 className="font-display text-5xl md:text-8xl font-bold text-foreground leading-[0.9]">
            Early Momentum,<br /><span className="text-gradient">Clear Direction</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Honest impressions from the teams we've collaborated with across brand and digital work.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-display font-bold text-xs text-muted-foreground mb-8 tracking-[0.3em] uppercase">Key Milestones</h3>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center gap-5 group py-5 border-b border-border hover:pl-2 transition-all duration-300"
              >
                <CheckCircle className="h-4 w-4 text-emerald shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-foreground text-sm group-hover:text-emerald transition-colors">{m}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-0">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-border py-8 group hover:bg-background/50 px-6 -mx-6 transition-colors duration-500"
            >
              <Quote className="h-5 w-5 text-emerald/30 group-hover:text-emerald transition-colors mb-4" />
              <p className="text-foreground mb-5 text-lg leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-6 bg-emerald" />
                <div>
                  <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground tracking-wider uppercase">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TractionSection;
