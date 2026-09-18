import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Attendance {
  id: number;
  student: number;
  student_name: string;
  date: string;
  is_present: boolean;
  remark: string;
}

const ChildrenAttendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/attendances/");
        setAttendances(data.results || data);
      } catch (e: any) {
        toast.error("Impossible de charger les présences");
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
            <CheckCircle className="h-8 w-8 text-letter-pink" />
            Suivi des Présences
          </h1>
          <p className="font-body text-muted-foreground">Consultez l'historique d'assiduité de vos enfants.</p>
        </div>
      </div>

      <Card className="border-none shadow-playful">
        <CardHeader>
           <CardTitle className="font-display flex items-center gap-2 text-letter-pink text-lg">
             <CheckCircle className="h-5 w-5" /> 
             Derniers Appels
           </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
             </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground flex flex-col justify-center items-center">
              <CheckCircle className="h-10 w-10 text-letter-pink/50 mb-4" />
              <p className="font-bold text-lg text-foreground">Aucun appel enregistré pour le moment</p>
              <p className="text-sm mt-1">L'historique des présences de vos enfants s'affichera ici.</p>
            </div>
          ) : (
             <Table>
                <TableHeader>
                  <TableRow>
                     <TableHead className="w-[150px]">Date</TableHead>
                     <TableHead>Élève concerné</TableHead>
                     <TableHead className="text-center">Statut</TableHead>
                     <TableHead>Remarquess / Retards</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {attendances.map(att => (
                      <TableRow key={att.id} className="hover:bg-muted/30 transition-colors">
                         <TableCell className="font-display text-sm">
                            {new Date(att.date).toLocaleDateString(undefined, {
                               weekday: 'long',
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric',
                            })}
                         </TableCell>
                         <TableCell className="font-bold text-foreground">{att.student_name}</TableCell>
                         <TableCell className="text-center">
                            {att.is_present ? (
                               <Badge className="bg-letter-green text-white font-body">Présent</Badge>
                            ) : (
                               <Badge variant="destructive" className="font-body flex items-center justify-center gap-1 w-max mx-auto">
                                  <XCircle className="h-3 w-3" /> Absent
                               </Badge>
                            )}
                         </TableCell>
                         <TableCell className="text-sm text-muted-foreground italic truncate max-w-[200px]">
                           {att.remark ? (
                              <span className="flex items-center gap-1 text-letter-orange font-medium">
                                 <AlertCircle className="h-4 w-4" /> {att.remark}
                              </span>
                           ) : "-"}
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

export default ChildrenAttendance;
