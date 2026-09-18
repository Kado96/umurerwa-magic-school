import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", coefficient: "1" });

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/subjects/");
      setSubjects(data.results || data);
    } catch (e: any) {
      toast.error("Erreur de chargement des matières");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      code: form.code,
      coefficient: parseInt(form.coefficient) || 1
    };

    try {
      if (editingId) {
        await fetchApi(`/subjects/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        toast.success("Matière modifiée");
      } else {
        await fetchApi("/subjects/", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Matière créée");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", code: "", coefficient: "1" });
      fetchSubjects();
    } catch (e: any) {
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Cette matière n'existe plus en base de données.");
        setOpen(false);
        setEditingId(null);
        fetchSubjects();
      } else {
        toast.error(e.message || "Erreur lors de la sauvegarde.");
      }
    }
  };

  const handleEdit = (sub: Subject) => {
    setEditingId(sub.id);
    setForm({ name: sub.name, code: sub.code || "", coefficient: String(sub.coefficient || 1) });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/subjects/${id}/`, { method: "DELETE" });
      toast.success("Matière supprimée");
      fetchSubjects();
    } catch (e: any) {
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Cette matière n'existe déjà plus.");
        fetchSubjects();
      } else {
        toast.error(e.message || "Impossible de supprimer");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-letter-rose" />
            Matières
          </h1>
          <p className="font-body text-muted-foreground">Gestion du programme scolaire et des coefficients.</p>
        </div>

        <Dialog open={open} onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setEditingId(null);
            setForm({ name: "", code: "", coefficient: "1" });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-letter-rose hover:bg-letter-rose/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
                <Plus className="h-5 w-5" />
                <span className="font-display">Ajouter</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject_name">Nom</Label>
                <Input id="subject_name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Mathématiques" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject_code">Code (Raccourci)</Label>
                <Input id="subject_code" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ex: MATH" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject_coefficient">Coefficient</Label>
                <Input id="subject_coefficient" name="coefficient" type="number" value={form.coefficient} onChange={(e) => setForm({ ...form, coefficient: e.target.value })} placeholder="Ex: 5" required />
              </div>
              <Button type="submit" className="w-full shadow-playful bg-letter-rose hover:bg-letter-rose/90">
                {editingId ? "Sauvegarder" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-3xl bg-muted animate-pulse shadow-playful" />
          ))
        ) : subjects.length === 0 ? (
          <div className="col-span-1 border border-border sm:col-span-2 lg:col-span-4 p-8 text-center text-muted-foreground bg-card rounded-2xl">
            Aucune matière enregistrée.
          </div>
        ) : subjects.map((subject) => (
          <Card key={subject.id} className="border-none shadow-playful hover:scale-102 transition-all">
             <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-letter-rose/10 flex items-center justify-center font-display text-letter-rose font-bold">
                      {subject.code ? subject.code.substring(0,3).toUpperCase() : subject.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                      <h3 className="font-display text-base truncate max-w-[120px]">{subject.name}</h3>
                      <p className="text-xs font-body text-muted-foreground">Coeff: {subject.coefficient}</p>
                   </div>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1 flex flex-col gap-1">
                    <Button variant="ghost" className="justify-start gap-2 h-9 px-2 text-sm" onClick={() => handleEdit(subject)}>
                      <Edit className="h-4 w-4" /> Modifier
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2 h-9 px-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(subject.id)}>
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </Button>
                  </PopoverContent>
                </Popover>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
