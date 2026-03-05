import { motion } from "framer-motion";

const AnimatedRobot = () => {
  return (
    <div className="relative w-32 h-40 md:w-48 md:h-56">
      {/* Body */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Head */}
        <div className="relative mx-auto w-20 h-18 md:w-28 md:h-24">
          {/* Antenna */}
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 origin-bottom"
          >
            <div className="w-[2px] h-5 bg-emerald mx-auto" />
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-emerald mx-auto -mt-1 shadow-glow"
            />
          </motion.div>

          {/* Head shape */}
          <div className="w-20 h-16 md:w-28 md:h-20 bg-foreground/10 border-2 border-foreground/20 rounded-2xl mx-auto flex items-center justify-center gap-3 md:gap-4">
            {/* Eyes */}
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald shadow-glow"
            />
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald shadow-glow"
            />
          </div>

          {/* Mouth */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 md:w-8 h-1.5 bg-emerald/40 rounded-full" />
        </div>

        {/* Torso */}
        <div className="w-16 h-14 md:w-24 md:h-18 bg-foreground/8 border-2 border-foreground/15 rounded-xl mx-auto mt-1 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-emerald/50 flex items-center justify-center"
          >
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald/60" />
          </motion.div>
        </div>

        {/* Waving arm (right) */}
        <motion.div
          animate={{ rotate: [-5, -45, -5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[4.5rem] md:top-[6rem] -right-3 md:-right-4 origin-top-left"
        >
          <div className="w-2.5 h-10 md:w-3 md:h-14 bg-foreground/15 border border-foreground/20 rounded-full" />
          {/* Hand */}
          <motion.div
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="w-4 h-4 md:w-5 md:h-5 bg-emerald/30 border border-emerald/50 rounded-full -mt-1 mx-auto"
          />
        </motion.div>

        {/* Left arm */}
        <div className="absolute top-[4.5rem] md:top-[6rem] -left-1 md:-left-2">
          <div className="w-2.5 h-10 md:w-3 md:h-14 bg-foreground/15 border border-foreground/20 rounded-full" />
        </div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={{ scale: [1, 0.85, 1], opacity: [0.15, 0.08, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-3 bg-foreground rounded-full blur-md"
      />
    </div>
  );
};

export default AnimatedRobot;
