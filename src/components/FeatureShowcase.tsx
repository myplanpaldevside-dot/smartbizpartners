import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import invoiceMockup from "@/assets/smartbooks-invoice-mockup.png";
import expensesMockup from "@/assets/smartbooks-expenses-mockup.png";
import crmMockup from "@/assets/smartbooks-crm-mockup.png";
import dashboardMockup from "@/assets/smartbooks-dashboard-mockup.png";

const features = [
  {
    title: "Create invoices, share receipts & track payments easily",
    desc: "Generate professional invoices in seconds, send receipts via WhatsApp, and never lose track of who owes you what.",
    image: invoiceMockup,
    link: "/smartbooks/invoices",
    badge: "Live",
  },
  {
    title: "Stay ahead with real-time expense & profit analytics",
    desc: "Log expenses, track revenue streams, and see your real profit margins at a glance. Know exactly where your money goes.",
    image: expensesMockup,
    link: "/smartbooks/expenses",
    badge: "Coming Soon",
  },
  {
    title: "Save customer details & keep them coming back",
    desc: "Record customer details with purchase history, shipping addresses, and contact info. Never miss a follow-up again.",
    image: crmMockup,
    link: "/smartbooks/crm",
    badge: "Coming Soon",
  },
  {
    title: "Have full visibility on your business operations",
    desc: "One dashboard to view sales, inventory, expenses & analytics. Stop running your business blindly.",
    image: dashboardMockup,
    link: "/smartbooks",
    badge: "Live",
  },
];

const FeatureShowcase = () => (
  <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-background">
    <div className="max-w-6xl mx-auto space-y-20 sm:space-y-32">
      {features.map((feature, i) => {
        const isReversed = i % 2 !== 0;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 sm:gap-12 md:gap-16`}
          >
            {/* Text side */}
            <div className="flex-1 text-center md:text-left">
              {feature.badge && (
                <span
                  className={`inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 mb-4 ${
                    feature.badge === "Live"
                      ? "bg-emerald/15 text-emerald"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {feature.badge}
                </span>
              )}
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
                {feature.desc}
              </p>
              <Link
                to={feature.link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald hover:text-foreground transition-colors group"
              >
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image side */}
            <motion.div
              className="flex-1 flex justify-center"
              whileInView={{ scale: [0.95, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-48 sm:w-56 md:w-64 lg:w-72 drop-shadow-xl"
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default FeatureShowcase;
