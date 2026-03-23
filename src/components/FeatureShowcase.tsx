import { motion } from "framer-motion";
import { ArrowRight, FileText, Calculator, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Create invoices, share receipts & track payments easily",
    desc: "Generate professional invoices in seconds, send receipts via WhatsApp, and never lose track of who owes you what.",
    icon: FileText,
    link: "/smartbooks/invoices",
    badge: "Live",
  },
  {
    title: "Stay ahead with real-time expense & profit analytics",
    desc: "Log expenses, track revenue streams, and see your real profit margins at a glance. Know exactly where your money goes.",
    icon: Calculator,
    link: "/smartbooks/expenses",
    badge: "Live",
  },
  {
    title: "Save customer details & keep them coming back",
    desc: "Record customer details with purchase history, shipping addresses, and contact info. Never miss a follow-up again.",
    icon: Users,
    link: "/smartbooks/crm",
    badge: "Live",
  },
  {
    title: "Have full visibility on your business operations",
    desc: "One dashboard to view sales, inventory, expenses & analytics. Stop running your business blindly.",
    icon: BarChart3,
    link: "/smartbooks",
    badge: "Live",
  },
];

const FeatureShowcase = () => (
  <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3">What You Get</p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Everything your business needs
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Tools designed for real businesses, not Silicon Valley startups.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={feature.link}
                className="group block p-8 sm:p-10 border border-border bg-card rounded-xl hover:border-primary/40 hover:shadow-elevated transition-all duration-500 h-full"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {feature.desc}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Try it now
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeatureShowcase;
