import React, { useState, useEffect } from "react";
import { Award, ArrowRight, BookOpen, Heart, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { fetchApi } from "@/lib/api";

const defaultCarouselImages = [
  {
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    caption: "Crèche & Petite Enfance",
    badge: "Crèche & Garderie"
  },
  {
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    caption: "Maternelle & Éveil Sensoriel",
    badge: "École Maternelle"
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    caption: "École Primaire & Fondamentale",
    badge: "École Primaire"
  },
  {
    url: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1200&auto=format&fit=crop",
    caption: "Ateliers Créatifs & Réussite",
    badge: "Activités & Éveil"
  }
];

const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchApi("/settings/1/")
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const carouselImages = [
    {
      url: settings?.carousel_img_1 || defaultCarouselImages[0].url,
      caption: settings?.carousel_caption_1 || defaultCarouselImages[0].caption,
      badge: "Crèche & Garderie"
    },
    {
      url: settings?.carousel_img_2 || defaultCarouselImages[1].url,
      caption: settings?.carousel_caption_2 || defaultCarouselImages[1].caption,
      badge: "École Maternelle"
    },
    {
      url: settings?.carousel_img_3 || defaultCarouselImages[2].url,
      caption: settings?.carousel_caption_3 || defaultCarouselImages[2].caption,
      badge: "École Primaire"
    },
    {
      url: settings?.carousel_img_4 || defaultCarouselImages[3].url,
      caption: settings?.carousel_caption_4 || defaultCarouselImages[3].caption,
      badge: "Activités & Éveil"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <section id="accueil" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 md:py-20 border-b border-slate-200/60">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Côté Gauche : Titre et Appel à l'action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 text-blue-900 font-body font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-blue-700" />
              <span>{settings?.slogan || "Savoir, Sentir, S'exprimer : VOILÀ TOUTE UNE ÉDUCATION"}</span>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <span>📍 Rohero, Bujumbura, Burundi</span>
            </div>

            <h1 
              className="font-display font-extrabold leading-tight text-slate-900"
              style={{ fontSize: settings?.title_font_size ? `${settings.title_font_size}px` : undefined }}
            >
              {settings?.hero_title || (
                <>L'excellence éducative de la <span className="text-amber-600">crèche</span> à l'<span className="text-blue-800">école primaire</span>.</>
              )}
            </h1>

            <p 
              className="text-slate-600 font-body leading-relaxed"
              style={{ fontSize: settings?.body_font_size ? `${settings.body_font_size}px` : undefined }}
            >
              {settings?.hero_description || "Implantée à Rohero (Bujumbura), Umurerwa School offre un parcours d'éveil et d'apprentissage complet, bienveillant et stimulant. De la crèche au certificat de fin de primaire, nous formons les enfants à Savoir, Sentir et S'exprimer avec assurance."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/inscription"
                className="inline-flex items-center gap-3 bg-blue-900 hover:bg-blue-800 text-white font-body font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: settings?.primary_color || undefined }}
              >
                Inscrire mon enfant <ArrowRight className="w-5 h-5 text-amber-300" />
              </a>
              <a
                href="#apropos"
                className="inline-flex items-center gap-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 font-body font-bold px-6 py-4 rounded-2xl text-base transition-all"
              >
                Découvrir nos sections
              </a>
            </div>

            {/* Badges institutionnels */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-body text-xs font-bold text-slate-700">{settings?.badge_1_text || "Programme Homologué"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-body text-xs font-bold text-slate-700">{settings?.badge_2_text || "Cadre Sécurisé & Éveil"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="font-body text-xs font-bold text-slate-700">{settings?.badge_3_text || "Pédagogie Active"}</span>
              </div>
            </div>
          </div>

          {/* Côté Droit : Carrousel Institutionnel */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
              {carouselImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="inline-block bg-blue-900 text-amber-300 text-xs font-body font-bold px-3.5 py-1 rounded-full w-max mb-2 uppercase tracking-wider">
                      {img.badge}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold">{img.caption}</h3>
                  </div>
                </div>
              ))}

              {/* Boutons de navigation manuelle */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicateurs de carrousel */}
              <div className="absolute bottom-4 right-6 z-20 flex gap-2">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? "w-8 bg-amber-400" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
