import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target_role: "ALL" | "PARENT" | "TEACHER";
  created_at: string;
}

const ParentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/announcements/");
        setAnnouncements(data.results || data);
      } catch (e: any) {
        toast.error("Impossible de charger les annonces");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-letter-orange" />
            Annonces
          </h1>
          <p className="font-body text-muted-foreground">Annonces et communications officielles de l'école.</p>
        </div>
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
              <p className="font-bold text-lg text-foreground">Aucune annonce</p>
              <p className="text-sm mt-1">Les communications de l'école s'afficheront ici.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <Card key={ann.id} className="border-none shadow-playful hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-letter-orange" />
                  {ann.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{new Date(ann.created_at).toLocaleDateString()}</p>
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

export default ParentAnnouncements;
