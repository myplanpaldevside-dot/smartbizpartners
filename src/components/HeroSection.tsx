import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pt-20 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Description top-left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-28 left-6 md:left-12 max-w-sm z-10"
      >
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          <span className="font-display font-bold text-foreground">SMARTBIZ</span> — a tech-enabled SME growth platform helping African small businesses scale through education, website development, and subscription-based digital growth tools.
        </p>
      </motion.div>

      {/* Location + time - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 right-6 md:right-12 text-right text-xs text-muted-foreground tracking-wide z-10"
      >
        <p>LAGOS, NG &nbsp;&nbsp; {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
      </motion.div>

      {/* Giant brand name */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-[15vw] md:text-[13vw] leading-[0.85] tracking-tighter text-foreground"
        >
          SMART
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-[15vw] md:text-[13vw] leading-[0.85] tracking-tighter text-stroke"
        >
          BIZ
        </motion.h1>
      </div>

      {/* Emerald accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-1 bg-emerald mt-6 origin-left max-w-xs"
      />
    </section>
  );
};

export default HeroSection;
