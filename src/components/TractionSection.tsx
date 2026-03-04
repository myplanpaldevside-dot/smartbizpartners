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
        className="mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">Traction</p>
        <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95]">
          Early Momentum,<br /><span className="text-gradient">Clear Direction</span>
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-8 tracking-[0.1em] uppercase">Key Milestones</h3>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m} className="flex items-start gap-4 group">
                <CheckCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <p className="text-foreground group-hover:text-emerald transition-colors">{m}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="border-l-2 border-emerald pl-8 py-2"
            >
              <Quote className="h-4 w-4 text-emerald/40 mb-3" />
              <p className="text-foreground mb-4 italic leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-display font-bold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TractionSection;
