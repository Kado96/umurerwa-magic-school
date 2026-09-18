import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Inbox, Send, AlertCircle, Plus, ArrowLeft, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface UserItem {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

const ParentMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [contentInput, setContentInput] = useState("");
  const [sending, setSending] = useState(false);

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
    } catch (e: any) {
      toast.error("Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Polling toutes les 4s pour le temps réel
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
    } catch (error: any) {
      toast.error("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Inbox className="h-8 w-8 text-letter-purple" />
            Messagerie Directe
          </h1>
          <p className="font-body text-muted-foreground">Échangez en direct avec les professeurs et la Direction.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-letter-purple hover:bg-letter-purple/90 text-white rounded-2xl shadow-playful px-6 py-6 flex gap-2">
              <Plus className="h-5 w-5" /> <span className="font-display">Nouveau Message</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Envoyer un message</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(selectedContact, contentInput); }} className="space-y-4 mt-4">
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger><SelectValue placeholder="Choisir un destinataire" /></SelectTrigger>
                <SelectContent>
                  {contacts.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.role_display})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Votre message..."
                className="min-h-[120px]"
                value={contentInput}
                onChange={e => setContentInput(e.target.value)}
                required
              />
              <Button type="submit" disabled={sending} className="w-full bg-letter-purple hover:bg-letter-purple/90 rounded-xl font-display">
                <Send className="mr-2 h-4 w-4" /> {sending ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Liste des contacts */}
        <Card className="border-none shadow-md overflow-hidden flex flex-col md:col-span-1 bg-white">
          <CardHeader className="border-b bg-slate-50 py-4">
            <CardTitle className="font-display text-base text-slate-800">Interlocuteurs (Profs & Direction)</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto space-y-1">
            {contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Aucun contact trouvé</p>
            ) : (
              contacts.map(c => {
                const isSelected = selectedContact === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContact(c.id)}
                    className={`w-full text-left p-3 rounded-2xl flex flex-col transition-all ${
                      isSelected ? "bg-letter-purple text-white shadow-md" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className={`text-[11px] ${isSelected ? "text-purple-200" : "text-slate-400"}`}>{c.role_display}</span>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Zone de discussion */}
        <Card className="border-none shadow-md overflow-hidden flex flex-col md:col-span-2 bg-white">
          <CardHeader className="border-b bg-slate-50 py-4 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base text-slate-800 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-letter-purple" />
              {contacts.find(c => c.id === selectedContact)?.name || "Discussion"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-3/4 rounded-2xl" />)}
              </div>
            ) : messages.filter(m => String(m.sender) === selectedContact || String(m.receiver) === selectedContact).length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-muted-foreground opacity-50 py-12">
                <Inbox className="h-12 w-12 mb-3 text-letter-purple" />
                <p className="font-bold text-base">Aucune conversation récente</p>
                <p className="text-xs">Tapez votre message ci-dessous pour démarrer l'échange.</p>
              </div>
            ) : (
              messages
                .filter(m => String(m.sender) === selectedContact || String(m.receiver) === selectedContact)
                .map((msg) => {
                  const isMine = String(msg.sender) !== selectedContact;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[80%] space-y-1">
                        <div className={`flex items-center gap-2 mb-1 ${isMine ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{isMine ? "Vous" : msg.sender_name}</span>
                          <span className="text-[9px] text-slate-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-4 rounded-3xl shadow-sm font-body text-sm ${
                          isMine ? "bg-letter-purple text-white rounded-tr-none" : "bg-slate-100 rounded-tl-none text-slate-900 border"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>

          {/* Saisie directe */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(selectedContact, contentInput); }}
            className="p-4 bg-slate-50 border-t flex gap-2"
          >
            <Input
              className="rounded-xl border-slate-200 bg-white shadow-inner h-12 text-sm"
              placeholder="Écrivez votre message ici..."
              value={contentInput}
              onChange={e => setContentInput(e.target.value)}
              disabled={!selectedContact}
            />
            <Button type="submit" disabled={!selectedContact || !contentInput.trim() || sending} className="rounded-xl px-6 bg-letter-purple hover:bg-letter-purple/90 text-white h-12">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ParentMessages;
