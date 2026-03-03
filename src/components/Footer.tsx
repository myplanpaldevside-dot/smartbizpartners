import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/smartbiz-logo.jpeg";
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SmartBiz" className="h-12 w-12 rounded-md object-contain bg-primary-foreground" />
              <span className="font-display font-bold text-xl">SmartBiz</span>
            </div>
            <p className="text-sm text-primary-foreground/60 mb-4">Building the growth infrastructure for African small businesses.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-emerald/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <a href="#problem" className="block hover:text-primary-foreground transition-colors">About</a>
              <a href="#solution" className="block hover:text-primary-foreground transition-colors">Services</a>
              <a href="#pricing" className="block hover:text-primary-foreground transition-colors">Pricing</a>
              <a href="#investor" className="block hover:text-primary-foreground transition-colors">Investors</a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@smartbiz.ng</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +234 800 SMARTBIZ</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lagos, Nigeria</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/60 mb-3">Get growth tips and updates straight to your inbox.</p>
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
              />
              <Button variant="hero" size="sm">Join</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} SmartBiz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
