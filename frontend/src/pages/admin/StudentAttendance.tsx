import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Search, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceEntry {
  id: number;
  student: number;
  student_name: string;
  student_class_name: string;
  date: string;
  is_present: boolean;
  remark: string | null;
}

const StudentAttendance = () => {
  const [attendances, setAttendances] = useState<AttendanceEntry[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/attendances/?date=${selectedDate}`;
      if (selectedClass !== "all") {
        url += `&student__student_class=${selectedClass}`;
      }
      const [attRes, classRes] = await Promise.all([
        fetchApi(url),
        fetchApi("/classes/")
      ]);
      setAttendances(attRes.results || attRes);
      setClasses(classRes.results || classRes);
    } catch {
      toast.error("Erreur lors de la récupération des présences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedClass]);

  const absencesCount = attendances.filter(a => !a.is_present).length;
  const presenceRate = attendances.length > 0 
    ? ((attendances.filter(a => a.is_present).length / attendances.length) * 100).toFixed(1)
    : "0";

  const filteredAttendances = attendances.filter(a => {
    const matchesSearch = (a.student_name?.toLowerCase() || "").includes(searchStudent.toLowerCase());
    const matchesStatus = selectedStatusFilter === "ALL" || 
      (selectedStatusFilter === "PRESENT" && a.is_present) || 
      (selectedStatusFilter === "ABSENT" && !a.is_present);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-letter-pink" />
            Suivi des Absences
          </h1>
          <p className="font-body text-muted-foreground">Historique et statistiques de présence des élèves.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-playful bg-letter-pink/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-letter-pink/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-letter-pink" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Absences ce jour</p>
              <p className="text-2xl font-display text-letter-pink">{absencesCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful bg-letter-green/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-letter-green/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-letter-green" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Taux de présence</p>
              <p className="text-2xl font-display text-letter-green">{presenceRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful bg-letter-blue/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-letter-blue/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-letter-blue" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Appels faits</p>
              <p className="text-2xl font-display text-letter-blue">{attendances.length > 0 ? "Oui" : "Aucun"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
           <Filter className="h-4 w-4 text-muted-foreground" />
           <span className="text-sm font-bold">Filtres:</span>
        </div>
        <div className="relative flex-1 min-w-[200px]">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Nom de l'élève..." 
             value={searchStudent} 
             onChange={e => setSearchStudent(e.target.value)}
             className="pl-9 rounded-xl border-muted bg-muted/20"
           />
        </div>
        <div className="flex-1 min-w-[160px]">
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border-muted bg-muted/20"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous statuts</SelectItem>
              <SelectItem value="PRESENT">Présents</SelectItem>
              <SelectItem value="ABSENT">Absents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" className="rounded-xl" onClick={() => {setSelectedDate(new Date().toISOString().split('T')[0]); setSelectedClass("all"); setSearchStudent(""); setSelectedStatusFilter("ALL");}}>Réinitialiser</Button>
      </div>

      <Card className="border-none shadow-playful overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filteredAttendances.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground bg-muted/5">
               <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p className="font-display text-xl">Aucune donnée pour cette sélection</p>
               <p className="text-sm">Les appels n'ont peut-être pas encore été faits ou enregistrés.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-6 py-4">Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Remarque</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendances.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/10">
                    <TableCell className="px-6 py-4 font-bold">{entry.student_name}</TableCell>
                    <TableCell>{entry.student_class_name}</TableCell>
                    <TableCell>
                      {entry.is_present ? (
                        <Badge className="bg-letter-green/20 text-letter-green hover:bg-letter-green/20 border-none px-3">Présent</Badge>
                      ) : (
                        <Badge className="bg-letter-pink/20 text-letter-pink hover:bg-letter-pink/20 border-none px-3">Absent</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground italic">
                      {entry.remark || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" className="text-letter-pink bg-letter-pink/5 hover:bg-letter-pink/10 rounded-xl" onClick={() => toast.info("Fonctionnalité de notification parent bientôt disponible")}>
                          Signaler
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
