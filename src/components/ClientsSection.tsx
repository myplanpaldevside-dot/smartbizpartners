import { motion } from "framer-motion";
import tmgLogo from "@/assets/clients/tmg.png";
import edugridLogo from "@/assets/clients/edugrid.png";
import henosisLogo from "@/assets/clients/henosis.png";
import stemxLogo from "@/assets/clients/stemx.png";

const clients = [
  { name: "TheMakerGuy", logo: tmgLogo },
  { name: "EduGrid Africa", logo: edugridLogo },
  { name: "Henosis", logo: henosisLogo },
  { name: "STEMx", logo: stemxLogo },
];

const ClientsSection = () => (
  <section className="py-24 px-6 md:px-12 border-b border-border">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">Trusted By</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[0.95]">
          Companies We've<br /><span className="text-gradient">Worked With</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center">
        {clients.map((client, i) => (
          <motion.div
            key={client.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex items-center justify-center p-6 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-500"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-20 md:max-h-24 w-auto object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
