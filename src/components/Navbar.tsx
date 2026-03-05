import React, { useState } from "react";
import RainbowSchoolName from "./RainbowSchoolName";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Accueil", href: "#accueil" },
  { label: "À Propos", href: "#apropos" },
  { label: "Activités", href: "#activites" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile toggle */}
        <div className="flex items-center justify-between md:hidden">
          <RainbowSchoolName size="sm" />
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop: name centered, links around */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <RainbowSchoolName size="md" />
          <div className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body font-bold text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-body font-bold text-muted-foreground hover:text-primary py-2 px-3 rounded-lg hover:bg-muted transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
