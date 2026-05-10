import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight } from "lucide-react";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "May 10, 2026";

  const sections = [
    {
      title: "1. Agreement to Terms",
      body: [
        `These Terms of Service ("Terms") govern your access to and use of the SmartBiz website (smartbiz.team), the SmartBooks dashboard, and all related tools and services (collectively, the "Services") operated by SmartBiz ("we," "us," or "our").`,
        `By creating an account, accessing, or using our Services, you agree to be bound by these Terms. If you do not agree, you may not use the Services. These Terms constitute a legally binding agreement between you and SmartBiz.`,
      ],
    },
    {
      title: "2. Description of Services",
      body: [
        `SmartBooks is a business management platform designed for African SMEs. Our Services include, but are not limited to:`,
        `Invoicing and payment tracking`,
        `Expense management and reporting`,
        `Customer relationship management (CRM)`,
        `Inventory and stock tracking`,
        `Online storefront creation and order management`,
        `Business analytics and reporting`,
        `We reserve the right to modify, suspend, or discontinue any part of the Services at any time with reasonable notice.`,
      ],
    },
    {
      title: "3. Account Registration",
      body: [
        `To use SmartBooks, you must create an account with accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`,
        `You must be at least 18 years old and legally capable of entering into contracts to use our Services. Businesses must provide a valid business name, contact email, and accurate billing information.`,
        `We reserve the right to suspend or terminate accounts that provide false information, violate these Terms, or engage in fraudulent or abusive behavior.`,
      ],
    },
    {
      title: "4. Subscription and Payments",
      body: [
        `SmartBooks offers tiered subscription plans: Starter, Growth, and Premium. Fees are billed in Nigerian Naira (₦) or as otherwise indicated at checkout.`,
        `All payments are processed securely through Paystack. By subscribing, you authorize us to charge your selected payment method for the subscription fee plus applicable taxes.`,
        `Subscriptions renew automatically at the end of each billing cycle unless canceled at least 24 hours before renewal. You may cancel your subscription at any time from your account settings.`,
        `Refunds are provided only where required by law or at our sole discretion for technical failures on our part.`,
      ],
    },
    {
      title: "5. User Content and Data",
      body: [
        `You retain ownership of all business data, customer records, invoices, and content you upload or create using SmartBooks ("User Content"). By using our Services, you grant us a limited license to host, store, and process your User Content solely for the purpose of providing and improving the Services.`,
        `You are solely responsible for the accuracy, legality, and appropriateness of your User Content. You may not upload content that is unlawful, defamatory, infringing, or harmful.`,
        `We do not monitor all User Content but reserve the right to remove or disable access to content that violates these Terms or applicable law.`,
      ],
    },
    {
      title: "6. Acceptable Use",
      body: [
        `You agree not to:`,
        `Use the Services for any illegal, fraudulent, or unauthorized purpose.`,
        `Interfere with or disrupt the integrity or performance of the Services.`,
        `Attempt to gain unauthorized access to any part of the Services or related systems.`,
        `Reverse engineer, decompile, or disassemble any aspect of the Services.`,
        `Send spam, phishing, or other unsolicited communications through our platform.`,
        `Use the Services to process payments for prohibited goods or services (e.g., illegal drugs, weapons, counterfeit items).`,
        `Violation of these rules may result in immediate suspension or termination of your account without refund.`,
      ],
    },
    {
      title: "7. Intellectual Property",
      body: [
        `All content, design, branding, software, and materials provided by SmartBiz (excluding your User Content) are the intellectual property of SmartBiz or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the Services for your internal business purposes.`,
        `You may not copy, modify, distribute, or create derivative works from our materials without express written permission. The SmartBiz name, logo, and taglines are trademarks of SmartBiz.`,
      ],
    },
    {
      title: "8. Third-Party Services",
      body: [
        `Our Services integrate with third-party providers such as Paystack (payments) and Google (authentication). Your use of these third-party services is subject to their respective terms and privacy policies. SmartBiz is not responsible for the availability, accuracy, or practices of third-party services.`,
      ],
    },
    {
      title: "9. Limitation of Liability",
      body: [
        `To the maximum extent permitted by law, SmartBiz and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Services.`,
        `Our total liability for any claim arising under these Terms shall not exceed the total amount you paid to SmartBiz in the twelve (12) months preceding the claim.`,
        `We do not guarantee that the Services will be uninterrupted, error-free, or completely secure. You use the Services at your own risk.`,
      ],
    },
    {
      title: "10. Termination",
      body: [
        `You may terminate your account at any time by contacting us or using the account deletion feature within SmartBooks. Upon termination, your access to the Services will cease, and we may delete your data in accordance with our data retention policy.`,
        `We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or if required by law. Provisions relating to intellectual property, liability, and dispute resolution shall survive termination.`,
      ],
    },
    {
      title: "11. Dispute Resolution",
      body: [
        `These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any dispute arising from these Terms or your use of the Services shall first be attempted to be resolved through good-faith negotiation.`,
        `If negotiation fails, disputes shall be resolved through arbitration in Lagos, Nigeria, under the Arbitration and Conciliation Act. Each party shall bear its own costs unless the arbitrator decides otherwise.`,
      ],
    },
    {
      title: "12. Changes to Terms",
      body: [
        `We may update these Terms from time to time. Material changes will be communicated via email or a notice within the Services at least 14 days before taking effect. Your continued use of the Services after changes constitutes acceptance of the revised Terms.`,
      ],
    },
    {
      title: "13. Contact Information",
      body: [
        `For questions about these Terms, please contact us:`,
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
            Terms of Service
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
                        p.startsWith("Invoicing") ||
                        p.startsWith("Expense") ||
                        p.startsWith("Customer") ||
                        p.startsWith("Inventory") ||
                        p.startsWith("Online") ||
                        p.startsWith("Business") ||
                        p.startsWith("Use the") ||
                        p.startsWith("Interfere") ||
                        p.startsWith("Attempt") ||
                        p.startsWith("Reverse") ||
                        p.startsWith("Send spam") ||
                        p.startsWith("Use the Services") ||
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

export default TermsOfService;
