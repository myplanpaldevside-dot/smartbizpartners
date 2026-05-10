import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "May 10, 2026";

  const sections = [
    {
      title: "1. Introduction",
      body: [
        `SmartBiz ("we," "us," or "our") is committed to protecting the privacy of African small and medium enterprises ("SMEs") and their customers who use our platform. This Privacy Policy explains how we collect, use, store, and protect your personal information when you access our website at smartbiz.team, the SmartBooks dashboard, or any of our services (collectively, the "Services").`,
        `By using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Services.`,
      ],
    },
    {
      title: "2. Information We Collect",
      body: [
        `We collect information that you provide directly to us, including:`,
        `Account Information: business name, email address, phone number, password, and billing details when you register for SmartBooks.`,
        `Business Data: customer records, invoices, expenses, inventory items, and store products that you create or upload.`,
        `Transaction Data: payment information processed via Paystack. We do not store your full card details — these are handled securely by our payment processor.`,
        `Communication Data: messages, support tickets, or inquiries you send to us.`,
        `We also collect technical data automatically, such as IP address, browser type, device information, and usage analytics via cookies and similar technologies.`,
      ],
    },
    {
      title: "3. How We Use Your Information",
      body: [
        `We use the information we collect to:`,
        `Provide, operate, and maintain our Services (including invoicing, expense tracking, CRM, inventory, and storefront tools).`,
        `Process payments and manage subscriptions (Starter, Growth, Premium plans).`,
        `Send transactional emails, invoices, and account notifications.`,
        `Improve and personalize your experience on SmartBooks.`,
        `Respond to your support requests and inquiries.`,
        `Comply with legal obligations and prevent fraud or abuse.`,
      ],
    },
    {
      title: "4. Data Storage and Security",
      body: [
        `Your data is stored on secure cloud infrastructure managed by Lovable Cloud. We implement industry-standard security measures, including encryption in transit (SSL/TLS) and at rest, access controls, and regular security reviews.`,
        `While we take reasonable steps to protect your data, no internet-based service can be 100% secure. You are responsible for keeping your account password confidential.`,
      ],
    },
    {
      title: "5. Sharing Your Information",
      body: [
        `We do not sell your personal data. We may share your information only in the following circumstances:`,
        `Service Providers: with trusted third parties who help us operate our Services (e.g., payment processors like Paystack, email delivery services). These providers are contractually bound to protect your data.`,
        `Legal Requirements: when required by law, court order, or to protect our rights, safety, or property.`,
        `Business Transfers: in connection with a merger, acquisition, or sale of assets, subject to confidentiality obligations.`,
      ],
    },
    {
      title: "6. Your Rights",
      body: [
        `Depending on your location, you may have the right to:`,
        `Access, update, or delete your personal information.`,
        `Export your business data from SmartBooks.`,
        `Opt out of non-essential marketing communications.`,
        `Request clarification on how we process your data.`,
        `To exercise these rights, contact us at hello@smartbiz.ng.`,
      ],
    },
    {
      title: "7. Cookies and Tracking",
      body: [
        `We use cookies and similar technologies to improve your experience, remember your preferences, and analyze how our Services are used. You can control cookies through your browser settings. Disabling cookies may limit some functionality.`,
      ],
    },
    {
      title: "8. Third-Party Links",
      body: [
        `Our Services may contain links to third-party websites (e.g., social media, partner sites). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.`,
      ],
    },
    {
      title: "9. Children's Privacy",
      body: [
        `Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately so we can delete it.`,
      ],
    },
    {
      title: "10. Changes to This Policy",
      body: [
        `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically. Continued use of our Services after changes constitutes acceptance of the revised policy.`,
      ],
    },
    {
      title: "11. Contact Us",
      body: [
        `If you have any questions about this Privacy Policy or our data practices, please contact us:`,
        `Email: hello@smartbiz.ng`,
        `Address: Lagos, Nigeria`,
        `Phone: +234 800 SMARTBIZ`,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
              Legal
            </span>
            <ArrowUpRight className="h-3 w-3 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-b border-border pb-10 last:border-b-0 last:pb-0"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((p, j) => (
                    <p
                      key={j}
                      className={`text-sm leading-relaxed ${
                        p.startsWith("Account") ||
                        p.startsWith("Business") ||
                        p.startsWith("Transaction") ||
                        p.startsWith("Communication") ||
                        p.startsWith("Provide,") ||
                        p.startsWith("Process") ||
                        p.startsWith("Send") ||
                        p.startsWith("Improve") ||
                        p.startsWith("Respond") ||
                        p.startsWith("Comply") ||
                        p.startsWith("Service") ||
                        p.startsWith("Legal") ||
                        p.startsWith("Business Transfers") ||
                        p.startsWith("Access,") ||
                        p.startsWith("Export") ||
                        p.startsWith("Opt out") ||
                        p.startsWith("Request") ||
                        p.startsWith("Email:") ||
                        p.startsWith("Address:") ||
                        p.startsWith("Phone:")
                          ? "text-foreground/80 pl-4 border-l-2 border-primary/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
