export type PricingTierKey = "smartbooks";

export interface PricingTier {
  key: PricingTierKey;
  label: string;
  badge: string;
  planName: string;
  monthlyPrice: number;
  priceLabel: string;
  summary: string;
  highlight?: boolean;
  cta: string;
  features: string[];
}

export const pricingTiers: PricingTier[] = [
  {
    key: "smartbooks",
    label: "SmartBooks",
    badge: "Full Access",
    planName: "SmartBooks",
    monthlyPrice: 20000,
    priceLabel: "₦20,000",
    summary: "Everything you need to run, track, and grow your business — one flat price, no limits.",
    highlight: true,
    cta: "Start Free Trial",
    features: [
      "Unlimited Invoices & Receipts",
      "Expense & Profit Tracking",
      "Customer CRM",
      "Inventory Management",
      "Business Analytics Dashboard",
      "Multi-Currency Support",
      "Payment Reminders",
      "Business Storefront",
      "Quotes & Proposals",
      "Data Export & Reports",
      "Mobile-Friendly Dashboard",
      "Priority Support",
    ],
  },
];

export const getTierAmountKobo = (tier: PricingTier) => tier.monthlyPrice * 100;
