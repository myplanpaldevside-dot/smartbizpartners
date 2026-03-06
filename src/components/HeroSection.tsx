import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedRobot from "./AnimatedRobot";

const fullText = "SMARTBIZ — a tech-enabled SME growth platform helping African small businesses scale through education, website development, and subscription-based digital growth tools.";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [, setTypingDone] = useState(false);

  useEffect(() => {
    if (charIndex > 0 && charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (charIndex >= fullText.length) {
      // Reset after a pause to loop the typing animation
      const resetTimeout = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        // Restart after a brief pause
        setTimeout(() => {
          setDisplayedText(fullText.slice(0, 1));
          setCharIndex(1);
        }, 500);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex]);

  // Start typing after a delay
  useEffect(() => {
    const delay = setTimeout(() => {
      setDisplayedText(fullText.slice(0, 1));
      setCharIndex(1);
    }, 1500);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-end pt-20 pb-12 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald/5 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Description top-left with typewriter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ y, opacity }}
        className="absolute top-24 sm:top-28 left-4 sm:left-6 md:left-12 max-w-[85vw] sm:max-w-sm z-10"
      >
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
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
          {!typingDone && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-3 sm:h-4 bg-emerald ml-0.5 align-middle"
            />
          )}
        </p>
      </motion.div>


      {/* Location + time - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 right-4 sm:right-6 md:right-12 text-right text-xs text-muted-foreground tracking-wide z-10"
      >
        <p className="mb-1">LAGOS, NG &nbsp;&nbsp; {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        <p className="text-[10px] text-emerald tracking-[0.3em]">EST. 2024</p>
      </motion.div>

      {/* Giant brand name with stagger */}
      <div className="relative z-10 mt-4 sm:mt-0">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-[16vw] sm:text-[18vw] md:text-[15vw] leading-[0.82] tracking-tighter text-foreground"
          >
            SMART
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <AnimatedRobot />
          </motion.div>
        </div>
        <div className="flex items-end gap-4 md:gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-[16vw] sm:text-[18vw] md:text-[15vw] leading-[0.82] tracking-tighter text-stroke"
          >
            BIZ
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden md:block pb-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-emerald" />
              <span className="text-xs font-semibold tracking-[0.3em] text-emerald uppercase">Growth Platform</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Emerald accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-[2px] bg-emerald mt-6 sm:mt-8 origin-left max-w-md"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-muted-foreground/30"
        />
        <span className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
