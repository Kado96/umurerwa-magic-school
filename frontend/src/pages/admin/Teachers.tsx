import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, UserPlus, Trash2, Edit, MoreVertical, Briefcase, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Teacher {
  id: string;
  user_details: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
  };
  subjects_display: string[];
  classes_display: string[];
  bio: string;
  photo: string | null;
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ 
    username: "", password: "", first_name: "", last_name: "", email: "",
    subjects: [] as string[], classes: [] as string[], bio: "", photo: "" 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tData, sData, cData] = await Promise.all([
        fetchApi("/teachers/"),
        fetchApi("/subjects/"),
        fetchApi("/classes/")
      ]);
      setTeachers(tData.results || tData);
      setSubjects(sData.results || sData);
      setClasses(cData.results || cData);
    } catch (e: any) {
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/teachers/", {
        method: "POST",
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          subjects: form.subjects,
          classes: form.classes,
          bio: form.bio,
          photo: form.photo || null
        })
      });
      toast.success("Enseignant créé !");
      setOpen(false);
      setForm({ username: "", password: "", first_name: "", last_name: "", email: "", subjects: [], classes: [], bio: "", photo: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      await fetchApi(`/teachers/${selectedTeacher.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          subjects: form.subjects,
          classes: form.classes,
          bio: form.bio,
          photo: form.photo || null
        })
      });
      toast.success("Profil professeur mis à jour !");
      setEditOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast.info("Cet enseignant n'existe plus en base de données.");
        setEditOpen(false);
        fetchData();
      } else {
        toast.error(error.message || "Erreur lors de la mise à jour");
      }
    }
  };

  const openEdit = (t: Teacher) => {
    setSelectedTeacher(t);
    // On extrait les IDs des matières et classes actuelles si possible
    // Sinon on laisse vide pour sélection manuelle
    setForm({
      username: t.user_details.username,
      password: "", // Password should not be pre-filled for security
      first_name: t.user_details.first_name,
      last_name: t.user_details.last_name,
      email: t.user_details.email,
      subjects: subjects.filter(s => t.subjects_display.includes(s.name)).map(s => s.id),
      classes: classes.filter(c => t.classes_display.includes(c.name)).map(c => c.id),
      bio: t.bio || "",
      photo: t.photo || ""
    });
    setEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet enseignant ? Son compte utilisateur sera conservé.")) return;
    try {
      await fetchApi(`/teachers/${id}/`, { method: "DELETE" });
      toast.success("Profil enseignant supprimé");
      fetchData();
    } catch (e: any) {
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Cet enseignant n'existe déjà plus.");
        fetchData();
      } else {
        toast.error(e.message);
      }
    }
  };

  const filtered = teachers.filter(t => {
    const fn = (t.user_details.first_name + " " + t.user_details.last_name).toLowerCase();
    const un = t.user_details.username.toLowerCase();
    const matchesSearch = fn.includes(search.toLowerCase()) || un.includes(search.toLowerCase());
    
    const matchesSubject = filterSubject === "all" || t.subjects_display.some(s => s === filterSubject || String(s) === filterSubject);
    const matchesClass = filterClass === "all" || t.classes_display.some(c => c === filterClass || String(c) === filterClass);

    return matchesSearch && matchesSubject && matchesClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-letter-orange" />
            Corps Enseignant
          </h1>
          <p className="font-body text-muted-foreground">Gestion des professeurs et de leurs matières.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-letter-orange hover:bg-letter-orange/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <UserPlus className="h-5 w-5" /> <span className="font-display">Nouveau Professeur</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">Ajouter un professeur</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
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
               <div className="space-y-1">
                 <Label htmlFor="username">Nom d'utilisateur</Label>
                 <Input id="username" name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="password">Mot de passe</Label>
                 <Input id="password" name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="email">Email</Label>
                 <Input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
               </div>
                <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-letter-orange/20 rounded-2xl bg-letter-orange/5">
                    {form.photo ? (
                      <img src={form.photo} alt="Prévisualisation" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-playful" />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-letter-orange/10 flex items-center justify-center text-letter-orange/40">
                        <UserPlus className="h-10 w-10" />
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground font-body">Aperçu de la photo de l'enseignant</p>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="photo_url">URL de la photo</Label>
                    <Input id="photo_url" name="photo" placeholder="URL de la photo (ex: https://...)" value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} />
                </div>
               <Button type="submit" className="w-full bg-letter-orange hover:bg-letter-orange/90 rounded-xl font-display">Créer le compte & profil</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-display">Modifier les affectations</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
               <div className="space-y-1">
                  <Label>Matières enseignées</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-muted/30 rounded-xl">
                      {subjects.map(s => (
                        <label key={s.id} className="flex items-center gap-2 text-xs p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                           <input 
                             type="checkbox" 
                             name="subjects"
                             checked={form.subjects.includes(s.id)}
                             onChange={(e) => {
                               if(e.target.checked) setForm({...form, subjects: [...form.subjects, s.id]});
                               else setForm({...form, subjects: form.subjects.filter(id => id !== s.id)});
                             }}
                           />
                           {s.name}
                        </label>
                      ))}
                  </div>
               </div>

               <div className="space-y-1">
                  <Label>Classes attribuées</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-muted/30 rounded-xl">
                      {classes.map(c => (
                        <label key={c.id} className="flex items-center gap-2 text-xs p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                           <input 
                             type="checkbox" 
                             name="classes"
                             checked={form.classes.includes(c.id)}
                             onChange={(e) => {
                               if(e.target.checked) setForm({...form, classes: [...form.classes, c.id]});
                               else setForm({...form, classes: form.classes.filter(id => id !== c.id)});
                             }}
                           />
                           {c.name}
                        </label>
                      ))}
                  </div>
               </div>
                <div className="space-y-1">
                  <Label htmlFor="edit_bio">Bio (optionnel)</Label>
                  <Input id="edit_bio" name="bio" placeholder="Bio (optionnel)" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </div>
                <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-letter-orange/20 rounded-2xl bg-letter-orange/5">
                    {form.photo ? (
                      <img src={form.photo} alt="Prévisualisation" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-playful" />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-letter-orange/10 flex items-center justify-center text-letter-orange/40 text-xs">
                        Aucune photo
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground font-body">Aperçu de la photo de l'enseignant</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit_photo_url">URL de la photo (optionnel)</Label>
                  <Input id="edit_photo_url" name="photo" placeholder="URL de la photo (optionnel)" value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} />
                </div>

               <Button type="submit" className="w-full bg-letter-orange hover:bg-letter-orange/90 rounded-xl font-display">Enregistrer les affectations</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-orange" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou pseudo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10 font-body"
          />
        </div>

        <div className="min-w-[150px]">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes matières" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" 
          onClick={() => { setSearch(""); setFilterSubject("all"); setFilterClass("all"); }}>
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <Skeleton key={i} className="h-44 rounded-3xl shadow-playful" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((teacher) => (
            <Card key={teacher.id} className="border-none shadow-playful hover:-translate-y-1 transition-all overflow-hidden relative group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-3xl bg-letter-purple/20 flex items-center justify-center overflow-hidden">
                    {teacher.photo ? (
                        <img src={teacher.photo} alt="Teacher" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-xl font-display text-letter-purple uppercase">{teacher.user_details?.first_name[0]}{teacher.user_details?.last_name[0]}</span>
                    )}
                  </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-display text-lg leading-tight truncate">
                       {teacher.user_details.first_name} {teacher.user_details.last_name || teacher.user_details.username}
                     </h3>
                     <p className="font-body text-xs text-muted-foreground mt-1 truncate">
                       @{teacher.user_details.username}
                     </p>
                   </div>
                   <div className="flex flex-col gap-1">
                      <Button onClick={() => openEdit(teacher)} variant="ghost" size="icon" title="Modifier" className="h-8 w-8 text-letter-orange bg-letter-orange/10 hover:bg-letter-orange hover:text-white transition-all rounded-xl">
                         <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(teacher.id)} variant="ghost" size="icon" title="Supprimer" className="h-8 w-8 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-all rounded-xl">
                         <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-1 text-sm font-body">
                  <div className="text-muted-foreground line-clamp-1">
                    <span className="font-bold text-foreground">Matières: </span> 
                    {teacher.subjects_display.length > 0 ? teacher.subjects_display.join(", ") : "Aucune affectation"}
                  </div>
                  <div className="text-muted-foreground line-clamp-1">
                    <span className="font-bold text-foreground">Classes: </span> 
                    {teacher.classes_display.length > 0 ? teacher.classes_display.join(", ") : "Aucune affectation"}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs font-body border-t pt-4 border-border/50">
                   <span className="px-3 py-1 bg-letter-orange/10 text-letter-orange rounded-full font-bold uppercase">Professeur</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <p className="font-display text-xl text-muted-foreground">Aucun professeur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Teachers;
