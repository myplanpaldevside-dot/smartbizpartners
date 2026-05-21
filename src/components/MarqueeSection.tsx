const words1 = ["Invoicing.", "Expenses.", "CRM.", "Inventory.", "Analytics.", "Payments.", "Reports."];
const words2 = ["Know your numbers.", "Own your growth.", "Run your business."];

const MarqueeSection = () => (
  <section className="py-6 border-y border-border overflow-hidden bg-foreground">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(6)].map((_, i) => (
        <div key={`a-${i}`} className="flex items-center mx-2">
          {words1.map((w, j) => (
            <span
              key={`${i}-${j}`}
              className="font-display text-3xl md:text-5xl font-bold text-primary-foreground/60 mx-5 hover:text-primary-foreground transition-colors duration-300"
            >
              {w}
            </span>
          ))}
          <span className="text-primary mx-5 text-3xl md:text-5xl">✦</span>
        </div>
      ))}
    </div>
    <div className="flex whitespace-nowrap animate-marquee-logos-reverse mt-3">
      {[...Array(8)].map((_, i) => (
        <div key={`b-${i}`} className="flex items-center mx-2">
          {words2.map((w, j) => (
            <span
              key={`${i}-${j}`}
              className="font-display text-2xl md:text-4xl font-bold mx-6"
              style={{
                WebkitTextStroke: "1px hsl(0 0% 100% / 0.25)",
                color: "transparent",
              }}
            >
              {w}
            </span>
          ))}
          <span className="text-primary mx-4 text-2xl md:text-4xl">◆</span>
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeSection;
