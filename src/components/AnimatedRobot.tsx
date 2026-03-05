import { motion } from "framer-motion";
import robotGif from "@/assets/robot-wave.gif";

const AnimatedRobot = () => {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-36 h-36 md:w-52 md:h-52"
    >
      {/* Brand-colored glow behind robot */}
      <div className="absolute inset-0 rounded-full bg-emerald/20 blur-2xl scale-110" />
      
      {/* Robot GIF with emerald tint overlay */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <img
          src={robotGif}
          alt="SmartBiz Robot waving hello"
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            filter: "hue-rotate(120deg) saturate(1.4) brightness(1.1)",
          }}
        />
      </div>

      {/* Shadow */}
      <motion.div
        animate={{ scale: [1, 0.85, 1], opacity: [0.15, 0.08, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-28 h-3 bg-foreground rounded-full blur-md"
      />
    </motion.div>
  );
};

export default AnimatedRobot;
