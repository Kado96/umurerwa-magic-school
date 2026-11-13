import React, { useState, useEffect, useRef } from "react";
import { Baby, Sparkles, BookOpen, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

const defaultFaculties = [
  {
    slug: "creche",
    icon: Baby,
    title: "Crèche & Garderie",
    subtitle: "Petite Enfance (3 mois - 2 ans)",
    desc: "Accueil bienveillant des tout-petits, sécurité maximale, stimulation sensorielle et suivi attentif du rythme de chaque bébé.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "maternelle",
    icon: Heart,
    title: "École Maternelle",
    subtitle: "Petite, Moyenne & Grande Section",
    desc: "Développement du langage, socialisation, motricité fine et éveil à la curiosité dans un cadre ludique et joyeux.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "primaire",
    icon: BookOpen,
    title: "École Primaire & Fondamentale",
    subtitle: "De la 1ère à la 6ème année",
    desc: "Maîtrise solide de la lecture, du calcul, des sciences et des langues, préparant au certificat de fin d'études primaires.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "activites",
    icon: Sparkles,
    title: "Activités & Périscolaire",
    subtitle: "Éveil Artistique, Sportif & Numérique",
    desc: "Espaces ludiques, ateliers créatifs, musique, sports et initiation numérique adaptée pour cultiver les talents.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop"
  }
];

const AboutSection: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApi("/settings/1/")
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const faculties = [
    {
      slug: "creche",
      icon: Baby,
      title: settings?.card_1_title || defaultFaculties[0].title,
      subtitle: settings?.card_1_subtitle || defaultFaculties[0].subtitle,
      desc: settings?.card_1_desc || defaultFaculties[0].desc,
      image: settings?.carousel_img_1 || defaultFaculties[0].image
    },
    {
      slug: "maternelle",
      icon: Heart,
      title: settings?.card_2_title || defaultFaculties[1].title,
      subtitle: settings?.card_2_subtitle || defaultFaculties[1].subtitle,
      desc: settings?.card_2_desc || defaultFaculties[1].desc,
      image: settings?.carousel_img_2 || defaultFaculties[1].image
    },
    {
      slug: "primaire",
      icon: BookOpen,
      title: settings?.card_3_title || defaultFaculties[2].title,
      subtitle: settings?.card_3_subtitle || defaultFaculties[2].subtitle,
      desc: settings?.card_3_desc || defaultFaculties[2].desc,
      image: settings?.carousel_img_3 || defaultFaculties[2].image
    },
    {
      slug: "activites",
      icon: Sparkles,
      title: settings?.card_4_title || defaultFaculties[3].title,
      subtitle: settings?.card_4_subtitle || defaultFaculties[3].subtitle,
      desc: settings?.card_4_desc || defaultFaculties[3].desc,
      image: settings?.carousel_img_4 || defaultFaculties[3].image
    }
  ];

  return (
    <section id="apropos" className="py-16 md:py-24 bg-slate-900 border-b border-slate-800 text-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-amber-400 font-body font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-3">
              Notre Structure Pédagogique 🎒
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white">
              {settings?.about_title || "Un cursus adapté à chaque étape de l'enfance"}
            </h2>
            <p className="text-slate-300 font-body text-base md:text-lg max-w-2xl mt-3">
              {settings?.about_description || "De la crèche à l'école primaire, Umurerwa School met son équipe pédagogique attentionnée et ses infrastructures modernes au service du développement harmonieux de votre enfant."}
            </p>
          </div>

          {/* Flèches de navigation du carrousel */}
          <div className="flex gap-3 shrink-0">
            <Button 
              onClick={() => scroll('left')} 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-slate-700 bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-xl backdrop-blur-md"
              title="Précédent"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              onClick={() => scroll('right')} 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-slate-700 bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-xl backdrop-blur-md"
              title="Suivant"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Grille / Carrousel défilant avec flèches */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {faculties.map((f, i) => (
            <div 
              key={i} 
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] lg:min-w-[360px] flex-1 shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                to={`/programme/${f.slug}`}
                className="relative group rounded-3xl overflow-hidden h-[430px] flex flex-col justify-end p-6 border border-slate-800 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/40 block"
              >
                {/* Photo d'arrière-plan HD */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${f.image}')` }}
                />

                {/* Overlay sombre dégradé pro */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/30 group-hover:from-slate-950 group-hover:via-slate-950/90 transition-all duration-500" />

                {/* Contenu lisible par dessus */}
                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-2 shrink-0 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  <span className="text-[11px] font-body font-bold uppercase tracking-wider text-amber-300/90 block">
                    {f.subtitle}
                  </span>

                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {f.title}
                  </h3>

                  <p className="font-body text-slate-200 text-sm leading-relaxed line-clamp-3">
                    {f.desc}
                  </p>

                  <div className="pt-4 mt-2 border-t border-white/15 flex items-center justify-between text-amber-300 font-body text-xs font-bold group-hover:translate-x-1 transition-transform">
                    <span className="flex items-center gap-1.5">
                      Lire l'article complet
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
