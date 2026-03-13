import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Adebayo Olamide",
    business: "Ola Fashion House",
    text: "SmartBooks changed how I run my fashion business. I used to track everything in notebooks — now invoices go out in seconds and I know exactly who owes me.",
    initials: "AO",
  },
  {
    name: "Chidinma Nwosu",
    business: "ChiChi's Kitchen",
    text: "As a caterer, I was losing money without knowing. The expense tracker showed me my real margins and I've increased profits by 40% in 3 months.",
    initials: "CN",
  },
  {
    name: "Tunde Bakare",
    business: "TechFix Solutions",
    text: "The CRM feature is a game-changer. I never miss a follow-up now and my repeat customers have doubled. SmartBiz understands what Nigerian businesses need.",
    initials: "TB",
  },
  {
    name: "Funmi Adeyemi",
    business: "Funmi's Organics",
    text: "I sell on Instagram and WhatsApp — SmartBooks helps me keep track of orders, send receipts, and manage my inventory all from my phone. Best decision ever!",
    initials: "FA",
  },
  {
    name: "Emmanuel Osei",
    business: "GreenLeaf Farms",
    text: "Before SmartBooks, I had no idea if my farm was profitable. Now I see real numbers. The dashboard is simple and perfect for someone like me who isn't tech-savvy.",
    initials: "EO",
  },
  {
    name: "Amara Eze",
    business: "Lux Hair Studio",
    text: "My hair salon runs smoother now. Appointments, customer history, invoices — everything is in one place. I recommend SmartBiz to every business owner I know.",
    initials: "AE",
  },
];

const TestimonialsSection = () => (
  <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-foreground text-primary-foreground overflow-hidden">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase mb-4">
          Trusted by SMEs
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          See what business owners<br className="hidden sm:block" /> are saying about{" "}
          <span className="text-emerald">SmartBiz</span>
        </h2>
      </motion.div>

      {/* Testimonials grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="border border-primary-foreground/10 p-6 sm:p-8 hover:border-emerald/30 transition-colors duration-300 group"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, si) => (
                <Star key={si} className="h-3.5 w-3.5 fill-emerald text-emerald" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald/20 flex items-center justify-center text-emerald text-xs font-bold">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">{t.name}</p>
                <p className="text-[11px] text-primary-foreground/50">{t.business}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
