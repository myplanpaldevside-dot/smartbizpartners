import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import phoneMockup from "@/assets/smartbooks-phone-mockup.png";

const fullText = "SMARTBIZ — a tech-enabled SME growth platform helping African small businesses scale through education, website development, and subscription-based digital growth tools.";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex > 0 && charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (charIndex >= fullText.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setTimeout(() => {
          setDisplayedText(fullText.slice(0, 1));
          setCharIndex(1);
        }, 500);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDisplayedText(fullText.slice(0, 1));
      setCharIndex(1);
    }, 1500);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col justify-center px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-emerald/5 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col gap-2 sm:gap-3">
        {/* Description with typewriter - tight to logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity }}
          className="max-w-[90vw] sm:max-w-xs md:max-w-sm"
        >
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
            {displayedText.split("SMARTBIZ").map((part, i) =>
              i === 0 ? (
                <span key={i}>
                  <span className="font-display font-bold text-foreground">SMARTBIZ</span>
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-3 sm:h-4 bg-emerald ml-0.5 align-middle"
            />
          </p>
        </motion.div>

        {/* Giant brand name + phone mockup */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <motion.h1
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.82] tracking-tighter text-foreground"
              >
                SMART
              </motion.h1>
            </div>
            <div className="flex items-end gap-2 sm:gap-4 md:gap-8">
              <motion.h1
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.82] tracking-tighter text-stroke"
              >
                BIZ
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="hidden sm:block pb-2 md:pb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 sm:w-12 bg-emerald" />
                  <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-emerald uppercase">Growth Platform</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block relative shrink-0 -mr-2 md:mr-0"
          >
            <div className="absolute inset-0 bg-emerald/10 blur-[60px] rounded-full scale-75" />
            <motion.img
              src={phoneMockup}
              alt="SmartBooks Dashboard on mobile"
              className="relative w-32 sm:w-44 md:w-56 lg:w-64 drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Mobile-only Growth Platform tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="sm:hidden flex items-center gap-2 mt-1"
        >
          <div className="h-[1px] w-8 bg-emerald" />
          <span className="text-[9px] font-semibold tracking-[0.3em] text-emerald uppercase">Growth Platform</span>
        </motion.div>

        {/* Emerald accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-[2px] bg-emerald origin-left max-w-md mt-1"
        />
      </div>

      {/* Bottom bar - location, scroll, time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-10 left-4 right-4 sm:left-6 sm:right-6 md:left-12 md:right-12 flex items-end justify-between z-10"
      >
        {/* Location - left on mobile */}
        <div className="text-[9px] sm:text-xs text-muted-foreground tracking-wide">
          <p>LAGOS, NG</p>
          <p className="text-emerald tracking-[0.3em] mt-0.5">EST. 2024</p>
        </div>

        {/* Scroll indicator - center */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-6 sm:h-8 bg-muted-foreground/30"
          />
          <span className="text-[8px] sm:text-[9px] tracking-[0.4em] text-muted-foreground uppercase">Scroll</span>
        </div>

        {/* Time - right */}
        <div className="text-right text-[9px] sm:text-xs text-muted-foreground tracking-wide">
          <p>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
