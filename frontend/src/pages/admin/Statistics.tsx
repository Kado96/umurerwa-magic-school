import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, GraduationCap, BookOpen, DollarSign, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Statistics = () => {
  const [stats, setStats] = useState<any>({});
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [s, ts] = await Promise.all([
          fetchApi("/dashboard/stats/"),
          fetchApi("/dashboard/academic_stats/")
        ]);
        setStats(s);
        setTopStudents(ts);
      } catch {
        toast.error("Erreur de chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}</div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  const cards = [
    { icon: GraduationCap, label: "Élèves", value: stats.total_students || 0, color: "letter-green" },
    { icon: Users, label: "Professeurs", value: stats.total_teachers || 0, color: "letter-blue" },
    { icon: BookOpen, label: "Matières", value: stats.total_subjects || 0, color: "letter-purple" },
    { icon: CheckCircle, label: "Taux Réussite", value: `${stats.pass_rate || 0}%`, color: "letter-pink" },
    { icon: CheckCircle, label: "Assiduité", value: `${stats.attendance_rate || 0}%`, color: "letter-orange" },
    { icon: DollarSign, label: "Encaissé", value: `${((stats.total_collected || 0) / 1000000).toFixed(1)}M BIF`, color: "letter-green" },
    { icon: DollarSign, label: "Impayé", value: `${((stats.total_due || 0) / 1000000).toFixed(1)}M BIF`, color: "destructive" },
    { icon: BarChart3, label: "Recouvrement", value: `${stats.collection_rate || 0}%`, color: "letter-blue" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-letter-purple" /> Statistiques Avancées
        </h1>
        <p className="font-body text-muted-foreground">Vue globale des performances de l'école.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className="border-none shadow-playful hover:scale-105 transition-all overflow-hidden group">
            <div className={`h-1 w-full bg-${c.color}`} />
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <c.icon className={`h-4 w-4 text-${c.color}`} />
              </div>
              <p className="text-2xl font-display">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-playful">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2 text-letter-purple">
            <TrendingUp className="h-5 w-5" /> Top Élèves (Moyenne)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground font-body">Aucune donnée académique disponible.</p>
          ) : (
            <div className="space-y-3">
              {topStudents.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-display font-bold text-white ${i === 0 ? "bg-letter-green" : i === 1 ? "bg-letter-blue" : "bg-letter-orange"}`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{s.student_name}</p>
                    <p className="text-xs text-muted-foreground">{s.class_name}</p>
                  </div>
                  <p className="font-display text-xl font-bold text-letter-purple">{s.average}<span className="text-xs text-muted-foreground font-body">/20</span></p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
