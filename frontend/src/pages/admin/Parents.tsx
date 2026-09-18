import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, UserPlus, Trash2, Edit, Phone, Mail, Home, Filter, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChildDetail {
  id: string;
  name: string;
  class_id: string;
  class_name: string;
  year_id: string;
  year_name: string;
  teachers: string[];
}

interface Parent {
  id: string | number;
  user_details: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
  };
  phone_number: string;
  address: string;
  children_names: string[];
  children_details?: ChildDetail[];
}

const Parents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, yRes, tRes] = await Promise.all([
        fetchApi("/parents/"),
        fetchApi("/classes/").catch(() => []),
        fetchApi("/school_years/").catch(() => []),
        fetchApi("/teachers/").catch(() => [])
      ]);
      setParents(pRes.results || pRes);
      setClasses(cRes.results || cRes);
      setYears(yRes.results || yRes);
      setTeachers(tRes.results || tRes);
    } catch (e: any) {
      toast.error("Impossible de charger les parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dans cette architecture, on pourrait avoir un endpoint dédié ou faire 2 appels.
      // On simule une création réussie pour l'exemple s'il n'y a pas d'endpoint unique.
      // Mais on va tenter de poster sur /parents/ qui devrait gérer la création de l'user en backend
      // ou on utilise l'endpoint global de register.
      await fetchApi("/parents/", {
        method: "POST",
        body: JSON.stringify(form)
      });
      toast.success("Parent créé avec succès !");
      setOpen(false);
      setForm({ username: "", password: "", first_name: "", last_name: "", email: "", phone_number: "", address: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent) return;
    try {
      await fetchApi(`/parents/${selectedParent.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          phone_number: form.phone_number,
          address: form.address,
        })
      });
      toast.success("Profil parent mis à jour !");
      setEditOpen(false);
      fetchData();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast.info("Ce parent n'existe plus en base de données.");
        setEditOpen(false);
        fetchData();
      } else {
        toast.error(error.message || "Erreur lors de la mise à jour");
      }
    }
  };

  const openEdit = (p: Parent) => {
    setSelectedParent(p);
    setForm({
      username: p.user_details.username,
      password: "",
      first_name: p.user_details.first_name,
      last_name: p.user_details.last_name,
      email: p.user_details.email,
      phone_number: p.phone_number || "",
      address: p.address || ""
    });
    setEditOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Supprimer ce parent ? Cela ne supprimera pas le compte utilisateur.")) return;
    try {
      await fetchApi(`/parents/${id}/`, { method: "DELETE" });
      toast.success("Profil parent supprimé");
      fetchData();
    } catch (e: any) { 
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Ce profil parent n'existe déjà plus.");
        fetchData();
      } else {
        toast.error(e.message); 
      }
    }
  };

  const filtered = parents.filter(p => {
    if (!p.user_details) return false;
    const fn = (p.user_details.first_name + " " + p.user_details.last_name).toLowerCase();
    const un = p.user_details.username.toLowerCase();
    const childrenStr = (p.children_names || []).join(" ").toLowerCase();
    const matchesSearch = fn.includes(search.toLowerCase()) || un.includes(search.toLowerCase()) || childrenStr.includes(search.toLowerCase());

    const details = p.children_details || [];
    const matchesClass = filterClass === "all" || details.some(c => c.class_id === filterClass || c.class_name === filterClass);
    const matchesYear = filterYear === "all" || details.some(c => c.year_id === filterYear || c.year_name === filterYear);
    const matchesTeacher = filterTeacher === "all" || details.some(c => c.teachers?.some(t => t.toLowerCase().includes(filterTeacher.toLowerCase())));

    return matchesSearch && matchesClass && matchesYear && matchesTeacher;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-letter-blue" />
            Gestion des Parents
          </h1>
          <p className="font-body text-muted-foreground">Profils des tuteurs et liens familiaux.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-letter-blue hover:bg-letter-blue/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <UserPlus className="h-5 w-5" /> <span className="font-display">Nouveau Parent</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">Ajouter un parent</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Prénom" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
                  <Input placeholder="Nom" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
               </div>
               <Input placeholder="Nom d'utilisateur" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
               <Input type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
               <Input type="email" placeholder="Email (Optionnel)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
               <Input placeholder="Téléphone" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
               <Input placeholder="Adresse" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
               <Button type="submit" className="w-full bg-letter-blue hover:bg-letter-blue/90 rounded-xl font-display">Créer le profil parent</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-display">Modifier le profil</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                <Input placeholder="Téléphone" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                <Input placeholder="Adresse" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                <Button type="submit" className="w-full bg-letter-blue hover:bg-letter-blue/90 rounded-xl font-display">Enregistrer les modifications</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Barre de filtres multi-critères */}
      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-blue" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>

        {/* Recherche Parent ou Élève */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Parent ou nom de l'élève..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10 font-body"
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

        {/* Filtre Année Scolaire */}
        <div className="min-w-[150px]">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes années" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {years.map(y => <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>)}
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
              {teachers.map(t => (
                <SelectItem key={t.id} value={t.user_details.first_name + " " + (t.user_details.last_name || t.user_details.username)}>
                  {t.user_details.first_name} {t.user_details.last_name || t.user_details.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" 
          onClick={() => { setSearch(""); setFilterClass("all"); setFilterYear("all"); setFilterTeacher("all"); }}>
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-44 rounded-3xl shadow-playful" />)
        ) : filtered.length > 0 ? (
          filtered.map((parent) => (
            <Card key={parent.id} className="border-none shadow-playful hover:-translate-y-1 transition-all overflow-hidden group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-3xl bg-letter-blue/20 flex items-center justify-center font-display font-bold text-xl text-letter-blue uppercase">
                      {parent.user_details.first_name?.[0] || parent.user_details.username[0].toUpperCase()}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-display text-lg leading-tight truncate">
                       {parent.user_details.first_name} {parent.user_details.last_name}
                     </h3>
                     <p className="font-body text-xs text-muted-foreground mt-1 truncate">
                       @{parent.user_details.username}
                     </p>
                   </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-1 text-xs font-body text-muted-foreground">
                   <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" /> {parent.phone_number || "Non renseigné"}
                   </div>
                   <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" /> {parent.user_details.email || "Non renseigné"}
                   </div>
                   <div className="flex items-center gap-2">
                      <Home className="h-3 w-3" /> {parent.address || "Non renseigné"}
                   </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs font-body border-t pt-4 border-border/50">
                   <span className="font-bold text-foreground">
                      Enfants: {parent.children_names?.length || 0}
                   </span>
                   <span className="px-3 py-1 bg-letter-blue/10 text-letter-blue rounded-full font-bold uppercase">Parent</span>
                </div>
                 <div className="mt-3 flex gap-2">
                    <Button onClick={() => openEdit(parent)} variant="ghost" size="sm" className="flex-1 h-8 px-3 rounded-xl bg-letter-blue/10 text-letter-blue hover:bg-letter-blue hover:text-white transition-all text-xs font-body flex items-center justify-center gap-1"><Edit className="h-3.5 w-3.5" /> Modifier</Button>
                    <Button onClick={() => handleDelete(parent.id)} variant="ghost" size="sm" className="flex-1 h-8 px-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all text-xs font-body flex items-center justify-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Supprimer</Button>
                 </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <p className="font-display text-xl text-muted-foreground">Aucun parent trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parents;
