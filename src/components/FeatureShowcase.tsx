import { motion } from "framer-motion";
import { ArrowRight, FileText, Calculator, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Invoicing & Receipts",
    tagline: "Get paid faster",
    desc: "Create a professional invoice in under 60 seconds, send it via WhatsApp or email, and receive instant alerts when payment lands. No more tracking who owes you in your head.",
    callout: "₦1M+ processed weekly",
    icon: FileText,
    link: "/smartbooks/invoices",
    iconColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  {
    number: "02",
    title: "Expense & Profit Tracking",
    tagline: "Know your real margins",
    desc: "Log every naira in and out, tag by category, and instantly see true profit. Most business owners are shocked the first time they see their real numbers — in a good way.",
    callout: "Average ₦180k/mo recovered",
    icon: Calculator,
    link: "/smartbooks/expenses",
    iconColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    number: "03",
    title: "Customer Management",
    tagline: "Build lasting relationships",
    desc: "Every customer's history, contact details, and purchase patterns in one place. Send targeted follow-ups, spot repeat buyers early, and never let a hot lead go cold.",
    callout: "2× repeat customer rate",
    icon: Users,
    link: "/smartbooks/crm",
    iconColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    number: "04",
    title: "Business Dashboard",
    tagline: "Your numbers at a glance",
    desc: "One clear view of sales, inventory levels, expenses, and growth trends. Stop running your business on gut feeling — make decisions backed by real data.",
    callout: "10-second daily review",
    icon: BarChart3,
    link: "/smartbooks",
    iconColor: "bg-primary/10 text-primary border-primary/20",
  },
];

const FeatureShowcase = () => (
  <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-12 bg-background">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16 sm:mb-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-4">
          What's Inside SmartBiz
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.05] max-w-xl">
            Four tools.
            <br />
            One platform.
            <br />
            <span className="text-primary">Total control.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:pb-2">
            Each module works on its own or as part of a fully connected system — your choice, your pace.
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={feature.link}
                className="group flex flex-col sm:flex-row sm:items-center gap-5 p-6 sm:p-8 border border-border bg-card rounded-2xl hover:border-primary/30 hover:shadow-elevated transition-all duration-400"
              >
                {/* Large step number — decorative */}
                <span className="font-display text-5xl font-bold text-border group-hover:text-primary/15 transition-colors duration-500 min-w-[3.5rem] leading-none hidden sm:block select-none">
                  {feature.number}
                </span>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${feature.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      · {feature.tagline}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-semibold text-primary whitespace-nowrap">
                      {feature.callout}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
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
