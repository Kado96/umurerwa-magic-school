import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const SchoolYears = () => {
  const [years, setYears] = useState<Tables<"school_years">[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "" });

  const fetchYears = async () => {
    const { data } = await supabase.from("school_years").select("*").order("start_date", { ascending: false });
    setYears(data || []);
  };

  useEffect(() => { fetchYears(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("school_years").insert(form);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Année scolaire créée" });
      setOpen(false);
      setForm({ name: "", start_date: "", end_date: "" });
      fetchYears();
    }
  };

  const setActive = async (id: string) => {
    await supabase.from("school_years").update({ is_active: false }).neq("id", id);
    await supabase.from("school_years").update({ is_active: true }).eq("id", id);
    fetchYears();
    toast({ title: "Année activée" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("school_years").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { toast({ title: "Supprimée" }); fetchYears(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Années Scolaires</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvelle année</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle année scolaire</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2025-2026" required />
              </div>
              <div className="space-y-2">
                <Label>Date début</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Date fin</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Créer</Button>
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
                  <TableCell className="text-right">
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
