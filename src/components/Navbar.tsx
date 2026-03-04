import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/smartbiz-logo.png";

const navLinks = [
  { label: "ABOUT", href: "#problem" },
  { label: "SOLUTIONS", href: "#solution" },
  { label: "PRICING", href: "#pricing" },
  { label: "INVEST", href: "#investor" },
  { label: "CONTACT", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md"
    >
      <div className="flex items-center justify-between h-20 px-6 md:px-12">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="SmartBiz" className="h-16 w-16 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">SMARTBIZ</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-semibold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background border-t border-border px-6 pb-6"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-semibold tracking-[0.15em] text-muted-foreground hover:text-foreground border-b border-border"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
