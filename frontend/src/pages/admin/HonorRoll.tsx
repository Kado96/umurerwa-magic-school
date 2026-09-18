import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Users, Download, Star, Medal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentAverage {
  id: string;
  name: string;
  average: number;
  rank: number;
  mention: string;
  mentionColor: string;
}

const HonorRoll = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StudentAverage[]>([]);
  const [stats, setStats] = useState({ classAverage: 0, passRate: 0, topStudent: "" });

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [cRes, tRes] = await Promise.all([fetchApi("/classes/"), fetchApi("/terms/")]);
        setClasses(cRes.results || cRes);
        setTerms(tRes.results || tRes);
      } catch { toast.error("Erreur de chargement"); }
    };
    fetchInitial();
  }, []);

  const calculateHonorRoll = async () => {
    if (!selectedClassId || !selectedTermId) return;
    setLoading(true);
    try {
      const res = await fetchApi(`/excellence/calculate/`, {
        method: "POST",
        body: JSON.stringify({
          class_id: selectedClassId,
          term_id: selectedTermId
        })
      });

      const backendResults = res.results || [];
      const formattedResults: StudentAverage[] = backendResults.map((entry: any) => {
        let mentionColor = "bg-blue-400";
        if (entry.average >= 16) mentionColor = "bg-letter-pink";
        else if (entry.average >= 14) mentionColor = "bg-letter-blue";
        else if (entry.average >= 12) mentionColor = "bg-letter-green";
        else if (entry.average < 10) mentionColor = "bg-destructive";

        return {
          id: entry.id,
          name: entry.student_name,
          average: parseFloat(entry.average),
          rank: entry.position,
          mention: entry.distinction_display,
          mentionColor
        };
      });

      setData(formattedResults);

      // Stats globales
      const validAverages = formattedResults.filter(r => r.average > 0);
      const classAvg = validAverages.reduce((acc, curr) => acc + curr.average, 0) / (validAverages.length || 1);
      const passRate = (validAverages.filter(r => r.average >= 10).length / (validAverages.length || 1)) * 100;

      setStats({
        classAverage: parseFloat(classAvg.toFixed(2)),
        passRate: parseFloat(passRate.toFixed(1)),
        topStudent: formattedResults[0]?.name || "N/A"
      });

      toast.success(res.message);

    } catch (e: any) {
      toast.error("Erreur lors du calcul : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Award className="h-8 w-8 text-letter-pink" /> Tableau d'Honneur
          </h1>
          <p className="font-body text-muted-foreground">Analyse des performances et mérite académique.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-letter-pink text-letter-pink hover:bg-letter-pink/10 rounded-2xl shadow-playful" onClick={() => toast.success("Exportation du rapport en cours...")}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button className="bg-letter-pink hover:bg-letter-pink/90 text-white rounded-2xl shadow-playful" onClick={calculateHonorRoll} disabled={loading || !selectedClassId || !selectedTermId}>
              {loading ? "Calcul..." : "Générer le Tableau"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-playful bg-card">
              <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Classe</label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Choisir une classe" /></SelectTrigger>
                        <SelectContent>
                          {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Période</label>
                    <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                        <SelectTrigger><SelectValue placeholder="Choisir un trimestre" /></SelectTrigger>
                        <SelectContent>
                          {terms.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
              </CardContent>
          </Card>

          <Card className="md:col-span-2 border-none shadow-playful bg-letter-pink/5 border-2 border-dashed border-letter-pink/20">
              <CardContent className="h-full flex items-center justify-around py-6">
                  <div className="text-center group cursor-help" title="Moyenne générale de tous les élèves de cette classe">
                      <div className="h-12 w-12 rounded-2xl bg-letter-pink/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-letter-pink" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Moyenne Classe</p>
                      <p className="text-3xl font-display text-letter-pink">{stats.classAverage}<span className="text-sm opacity-60">/20</span></p>
                  </div>
                  <div className="text-center border-x border-border/50 px-8 group cursor-help" title="Pourcentage d'élèves ayant plus de 10/20">
                      <div className="h-12 w-12 rounded-2xl bg-letter-blue/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6 text-letter-blue" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Taux de Réussite</p>
                      <p className="text-3xl font-display text-letter-blue">{stats.passRate}<span className="text-sm opacity-60">%</span></p>
                  </div>
                  <div className="text-center group cursor-help" title="L'élève ayant obtenu la meilleure moyenne sur cette période">
                      <div className="h-12 w-12 rounded-2xl bg-letter-orange/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Medal className="h-6 w-6 text-letter-orange" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Major de Promo</p>
                      <p className="text-lg font-display text-letter-orange truncate max-w-[150px]">{stats.topStudent}</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card className="border-none shadow-playful overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] text-center">Rang</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead className="text-center">Moyenne</TableHead>
              <TableHead>Mention / Décision du Conseil</TableHead>
              <TableHead className="text-right">Distinction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">
                   Sélectionnez une classe et cliquez sur "Générer le Tableau"
                </TableCell>
              </TableRow>
            ) : data.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/20">
                <TableCell className="text-center font-display text-xl">
                    {student.rank === 1 ? <Medal className="h-6 w-6 text-yellow-500 mx-auto" /> : student.rank}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden font-display text-[10px] text-muted-foreground border border-muted-foreground/20">
                           {student.name[0]}
                        </div>
                        <span className="font-bold">{student.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    <span className={`text-lg font-display ${student.average >= 10 ? "text-letter-green" : "text-destructive"}`}>
                        {student.average}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/20</span>
                </TableCell>
                <TableCell>
                    <Badge className={`${student.mentionColor} text-white border-none shadow-sm`}>
                        {student.mention}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {student.average >= 16 && <Star className="h-5 w-5 text-yellow-400 inline" fill="currentColor" />}
                    {student.average >= 14 && <Star className="h-5 w-5 text-yellow-400 inline" fill="currentColor" />}
                    {student.average < 10 && <AlertTriangle className="h-5 w-5 text-destructive inline" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default HonorRoll;
