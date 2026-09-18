import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Plus, Trash2, AlertCircle, Search, User, Filter, Calendar, Edit, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Salary {
  id: string;
  teacher?: string;
  teacher_name: string;
  employee_name?: string;
  role_type?: string;
  role_type_display?: string;
  month: string;
  base_salary: string;
  bonus: string;
  deductions: string;
  status: string;
  payment_method: string;
}
interface TeacherItem { id: string; user_details: { username: string; first_name: string; last_name: string; }; }

const ROLE_LABELS: Record<string, string> = {
  TEACHER: "Professeur",
  SECRETARY: "Secrétaire",
  STAFF: "Personnel / Platon",
  ACCOUNTANT: "Comptable",
  DIRECTOR: "Directeur",
  OTHER: "Autre Personnel",
};

const ROLE_COLORS: Record<string, string> = {
  TEACHER: "bg-letter-orange/10 text-letter-orange border-letter-orange/30",
  SECRETARY: "bg-letter-blue/10 text-letter-blue border-letter-blue/30",
  STAFF: "bg-letter-purple/10 text-letter-purple border-letter-purple/30",
  ACCOUNTANT: "bg-letter-green/10 text-letter-green border-letter-green/30",
  DIRECTOR: "bg-letter-rose/10 text-letter-rose border-letter-rose/30",
  OTHER: "bg-muted text-muted-foreground",
};

