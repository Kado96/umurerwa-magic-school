import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  category_display: string;
  target_class_name: string | null;
  target_role: "ALL" | "TEACHER" | "PARENT";
  author_name: string;
  created_at: string;
}

interface ClassItem { id: number; name: string; }

const CATEGORIES = [
  { value: "GENERAL", label: "Information" },
  { value: "HOMEWORK", label: "Devoir" },
  { value: "EXAM", label: "Examen" },
  { value: "MEETING", label: "Réunion" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "GENERAL": "bg-letter-blue",
  "HOMEWORK": "bg-letter-orange",
  "EXAM": "bg-destructive",
  "MEETING": "bg-letter-purple",
};

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "GENERAL", target_class: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [annRes, clsRes] = await Promise.all([
        fetchApi("/announcements/"),
        fetchApi("/classes/") 
      ]);
      setAnnouncements(annRes.results || annRes);
      setClasses(clsRes.results || clsRes);
      

    } catch (e: any) {
      toast.error("Impossible de charger les annonces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/announcements/", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          category: form.category,
          target_class: form.target_class ? parseInt(form.target_class) : null,
        })
      });
      toast.success("Annonce publiée !");
      setOpen(false);
      setForm({ title: "", content: "", category: "GENERAL", target_class: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchApi(`/announcements/${id}/`, { method: "DELETE" });
      toast.success("Annonce supprimée");
      fetchData();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-letter-orange" />
            Annonces & Devoirs
          </h1>
          <p className="font-body text-muted-foreground">Communiquez avec vos classes et consultez les notes de l'école.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-letter-orange hover:bg-letter-orange/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouvelle Annonce</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Publier une annonce</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input placeholder="Titre (ex: Devoir de Math)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <Textarea placeholder="Contenu de l'annonce..." className="min-h-[100px]" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.target_class} onValueChange={v => setForm({...form, target_class: v})}>
                  <SelectTrigger><SelectValue placeholder="Classe" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toute l'école</SelectItem>
                    {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-letter-orange hover:bg-letter-orange/90 rounded-xl font-display">Publier</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
      ) : announcements.length === 0 ? (
        <Card className="border-none shadow-playful">
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-letter-orange/40 mb-4" />
              <p className="font-bold text-lg text-foreground">Aucune annonce pour le moment</p>
              <p className="text-sm mt-1">Les annonces de l'école apparaîtront ici.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <Card key={ann.id} className="border-none shadow-playful group relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-1.5 h-full ${CATEGORY_COLORS[ann.category] || "bg-muted"}`} />
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    {ann.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${CATEGORY_COLORS[ann.category] || "bg-muted"} text-white text-[10px] uppercase font-body`}>
                      {ann.category_display}
                    </Badge>
                     {ann.target_class_name && (
                      <Badge variant="outline" className="text-[10px] font-body">{ann.target_class_name}</Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">le {new Date(ann.created_at).toLocaleDateString()} par {ann.author_name}</span>
                  </div>
                </div>
                {/* On ne permet de supprimer que ses propres annonces (logique simplifiée ici) */}
                <button onClick={() => handleDelete(ann.id)} className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-body text-muted-foreground whitespace-pre-line">{ann.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
