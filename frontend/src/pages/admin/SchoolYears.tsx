import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Check, Pencil } from "lucide-react";

interface SchoolYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const SchoolYears = () => {
  const [years, setYears] = useState<SchoolYear[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", is_active: false });

  const fetchYears = async () => {
    try {
      const data = await fetchApi("/school_years/");
      // Django DRF renvoie parfois une pagination avec `results`
      setYears(data.results || data);
    } catch (e: any) {
      toast({ title: "Erreur", description: "Impossible de charger les années", variant: "destructive" });
    }
  };

  useEffect(() => { fetchYears(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetchApi(`/school_years/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(form)
        });
        toast({ title: "Année scolaire modifiée" });
      } else {
        await fetchApi("/school_years/", {
          method: "POST",
          body: JSON.stringify(form)
        });
        toast({ title: "Année scolaire créée" });
      }
      setOpen(false);
      setEditingId(null);
      setForm({ name: "", start_date: "", end_date: "", is_active: false });
      fetchYears();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (y: SchoolYear) => {
    setEditingId(y.id);
    setForm({
      name: y.name,
      start_date: y.start_date,
      end_date: y.end_date,
      is_active: y.is_active
    });
    setOpen(true);
  };

  const setActive = async (id: string) => {
    try {
      // Pour simuler la désactivation globale, il faudrait le faire côté backend
      // Mais on peut au moins Activer celle cliquée, et le serveur désactivera les autres idéalement
      // Ici on patch simplement celle qu'on veut activer (on suppose que le backend fera le reste)
      await fetchApi(`/school_years/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: true })
      });
      toast({ title: "Année activée" });
      fetchYears();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/school_years/${id}/`, { method: "DELETE" });
      toast({ title: "Supprimée" }); 
      fetchYears();
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Années Scolaires</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) { setEditingId(null); setForm({ name: "", start_date: "", end_date: "", is_active: false }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle année</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Modifier l'année scolaire" : "Nouvelle année scolaire"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year_name">Nom</Label>
                <Input id="year_name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2025-2026" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Date début</Label>
                <Input id="start_date" name="start_date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Date fin</Label>
                <Input id="end_date" name="end_date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full shadow-playful">{editingId ? "Sauvegarder" : "Créer"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {years.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Aucune année scolaire.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((y) => (
                <TableRow key={y.id}>
                  <TableCell className="font-medium">{y.name}</TableCell>
                  <TableCell>{y.start_date}</TableCell>
                  <TableCell>{y.end_date}</TableCell>
                  <TableCell>
                    {y.is_active ? (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-bold">Active</span>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setActive(y.id)}>
                        <Check className="h-3 w-3 mr-1" /> Activer
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(y)}>
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(y.id)}>
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

export default SchoolYears;
