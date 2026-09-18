import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, School, BookOpen, Clock, Megaphone, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_classes: 0,
    total_students: 0,
    total_teachers: 0,
    total_subjects: 0,
    pass_rate: 0,
    attendance_rate: 0
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [dData, aData] = await Promise.all([
          fetchApi("/dashboard/stats/"),
          fetchApi("/announcements/")
        ]);
        setStats({
          total_classes: dData.total_classes || 0,
          total_students: dData.total_students || 0,
          total_teachers: dData.total_teachers || 0,
          total_subjects: dData.total_subjects || 0,
          pass_rate: dData.pass_rate || 0,
          attendance_rate: dData.attendance_rate || 0,
        });
        setAnnouncements(aData.results?.slice(0, 3) || aData.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: School, label: "Classes", value: stats.total_classes, color: "bg-letter-blue", textColor: "text-letter-blue" },
    { icon: GraduationCap, label: "Élèves", value: stats.total_students, color: "bg-letter-green", textColor: "text-letter-green" },
    { icon: Users, label: "Professeurs", value: stats.total_teachers, color: "bg-letter-orange", textColor: "text-letter-orange" },
    { icon: BookOpen, label: "Matières", value: stats.total_subjects, color: "bg-letter-purple", textColor: "text-letter-purple" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-foreground">Tableau de Bord</h1>
          <p className="font-body text-muted-foreground">Bienvenue dans votre gestionnaire Umurerwa Magic School</p>
        </div>
        <div className="flex gap-2">
            <div className="px-4 py-2 bg-primary/10 rounded-full flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Global</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label} className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
            <div className={cn("h-1 w-full", card.color)} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{card.label}</CardTitle>
              <div className={cn("p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity", card.color + "/20")}>
                <card.icon className={cn("h-5 w-5", card.textColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-display">{loading ? "..." : card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <Card className="lg:col-span-2 border-none shadow-playful">
             <CardHeader className="flex flex-row items-center gap-3">
                <Clock className="h-6 w-6 text-letter-pink" />
                <CardTitle className="font-display">Indicateurs Globaux</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 border border-transparent hover:border-primary/20 transition-all">
                         <div className="h-10 w-10 text-letter-green rounded-full bg-letter-green/20 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Taux de Réussite</p>
                            <p className="text-xs text-muted-foreground">Environ {stats.pass_rate}% de réussite simulée</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 border border-transparent hover:border-primary/20 transition-all">
                         <div className="h-10 w-10 text-letter-blue rounded-full bg-letter-blue/20 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Taux de Présence</p>
                            <p className="text-xs text-muted-foreground">Moyenne de {stats.attendance_rate}% de présence</p>
                         </div>
                    </div>
                </div>
             </CardContent>
        </Card>

        <Card className="border-none shadow-playful bg-primary text-primary-foreground relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <Megaphone className="h-48 w-48" />
            </div>
            <CardHeader>
                <CardTitle className="font-display">Annonces Systèmes</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm shadow-inner">
                            <p className="text-sm font-bold text-center">Aucune annonce récente</p>
                        </div>
                    ) : (
                        announcements.map(ann => (
                            <div key={ann.id} className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                                <p className="text-xs font-bold uppercase opacity-70 mb-1">{ann.target_role === 'ALL' ? 'Tous' : ann.target_role}</p>
                                <p className="text-sm font-bold line-clamp-1">{ann.title}</p>
                                <p className="text-[10px] opacity-80 mt-1 line-clamp-2">{ann.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
