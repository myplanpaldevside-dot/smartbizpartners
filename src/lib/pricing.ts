export type PricingTierKey = "starter" | "growth" | "premium";

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
    key: "starter",
    label: "Starter Plan",
    badge: "🟢 Easy entry",
    planName: "Starter Plan",
    monthlyPrice: 25000,
    priceLabel: "₦25k",
    summary: "Basic branding or a simple website for SMEs getting started.",
    cta: "Start with Starter",
    features: [
      "Basic branding or simple website",
      "1–2 services only",
      "Essential business setup",
      "Simple onboarding support",
    ],
  },
  {
    key: "growth",
    label: "Growth Plan",
    badge: "🟡 Main seller",
    planName: "Growth Plan",
    monthlyPrice: 60000,
    priceLabel: "₦60k",
    summary: "Branding + website or marketing setup for businesses ready to scale.",
    highlight: true,
    cta: "Choose Growth",
    features: [
      "Branding + website or marketing setup",
      "Stronger online presence",
      "Better conversion-focused setup",
      "Best balance of value and scale",
    ],
  },
  {
    key: "premium",
    label: "Premium Plan",
    badge: "🔵 Full package",
    planName: "Premium Plan",
    monthlyPrice: 100000,
    priceLabel: "₦100k+",
    summary: "Full package with branding, website, content, and priority support.",
    cta: "Go Premium",
    features: [
      "Branding + website + content + support",
      "Priority handling and deeper support",
      "Full business toolkit access",
      "Built for serious businesses",
    ],
  },
];

export const getTierAmountKobo = (tier: PricingTier) => tier.monthlyPrice * 100;