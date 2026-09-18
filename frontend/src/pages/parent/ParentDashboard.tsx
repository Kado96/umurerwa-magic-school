import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, Megaphone, TrendingUp, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Users as UsersIcon, BookOpen as BookIcon, CheckCircle as CheckIcon, Megaphone as MegaIcon, TrendingUp as TrendIcon } from "lucide-react";

const ParentDashboard = () => {
  const [stats, setStats] = useState({
    total_children: 0,
    attendance_rate: 0,
    notes_count: 0,
    child_performance: []
  });
  const [children, setChildren] = useState<any[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [sData, cData, annData] = await Promise.all([
          fetchApi("/dashboard/stats/"),
          fetchApi("/students/"),
          fetchApi("/announcements/")
        ]);
        setStats({
          total_children: sData.total_children || 0,
          attendance_rate: sData.attendance_rate || 0,
          notes_count: sData.notes_count || 0,
          child_performance: sData.child_performance || []
        });
        setChildren(cData.results?.slice(0, 3) || cData.slice(0, 3) || []);
        const annList = annData.results || annData;
        if (annList.length > 0) setLatestAnnouncement(annList[0]);
      } catch (error) {
        console.error("Error fetching parent stats:", error);
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
          <h1 className="text-3xl font-display text-foreground">Espace Parents</h1>
          <p className="font-body text-muted-foreground">Suivez la scolarité de vos enfants au jour le jour.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-blue" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mes Enfants</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-blue/20">
              <UsersIcon className="h-5 w-5 text-letter-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : stats.total_children}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful hover:scale-105 transition-all cursor-pointer overflow-hidden group">
          <div className="h-1 w-full bg-letter-purple" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Notes Publiées</CardTitle>
            <div className="p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity bg-letter-purple/20">
              <BookIcon className="h-5 w-5 text-letter-purple" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-display">{loading ? "..." : stats.notes_count}</p>
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
        <Card className="border-none shadow-playful lg:col-span-2 relative overflow-hidden group">
            <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-letter-blue">
                  <TrendIcon className="h-5 w-5" />
                  Performance Académique {children.length > 0 && `(${children[0].first_name})`}
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {stats.child_performance.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.child_performance}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6B7280' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Radar
                                name="Moyenne"
                                dataKey="score"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
                        <BookIcon className="h-10 w-10 opacity-20 mb-2" />
                        <p className="text-sm italic">Pas encore de notes enregistrées pour cet enfant</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-blue-900 text-white relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-125 transition-transform duration-500">
                <MegaIcon className="h-48 w-48 text-amber-400" />
            </div>
            <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <MegaIcon className="h-5 w-5 text-amber-400" />
                  Annonces Systèmes
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="space-y-4">
                    {latestAnnouncement ? (
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-sm border border-white/20">
                            <span className="text-[10px] font-body font-bold text-amber-300 uppercase tracking-widest block mb-1">
                              {latestAnnouncement.target_role || "TOUS"}
                            </span>
                            <p className="text-base font-bold text-white">{latestAnnouncement.title}</p>
                            <p className="text-xs text-slate-200 mt-1 line-clamp-3 leading-relaxed">{latestAnnouncement.content}</p>
                            <p className="text-[10px] mt-2 font-bold text-slate-300 uppercase">{new Date(latestAnnouncement.created_at).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-sm border border-white/20">
                            <p className="text-sm font-bold text-white">Informations Académiques</p>
                            <p className="text-xs text-slate-200 mt-1">Les communications officielles de l'administration et des enseignants apparaîtront ici.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card className="border-none shadow-playful">
            <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-letter-green">
                    <UsersIcon className="h-5 w-5" />
                    Mes Enfants
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        [1,2].map(i => <div key={i} className="h-12 bg-muted rounded-2xl animate-pulse" />)
                    ) : children.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">Aucun enfant listé</p>
                    ) : (
                        children.map(child => (
                            <div key={child.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                                <div className="h-10 w-10 rounded-xl bg-letter-blue/10 overflow-hidden flex items-center justify-center font-bold text-letter-blue text-xs uppercase">
                                    {child.photo ? (
                                        <img src={child.photo} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <span>{child.first_name[0]}{child.last_name[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold">{child.first_name} {child.last_name}</p>
                                    <p className="text-[10px] text-muted-foreground">{child.class_name}</p>
                                </div>
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

export default ParentDashboard;
