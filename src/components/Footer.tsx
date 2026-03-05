import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import logo from "@/assets/smartbiz-logo.png";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Giant text divider */}
      <div className="border-b border-primary-foreground/10 overflow-hidden py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex whitespace-nowrap animate-marquee"
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="font-display text-6xl md:text-8xl font-bold mx-8" style={{ WebkitTextStroke: "1px hsl(0 0% 100% / 0.15)", color: "transparent" }}>
              SMARTBIZ ✦ GROW SMART ✦ BUILD BOLD ✦
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img src={logo} alt="SmartBiz" className="h-28 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sm text-primary-foreground/40 leading-relaxed">
              Building the growth infrastructure for African small businesses.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-[10px] tracking-[0.3em] uppercase mb-8 text-emerald">Company</h4>
            <div className="space-y-4 text-sm text-primary-foreground/50">
              <a href="#problem" className="block hover:text-primary-foreground hover:pl-2 transition-all duration-300">About</a>
              <a href="#solution" className="block hover:text-primary-foreground hover:pl-2 transition-all duration-300">Services</a>
              <a href="#process" className="block hover:text-primary-foreground hover:pl-2 transition-all duration-300">Process</a>
              <a href="#contact" className="block hover:text-primary-foreground hover:pl-2 transition-all duration-300">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-[10px] tracking-[0.3em] uppercase mb-8 text-emerald">Contact</h4>
            <div className="space-y-4 text-sm text-primary-foreground/50">
              <div className="flex items-center gap-3 hover:text-primary-foreground transition-colors"><Mail className="h-4 w-4 text-emerald/60" /> hello@smartbiz.ng</div>
              <div className="flex items-center gap-3 hover:text-primary-foreground transition-colors"><Phone className="h-4 w-4 text-emerald/60" /> +234 800 SMARTBIZ</div>
              <div className="flex items-center gap-3 hover:text-primary-foreground transition-colors"><MapPin className="h-4 w-4 text-emerald/60" /> Lagos, Nigeria</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-[10px] tracking-[0.3em] uppercase mb-8 text-emerald">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/40 mb-4">Get growth tips and updates.</p>
            <div className="flex gap-0">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/20 rounded-none focus:border-emerald"
              />
              <button className="bg-emerald text-foreground px-4 font-bold text-xs tracking-wider hover:bg-primary-foreground hover:text-foreground transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-primary-foreground/30 tracking-wider">© {new Date().getFullYear()} SMARTBIZ. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] text-primary-foreground/30 tracking-[0.3em]">LAGOS, NIGERIA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
