import React from "react";
import RainbowSchoolName from "./RainbowSchoolName";
import heroImg from "@/assets/hero-illustration.png";
import { Star } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section id="accueil" className="relative overflow-hidden bg-background py-12 md:py-20">
      {/* Decorative floating shapes */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-secondary/40 rounded-full animate-float-slow" />
      <div className="absolute top-32 right-16 w-10 h-10 bg-primary/20 rounded-full animate-float" />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent/30 rounded-full animate-float-slow" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Star className="text-secondary fill-secondary w-6 h-6 animate-bounce-gentle" />
            <span className="font-body font-bold text-muted-foreground uppercase tracking-widest text-sm">
              Bienvenue à
            </span>
            <Star className="text-secondary fill-secondary w-6 h-6 animate-bounce-gentle" style={{ animationDelay: "0.5s" }} />
          </div>
          <RainbowSchoolName size="xl" />
          <p className="mt-6 text-lg md:text-xl text-muted-foreground font-body font-semibold max-w-2xl mx-auto">
            L'école où chaque enfant brille ! 🌟 Un environnement chaleureux pour apprendre, grandir et s'épanouir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Inscrire mon enfant ✏️
            </a>
            <a
              href="#apropos"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-display px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Découvrir l'école 🏫
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <img
            src={heroImg}
            alt="Enfants heureux à Umurerwa School"
            className="w-full rounded-3xl shadow-xl"
            loading="eager"
          />
        </div>
      </div>

      {/* Wave divider */}
      <div className="wave-divider mt-12">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,20 1440,30 L1440,60 L0,60 Z"
            fill="hsl(var(--primary) / 0.08)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