const AdminSalaries = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSalary, setSearchSalary] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [form, setForm] = useState({ 
    teacher: "", 
    employee_name: "",
    role_type: "TEACHER",
    month: currentMonth, 
    base_salary: "", 
    bonus: "0", 
    deductions: "0", 
    payment_method: "BANK" 
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([fetchApi("/salaries/"), fetchApi("/teachers/")]);
      setSalaries(sRes.results || sRes);
      setTeachers(tRes.results || tRes);
    } catch { toast.error("Erreur de chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...form, 
      teacher: form.teacher || null,
      employee_name: form.employee_name || null,
      base_salary: parseFloat(form.base_salary), 
      bonus: parseFloat(form.bonus), 
      deductions: parseFloat(form.deductions) 
    };
    try {
      if (editingId) {
        await fetchApi(`/salaries/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        toast.success("Salaire mis à jour !");
      } else {
        await fetchApi("/salaries/", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Salaire enregistré !");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ teacher: "", employee_name: "", role_type: "TEACHER", month: currentMonth, base_salary: "", bonus: "0", deductions: "0", payment_method: "BANK" });
      fetchAll();
    } catch (err: any) { 
      if (err.message?.includes("404") || err.message?.includes("Not Found")) {
        toast.info("Cette fiche de salaire n'existe plus en base de données.");
        setOpen(false);
        setEditingId(null);
        fetchAll();
      } else {
        toast.error(err.message || "Erreur lors de l'enregistrement du salaire"); 
      }
    }
  };

  const handleEdit = (s: Salary) => {
    setEditingId(s.id);
    setForm({
      teacher: s.teacher ? String(s.teacher) : "",
      employee_name: s.employee_name || s.teacher_name || "",
      role_type: s.role_type || "TEACHER",
      month: s.month,
      base_salary: s.base_salary,
      bonus: s.bonus,
      deductions: s.deductions,
      payment_method: s.payment_method
    });
    setOpen(true);
  };

  const handlePay = async (id: string) => {
    try {
      await fetchApi(`/salaries/${id}/`, { method: "PATCH", body: JSON.stringify({ status: "PAID" }) });
      toast.success("Salaire marqué comme payé !");
      fetchAll();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    try { 
      await fetchApi(`/salaries/${id}/`, { method: "DELETE" }); 
      toast.success("Salaire supprimé"); 
      fetchAll(); 
    } catch (e: any) { 
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Ce salaire n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message); 
      }
    }
  };

  const filteredSalaries = salaries.filter(s => {
    const nameToSearch = (s.employee_name || s.teacher_name || "").toLowerCase();
    const matchesSearch = nameToSearch.includes(searchSalary.toLowerCase()) || s.month.includes(searchSalary);
    const matchesRole = filterRole === "all" || s.role_type === filterRole;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesMethod = filterMethod === "all" || s.payment_method === filterMethod;
    return matchesSearch && matchesRole && matchesStatus && matchesMethod;
  });

  const totalPending = filteredSalaries.filter(s => s.status === "PENDING").reduce((a, s) => a + parseFloat(s.base_salary) + parseFloat(s.bonus) - parseFloat(s.deductions), 0);
  const totalPaid = salaries.filter(s => s.status === "PAID").reduce((a, s) => a + parseFloat(s.base_salary) + parseFloat(s.bonus) - parseFloat(s.deductions), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Banknote className="h-8 w-8 text-letter-orange" /> Gestion des Salaires du Personnel
          </h1>
          <p className="font-body text-muted-foreground">Gérez la paie mensuelle des professeurs, secrétaires, platons et tout le personnel.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) { setEditingId(null); setForm({ teacher: "", employee_name: "", role_type: "TEACHER", month: currentMonth, base_salary: "", bonus: "0", deductions: "0", payment_method: "BANK" }); } }}>
          <DialogTrigger asChild>
            <Button className="bg-letter-orange hover:bg-letter-orange/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Salaire</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-3xl">
            <DialogHeader><DialogTitle className="font-display">{editingId ? "Modifier le salaire" : "Enregistrer une paie"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-body text-sm">
              
              {/* Type de poste / rôle */}
              <div>
                <label className="text-xs font-bold text-muted-foreground">Poste / Fonction</label>
                <Select value={form.role_type} onValueChange={v => setForm({...form, role_type: v, teacher: v === 'TEACHER' ? form.teacher : ""})}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">👨‍🏫 Professeur</SelectItem>
                    <SelectItem value="SECRETARY">👩‍💼 Secrétaire</SelectItem>
                    <SelectItem value="STAFF">🧹 Personnel d'Appui / Platon</SelectItem>
                    <SelectItem value="ACCOUNTANT">📊 Comptable</SelectItem>
                    <SelectItem value="DIRECTOR">🎓 Directeur</SelectItem>
                    <SelectItem value="OTHER">👤 Autre Personnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection Professeur ou Nom Libre */}
              {form.role_type === "TEACHER" ? (
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Sélectionner un professeur</label>
                  <Select value={form.teacher} onValueChange={v => setForm({...form, teacher: v, employee_name: ""})}>
                    <SelectTrigger className="rounded-xl mt-1"><SelectValue placeholder="Choisir un professeur" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map(t => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.user_details.first_name} {t.user_details.last_name || t.user_details.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Nom et prénom de l'employé</label>
                  <Input 
                    placeholder="Ex: Jean Nkurunziza (Secrétaire)" 
                    value={form.employee_name} 
                    onChange={e => setForm({...form, employee_name: e.target.value})} 
                    className="rounded-xl mt-1" 
                    required 
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Mois de Paie</label>
                  <Input type="month" value={form.month} onChange={e => setForm({...form, month: e.target.value})} required className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Salaire de base (BIF)</label>
                  <Input type="number" placeholder="Montant BIF" value={form.base_salary} onChange={e => setForm({...form, base_salary: e.target.value})} required className="rounded-xl mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Bonus / Primes (BIF)</label>
                  <Input type="number" placeholder="0" value={form.bonus} onChange={e => setForm({...form, bonus: e.target.value})} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Déductions / Retenues (BIF)</label>
                  <Input type="number" placeholder="0" value={form.deductions} onChange={e => setForm({...form, deductions: e.target.value})} className="rounded-xl mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Mode de Règlement</label>
                <Select value={form.payment_method} onValueChange={v => setForm({...form, payment_method: v})}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">🏛️ Virement Bancaire</SelectItem>
                    <SelectItem value="CASH">💵 Espèces</SelectItem>
                    <SelectItem value="MOBILE_MONEY">📱 Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-letter-orange hover:bg-letter-orange/90 rounded-xl font-display py-6 text-white shadow-playful mt-2">
                {editingId ? "Enregistrer les modifications" : "Enregistrer la paie"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de filtres */}
      <div className="bg-card p-4 rounded-3xl shadow-playful flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-letter-orange" />
          <span className="text-sm font-bold">Filtres:</span>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom de personnel ou mois (ex: 2026-03)..." 
            value={searchSalary}
            onChange={e => setSearchSalary(e.target.value)}
            className="pl-9 rounded-xl border-muted bg-muted/20 h-10 font-body text-xs"
          />
        </div>

        {/* Filtre par Poste / Rôle */}
        <div className="min-w-[150px]">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10 text-xs">
              <SelectValue placeholder="Tous les postes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les postes</SelectItem>
              <SelectItem value="TEACHER">👨‍🏫 Professeurs</SelectItem>
              <SelectItem value="SECRETARY">👩‍💼 Secrétaires</SelectItem>
              <SelectItem value="STAFF">🧹 Personnel d'Appui / Platon</SelectItem>
              <SelectItem value="ACCOUNTANT">📊 Comptables</SelectItem>
              <SelectItem value="DIRECTOR">🎓 Directeurs</SelectItem>
              <SelectItem value="OTHER">👤 Autre Personnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[130px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10 text-xs">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="PENDING">⏳ En attente</SelectItem>
              <SelectItem value="PAID">✅ Payé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[130px]">
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="rounded-xl border-muted bg-muted/20 h-10 text-xs">
              <SelectValue placeholder="Tous modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous modes</SelectItem>
              <SelectItem value="BANK">🏛️ Virement</SelectItem>
              <SelectItem value="CASH">💵 Espèces</SelectItem>
              <SelectItem value="MOBILE_MONEY">📱 Mobile Money</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground text-xs" 
          onClick={() => { setSearchSalary(""); setFilterRole("all"); setFilterStatus("all"); setFilterMethod("all"); }}>
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-playful bg-letter-orange text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                <Banknote className="h-24 w-24" />
            </div>
            <CardContent className="flex flex-col justify-center h-full py-4 relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-80">En attente</p>
                <p className="text-2xl font-display">{totalPending.toLocaleString()} <span className="text-xs font-body">BIF</span></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-playful bg-letter-green text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                <Filter className="h-24 w-24" />
            </div>
            <CardContent className="flex flex-col justify-center h-full py-4 relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-80">Total Payé</p>
                <p className="text-2xl font-display">{totalPaid.toLocaleString()} <span className="text-xs font-body">BIF</span></p>
            </CardContent>
          </Card>
      </div>

      <Card className="border-none shadow-playful">
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : salaries.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <Banknote className="h-12 w-12 text-letter-orange/40 mx-auto mb-4" />
              <p className="font-bold text-lg text-foreground">Aucun salaire enregistré</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-6 py-4">Mois</TableHead>
                  <TableHead>Employé / Personnel</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead className="text-right">Net à Payer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalaries.map(s => {
                  const net = parseFloat(s.base_salary) + parseFloat(s.bonus) - parseFloat(s.deductions);
                  const roleKey = s.role_type || "TEACHER";
                  const roleLabel = ROLE_LABELS[roleKey] || s.role_type_display || "Personnel";
                  const roleColor = ROLE_COLORS[roleKey] || ROLE_COLORS.OTHER;
                  
                  return (
                    <TableRow key={s.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                      <TableCell className="px-6 py-4 font-display text-muted-foreground">{s.month}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <div className="h-7 w-7 rounded-full bg-letter-orange/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-letter-orange" />
                           </div>
                           <span className="font-bold">
                             {s.employee_name || (s.teacher_name && s.teacher_name !== "N/A" ? s.teacher_name : (() => {
                               const found = teachers.find(t => String(t.id) === String(s.teacher));
                               if (found && found.user_details) {
                                 const full = `${found.user_details.first_name} ${found.user_details.last_name}`.trim();
                                 return full || found.user_details.username;
                               }
                               return "Personnel";
                             })())}
                           </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${roleColor} text-[10px] font-body uppercase font-bold`}>
                          {roleLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-display text-lg font-bold">
                        {net.toLocaleString()} <span className="text-[10px] text-muted-foreground font-body">BIF</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${s.status === "PAID" ? "bg-letter-green" : "bg-letter-orange"} text-white text-[10px] shadow-sm border-none px-3`}>
                          {s.status === "PAID" ? "Payé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end items-center">
                          {s.status === "PENDING" && (
                            <Button size="sm" className="bg-letter-green hover:bg-letter-green/90 text-white rounded-xl h-8 px-4 text-xs font-display" onClick={() => handlePay(s.id)}>
                              Payer
                            </Button>
                          )}
                          <button onClick={() => handleEdit(s)} className="p-2 text-primary/40 hover:text-primary transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2 text-destructive/40 hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSalaries;
