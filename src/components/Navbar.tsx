import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/smartbiz-logo.png";

const navLinks = [
  { label: "WORK", href: "#solution" },
  { label: "ABOUT US", href: "#problem" },
  { label: "SMARTBOOKS", href: "/smartbooks", isRoute: true },
  { label: "FEED", href: "#traction" },
  { label: "CONTACT", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      navigate(link.href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 md:px-12 max-w-[1800px] mx-auto">
        <a href="/" className="group">
          <img src={logo} alt="SmartBiz" className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </a>

        <div className="hidden md:flex items-center gap-16">
          {navLinks.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.isRoute ? undefined : l.href}
              onClick={l.isRoute ? (e) => { e.preventDefault(); handleClick(l); } : undefined}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`text-[12px] font-bold tracking-[0.15em] transition-colors relative group cursor-pointer ${
                l.isRoute ? "text-primary hover:text-foreground" : "text-foreground hover:text-primary"
              }`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <button className="md:hidden relative z-50" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 bg-background z-40 flex flex-col justify-center px-8"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.isRoute ? undefined : l.href}
                onClick={() => {
                  if (l.isRoute) navigate(l.href);
                  setOpen(false);
                }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`font-display font-bold text-4xl py-4 border-b border-border transition-colors cursor-pointer ${
                  l.isRoute ? "text-emerald hover:text-foreground" : "text-foreground hover:text-emerald"
                }`}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
