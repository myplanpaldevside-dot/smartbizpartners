import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/smartbiz-logo.jpeg";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="SmartBiz" className="h-12 w-12 rounded-sm object-contain bg-primary-foreground" />
              <span className="font-display font-bold text-xl tracking-tight">SMARTBIZ</span>
            </div>
            <p className="text-sm text-primary-foreground/40 leading-relaxed">
              Building the growth infrastructure for African small businesses.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Company</h4>
            <div className="space-y-3 text-sm text-primary-foreground/50">
              <a href="#problem" className="block hover:text-primary-foreground transition-colors">About</a>
              <a href="#solution" className="block hover:text-primary-foreground transition-colors">Services</a>
              <a href="#pricing" className="block hover:text-primary-foreground transition-colors">Pricing</a>
              <a href="#investor" className="block hover:text-primary-foreground transition-colors">Investors</a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/50">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4" /> hello@smartbiz.ng</div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4" /> +234 800 SMARTBIZ</div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4" /> Lagos, Nigeria</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/40 mb-4">Get growth tips and updates.</p>
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/20 rounded-none"
              />
              <Button variant="hero" size="sm" className="rounded-none">Join</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/30">© {new Date().getFullYear()} SmartBiz. All rights reserved.</p>
          <p className="text-xs text-primary-foreground/30 tracking-wide">LAGOS, NIGERIA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
