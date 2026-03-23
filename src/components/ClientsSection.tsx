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

const tripled = [...clients, ...clients, ...clients];

const ClientsSection = () => (
  <section className="py-16 px-6 md:px-12 overflow-hidden">
    <div className="max-w-7xl mx-auto mb-10">
      <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase text-center">
        Brands that trust us
      </p>
    </div>

    <div className="relative group/marquee">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex items-center gap-20 animate-marquee-logos-fast whitespace-nowrap py-6 group-hover/marquee:[animation-play-state:paused]">
        {tripled.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-14 md:max-h-16 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
