import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTickerBar from "@/components/NewsTickerBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Newspaper, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: string;
  created_at: string;
  image_url?: string;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
];

const BlogPage = () => {
  const [articles, setArticles] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi("/announcements/");
        const all: Announcement[] = res.results || res || [];
        setArticles(all);
      } catch {
        setArticles([
          { 
            id: "1", 
            title: "Inauguration du Nouveau Laboratoire STEM & Recherche", 
            content: "L'Umurerwa Academy vient d'inaugurer son tout nouveau complexe de laboratoires doté d'équipements de pointe pour le secondaire et le supérieur. Un espace innovant pour former les chercheurs de demain.", 
            target_role: "ALL", 
            created_at: new Date().toISOString() 
          },
          { 
            id: "2", 
            title: "Rentrée Académique & Inscriptions 2025-2026", 
            content: "Les inscriptions universitaires, lycéennes et fondamentales sont désormais ouvertes. Rejoignez une institution d'excellence et découvrez nos nouveaux programmes.", 
            target_role: "ALL", 
            created_at: new Date().toISOString() 
          },
          { 
            id: "3", 
            title: "Célébration de la Journée de l'Excellence Académique", 
            content: "Retour en images sur la grande cérémonie de remise des distinctions aux étudiants et élèves qui se sont illustrés par leurs performances scientifiques et artistiques.", 
            target_role: "ALL", 
            created_at: new Date().toISOString() 
          },
          { 
            id: "4", 
            title: "Partenariats Internationaux & Échanges Universitaires", 
            content: "Signature de nouvelles conventions académiques permettant à nos étudiants en Licence et Master d'effectuer des semestres d'échange à l'étranger.", 
            target_role: "ALL", 
            created_at: new Date().toISOString() 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pb-12 font-body">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 text-xs uppercase tracking-widest font-body">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" /> Journal & Actualités Officiels
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display text-white font-bold tracking-tight">
            Les Actualités d'Umurerwa Academy
          </h1>
          <p className="font-body text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Découvrez les projets, événements et réussites de notre complexe scolaire & universitaire.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-slate-800/60 rounded-3xl animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-800">
            <Newspaper className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="font-display text-slate-300 text-xl">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Boutons de contrôle du carrousel */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-slate-400 font-mono">
                {articles.length} article{articles.length > 1 ? 's' : ''} disponible{articles.length > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => scroll('left')} 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-2xl border-slate-700 bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-lg backdrop-blur-md"
                  title="Article précédent"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  onClick={() => scroll('right')} 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-2xl border-slate-700 bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-lg backdrop-blur-md"
                  title="Article suivant"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Conteneur Carrousel à défilement horizontal fluide */}
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {articles.map((item, index) => {
                const bgImg = item.image_url || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
                return (
                  <div 
                    key={item.id} 
                    className="min-w-[320px] sm:min-w-[360px] md:min-w-[400px] flex-1 shrink-0"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <Card 
                      className="relative group border-none shadow-2xl rounded-3xl overflow-hidden h-[460px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-2 hover:shadow-amber-500/10"
                    >
                      {/* Image d'arrière-plan haute définition */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${bgImg}')` }}
                      />
                      
                      {/* Overlay sombre dégradé pro pour lisibilité optimale */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/30 group-hover:from-slate-950 group-hover:via-slate-950/85 transition-all duration-500" />

                      {/* Contenu clairs et lisibles par dessus */}
                      <CardContent className="relative z-10 p-7 flex flex-col justify-end h-full">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold border-none text-[11px] uppercase tracking-wider px-3 py-1">
                              {item.target_role === "ALL" ? "Public" : item.target_role}
                            </Badge>
                            <span className="text-xs text-amber-200/90 font-mono font-medium flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                              <Calendar className="h-3.5 w-3.5 text-amber-400" />
                              {new Date(item.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>

                          <h2 className="font-display text-2xl text-white font-bold leading-snug drop-shadow-md group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </h2>

                          <p className="font-body text-slate-200 text-sm leading-relaxed line-clamp-3 font-normal drop-shadow">
                            {item.content}
                          </p>

                          <div className="pt-4 mt-2 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-amber-400" />
                              </div>
                              <span className="font-semibold text-slate-200">Direction Académique</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <NewsTickerBar />
    </div>
  );
};

export default BlogPage;
