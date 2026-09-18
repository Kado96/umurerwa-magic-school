import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Edit, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TimetableEntry {
  id: string;
  class_obj: string;
  class_name: string;
  subject: string;
  subject_name: string;
  teacher: string;
  teacher_name: string;
  day: number;
  day_display: string;
  start_time: string;
  end_time: string;
  classroom: string;
}
interface ClassItem { id: string; name: string; }
interface SubjectItem { id: string; name: string; }
interface TeacherItem { id: string; user_details: { first_name: string; last_name: string; username: string }; }

const DAYS = [
  { value: "0", label: "Lundi" },
  { value: "1", label: "Mardi" },
  { value: "2", label: "Mercredi" },
  { value: "3", label: "Jeudi" },
  { value: "4", label: "Vendredi" },
  { value: "5", label: "Samedi" },
];

const DAY_COLORS: Record<string, string> = {
  "Lundi": "bg-letter-blue",
  "Mardi": "bg-letter-green",
  "Mercredi": "bg-letter-orange",
  "Jeudi": "bg-letter-purple",
  "Vendredi": "bg-letter-pink",
  "Samedi": "bg-muted-foreground",
};

const AdminTimetable = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [form, setForm] = useState({
    class_obj: "", subject: "", teacher: "", day: "", start_time: "", end_time: "", classroom: ""
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ttRes, clsRes, subRes, tchRes] = await Promise.all([
        fetchApi("/timetable/"),
        fetchApi("/classes/"),
        fetchApi("/subjects/"),
        fetchApi("/teachers/")
      ]);
      setEntries(ttRes.results || ttRes);
      setClasses(clsRes.results || clsRes);
      setSubjects(subRes.results || subRes);
      setTeachers(tchRes.results || tchRes);
    } catch (e: any) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      class_obj: form.class_obj,
      subject: form.subject,
      teacher: form.teacher,
      day: parseInt(form.day),
      start_time: form.start_time,
      end_time: form.end_time,
      classroom: form.classroom,
    };
    try {
      if (editingId) {
        await fetchApi(`/timetable/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        toast.success("Créneau mis à jour !");
      } else {
        await fetchApi("/timetable/", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Créneau ajouté !");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ class_obj: "", subject: "", teacher: "", day: "", start_time: "", end_time: "", classroom: "" });
      fetchAll();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast.info("Ce créneau n'existe plus en base de données.");
        setOpen(false);
        setEditingId(null);
        fetchAll();
      } else {
        toast.error(error.message || "Erreur lors de l'enregistrement du créneau");
      }
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingId(entry.id);
    setForm({
      class_obj: String(entry.class_obj),
      subject: String(entry.subject),
      teacher: String(entry.teacher),
      day: String(entry.day),
      start_time: entry.start_time,
      end_time: entry.end_time,
      classroom: entry.classroom || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/timetable/${id}/`, { method: "DELETE" });
      toast.success("Créneau supprimé");
      fetchAll();
    } catch (e: any) { 
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Ce créneau n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message); 
      }
    }
  };

  const filtered = entries.filter(e => {
    const matchesClass = filterClass === "all" || String(e.class_obj) === filterClass;
    const matchesDay = filterDay === "all" || String(e.day) === filterDay;
    const matchesSubject = filterSubject === "all" || String(e.subject) === filterSubject;
    const matchesTeacher = filterTeacher === "all" || String(e.teacher) === filterTeacher;
    const matchesSearch = filterSearch === "" || 
      e.class_name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      e.subject_name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      e.teacher_name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      e.classroom?.toLowerCase().includes(filterSearch.toLowerCase());
    return matchesClass && matchesDay && matchesSubject && matchesTeacher && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-letter-blue" />
            Emploi du Temps
          </h1>
          <p className="font-body text-muted-foreground">Configurez les créneaux horaires de chaque classe.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) { setEditingId(null); setForm({ class_obj: "", subject: "", teacher: "", day: "", start_time: "", end_time: "", classroom: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="bg-letter-blue hover:bg-letter-blue/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Créneau</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? "Modifier le créneau" : "Ajouter un créneau"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1">
                <Label htmlFor="tt_class">Classe</Label>
                <Select value={form.class_obj} onValueChange={v => setForm({...form, class_obj: v})}>
                  <SelectTrigger id="tt_class" name="class_obj"><SelectValue placeholder="Classe" /></SelectTrigger>
                  <SelectContent>{classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tt_subject">Matière</Label>
                <Select value={form.subject} onValueChange={v => setForm({...form, subject: v})}>
                  <SelectTrigger id="tt_subject" name="subject"><SelectValue placeholder="Matière" /></SelectTrigger>
                  <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tt_teacher">Professeur</Label>
                <Select value={form.teacher} onValueChange={v => setForm({...form, teacher: v})}>
                  <SelectTrigger id="tt_teacher" name="teacher"><SelectValue placeholder="Professeur" /></SelectTrigger>
                  <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.user_details.first_name} {t.user_details.last_name || t.user_details.username}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tt_day">Jour</Label>
                <Select value={form.day} onValueChange={v => setForm({...form, day: v})}>
                  <SelectTrigger id="tt_day" name="day"><SelectValue placeholder="Jour" /></SelectTrigger>
                  <SelectContent>{DAYS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="start_time">Début</Label>
                  <Input id="start_time" name="start_time" type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end_time">Fin</Label>
                  <Input id="end_time" name="end_time" type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="classroom">Salle</Label>
                <Input id="classroom" name="classroom" placeholder="Salle (ex: Salle A3)" value={form.classroom} onChange={e => setForm({...form, classroom: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-letter-blue hover:bg-letter-blue/90 rounded-xl font-display">
                {editingId ? "Sauvegarder les modifications" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de filtres multi-critères */}
      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-blue" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>
        
        {/* Recherche globale */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Recherche libre (matière, salle...)" 
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10"
          />
        </div>

        {/* Filtre Classe */}
        <div className="min-w-[140px]">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Jour */}
        <div className="min-w-[130px]">
          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Tous les jours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les jours</SelectItem>
              {DAYS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Matière */}
        <div className="min-w-[140px]">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {subjects.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Professeur */}
        <div className="min-w-[160px]">
          <Select value={filterTeacher} onValueChange={setFilterTeacher}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Tous profs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les professeurs</SelectItem>
              {teachers.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.user_details.first_name} {t.user_details.last_name || t.user_details.username}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" 
          onClick={() => { setFilterClass("all"); setFilterDay("all"); setFilterSubject("all"); setFilterTeacher("all"); setFilterSearch(""); }}>
          Réinitialiser
        </Button>
      </div>

      <Card className="border-none shadow-playful">
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <Calendar className="h-12 w-12 text-letter-blue/40 mx-auto mb-4" />
              <p className="font-bold text-lg text-foreground">Aucun créneau configuré</p>
              <p className="text-sm mt-1">Cliquez sur "Nouveau Créneau" pour commencer.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jour</TableHead>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Professeur</TableHead>
                  <TableHead>Salle</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(entry => (
                  <TableRow key={entry.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Badge className={`${DAY_COLORS[entry.day_display] || "bg-muted"} text-white font-body`}>
                        {entry.day_display}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-display">{entry.start_time?.slice(0, 5)} - {entry.end_time?.slice(0, 5)}</TableCell>
                    <TableCell className="font-bold">{entry.class_name}</TableCell>
                    <TableCell>{entry.subject_name}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.teacher_name}</TableCell>
                    <TableCell className="text-sm">{entry.classroom || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(entry)} className="text-primary hover:text-primary/80">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(entry.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default AdminTimetable;
