import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Inbox, Send, Plus, Shield, Search, Users, GraduationCap, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: string;
  sender_name: string;
  receiver: string;
  receiver_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [contentInput, setContentInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "TEACHER" | "PARENT" | "ADMIN">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const [msgRes, contactsRes] = await Promise.all([
        fetchApi("/messages/"),
        fetchApi("/messages/contacts/")
      ]);
      setMessages(msgRes.results || msgRes);
      setContacts(contactsRes || []);
      if (!selectedContact && contactsRes.length > 0) {
        setSelectedContact(contactsRes[0].id);
      }
    } catch {
      toast.error("Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (receiverId: string, text: string) => {
    if (!receiverId || !text.trim()) return;
    setSending(true);
    try {
      await fetchApi("/messages/", {
        method: "POST",
        body: JSON.stringify({ receiver: receiverId, content: text })
      });
      toast.success("Message envoyé !");
      setContentInput("");
      setOpen(false);
      fetchData();
    } catch {
      toast.error("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.role === activeTab;
    const matchesSearch = searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const conversation = messages.filter(
    (m) => String(m.sender) === selectedContact || String(m.receiver) === selectedContact
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-amber-500" />
            Messagerie Direction & Administration
          </h1>
          <p className="font-body text-slate-600">
            Échangez directement avec les professeurs, les parents d'élèves et le personnel.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl shadow-md px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" />
              <span className="font-display">Nouveau Message</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-slate-900">Nouveau Message Direct</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(selectedContact, contentInput); }}
              className="space-y-4 mt-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Choisir le destinataire</label>
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger className="rounded-xl border-slate-300">
                    <SelectValue placeholder="Choisir un destinataire" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.role_display})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Message</label>
                <Textarea
                  placeholder="Tapez votre message..."
                  className="min-h-[120px] rounded-xl border-slate-300"
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={sending} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl py-6">
                <Send className="mr-2 h-4 w-4" /> {sending ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-230px)]">
        
        {/* Colonne Liste des contacts avec Onglets de Filtrage Rôle & Recherche */}
        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col md:col-span-1 bg-white rounded-3xl">
          
          {/* Header avec Onglets Filtres (Professeurs / Parents / Admin / Tous) */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input 
                placeholder="Chercher un contact..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs rounded-xl border-slate-200 bg-white"
              />
            </div>

            <div className="flex bg-slate-200/80 p-1 rounded-2xl text-[11px] font-bold">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`flex-1 py-1.5 rounded-xl transition-all ${activeTab === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Tous ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab("TEACHER")}
                className={`flex-1 py-1.5 rounded-xl transition-all ${activeTab === "TEACHER" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Profs ({contacts.filter(c => c.role === 'TEACHER').length})
              </button>
              <button
                onClick={() => setActiveTab("PARENT")}
                className={`flex-1 py-1.5 rounded-xl transition-all ${activeTab === "PARENT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Parents ({contacts.filter(c => c.role === 'PARENT').length})
              </button>
            </div>
          </div>

          <CardContent className="p-2 flex-1 overflow-y-auto space-y-1">
            {loading ? (
              <div className="space-y-2 p-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}</div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="h-8 w-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs">Aucun contact dans cette catégorie</p>
              </div>
            ) : (
              filteredContacts.map((c) => {
                const isSelected = selectedContact === c.id;
                return (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedContact(c.id)}
                    className={`w-full text-left p-3 rounded-2xl flex flex-col transition-all border ${
                      isSelected 
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md" 
                        : "hover:bg-slate-100/80 border-transparent text-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm leading-tight">{c.name}</span>
                      <Badge className={`text-[9px] border-none px-2 py-0.5 ${
                        isSelected 
                          ? "bg-slate-950 text-white" 
                          : c.role === 'TEACHER' ? "bg-blue-100 text-blue-800" : c.role === 'PARENT' ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {c.role_display}
                      </Badge>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Zone de Chat de la Conversation */}
        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col md:col-span-2 bg-white rounded-3xl">
          <CardHeader className="border-b bg-slate-50 py-4 px-6">
            <CardTitle className="font-display text-base text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-amber-500" />
                <span>{contacts.find((c) => c.id === selectedContact)?.name || "Sélectionnez un destinataire"}</span>
              </div>
              {selectedContact && (
                <Badge className="bg-amber-500/20 text-amber-800 border border-amber-500/30 text-xs font-mono">
                  {contacts.find((c) => c.id === selectedContact)?.role_display}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            {loading ? (
              <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-3/4 rounded-2xl" />)}</div>
            ) : conversation.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-slate-400 opacity-60 py-12">
                <Inbox className="h-12 w-12 mb-3 text-amber-400" />
                <p className="font-bold text-base text-slate-700">Aucun message échangé pour le moment</p>
                <p className="text-xs">Tapez votre premier message ci-dessous pour démarrer la discussion.</p>
              </div>
            ) : (
              conversation.map((msg) => {
                const isMine = String(msg.sender) !== selectedContact;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%] space-y-1">
                      <div className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{isMine ? "Direction (Vous)" : msg.sender_name}</span>
                        <span className="text-[9px] text-slate-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className={`p-4 rounded-3xl shadow-sm font-body text-sm leading-relaxed ${
                        isMine ? "bg-amber-500 text-slate-950 rounded-tr-none font-medium" : "bg-white rounded-tl-none text-slate-900 border border-slate-200"
                      }`}>{msg.content}</div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(selectedContact, contentInput); }} className="p-4 bg-white border-t border-slate-200 flex gap-2">
            <Input
              className="rounded-xl border-slate-200 bg-slate-50 shadow-inner h-12 text-sm"
              placeholder={selectedContact ? "Écrivez votre message..." : "Sélectionnez un destinataire"}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              disabled={!selectedContact}
            />
            <Button type="submit" disabled={!selectedContact || !contentInput.trim() || sending} className="rounded-xl px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminMessages;
