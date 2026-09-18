import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Trash2, AlertCircle, DollarSign, Search, Edit, Download, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  student: string;
  student_name: string;
  student_class_name: string;
  amount: string;
  payment_type: string;
  method: string;
  reference: string | null;
  date: string;
  notes: string | null;
  receipt_number?: string;
}
interface StudentItem { id: string; first_name: string; last_name: string; class_name: string; }

const TYPE_LABELS: Record<string, string> = { MINERVAL: "Frais Scolaires", INSCRIPTION: "Inscription", AUTRE: "Autre Frais" };
const METHOD_LABELS: Record<string, string> = { CASH: "Espèces", BANK: "Banque", MOBILE_MONEY: "Mobile Money" };
const TYPE_COLORS: Record<string, string> = { MINERVAL: "bg-letter-green", INSCRIPTION: "bg-letter-blue", AUTRE: "bg-letter-orange" };

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPayment, setSearchPayment] = useState("");
  const [selectedStudentFilter, setSelectedStudentFilter] = useState("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState("ALL");
  const [modalClassFilter, setModalClassFilter] = useState("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ student: "", amount: "", payment_type: "MINERVAL", method: "CASH", reference: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        fetchApi("/payments/"), 
        fetchApi("/students/"),
        fetchApi("/classes/").catch(() => [])
      ]);
      setPayments(pRes.results || pRes);
      setStudents(sRes.results || sRes);
      setClasses(cRes.results || cRes);
    } catch { toast.error("Erreur de chargement"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, student: form.student, amount: parseFloat(form.amount), reference: form.reference || null, notes: form.notes || null };
    try {
      if (editingId) {
        await fetchApi(`/payments/${editingId}/`, { method: "PATCH", body: JSON.stringify(payload)});
        toast.success("Paiement mis à jour !");
      } else {
        await fetchApi("/payments/", { method: "POST", body: JSON.stringify(payload)});
        toast.success("Paiement enregistré !");
      }
      setOpen(false);
      setEditingId(null);
      setForm({ student: "", amount: "", payment_type: "MINERVAL", method: "CASH", reference: "", date: new Date().toISOString().split("T")[0], notes: "" });
      fetchAll();
    } catch (err: any) { 
      if (err.message?.includes("404") || err.message?.includes("Not Found")) {
        toast.info("Ce paiement n'existe plus en base de données.");
        setOpen(false);
        setEditingId(null);
        fetchAll();
      } else {
        toast.error(err.message || "Erreur lors de l'enregistrement du paiement"); 
      }
    }
  };

  const handleEdit = (p: Payment) => {
    setEditingId(p.id);
    setForm({
      student: String(p.student),
      amount: p.amount,
      payment_type: p.payment_type,
      method: p.method,
      reference: p.reference || "",
      date: p.date,
      notes: p.notes || ""
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Annuler ce paiement ?")) return;
    try { 
      await fetchApi(`/payments/${id}/`, { method: "DELETE" }); 
      toast.success("Paiement supprimé"); 
      fetchAll(); 
    } catch (e: any) { 
      if (e.message?.includes("404") || e.message?.includes("Not Found")) {
        toast.info("Ce paiement n'existe déjà plus.");
        fetchAll();
      } else {
        toast.error(e.message); 
      }
    }
  };

  const handleDownloadReceipt = (id: string, receiptNum: string) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/school/payments/${id}/export_receipt/`, '_blank');
  };

  const handleSendReminder = async () => {
    try {
      await fetchApi("/payments/send_reminders/", { method: "POST" });
      toast.success(`Rappels de paiement envoyés à tous les parents !`);
    } catch (err: any) {
      toast.error("Erreur lors de l'envoi des rappels : " + err.message);
    }
  };

  // Filtrer les élèves dans la modale de création de paiement par classe
  const modalFilteredStudents = students.filter(s => {
    if (modalClassFilter === "ALL") return true;
    return String(s.class_name) === modalClassFilter;
  });

  // Élèves disponibles dans le filtre principal (filtrés selon la classe sélectionnée si applicable)
  const filterAvailableStudents = students.filter(s => {
    if (selectedClassFilter === "ALL") return true;
    return String(s.class_name) === selectedClassFilter;
  });

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.student_name?.toLowerCase() || "").includes(searchPayment.toLowerCase()) || 
      (p.reference && p.reference.toLowerCase().includes(searchPayment.toLowerCase())) || 
      (p.receipt_number && p.receipt_number.toLowerCase().includes(searchPayment.toLowerCase()));
    const matchesClass = selectedClassFilter === "ALL" || p.student_class_name === selectedClassFilter;
    const matchesStudent = selectedStudentFilter === "ALL" || String(p.student) === selectedStudentFilter || p.student_name === selectedStudentFilter;
    const matchesType = selectedTypeFilter === "ALL" || p.payment_type === selectedTypeFilter;
    const matchesMethod = selectedMethodFilter === "ALL" || p.method === selectedMethodFilter;
    return matchesSearch && matchesClass && matchesStudent && matchesType && matchesMethod;
  });
  const totalCollected = filteredPayments.reduce((s, p) => s + parseFloat(p.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-letter-green" /> Gestion des Paiements
          </h1>
          <p className="font-body text-muted-foreground">Suivez les frais scolaires et les paiements des élèves.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-letter-green text-letter-green hover:bg-letter-green/10 rounded-2xl shadow-playful px-6 py-6" onClick={() => toast.success("Exportation PDF lancée...")}>
             <Download className="h-5 w-5 mr-2" /> <span className="font-display">Export</span>
           </Button>
           <Dialog open={open} onOpenChange={(v) => {setOpen(v); if(!v) { setEditingId(null); setModalClassFilter("ALL"); } }}>
             <DialogTrigger asChild>
               <Button className="bg-letter-green hover:bg-letter-green/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
                 <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Paiement</span>
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-lg">
               <DialogHeader><DialogTitle className="font-display">{editingId ? "Modifier le paiement" : "Enregistrer un paiement"}</DialogTitle></DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-4 mt-4">

                 {/* Filtre par classe pour trouver l'élève facilement */}
                 {!editingId && (
                   <div className="space-y-1">
                     <Label className="text-letter-purple font-bold">Filtrer par Classe (Optionnel)</Label>
                     <Select value={modalClassFilter} onValueChange={setModalClassFilter}>
                       <SelectTrigger className="bg-letter-purple/10 border-letter-purple/20"><SelectValue placeholder="Toutes les classes" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="ALL">Toutes les classes</SelectItem>
                         {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                       </SelectContent>
                     </Select>
                   </div>
                 )}

                 <div className="space-y-1">
                   <Label htmlFor="payment_student">Élève</Label>
                   <Select value={form.student} onValueChange={v => setForm({...form, student: v})} disabled={!!editingId}>
                     <SelectTrigger id="payment_student" name="student"><SelectValue placeholder="Sélectionner un élève" /></SelectTrigger>
                     <SelectContent>
                       {modalFilteredStudents.map(s => (
                         <SelectItem key={s.id} value={String(s.id)}>
                           {s.first_name} {s.last_name} ({s.class_name || "Non affecté"})
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-1">
                   <Label htmlFor="payment_amount">Montant (BIF)</Label>
                   <Input id="payment_amount" name="amount" type="number" placeholder="Montant (BIF)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <Label htmlFor="payment_type">Type</Label>
                     <Select value={form.payment_type} onValueChange={v => setForm({...form, payment_type: v})}>
                       <SelectTrigger id="payment_type" name="payment_type"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="MINERVAL">Frais Scolaires</SelectItem>
                         <SelectItem value="INSCRIPTION">Inscription</SelectItem>
                         <SelectItem value="AUTRE">Autre Frais</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-1">
                     <Label htmlFor="payment_method">Méthode</Label>
                     <Select value={form.method} onValueChange={v => setForm({...form, method: v})}>
                       <SelectTrigger id="payment_method" name="method"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="CASH">Espèces</SelectItem>
                         <SelectItem value="BANK">Banque</SelectItem>
                         <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
                 <div className="space-y-1">
                   <Label htmlFor="payment_date">Date</Label>
                   <Input id="payment_date" name="date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                 </div>
                 <div className="space-y-1">
                   <Label htmlFor="payment_reference">Référence (optionnel)</Label>
                   <Input id="payment_reference" name="reference" placeholder="Référence (optionnel)" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <Label htmlFor="payment_notes">Notes (optionnel)</Label>
                   <Input id="payment_notes" name="notes" placeholder="Notes (optionnel)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                 </div>
                  <Button type="submit" className="w-full bg-letter-green hover:bg-letter-green/90 rounded-xl font-display py-6 text-white shadow-playful">
                    {editingId ? "Mettre à jour le paiement" : "Confirmer le paiement"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3 border-none shadow-playful overflow-hidden">
             <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center flex-wrap">
                 <div className="relative flex-1 min-w-[200px] w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input className="pl-10 h-12 bg-muted/30 border-none rounded-2xl font-body" placeholder="Rechercher élève, réf..." value={searchPayment} onChange={e => setSearchPayment(e.target.value)} />
                 </div>

                 {/* Filtre Classe des Paiements */}
                 <div className="w-full md:w-auto min-w-[140px]">
                   <Select value={selectedClassFilter} onValueChange={(v) => { setSelectedClassFilter(v); setSelectedStudentFilter("ALL"); }}>
                     <SelectTrigger className="h-12 bg-muted/30 border-none rounded-2xl font-body text-xs">
                       <SelectValue placeholder="Toutes les classes" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ALL">Toutes les classes</SelectItem>
                       {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                     </SelectContent>
                   </Select>
                 </div>

                 {/* Filtre Élève des Paiements */}
                 <div className="w-full md:w-auto min-w-[150px]">
                   <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
                     <SelectTrigger className="h-12 bg-muted/30 border-none rounded-2xl font-body text-xs">
                       <SelectValue placeholder="Tous les élèves" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ALL">Tous les élèves</SelectItem>
                       {filterAvailableStudents.map(s => (
                         <SelectItem key={s.id} value={String(s.id)}>
                           {s.first_name} {s.last_name}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 {/* Filtre Type de Frais */}
                 <div className="w-full md:w-auto min-w-[160px]">
                   <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
                     <SelectTrigger className="h-14 bg-muted/30 border-none rounded-2xl font-body">
                       <SelectValue placeholder="Tous les types" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ALL">Tous les types</SelectItem>
                       <SelectItem value="MINERVAL">Frais Scolaires</SelectItem>
                       <SelectItem value="INSCRIPTION">Inscription</SelectItem>
                       <SelectItem value="AUTRE">Autre Frais</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 {/* Filtre Mode de Paiement */}
                 <div className="w-full md:w-auto min-w-[160px]">
                   <Select value={selectedMethodFilter} onValueChange={setSelectedMethodFilter}>
                     <SelectTrigger className="h-14 bg-muted/30 border-none rounded-2xl font-body">
                       <SelectValue placeholder="Tous les modes" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ALL">Tous les modes</SelectItem>
                       <SelectItem value="CASH">Espèces</SelectItem>
                       <SelectItem value="BANK">Banque</SelectItem>
                       <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
             </CardContent>
          </Card>
          <Card className="border-none shadow-playful bg-letter-green text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                <DollarSign className="h-24 w-24" />
            </div>
            <CardContent className="flex flex-col justify-center h-full py-4 relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-80">Total Perçu</p>
                <p className="text-2xl font-display">{totalCollected.toLocaleString()} <span className="text-xs font-body">BIF</span></p>
            </CardContent>
          </Card>
      </div>

      <Card className="border-none shadow-playful overflow-hidden mt-4">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-16 bg-muted/10">
              <CreditCard className="h-12 w-12 text-letter-green/40 mx-auto mb-4" />
              <p className="font-bold text-muted-foreground">Aucun paiement trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30"><TableRow>
                <TableHead className="px-6 py-4">Date</TableHead><TableHead>Élève</TableHead>
                <TableHead>Type</TableHead><TableHead className="text-right">Montant</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredPayments.map(p => (
                  <TableRow key={p.id} className="hover:bg-muted/20 border-border/50">
                    <TableCell className="px-6 py-4 text-xs font-bold">{new Date(p.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <p className="font-bold">{p.student_name}</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.student_class_name} • {METHOD_LABELS[p.method]}</p>
                    </TableCell>
                    <TableCell><Badge className={`${TYPE_COLORS[p.payment_type]||"bg-muted"} text-white text-[10px] shadow-sm border-none`}>{TYPE_LABELS[p.payment_type]}</Badge></TableCell>
                    <TableCell className="text-right font-display text-lg text-primary">{parseFloat(p.amount).toLocaleString()} <span className="text-[10px] text-muted-foreground font-body">BIF</span></TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-letter-blue" onClick={() => handleDownloadReceipt(p.id, p.receipt_number || '')} title="Télécharger le reçu">
                             <FileText className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-letter-orange" onClick={() => handleSendReminder()} title="Envoyer des rappels à tous">
                             <Bell className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
