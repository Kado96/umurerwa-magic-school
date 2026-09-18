import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceRecord {
  id: number;
  date: string;
  is_present: boolean;
  remark: string | null;
  student_name: string;
}

const ParentAttendance = () => {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Le backend filtre déjà par rapport à l'utilisateur connecté (Parent)
        const data = await fetchApi("/attendances/");
        setAttendances(data.results || data);
      } catch (err) {
        toast.error("Erreur de chargement des absences");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAbsences = attendances.filter(a => !a.is_present).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-letter-pink" />
            Suivi de l'Assiduité
          </h1>
          <p className="font-body text-muted-foreground">Consultez les présences et absences de vos enfants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-playful bg-letter-pink/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-letter-pink/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-letter-pink" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Total Absences</p>
              <p className="text-2xl font-display text-letter-pink">{totalAbsences}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-playful bg-letter-green/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-letter-green/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-letter-green" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">État Général</p>
              <p className="text-2xl font-display text-letter-green">{totalAbsences === 0 ? "Excellent" : totalAbsences < 3 ? "Régulier" : "À surveiller"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-playful overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="font-display text-lg">Historique des présences</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
             <div className="p-6 space-y-4">
               {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
             </div>
          ) : attendances.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
               <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p className="font-display text-xl">Aucune absence signalée</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-6 py-4">Date</TableHead>
                  <TableHead>Enfant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Motif / Remarque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((att) => (
                  <TableRow key={att.id} className="hover:bg-muted/10">
                    <TableCell className="px-6 py-4 font-bold">{new Date(att.date).toLocaleDateString()}</TableCell>
                    <TableCell>{att.student_name}</TableCell>
                    <TableCell>
                      {att.is_present ? (
                        <Badge className="bg-letter-green/20 text-letter-green hover:bg-letter-green/20 border-none">Présent</Badge>
                      ) : (
                        <Badge className="bg-letter-pink/20 text-letter-pink hover:bg-letter-pink/20 border-none shadow-sm animate-pulse">Absent</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm italic text-muted-foreground">{att.remark || "N/A"}</TableCell>
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

export default ParentAttendance;
