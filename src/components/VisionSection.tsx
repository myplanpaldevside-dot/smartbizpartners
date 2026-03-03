import { motion } from "framer-motion";
import { Globe, Smartphone, Network, Layers } from "lucide-react";

const visions = [
  { icon: Layers, label: "Subscription Platform", desc: "Recurring revenue through digital growth tools." },
  { icon: Globe, label: "Pan-African Expansion", desc: "Scaling across West Africa and beyond." },
  { icon: Network, label: "SME Infrastructure", desc: "The backbone for Africa's emerging businesses." },
  { icon: Smartphone, label: "App Ecosystem", desc: "Mobile-first tools for SMEs on the go." },
];

const VisionSection = () => (
  <section className="py-24 gradient-subtle">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">Our Vision</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
          The Operating System for African SMEs
        </h2>
        <p className="text-muted-foreground">We're building long-term infrastructure — not a one-time service. SmartBiz will become the default growth engine for SMEs across the continent.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visions.map((v, i) => (
          <motion.div key={v.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="text-center bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <v.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-2">{v.label}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default VisionSection;
