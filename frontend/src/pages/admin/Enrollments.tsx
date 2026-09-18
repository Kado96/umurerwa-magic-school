import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Trash2, Search, Filter, Edit, User, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Enrollment {
  id: number | string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  gender_display?: string;
  target_class: number | string;
  target_class_name?: string;
  school_year?: number | string;
  school_year_name?: string;
  photo?: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  status: string;
  status_display?: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-letter-orange text-white",
  APPROVED: "bg-letter-blue text-white",
  REJECTED: "bg-destructive text-white",
  COMPLETED: "bg-letter-green text-white",
};

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [schoolYears, setSchoolYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal d'édition
  const [editingItem, setEditingItem] = useState<Enrollment | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "M",
    birth_date: "",
    target_class: "",
    school_year: "",
    photo: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    address: "",
    status: "PENDING"
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [enRes, clRes, syRes] = await Promise.all([
        fetchApi("/enrollments/"),
        fetchApi("/classes/").catch(() => []),
        fetchApi("/school_years/").catch(() => [])
      ]);
      setEnrollments(enRes.results || enRes);
      setClasses(clRes.results || clRes);
      setSchoolYears(syRes.results || syRes);
    } catch { toast.error("Erreur de chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openEdit = (item: Enrollment) => {
    setEditingItem(item);
    setFormData({
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      gender: item.gender || "M",
      birth_date: item.birth_date || "",
      target_class: String(item.target_class || ""),
      school_year: String(item.school_year || ""),
      photo: item.photo || "",
      parent_name: item.parent_name || "",
      parent_email: item.parent_email || "",
      parent_phone: item.parent_phone || "",
      address: item.address || "",
      status: item.status || "PENDING"
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      await fetchApi(`/enrollments/${editingItem.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formData,
          target_class: formData.target_class ? Number(formData.target_class) : null,
          school_year: formData.school_year ? Number(formData.school_year) : null,
        })
      });
      toast.success("Demande d'inscription modifiée avec succès !");
      setEditOpen(false);
      fetchAll();
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cette demande n'existe plus.");
        setEditOpen(false);
        fetchAll();
      } else {
        toast.error(e.message || "Erreur lors de la modification");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: number | string) => {
    try {
      await fetchApi(`/enrollments/${id}/approve/`, { method: "POST" });
      toast.success("Inscription approuvée ! L'élève a été créé automatiquement.");
      fetchAll();
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cette demande n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleReject = async (id: number | string) => {
    try {
      await fetchApi(`/enrollments/${id}/`, { method: "PATCH", body: JSON.stringify({ status: "REJECTED" }) });
      toast.success("Inscription refusée.");
      fetchAll();
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cette demande n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message);
      }
    }
  };

  const handlePending = async (id: number | string) => {
    try {
      await fetchApi(`/enrollments/${id}/`, { method: "PATCH", body: JSON.stringify({ status: "PENDING" }) });
      toast.success("Demande remise en attente.");
      fetchAll();
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cette demande n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message);
      }
    }
  };

  const handleDelete = async (id: number | string) => {
    try { 
      await fetchApi(`/enrollments/${id}/`, { method: "DELETE" }); 
      toast.success("Demande supprimée"); 
      fetchAll(); 
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cette demande a déjà été supprimée.");
        fetchAll();
      } else {
        toast.error(e.message);
      }
    }
  };

  const pendingCount = enrollments.filter(e => e.status === "PENDING").length;

  const filteredEnrollments = enrollments.filter(en => {
    const text = `${en.first_name} ${en.last_name} ${en.parent_name} ${en.parent_email} ${en.parent_phone}`.toLowerCase();
    const matchesSearch = search === "" || text.includes(search.toLowerCase());
    const matchesClass = filterClass === "all" || String(en.target_class) === filterClass || en.target_class_name === filterClass;
    const matchesYear = filterYear === "all" || String(en.school_year) === filterYear || en.school_year_name === filterYear;
    const matchesStatus = filterStatus === "all" || en.status === filterStatus;
    return matchesSearch && matchesClass && matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-letter-purple" /> Demandes d'Inscription
          </h1>
          <p className="font-body text-muted-foreground">Validez, modifiez ou refusez les demandes d'inscription en ligne.</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-letter-orange text-white text-sm px-4 py-2 font-display">
            <Clock className="h-4 w-4 mr-2" /> {pendingCount} en attente
          </Badge>
        )}
      </div>

      {/* Barre de filtres */}
      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-purple" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher élève, parent, tel..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10"
          />
        </div>

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

        <div className="min-w-[140px]">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Toutes années" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {schoolYears.map(sy => <SelectItem key={sy.id} value={String(sy.id)}>{sy.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="PENDING">⏳ En attente</SelectItem>
              <SelectItem value="APPROVED">✅ Approuvé</SelectItem>
              <SelectItem value="REJECTED">❌ Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground" 
          onClick={() => { setSearch(""); setFilterClass("all"); setFilterYear("all"); setFilterStatus("all"); }}>
          Réinitialiser
        </Button>
      </div>

      <Card className="border-none shadow-playful">
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <FileText className="h-12 w-12 text-letter-purple/40 mx-auto mb-4" />
              <p className="font-bold text-lg text-foreground">Aucune demande trouvée</p>
              <p className="text-sm mt-1">Modifiez vos filtres de recherche.</p>
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Élève</TableHead>
                <TableHead>Année Scolaire</TableHead>
                <TableHead>Classe visée</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredEnrollments.map(en => (
                  <TableRow key={en.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="h-10 w-10 rounded-full bg-letter-purple/10 flex items-center justify-center overflow-hidden border border-border">
                        {en.photo ? (
                          <img src={en.photo} alt="Photo" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-letter-purple" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(en.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold">{en.first_name} {en.last_name}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-muted/50 text-[11px]">{en.school_year_name || "Non spécifiée"}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="font-body text-primary border-primary/30">{en.target_class_name || "Non définie"}</Badge></TableCell>
                    <TableCell className="text-sm">{en.parent_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{en.parent_phone}</TableCell>
                    <TableCell><Badge className={`${STATUS_COLORS[en.status]||"bg-muted"} text-[10px]`}>{en.status_display || en.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1.5 justify-end flex-wrap items-center">
                        <Button size="sm" variant="ghost" className="h-8 px-3 rounded-xl bg-letter-blue/10 text-letter-blue hover:bg-letter-blue hover:text-white transition-all text-xs font-body flex items-center gap-1" onClick={() => openEdit(en)}>
                          <Edit className="h-3.5 w-3.5" /> Modifier
                        </Button>
                        {en.status !== "APPROVED" && en.status !== "COMPLETED" && (
                          <Button size="sm" className="bg-letter-green hover:bg-letter-green/90 text-white rounded-xl h-8 px-3 text-xs flex items-center gap-1 shadow-sm" onClick={() => handleApprove(en.id)}>
                            <CheckCircle className="h-3.5 w-3.5" /> Approuver
                          </Button>
                        )}
                        {en.status !== "REJECTED" && (
                          <Button size="sm" variant="destructive" className="rounded-xl h-8 px-3 text-xs flex items-center gap-1 shadow-sm" onClick={() => handleReject(en.id)}>
                            <XCircle className="h-3.5 w-3.5" /> Refuser
                          </Button>
                        )}
                        {en.status !== "PENDING" && (
                          <Button size="sm" variant="outline" className="border-letter-orange text-letter-orange hover:bg-letter-orange/10 rounded-xl h-8 px-3 text-xs flex items-center gap-1 shadow-sm" onClick={() => handlePending(en.id)}>
                            <Clock className="h-3.5 w-3.5" /> En attente
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 rounded-xl h-8 px-2 text-xs flex items-center gap-1" onClick={() => handleDelete(en.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition complète de la demande d'inscription */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl rounded-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2 text-letter-blue">
              <Edit className="h-6 w-6" /> Édition Complète de l'Inscription
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 font-body text-sm">

            {/* Photo Preview & URL */}
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-2xl border border-muted">
              <div className="h-16 w-16 rounded-full bg-letter-purple/20 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                {formData.photo ? (
                  <img src={formData.photo} alt="Aperçu" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-letter-purple" />
                )}
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> URL de la Photo
                </label>
                <Input 
                  placeholder="https://exemple.com/photo.jpg ou chemin média" 
                  value={formData.photo} 
                  onChange={e => setFormData({...formData, photo: e.target.value})} 
                  className="rounded-xl mt-1 h-9 text-xs" 
                />
              </div>
            </div>

            {/* Informations Élève */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Prénom de l'élève</label>
                <Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Nom de l'élève</label>
                <Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="rounded-xl mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Sexe</label>
                <Select value={formData.gender} onValueChange={v => setFormData({...formData, gender: v})}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Date de naissance</label>
                <Input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="rounded-xl mt-1" />
              </div>
            </div>

            {/* Affectation Scolaire */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Classe visée</label>
                <Select value={formData.target_class} onValueChange={v => setFormData({...formData, target_class: v})}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Sélectionner classe" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Année Académique</label>
                <Select value={formData.school_year} onValueChange={v => setFormData({...formData, school_year: v})}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Sélectionner année" /></SelectTrigger>
                  <SelectContent>
                    {schoolYears.map(sy => <SelectItem key={sy.id} value={String(sy.id)}>{sy.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Statut de la demande */}
            <div>
              <label className="text-xs font-bold text-muted-foreground">Statut de l'inscription</label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">⏳ En attente</SelectItem>
                  <SelectItem value="APPROVED">✅ Approuvé (Crée l'élève)</SelectItem>
                  <SelectItem value="REJECTED">❌ Refusé</SelectItem>
                  <SelectItem value="COMPLETED">🎉 Inscrit / Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <hr className="border-border/50 my-2" />

            {/* Informations Parent */}
            <div>
              <label className="text-xs font-bold text-muted-foreground">Nom complet du parent</label>
              <Input value={formData.parent_name} onChange={e => setFormData({...formData, parent_name: e.target.value})} className="rounded-xl mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Téléphone parent</label>
                <Input value={formData.parent_phone} onChange={e => setFormData({...formData, parent_phone: e.target.value})} className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Email parent</label>
                <Input value={formData.parent_email} onChange={e => setFormData({...formData, parent_email: e.target.value})} className="rounded-xl mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground">Adresse résidentielle</label>
              <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-xl mt-1" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-xl">Annuler</Button>
            <Button onClick={handleSaveEdit} disabled={saving} className="bg-letter-blue hover:bg-letter-blue/90 text-white rounded-xl">
              {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEnrollments;
