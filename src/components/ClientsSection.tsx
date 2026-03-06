import { motion } from "framer-motion";
import tmgLogo from "@/assets/clients/tmg.png";
import edugridLogo from "@/assets/clients/edugrid.png";
import henosisLogo from "@/assets/clients/henosis.png";
import stemxLogo from "@/assets/clients/stemx.png";
import boxedblissLogo from "@/assets/clients/boxedbliss.png";

const clients = [
  { name: "TheMakerGuy", logo: tmgLogo },
  { name: "EduGrid Africa", logo: edugridLogo },
  { name: "Henosis", logo: henosisLogo },
  { name: "STEMx", logo: stemxLogo },
  { name: "BoxedBliss", logo: boxedblissLogo },
];

// Double the array for seamless infinite scroll
const doubled = [...clients, ...clients, ...clients];

const ClientsSection = () => (
  <section className="py-28 px-6 md:px-12 overflow-hidden">
    <div className="max-w-7xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">Our Partners</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.95]">
            Trusted By<br />
            <span className="text-stroke">Ambitious Brands</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Here are some of the brands we've had the privilege to collaborate with and deliver results.
        </p>
      </motion.div>
    </div>

    {/* Scrolling logo row - forward */}
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex items-center gap-16 animate-marquee-logos whitespace-nowrap py-8">
        {doubled.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center w-40 md:w-52 h-24 md:h-28 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-20 md:max-h-24 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Scrolling logo row - reverse */}
    <div className="relative mt-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex items-center gap-16 animate-marquee-logos-reverse whitespace-nowrap py-8">
        {doubled.map((client, i) => (
          <div
            key={`${client.name}-rev-${i}`}
            className="flex-shrink-0 flex items-center justify-center w-40 md:w-52 h-24 md:h-28 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-20 md:max-h-24 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
