import { motion } from "framer-motion";

const words1 = ["Build.", "Scale.", "Grow.", "Dominate."];
const words2 = ["Big thinking.", "Bold moves.", "Real results."];

const MarqueeSection = () => (
  <section className="py-6 border-y border-border overflow-hidden bg-foreground">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(8)].map((_, i) => (
        <div key={`a-${i}`} className="flex items-center mx-2">
          {words1.map((w, j) => (
            <span key={`${i}-${j}`} className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mx-4">
              {w}
            </span>
          ))}
          <span className="text-emerald mx-4 text-4xl md:text-6xl">✦</span>
        </div>
      ))}
    </div>
    <div className="flex whitespace-nowrap animate-marquee-logos-reverse mt-3">
      {[...Array(8)].map((_, i) => (
        <div key={`b-${i}`} className="flex items-center mx-2">
          {words2.map((w, j) => (
            <span key={`${i}-${j}`} className="font-display text-3xl md:text-5xl font-bold mx-4" style={{ WebkitTextStroke: "1px hsl(0 0% 100%)", color: "transparent" }}>
              {w}
            </span>
          ))}
          <span className="text-emerald mx-4 text-3xl md:text-5xl">◆</span>
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeSection;
