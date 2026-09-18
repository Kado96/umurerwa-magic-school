import { useEffect, useState } from "react";
import { fetchAccountsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, Shield, ShieldAlert, ShieldCheck, Mail, User, Trash2, Key, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserItem {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_display: string;
  is_active: boolean;
  photo?: string;
}

const ROLE_ICONS: Record<string, any> = {
  "ADMIN": ShieldAlert,
  "TEACHER": ShieldCheck,
  "PARENT": Shield,
};

const ROLE_COLORS: Record<string, string> = {
  "ADMIN": "bg-destructive text-destructive-foreground",
  "TEACHER": "bg-letter-orange text-white",
  "PARENT": "bg-letter-blue text-white",
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState({ 
    username: "", email: "", password: "", first_name: "", last_name: "", role: "PARENT", photo: "" 
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAccountsApi("/users/");
      setUsers(data.results || data);
    } catch (e: any) {
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAccountsApi("/register/", {
        method: "POST",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          role_input: form.role,
          photo: form.photo
        })
      });
      toast.success("Utilisateur créé avec succès !");
      setOpen(false);
      setForm({ username: "", email: "", password: "", first_name: "", last_name: "", role: "PARENT", photo: "" });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Erreur de validation. Vérifiez les champs fournis.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await fetchAccountsApi(`/users/${selectedUser.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
           email: form.email,
           first_name: form.first_name,
           last_name: form.last_name,
           role_input: form.role,
           photo: form.photo
         })
      });
      toast.success("Utilisateur mis à jour !");
      setEditOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEdit = (user: UserItem) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "", // Pas de modif MDP ici
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      photo: user.photo || ""
    });
    setEditOpen(true);
  };

  const openResetPwd = (user: UserItem) => {
    setSelectedUser(user);
    setNewPassword("");
    setResetPwdOpen(true);
  };

  const handleResetPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await fetchAccountsApi(`/users/${selectedUser.id}/set_password/`, {
        method: "POST",
        body: JSON.stringify({ password: newPassword })
      });
      toast.success(`Mot de passe réinitialisé pour ${selectedUser.username}`);
      setResetPwdOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) return;
    try {
      await fetchAccountsApi(`/users/${id}/`, { method: "DELETE" });
      toast.success("Utilisateur supprimé avec succès.");
      fetchUsers();
    } catch (e: any) {
      if (e.message?.includes("404") || e.status === 404) {
        toast.info("Cet utilisateur n'existe déjà plus.");
        fetchUsers();
      } else {
        toast.error(e.message || "Impossible de supprimer cet utilisateur (enregistrements liés).");
      }
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await fetchAccountsApi(`/users/${user.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !user.is_active })
      });
      toast.success(`Utilisateur ${user.is_active ? 'désactivé' : 'activé'}`);
      fetchUsers();
    } catch (e: any) { toast.error(e.message); }
  };

  const filtered = users.filter(u => {
    const matchesSearch = ((u.username || "") + (u.first_name || "") + (u.last_name || "") + (u.email || "")).toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-letter-purple" />
            Comptes & Accès
          </h1>
          <p className="font-body text-muted-foreground">Gérez les accès, les rôles et la sécurité des utilisateurs.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-letter-purple hover:bg-letter-purple/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Compte</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-display">Créer un utilisateur</DialogTitle>
               <DialogDescription className="sr-only">Formulaire permettant de créer un nouvel utilisateur du système</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input id="first_name" name="first_name" placeholder="Prénom" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input id="last_name" name="last_name" placeholder="Nom" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
                  </div>
               </div>
               <div className="space-y-1">
                 <Label htmlFor="username">Nom d'utilisateur</Label>
                 <Input id="username" name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="email">Email</Label>
                 <Input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="password">Mot de passe</Label>
                 <Input id="password" name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
               </div>
               <div className="space-y-1">
                 <Label htmlFor="role">Rôle</Label>
                 <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                   <SelectTrigger id="role" name="role"><SelectValue placeholder="Rôle" /></SelectTrigger>
                   <SelectContent>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="TEACHER">Professeur</SelectItem>
                      <SelectItem value="PARENT">Parent</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-1">
                 <Label htmlFor="photo_url">URL de la photo (Optionnel)</Label>
                 <Input id="photo_url" name="photo" placeholder="URL de la photo (Optionnel)" value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} />
               </div>
                 {form.photo && (
                   <div className="flex justify-center">
                     <img src={form.photo} alt="Aperçu" className="h-16 w-16 rounded-xl object-cover border-2 border-letter-purple/20" />
                   </div>
                 )}
               <Button type="submit" className="w-full bg-letter-purple hover:bg-letter-purple/90 rounded-xl font-display py-6 text-white shadow-playful">Créer le compte</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
             <DialogTitle className="font-display">Modifier l'utilisateur</DialogTitle>
             <DialogDescription className="sr-only">Formulaire permettant de modifier un utilisateur existant</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit_first_name">Prénom</Label>
                  <Input id="edit_first_name" name="first_name" placeholder="Prénom" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit_last_name">Nom</Label>
                  <Input id="edit_last_name" name="last_name" placeholder="Nom" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit_email">Email</Label>
                <Input id="edit_email" name="email" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit_role">Rôle</Label>
                <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                  <SelectTrigger id="edit_role" name="role"><SelectValue placeholder="Rôle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="TEACHER">Professeur</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit_photo">URL de la photo</Label>
                <Input id="edit_photo" name="photo" placeholder="URL de la photo" value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-letter-purple hover:bg-letter-purple/90 rounded-xl font-display py-6 text-white shadow-playful">Mettre à jour</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={resetPwdOpen} onOpenChange={setResetPwdOpen}>
        <DialogContent>
          <DialogHeader>
             <DialogTitle className="font-display">Changer le mot de passe</DialogTitle>
             <DialogDescription className="sr-only">Formulaire permettant de réinitialiser le mot de passe d'un utilisateur</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPwd} className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                 Vous vous apprêtez à réinitialiser le mot de passe de <span className="font-bold">{selectedUser?.username}</span>.
              </p>
              <div className="space-y-1">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <Input id="new_password" name="password" type="text" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 rounded-xl font-display py-6 text-white shadow-playful">
                 Confirmer le nouveau mot de passe
              </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 bg-card border-none rounded-2xl shadow-playful" 
            placeholder="Rechercher par nom, email ou pseudo..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
           <SelectTrigger className="h-12 bg-card border-none rounded-2xl shadow-playful">
             <SelectValue placeholder="Filtrer par rôle" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">Tous les rôles</SelectItem>
             <SelectItem value="ADMIN">Administrateurs</SelectItem>
             <SelectItem value="TEACHER">Professeurs</SelectItem>
             <SelectItem value="PARENT">Parents</SelectItem>
           </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-playful overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-display">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Email / Contact</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
                ) : (
                  filtered.map(user => {
                    const RoleIcon = ROLE_ICONS[user.role] || User;
                    return (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                           <div className={`h-10 w-10 rounded-xl ${ROLE_COLORS[user.role] || 'bg-muted'} flex items-center justify-center font-bold overflow-hidden border border-white shadow-sm`}>
                               {user.photo ? (
                                 <img src={user.photo} alt={user.username} className="h-full w-full object-cover" />
                               ) : (
                                 user.username[0].toUpperCase()
                               )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{user.first_name} {user.last_name}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <Mail className="h-3 w-3" /> {user.email || "Non renseigné"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`${ROLE_COLORS[user.role] || 'bg-muted'} border-none shadow-sm`}>
                            <RoleIcon className="h-3 w-3 mr-1" /> {user.role_display}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              user.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {user.is_active ? "Actif" : "Inactif"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => openEdit(user)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-letter-purple" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => openResetPwd(user)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-letter-purple" title="Réinitialiser le MDP">
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDelete(user.id)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default UserManagement;
