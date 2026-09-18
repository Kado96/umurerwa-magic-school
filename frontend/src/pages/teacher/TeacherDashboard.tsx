import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, CheckSquare, Megaphone, TrendingUp, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users as UsersIcon, GraduationCap as GradIcon, CheckSquare as CheckIcon, Megaphone as MegaIcon, TrendingUp as TrendIcon } from "lucide-react";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_classes: 0,
    attendance_rate: 0,
    pass_rate: 0,
    class_performance: []
  });
  const [loading, setLoading] = useState(true);
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [statsData, annData] = await Promise.all([
           fetchApi("/dashboard/stats/"),
           fetchApi("/announcements/")
        ]);
        setStats({
          total_students: statsData.total_students || 0,
          total_classes: statsData.total_classes || 0,
          attendance_rate: statsData.attendance_rate || 0,
          pass_rate: statsData.pass_rate || 0,
          class_performance: statsData.class_performance || []
        });
        const annList = annData.results || annData;
        if (annList.length > 0) setLatestAnnouncement(annList[0]);
      } catch (error) {
        console.error("Error fetching teacher stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-foreground">Espace Professeur</h1>
          <p className="font-body text-muted-foreground">Bienvenue dans votre espace pédagogique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-green" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mes Classes</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-green/20">
              <UsersIcon className="h-5 w-5 text-letter-green" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : stats.total_classes}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-blue" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mes Élèves</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-blue/20">
              <UsersIcon className="h-5 w-5 text-letter-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : stats.total_students}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-orange" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Taux Réussite Moyen</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-orange/20">
              <TrendIcon className="h-5 w-5 text-letter-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : `${stats.pass_rate}%`}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-pink" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Assiduité</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-pink/20">
              <CheckIcon className="h-5 w-5 text-letter-pink" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : `${stats.attendance_rate}%`}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <Card className="lg:col-span-2 border-none shadow-playful">
             <CardHeader className="flex flex-row items-center gap-3">
                <TrendIcon className="h-6 w-6 text-letter-green" />
                <CardTitle className="font-display">Performance par Classe</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
                {stats.class_performance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.class_performance} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#F3F4F6' }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                        {stats.class_performance.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#4ADE80', '#60A5FA', '#FB923C', '#F472B6'][index % 4]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <CheckIcon className="h-10 w-10 opacity-20 mb-2" />
                    <p className="text-sm">Aucune donnée d'évaluation disponible</p>
                  </div>
                )}
             </CardContent>
        </Card>

        <Card className="border-none shadow-playful bg-letter-green/10 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <MegaIcon className="h-48 w-48 text-letter-green" />
            </div>
            <CardHeader>
                <CardTitle className="font-display text-letter-green">Annonces</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="space-y-4">
                    {latestAnnouncement ? (
                        <div className="bg-white/50 p-4 rounded-3xl backdrop-blur-sm shadow-sm border border-letter-green/10">
                            <p className="text-sm font-bold text-letter-green">{latestAnnouncement.title}</p>
                            <p className="text-xs opacity-80 mt-1 line-clamp-3">{latestAnnouncement.content}</p>
                            <p className="text-[10px] mt-2 font-bold opacity-60 uppercase">{new Date(latestAnnouncement.created_at).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-letter-green/60 text-center py-4 italic">Aucune annonce récente</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
