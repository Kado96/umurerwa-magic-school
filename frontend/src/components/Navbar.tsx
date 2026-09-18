import React, { useState } from "react";
import RainbowSchoolName from "./RainbowSchoolName";
import { Menu, X, LogIn, Sparkles, Phone, Mail, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Blog & Actualités", href: "/blog" },
  { label: "Formations", href: "/#activites" },
  { label: "À Propos", href: "/#apropos" },
  { label: "Contact", href: "/#contact" },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top bar avec informations de contact */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 md:px-8 border-b border-slate-800 hidden sm:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              +257 68 00 00 00
            </span>
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              contact@umurerwa-academy.bi
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Bujumbura, Burundi
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            <span className="text-amber-400 font-bold">● Inscriptions Ouvertes 2025-2026</span>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          
          <Link to="/" className="hover:opacity-95 transition-opacity py-1">
            <RainbowSchoolName size="sm" />
          </Link>

          {/* Navigation sans le lien Admissions */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative font-body text-xs font-bold uppercase tracking-wider transition-all duration-200 py-2 ${
                    isActive 
                      ? "text-blue-900 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500 after:rounded-full" 
                      : "text-slate-600 hover:text-blue-900 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-amber-400"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-900 font-body font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200"
            >
              <LogIn className="w-4 h-4 text-blue-700" />
              <span>Portail Connexion</span>
            </a>
            <a
              href="/inscription"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-body font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg border border-blue-800 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Postuler en ligne</span>
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setOpen(!open)} 
              className="p-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block font-body font-bold text-slate-700 hover:text-blue-900 py-2.5 border-b border-slate-100 text-sm uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              <a
                href="/login"
                className="w-full text-center py-3 rounded-xl border border-slate-300 text-slate-800 font-body font-bold text-xs uppercase tracking-wider bg-slate-50"
              >
                Portail Connexion
              </a>
              <a
                href="/inscription"
                className="w-full text-center py-3 rounded-xl bg-blue-900 text-white font-body font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Postuler en ligne
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
