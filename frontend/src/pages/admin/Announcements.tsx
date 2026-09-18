import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Plus, Trash2, Bell, Send, Edit, Search, Image as ImageIcon, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: string;
  created_at: string;
  author_name?: string;
  image_url?: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", target_role: "ALL", image_url: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/announcements/");
      setAnnouncements(data.results || data);
    } catch {
      toast.error("Impossible de charger les annonces et articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetchApi(`/announcements/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(form)
        });
        toast.success("Article / Annonce mis à jour avec succès !");
      } else {
        await fetchApi("/announcements/", {
          method: "POST",
          body: JSON.stringify(form)
        });
        toast.success("Nouvel article / annonce publié avec succès !");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ title: "", content: "", target_role: "ALL", image_url: "" });
      fetchData();
    } catch {
      toast.error("Échec de l'opération.");
    }
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setForm({
      title: ann.title,
      content: ann.content,
      target_role: ann.target_role,
      image_url: ann.image_url || ""
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Êtes-vous sûr de vouloir supprimer cet article / annonce ?")) return;
    try {
      await fetchApi(`/announcements/${id}/`, { method: "DELETE" });
      toast.success("Article / Annonce supprimé");
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const text = `${a.title} ${a.content}`.toLowerCase();
    const matchesSearch = search === "" || text.includes(search.toLowerCase());
    const matchesRole = filterRole === "ALL" || a.target_role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-body max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-500" />
            Gestion du Blog & de l'Info Défilante (France 24)
          </h1>
          <p className="font-body text-slate-600">
            Publiez et modifiez en temps réel les articles du blog ainsi que le bandeau d'actualités défilant en bas du site.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) { setEditingId(null); setForm({ title: "", content: "", target_role: "ALL", image_url: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl shadow-lg px-6 py-6 flex gap-2 font-bold">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Message / Article</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2 text-slate-900">
                <Bell className="h-5 w-5 text-amber-500" /> 
                {editingId ? "Éditer l'Article / Annonce" : "Créer un Article / Annonce"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Titre de l'article / de l'annonce</label>
                <Input 
                  placeholder="Ex: Inscription Année Scolaire 2025-2026..." 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  required 
                  className="rounded-xl border-slate-300 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Contenu / Message défilant</label>
                <textarea 
                  placeholder="Tapez votre texte ici. Ce texte apparaîtra dans le Blog et défilera sur le bandeau France 24..." 
                  value={form.content} 
                  onChange={e => setForm({...form, content: e.target.value})} 
                  required 
                  className="w-full min-h-32 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-body text-sm"
                />
              </div>
              
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-amber-500" /> Photo d'Arrière-Plan du Blog (Optionnel)
                </label>
                <Input 
                  placeholder="URL d'image ou choisir un fichier ci-dessous..." 
                  value={form.image_url} 
                  onChange={e => setForm({...form, image_url: e.target.value})} 
                  className="rounded-xl border-slate-300 text-xs bg-white"
                />
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 py-1.5 px-3 rounded-xl cursor-pointer shadow-sm">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-800" />
                  <span>Téléverser depuis mon PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, image_url: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Diffusion & Visibilité</label>
                <Select value={form.target_role} onValueChange={v => setForm({...form, target_role: v})}>
                  <SelectTrigger className="rounded-xl border-slate-300">
                    <SelectValue placeholder="Choisir la cible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">🌐 Tout le monde (Blog Public & Bandeau France 24)</SelectItem>
                    <SelectItem value="TEACHER">👨‍🏫 Professeurs uniquement (Interne)</SelectItem>
                    <SelectItem value="PARENT">👨‍👩‍👧 Parents uniquement (Interne)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 font-bold rounded-xl flex gap-2 py-6 text-slate-950 shadow-md">
                <Send className="h-4 w-4" /> {editingId ? "Enregistrer les modifications" : "Publier maintenant"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de Recherche et Filtre */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher par titre ou mot clé..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 bg-slate-50 h-10 font-body text-sm"
          />
        </div>

        <div className="min-w-[220px]">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10 text-xs">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous (Public Blog & Bandeau)</SelectItem>
              <SelectItem value="TEACHER">Professeurs</SelectItem>
              <SelectItem value="PARENT">Parents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cartes d'articles publiées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-3xl" />)
        ) : filteredAnnouncements.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
             <Megaphone className="h-12 w-12 mx-auto opacity-30 mb-3" />
             <p className="font-display text-lg text-slate-700 font-bold">Aucun article publié pour le moment.</p>
             <p className="text-xs text-slate-500 mt-1">Cliquez sur "Nouveau Message / Article" pour créer votre première annonce défilante ou article de blog.</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const bgImg = item.image_url || `https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop`;
            const isPublic = !item.target_role || item.target_role === "ALL";
            return (
              <Card key={item.id} className="relative border-none shadow-lg rounded-3xl overflow-hidden h-80 flex flex-col justify-end group">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${bgImg}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/30" />

                <CardContent className="relative z-10 p-5 flex flex-col justify-end h-full">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge className={`font-bold border-none text-[10px] ${isPublic ? "bg-amber-500 text-slate-950" : "bg-blue-600 text-white"}`}>
                        {isPublic ? "🌐 Blog & Bandeau France 24" : item.target_role}
                      </Badge>
                      <span className="text-[10px] text-amber-200/90 font-mono font-medium">
                        {new Date(item.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="font-body text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="pt-3 mt-2 border-t border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold">
                        <Radio className="h-3 w-3 animate-pulse text-red-500" />
                        <span>Direction</span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="h-8 px-3 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold shadow"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Éditer
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 px-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold shadow"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Suppr.
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Announcements;
