import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface TimetableEntry {
  id: number;
  class_name: string;
  subject_name: string;
  teacher_name: string;
  day: number;
  day_display: string;
  start_time: string;
  end_time: string;
  classroom: string;
}

const DAY_COLORS: Record<string, string> = {
  "Lundi": "bg-letter-blue text-white",
  "Mardi": "bg-letter-green text-white",
  "Mercredi": "bg-letter-orange text-white",
  "Jeudi": "bg-letter-purple text-white",
  "Vendredi": "bg-letter-pink text-white",
  "Samedi": "bg-muted-foreground text-white",
};

const TeacherPlanning = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/timetable/");
        setEntries(data.results || data);
      } catch (e: any) {
        toast.error("Impossible de charger le planning");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group entries by day
  const grouped = entries.reduce((acc, entry) => {
    const day = entry.day_display;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  const dayOrder = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Calendar className="h-8 w-8 text-letter-blue" />
            Mon Planning
          </h1>
          <p className="font-body text-muted-foreground">Votre emploi du temps hebdomadaire.</p>
        </div>
        <Button 
          className="bg-letter-blue hover:bg-letter-blue/90 text-white rounded-2xl shadow-playful px-6 py-6"
          onClick={() => toast.info("Cette fonctionnalité sera bientôt disponible. Contactez l'admin pour modifier votre planning.")}
        >
          <Plus className="h-5 w-5 mr-2" /> Proposer un Créneau
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}</div>
      ) : entries.length === 0 ? (
        <Card className="border-none shadow-playful">
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <Calendar className="h-12 w-12 text-letter-blue/40 mb-4" />
              <p className="font-bold text-lg text-foreground">Aucun créneau configuré</p>
              <p className="text-sm mt-1">L'administration n'a pas encore configuré votre emploi du temps.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {dayOrder.filter(d => grouped[d]).map(day => (
            <Card key={day} className="border-none shadow-playful overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="font-display flex items-center gap-2">
                  <Badge className={`${DAY_COLORS[day] || "bg-muted"} font-display text-sm px-4 py-1`}>{day}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time)).map(entry => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
                      <div className="text-center flex-shrink-0 w-24">
                        <p className="font-display text-sm">{entry.start_time?.slice(0, 5)}</p>
                        <p className="text-xs text-muted-foreground">à {entry.end_time?.slice(0, 5)}</p>
                      </div>
                      <div className="h-10 w-1 bg-letter-blue/30 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{entry.subject_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.class_name} {entry.classroom ? `• ${entry.classroom}` : ""}</p>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherPlanning;
