import React from "react";
import classroomImg from "@/assets/classroom.png";
import { BookOpen, Users, Award, Heart } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Excellence Académique", desc: "Un programme riche et adapté à chaque enfant", color: "text-letter-blue" },
  { icon: Users, title: "Encadrement Bienveillant", desc: "Des enseignants passionnés et dévoués", color: "text-letter-green" },
  { icon: Award, title: "Activités Variées", desc: "Sport, art, musique et bien plus encore", color: "text-letter-orange" },
  { icon: Heart, title: "Valeurs Fortes", desc: "Respect, solidarité et épanouissement", color: "text-letter-pink" },
];

const AboutSection: React.FC = () => {
  return (
    <section id="apropos" className="py-16 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-5xl text-center text-foreground mb-4">
          Notre École 🎓
        </h2>
        <p className="text-center text-muted-foreground font-body text-lg max-w-2xl mx-auto mb-12">
          Umurerwa School est un lieu d'apprentissage unique où chaque enfant est encouragé à découvrir ses talents et à développer son plein potentiel.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src={classroomImg}
              alt="Salle de classe colorée"
              className="w-72 md:w-96 animate-float-slow drop-shadow-xl"
              loading="lazy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                <f.icon className={`w-10 h-10 ${f.color} mb-3`} />
                <h3 className="font-display text-lg text-foreground mb-1">{f.title}</h3>
                <p className="font-body text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
