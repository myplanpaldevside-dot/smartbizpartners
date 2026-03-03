import { motion } from "framer-motion";
import { Palette, BookOpen, Cpu, Globe, PenTool, Rocket, Target, GraduationCap, FileText, Monitor, BarChart2, Users } from "lucide-react";

const columns = [
  {
    title: "Premium Execution Services",
    desc: "Professional digital solutions at SME-friendly prices.",
    badge: "Active",
    items: [
      { icon: Globe, label: "Website Development" },
      { icon: Palette, label: "Branding & Content Creation" },
      { icon: Rocket, label: "Growth Funnels" },
      { icon: Target, label: "Retainer Services" },
    ],
  },
  {
    title: "Business Education",
    desc: "Hands-on learning designed for African entrepreneurs.",
    badge: "Active",
    items: [
      { icon: GraduationCap, label: "Bootcamps" },
      { icon: BookOpen, label: "Courses" },
      { icon: FileText, label: "Templates" },
      { icon: PenTool, label: "Masterclasses" },
    ],
  },
  {
    title: "SmartBiz Platform",
    desc: "The subscription engine for sustained SME growth.",
    badge: "Coming Soon",
    items: [
      { icon: Monitor, label: "SME Dashboard" },
      { icon: Cpu, label: "Subscription Tools" },
      { icon: BarChart2, label: "Growth Tracking" },
      { icon: Users, label: "Community Support" },
    ],
  },
];

const SolutionSection = () => (
  <section id="solution" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-emerald uppercase tracking-wider">Our Solution</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">A Complete Growth Ecosystem</h2>
        <p className="text-muted-foreground">Three integrated pillars designed to move African SMEs from survival to scale.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {columns.map((col, ci) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.15 }}
            className="bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-elevated transition-all group relative overflow-hidden"
          >
            {col.badge === "Coming Soon" && (
              <div className="absolute top-4 right-4 bg-navy text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            <h3 className="font-display font-bold text-xl text-foreground mb-2">{col.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{col.desc}</p>
            <div className="space-y-3">
              {col.items.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-emerald" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
