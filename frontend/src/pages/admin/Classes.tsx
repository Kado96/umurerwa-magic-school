import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ClassRow {
  id: number;
  name: string;
  level: string;
  max_students: number;
  school_year: number; // ID de l'année
  school_year_name?: string;
  student_count?: number;
}

interface SchoolYear {
  id: number;
  name: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", level: "", school_year: "", max_students: "40" });

  const fetchData = async () => {
    try {
      const [classesRes, yearsRes] = await Promise.all([
        fetchApi("/classes/"),
        fetchApi("/school_years/"),
      ]);
      setClasses(classesRes.results || classesRes);
      setSchoolYears(yearsRes.results || yearsRes);
    } catch (error: any) {
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      level: form.level,
      school_year: form.school_year,
      max_students: parseInt(form.max_students) || 40,
    };

    try {
      if (editingId) {
        await fetchApi(`/classes/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi("/classes/", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      
      toast({ title: editingId ? "Classe modifiée" : "Classe créée" });
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", level: "", school_year: "", max_students: "40" });
      fetchData();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast({ title: "Information", description: "Cette classe n'existe plus en base de données." });
        setOpen(false);
        setEditingId(null);
        fetchData();
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleEdit = (cls: ClassRow) => {
    setEditingId(cls.id);
    setForm({
      name: cls.name,
      level: cls.level,
      school_year: String(cls.school_year || ""),
      max_students: String(cls.max_students || 40),
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchApi(`/classes/${id}/`, { method: "DELETE" });
      toast({ title: "Classe supprimée" });
      fetchData();
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("Not Found")) {
        toast({ title: "Information", description: "Cette classe n'existe déjà plus." });
        fetchData();
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Gestion des Classes</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm({ name: "", level: "", school_year: "", max_students: "40" }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle classe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier la classe" : "Nouvelle classe"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class_name">Nom</Label>
                <Input id="class_name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: 1ère A" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class_level">Niveau</Label>
                <Input id="class_level" name="level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Ex: Primaire" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_year_select">Année scolaire</Label>
                <select
                  id="school_year_select"
                  name="school_year"
                  value={form.school_year}
                  onChange={(e) => setForm({ ...form, school_year: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {schoolYears.map((y) => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_students">Capacité max</Label>
                <Input id="max_students" name="max_students" type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: e.target.value })} />
              </div>
              <Button type="submit" className="w-full shadow-playful">{editingId ? "Modifier" : "Créer"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-body">Aucune classe pour le moment.</p>
            <p className="text-sm mt-1">Créez d'abord une année scolaire, puis ajoutez des classes.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Année Scolaire</TableHead>
                <TableHead>Élèves</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
                  <TableCell>{cls.school_year_name || "N/A"}</TableCell>
                  <TableCell>{cls.student_count || 0}</TableCell>
                  <TableCell>{cls.max_students}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Classes;
