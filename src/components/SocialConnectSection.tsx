import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
);

const socials = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/smartbiz_partners?igsh=ajRpaHgwN29nb3N1",
    icon: Instagram,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@business_schng?_r=1&_t=ZS-94T6gzvkxbc",
    icon: null,
  },
];

const SocialConnectSection = () => (
  <section className="py-12 px-4 sm:px-6 md:px-12 bg-background">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
      <p className="text-sm text-muted-foreground font-medium">Follow us</p>
      {socials.map((social, i) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.15 }}
          className="w-10 h-10 flex items-center justify-center border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          title={social.name}
        >
          {social.icon ? (
            <social.icon className="h-5 w-5" />
          ) : (
            <TikTokIcon className="h-5 w-5" />
          )}
        </motion.a>
      ))}
    </div>
  </section>
);

export default SocialConnectSection;
