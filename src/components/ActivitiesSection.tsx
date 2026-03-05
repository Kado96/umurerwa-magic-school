import React from "react";
import activitiesImg from "@/assets/activities.png";
import readingImg from "@/assets/reading.png";
import { Palette, Music, Dumbbell, BookOpen, Globe, Calculator } from "lucide-react";

const activities = [
  { icon: BookOpen, label: "Lecture", color: "bg-letter-blue/10 text-letter-blue" },
  { icon: Calculator, label: "Mathématiques", color: "bg-letter-green/10 text-letter-green" },
  { icon: Palette, label: "Arts Plastiques", color: "bg-letter-pink/10 text-letter-pink" },
  { icon: Music, label: "Musique", color: "bg-letter-purple/10 text-letter-purple" },
  { icon: Dumbbell, label: "Sport", color: "bg-letter-orange/10 text-letter-orange" },
  { icon: Globe, label: "Langues", color: "bg-letter-teal/10 text-letter-teal" },
];

const ActivitiesSection: React.FC = () => {
  return (
    <section id="activites" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-5xl text-center text-foreground mb-4">
          Nos Activités 🎨
        </h2>
        <p className="text-center text-muted-foreground font-body text-lg max-w-2xl mx-auto mb-12">
          Un programme complet pour développer toutes les compétences de votre enfant.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-12">
          {activities.map((a) => (
            <div
              key={a.label}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${a.color} hover:scale-105 transition-transform cursor-default`}
            >
              <a.icon className="w-10 h-10" />
              <span className="font-display text-sm md:text-base">{a.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <img src={activitiesImg} alt="Enfants jouant" className="w-56 md:w-72 rounded-2xl shadow-lg" loading="lazy" />
          <img src={readingImg} alt="Enfants lisant" className="w-56 md:w-72 rounded-2xl shadow-lg" loading="lazy" />
        </div>
      </div>

      <div className="wave-divider mt-12">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="hsl(var(--accent) / 0.08)" />
        </svg>
      </div>
    </section>
  );
};

export default ActivitiesSection;
