import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ClassRow = Tables<"classes">;
type SchoolYear = Tables<"school_years">;

const Classes = () => {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", level: "", school_year_id: "", max_students: "40" });

  const fetchData = async () => {
    const [classesRes, yearsRes] = await Promise.all([
      supabase.from("classes").select("*").order("name"),
      supabase.from("school_years").select("*").order("start_date", { ascending: false }),
    ]);
    setClasses(classesRes.data || []);
    setSchoolYears(yearsRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      level: form.level,
      school_year_id: form.school_year_id,
      max_students: parseInt(form.max_students) || 40,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("classes").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("classes").insert(payload));
    }

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Classe modifiée" : "Classe créée" });
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", level: "", school_year_id: "", max_students: "40" });
      fetchData();
    }
  };

  const handleEdit = (cls: ClassRow) => {
    setEditingId(cls.id);
    setForm({
      name: cls.name,
      level: cls.level,
      school_year_id: cls.school_year_id,
      max_students: String(cls.max_students || 40),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Classe supprimée" });
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Gestion des Classes</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm({ name: "", level: "", school_year_id: "", max_students: "40" }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle classe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier la classe" : "Nouvelle classe"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: 1ère A" required />
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Ex: Primaire" required />
              </div>
              <div className="space-y-2">
                <Label>Année scolaire</Label>
                <select
                  value={form.school_year_id}
                  onChange={(e) => setForm({ ...form, school_year_id: e.target.value })}
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
                <Label>Capacité max</Label>
                <Input type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">{editingId ? "Modifier" : "Créer"}</Button>
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
                <TableHead>Capacité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.level}</TableCell>
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
