import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Save, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeacherItem {
  id: number;
  user_details: { id: number; username: string; first_name: string; last_name: string; };
}

interface AttendanceRecord {
  teacher_id: number;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-letter-green text-white",
  ABSENT: "bg-destructive text-white",
  LATE: "bg-letter-orange text-white",
};

const AdminTeacherAttendance = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [records, setRecords] = useState<Record<number, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tchRes, attRes] = await Promise.all([
        fetchApi("/teachers/"),
        fetchApi(`/teacher-attendance/?date=${date}`)
      ]);
      const tchList = tchRes.results || tchRes;
      setTeachers(tchList);
      const attList = attRes.results || attRes;
      const map: Record<number, string> = {};
      tchList.forEach((t: TeacherItem) => { map[t.id] = "PRESENT"; });
      attList.forEach((a: any) => { map[a.teacher] = a.status; });
      setRecords(map);
    } catch { toast.error("Erreur de chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [date]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(records).map(([tid, status]) =>
        fetchApi("/teacher-attendance/", {
          method: "POST",
          body: JSON.stringify({ teacher: parseInt(tid), date, status })
        })
      );
      await Promise.all(promises);
      toast.success("Présences des professeurs enregistrées !");
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const filteredTeachers = teachers.filter(t => {
    const fullName = `${t.user_details.first_name} ${t.user_details.last_name || ''} ${t.user_details.username}`.toLowerCase();
    const matchesSearch = search === "" || fullName.includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || records[t.id] === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-letter-blue" /> Présences Professeurs
          </h1>
          <p className="font-body text-muted-foreground">Pointage journalier des professeurs.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-48" />
          <Button onClick={handleSave} disabled={saving} className="bg-letter-blue hover:bg-letter-blue/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
            <Save className="h-5 w-5" /> <span className="font-display">{saving ? "..." : "Enregistrer"}</span>
          </Button>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-blue" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un professeur..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10"
          />
        </div>

        <div className="min-w-[150px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="PRESENT">✅ Présent</SelectItem>
              <SelectItem value="ABSENT">❌ Absent</SelectItem>
              <SelectItem value="LATE">⏰ En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" 
          onClick={() => { setSearch(""); setFilterStatus("all"); }}>
          Réinitialiser
        </Button>
      </div>

      <Card className="border-none shadow-playful">
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <UserCheck className="h-12 w-12 text-letter-blue/40 mx-auto mb-4" />
              <p className="font-bold text-lg text-foreground">Aucun professeur trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead className="w-[200px]">Statut</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredTeachers.map((t, idx) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground font-display">{idx + 1}</TableCell>
                    <TableCell className="font-bold">{t.user_details.first_name} {t.user_details.last_name || t.user_details.username}</TableCell>
                    <TableCell>
                      <Select value={records[t.id] || "PRESENT"} onValueChange={v => setRecords({...records, [t.id]: v})}>
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">✅ Présent</SelectItem>
                          <SelectItem value="ABSENT">❌ Absent</SelectItem>
                          <SelectItem value="LATE">⏰ En retard</SelectItem>
                        </SelectContent>
                      </Select>
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

export default AdminTeacherAttendance;
