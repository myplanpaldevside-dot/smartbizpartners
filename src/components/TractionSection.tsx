import { motion } from "framer-motion";
import { CheckCircle, Star, Quote } from "lucide-react";

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
  <section className="py-24">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">Traction</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Early Momentum, Clear Direction</h2>
        <p className="text-muted-foreground">We've validated the model with real paying customers and a structured growth roadmap.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Milestones */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="bg-card rounded-2xl border border-border p-8 shadow-card"
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-6">Key Milestones</h3>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{m}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-card"
            >
              <Quote className="h-5 w-5 text-emerald/40 mb-3" />
              <p className="text-sm text-foreground mb-4 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, si) => <Star key={si} className="h-3 w-3 fill-emerald text-emerald" />)}
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
