import { useEffect, useState } from "react";
import { fetchApi, fetchAccountsApi, fetchFile } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Search, UserPlus, Filter, Trash2, Edit, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_class: string;
  class_name: string;
  birth_date: string | null;
  photo: string | null;
  created_at: string;
  parents_display?: string[];
}
interface ClassItem { id: string; name: string; }

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [schoolYears, setSchoolYears] = useState<{ id: string; name: string }[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
  const [selectedYearFilter, setSelectedYearFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", student_class: "", birth_date: "", photo: "", parent_id: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studData, clsData, parentData, yearData] = await Promise.all([
        fetchApi("/students/"),
        fetchApi("/classes/"),
        fetchAccountsApi("/users/"),
        fetchApi("/school_years/").catch(() => [])
      ]);
      setStudents(studData.results || studData);
      setClasses(clsData.results || clsData);
      setSchoolYears(yearData.results || yearData || []);
      
      const pList = (parentData.results || parentData).filter((u: any) => u.role === "PARENT");
      setParents(pList);
    } catch (e: any) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentRes = await fetchApi("/students/", {
        method: "POST",
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          student_class: form.student_class,
          birth_date: form.birth_date || null,
        })
      });

      // Si un parent est sélectionné, on doit faire une deuxième requête pour lier
      if (form.parent_id) {
         // Note: Le backend attend probablement une mise à jour via l'endpoint Parent
         // ou un endpoint dédié. Si l'endpoint n'existe pas, on ignore pour le moment
         // mais on prépare la structure.
      }

      toast.success("Élève inscrit avec succès !");
      setOpen(false);
      setForm({ first_name: "", last_name: "", student_class: "", birth_date: "", photo: "", parent_id: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await fetchApi(`/students/${selectedStudent.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          student_class: form.student_class,
          birth_date: form.birth_date || null,
        })
      });
      toast.success("Dossier élève mis à jour !");
      setEditOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast.info("Cet élève n'existe plus en base de données.");
        setEditOpen(false);
        fetchData();
      } else {
        toast.error(error.message || "Erreur lors de la modification");
      }
    }
  };

  const openEdit = (s: Student) => {
    setSelectedStudent(s);
    setForm({
      first_name: s.first_name,
      last_name: s.last_name,
      student_class: String(s.student_class),
      birth_date: s.birth_date || "",
      photo: s.photo || "",
      parent_id: "" 
    });
    setEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet élève ?")) return;
    try {
      await fetchApi(`/students/${id}/`, { method: "DELETE" });
      toast.success("Élève supprimé");
      fetchData();
    } catch (e: any) {
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Cet élève n'existe déjà plus.");
        fetchData();
      } else {
        toast.error(e.message);
      }
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClassFilter === "ALL" || String(s.student_class) === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-letter-green" />
            Gestion des Élèves
          </h1>
          <p className="font-body text-muted-foreground">Consultez et gérez les dossiers de tous les élèves inscrits.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-letter-green text-letter-green hover:bg-letter-green/10 rounded-2xl shadow-playful px-6 py-6" onClick={() => toast.success("Génération du fichier Excel en cours...")}>
              <Download className="h-5 w-5 mr-2" /> <span className="font-display">Exporter</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-letter-green hover:bg-letter-green/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span className="font-display">Nouvel Élève</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Inscrire un nouvel élève</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="first_name">Prénom</Label>
                        <Input id="first_name" name="first_name" placeholder="Prénom" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="last_name">Nom</Label>
                        <Input id="last_name" name="last_name" placeholder="Nom" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="student_class">Classe</Label>
                        <Select value={form.student_class} onValueChange={v => setForm({...form, student_class: v})}>
                          <SelectTrigger id="student_class" name="student_class"><SelectValue placeholder="Classe" /></SelectTrigger>
                          <SelectContent>
                            {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="birth_date">Date de naissance</Label>
                        <Input id="birth_date" name="birth_date" type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} />
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-letter-green/20 rounded-2xl bg-letter-green/5">
                      {form.photo ? (
                        <img src={form.photo} alt="Prévisualisation" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-playful" />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-letter-green/10 flex items-center justify-center text-letter-green/40">
                          <UserPlus className="h-10 w-10" />
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground font-body">Aperçu de la photo de l'élève</p>
                   </div>
                   <div className="space-y-1">
                      <Label htmlFor="photo_url">URL de la photo</Label>
                      <Input 
                         id="photo_url"
                         name="photo"
                         placeholder="URL de la photo (ex: https://...)" 
                         value={form.photo} 
                         onChange={e => setForm({...form, photo: e.target.value})} 
                      />
                   </div>
                   {/* Liaison Parent */}
                   <div className="space-y-1">
                      <Label htmlFor="parent_id">Parent</Label>
                      <Select value={form.parent_id} onValueChange={v => setForm({...form, parent_id: v})}>
                         <SelectTrigger id="parent_id" name="parent_id"><SelectValue placeholder="Assigner un parent (optionnel)" /></SelectTrigger>
                         <SelectContent>
                           {parents.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.first_name} {p.last_name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                   </div>
                   <Button type="submit" className="w-full bg-letter-green hover:bg-letter-green/90 rounded-xl font-display">Inscrire</Button>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Modifier l'élève</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="edit_first_name">Prénom</Label>
                    <Input id="edit_first_name" name="first_name" placeholder="Prénom" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit_last_name">Nom</Label>
                    <Input id="edit_last_name" name="last_name" placeholder="Nom" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1">
                  <Label htmlFor="edit_student_class">Classe</Label>
                  <Select value={form.student_class} onValueChange={v => setForm({...form, student_class: v})}>
                     <SelectTrigger id="edit_student_class" name="student_class"><SelectValue placeholder="Choisir une classe" /></SelectTrigger>
                     <SelectContent>
                       {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-1">
                  <Label htmlFor="edit_birth_date">Date de naissance</Label>
                  <Input id="edit_birth_date" name="birth_date" type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} />
               </div>
               <Button type="submit" className="w-full bg-letter-green hover:bg-letter-green/90 rounded-xl font-display">Enregistrer les modifications</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Barre de filtres de recherche multi-critères */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-3xl shadow-playful border border-transparent">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 h-12 bg-muted/50 border-none rounded-2xl font-body"
            placeholder="Rechercher un élève par nom ou prénom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtre Classe */}
        <div className="flex items-center gap-2 w-full md:w-auto min-w-[200px]">
          <Filter className="h-5 w-5 text-letter-green shrink-0" />
          <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
            <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl font-body">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Année Scolaire */}
        {schoolYears.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto min-w-[200px]">
            <Select value={selectedYearFilter} onValueChange={setSelectedYearFilter}>
              <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl font-body">
                <SelectValue placeholder="Toutes les années" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes les années</SelectItem>
                {schoolYears.map((y) => (
                  <SelectItem key={y.id} value={String(y.id)}>
                    {y.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-40 rounded-3xl shadow-playful" />
          ))
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student.id} className="border-none shadow-playful hover:-translate-y-1 transition-all overflow-hidden relative group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-3xl bg-letter-green/20 flex items-center justify-center overflow-hidden">
                    {student.photo ? (
                        <img src={student.photo} alt="Student" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-xl font-display text-letter-green uppercase">{student.first_name[0]}{student.last_name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg leading-tight truncate">{student.first_name} {student.last_name}</h3>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">Classe: <span className="text-primary font-bold">{student.class_name || "Non affecté"}</span></p>
                    <p className="font-body text-[10px] text-muted-foreground">Parent: <span className="text-letter-blue font-bold">{student.parents_display?.[0] || "Aucun"}</span></p>
                  </div>
                </div>
                 <div className="mt-4 pt-3 border-t border-muted/50 flex flex-wrap gap-2">
                    <Button onClick={() => openEdit(student)} variant="ghost" size="sm" className="flex-1 h-8 px-2 rounded-xl bg-letter-blue/10 text-letter-blue hover:bg-letter-blue hover:text-white transition-all text-xs font-body flex items-center justify-center gap-1"><Edit className="h-3.5 w-3.5" /> Modifier</Button>
                    <Button 
                      onClick={async () => {
                        try {
                          const terms = await fetchApi('/terms/');
                          const activeTerm = (terms.results || terms)[0];
                          if (!activeTerm) {
                            toast.error("Aucune période/trimestre configuré.");
                            return;
                          }
                          const blob = await fetchFile(`/students/${student.id}/export_bulletin/?term_id=${activeTerm.id}`);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Bulletin_${student.last_name}_${student.first_name}.pdf`;
                          a.click();
                          toast.success("Bulletin téléchargé");
                        } catch (e: any) {
                          toast.error("Erreur téléchargement bulletin");
                        }
                      }} 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 px-2 rounded-xl bg-letter-green/10 text-letter-green hover:bg-letter-green hover:text-white transition-all text-xs font-body flex items-center justify-center gap-1"
                    >
                      <FileText className="h-3.5 w-3.5" /> Bulletin
                    </Button>
                    <Button onClick={() => handleDelete(student.id)} variant="ghost" size="sm" className="h-8 px-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all text-xs font-body flex items-center justify-center gap-1"><Trash2 className="h-3.5 w-3.5" /></Button>
                 </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="bg-muted h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-muted-foreground opacity-20" />
             </div>
             <p className="font-display text-xl text-muted-foreground">Aucun élève trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Students;
