const MarqueeSection = () => {
  const words1 = "Big thinking. ";
  const words2 = "Grow smart. ";

  return (
    <section className="py-8 border-y border-border overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, i) => (
          <span key={`a-${i}`} className="font-display text-4xl md:text-6xl font-bold text-foreground mx-4">
            {words1}
          </span>
        ))}
      </div>
      <div className="flex whitespace-nowrap animate-marquee-slow mt-4" style={{ direction: 'rtl' }}>
        {[...Array(10)].map((_, i) => (
          <span key={`b-${i}`} className="font-display text-4xl md:text-6xl font-bold text-stroke mx-4">
            {words2}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
