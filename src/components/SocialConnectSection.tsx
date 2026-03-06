import { motion } from "framer-motion";
import { Instagram, ArrowUpRight } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
);

const socials = [
  {
    name: "Instagram",
    handle: "@smartbiz_partners",
    url: "https://www.instagram.com/smartbiz_partners?igsh=ajRpaHgwN29nb3N1",
    icon: Instagram,
    color: "from-[#f09433] via-[#e6683c] to-[#dc2743]",
    bgGlow: "bg-[#e6683c]/20",
  },
  {
    name: "TikTok",
    handle: "@business_schng",
    url: "https://www.tiktok.com/@business_schng?_r=1&_t=ZS-94T6gzvkxbc",
    icon: null,
    color: "from-[#00f2ea] via-[#ff0050] to-[#000]",
    bgGlow: "bg-[#ff0050]/20",
  },
];

const SocialConnectSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.4em] text-emerald font-semibold uppercase mb-3">Stay Connected</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
            Follow Us <span className="text-emerald">Everywhere</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Get daily business tips, growth hacks, and behind-the-scenes content.
          </p>
        </motion.div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {socials.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden border border-border bg-card p-6 sm:p-8 flex flex-col gap-5 hover:border-emerald/40 transition-colors"
            >
              {/* Glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${social.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon + Name */}
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg`}>
                  {social.icon ? (
                    <social.icon className="h-7 w-7 text-white" />
                  ) : (
                    <TikTokIcon className="h-7 w-7 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">{social.name}</p>
                  <p className="text-sm text-muted-foreground">{social.handle}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 relative z-10">
                <span className="text-sm font-semibold text-emerald group-hover:text-foreground transition-colors">
                  Like & Follow
                </span>
                <ArrowUpRight className="h-4 w-4 text-emerald group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.a>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-10"
        >
          Join our growing community of <span className="text-emerald font-semibold">smart entrepreneurs</span> 🚀
        </motion.p>
      </div>
    </section>
  );
};

export default SocialConnectSection;
