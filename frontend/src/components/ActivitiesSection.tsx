import React, { useEffect, useState } from "react";
import { Palette, Music, Dumbbell, BookOpen, Globe, Calculator, Sparkles } from "lucide-react";
import { fetchApi } from "@/lib/api";

const defaultActivities = [
  { icon: BookOpen, labelKey: "act_1_title", defaultLabel: "Lecture & Recherches", color: "bg-blue-500/10 text-blue-800" },
  { icon: Calculator, labelKey: "act_2_title", defaultLabel: "Sciences & Mathématiques", color: "bg-emerald-500/10 text-emerald-800" },
  { icon: Palette, labelKey: "act_3_title", defaultLabel: "Arts & Culture", color: "bg-rose-500/10 text-rose-800" },
  { icon: Music, labelKey: "act_4_title", defaultLabel: "Musique & Conservatoire", color: "bg-purple-500/10 text-purple-800" },
  { icon: Dumbbell, labelKey: "act_5_title", defaultLabel: "Sports & Compétitions", color: "bg-amber-500/10 text-amber-800" },
  { icon: Globe, labelKey: "act_6_title", defaultLabel: "Langues & International", color: "bg-teal-500/10 text-teal-800" },
];

const defaultGalleryPhotos = [
  { imgKey: "gallery_img_1", captionKey: "gallery_caption_1", defaultUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop", defaultTitle: "Bibliothèque & Recherches" },
  { imgKey: "gallery_img_2", captionKey: "gallery_caption_2", defaultUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop", defaultTitle: "Laboratoires & Sciences" },
  { imgKey: "gallery_img_3", captionKey: "gallery_caption_3", defaultUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=600&auto=format&fit=crop", defaultTitle: "Ateliers d'Innovation" },
  { imgKey: "gallery_img_4", captionKey: "gallery_caption_4", defaultUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop", defaultTitle: "Infrastructures Sportives" },
  { imgKey: "gallery_img_5", captionKey: "gallery_caption_5", defaultUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop", defaultTitle: "Projets de Recherche en Groupe" },
  { imgKey: "gallery_img_6", captionKey: "gallery_caption_6", defaultUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=600&auto=format&fit=crop", defaultTitle: "Événements & Campus Life" }
];

const ActivitiesSection: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchApi("/settings/1/").then((data) => setSettings(data)).catch(() => {});
  }, []);

  const title = settings?.activities_title || "Nos Activités & Épanouissement";
  const description = settings?.activities_description || "Un programme complet favorisant la recherche, la créativité, l'esprit d'équipe et l'excellence académique.";
  const galleryTitle = settings?.gallery_title || "Galerie de la Vie Académique (Défilement Infini)";

  const galleryPhotos = defaultGalleryPhotos.map(item => ({
    url: settings?.[item.imgKey] || item.defaultUrl,
    title: settings?.[item.captionKey] || item.defaultTitle
  }));

  return (
    <section id="activites" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-amber-800 font-display text-sm uppercase tracking-wider bg-amber-500/10 px-4 py-2 rounded-full inline-block mb-3">
            Vie à l'Académie 🎨
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-extrabold">
            {title}
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto mt-3">
            {description}
          </p>
        </div>

        {/* Grille des domaines d'activités */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-16">
          {defaultActivities.map((a) => {
            const label = settings?.[a.labelKey] || a.defaultLabel;
            return (
              <div
                key={a.labelKey}
                className={`flex flex-col items-center gap-3 p-5 rounded-3xl ${a.color} hover:scale-105 transition-all shadow-sm border border-transparent hover:border-current cursor-default`}
              >
                <a.icon className="w-8 h-8" />
                <span className="font-display text-sm text-center font-bold">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carrousel infini de photos (Marquee) */}
      <div className="space-y-6 pt-4">
        <div className="text-center">
          <h3 className="font-display text-2xl text-slate-900 font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {galleryTitle}
          </h3>
        </div>

        {/* Ruban 1 : Gauche -> Droite */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="animate-marquee gap-6">
            {[...galleryPhotos, ...galleryPhotos].map((photo, i) => (
              <div
                key={i}
                className="w-72 md:w-80 shrink-0 rounded-3xl overflow-hidden shadow-lg border-2 border-white group relative aspect-[4/3]"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <span className="font-display text-white text-sm font-semibold">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ruban 2 : Droite -> Gauche */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="animate-marquee-reverse gap-6">
            {[...galleryPhotos, ...galleryPhotos].reverse().map((photo, i) => (
              <div
                key={i}
                className="w-72 md:w-80 shrink-0 rounded-3xl overflow-hidden shadow-lg border-2 border-white group relative aspect-[4/3]"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <span className="font-display text-white text-sm font-semibold">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
