import { useEffect, useState } from "react";
import { fetchApi, fetchFile } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle, TrendingUp, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Grade {
  id: number;
  student: number;
  student_name: string;
  subject_name: string;
  subject_coefficient: number;
  term_name: string;
  value: string;
  max_value: string;
  comment: string;
  date: string;
}

interface Student { id: number; first_name: string; last_name: string; }
interface Term { id: number; name: string; }

const ChildrenGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gData, sData, tData] = await Promise.all([
          fetchApi("/grades/"),
          fetchApi("/students/"),
          fetchApi("/terms/")
        ]);
        setGrades(gData.results || gData);
        setStudents(sData.results || sData);
        setTerms(tData.results || tData);
      } catch (e: any) {
        toast.error("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (studentId: number, termId: number, studentName: string, termName: string) => {
    const key = `${studentId}-${termId}`;
    setDownloading(key);
    try {
      const blob = await fetchFile(`/students/${studentId}/export_bulletin/?term_id=${termId}`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bulletin_${studentName.replace(' ', '_')}_${termName.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Téléchargement lancé");
    } catch (e) {
      toast.error("Échec du téléchargement du bulletin");
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (value: string, max: string) => {
     try {
       const ratio = parseFloat(value) / parseFloat(max);
       if (ratio >= 0.8) return "bg-letter-green text-white";
       if (ratio >= 0.6) return "bg-letter-blue text-white";
       if (ratio >= 0.5) return "bg-letter-orange text-white";
       return "bg-destructive text-destructive-foreground";
     } catch {
       return "bg-muted text-muted-foreground";
     }
  };

  const getStatusText = (value: string, max: string) => {
     try {
       const ratio = parseFloat(value) / parseFloat(max);
       if (ratio >= 0.8) return "Très Bien";
       if (ratio >= 0.6) return "Assez Bien";
       if (ratio >= 0.5) return "Passable";
       return "Insuffisant";
     } catch {
       return "-";
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-letter-purple" />
            Notes & Résultats
          </h1>
          <p className="font-body text-muted-foreground">Consultez les dernières notes de vos enfants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-playful">
            <CardHeader>
               <CardTitle className="font-display flex items-center gap-2 text-letter-purple text-lg">
                 <TrendingUp className="h-5 w-5" /> 
                 Notes Récentes
               </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                 </div>
              ) : grades.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground flex flex-col justify-center items-center">
                  <AlertCircle className="h-10 w-10 text-letter-purple/50 mb-4" />
                  <p className="font-bold text-lg text-foreground">Aucune note pour le moment</p>
                </div>
              ) : (
                 <Table>
                    <TableHeader>
                      <TableRow>
                         <TableHead>Élève</TableHead>
                         <TableHead>Matière</TableHead>
                         <TableHead className="text-right">Note</TableHead>
                         <TableHead className="text-center">Éval.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {grades.map(grade => (
                          <TableRow key={grade.id} className="hover:bg-muted/30">
                             <TableCell className="font-medium">{grade.student_name}</TableCell>
                             <TableCell>
                               <Badge variant="outline" className="font-normal font-body border-letter-purple/20 text-letter-purple text-[10px]">
                                  {grade.subject_name}
                               </Badge>
                             </TableCell>
                             <TableCell className="text-right font-display whitespace-nowrap">
                                <span className="font-bold">{parseFloat(grade.value)}</span>
                                <span className="text-[10px] text-muted-foreground">/{parseFloat(grade.max_value)}</span>
                             </TableCell>
                             <TableCell className="text-center">
                                <Badge className={`font-body text-[9px] ${getStatusColor(grade.value, grade.max_value)}`}>
                                   {getStatusText(grade.value, grade.max_value)}
                                </Badge>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-playful">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-letter-green text-lg">
                <FileText className="h-5 w-5" /> 
                Télécharger les Bulletins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                [1,2].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
              ) : students.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">Aucun bulletin disponible</p>
              ) : (
                students.map(s => (
                  <div key={s.id} className="p-4 rounded-3xl bg-muted/20 border border-transparent hover:border-letter-green/20 transition-all">
                    <p className="font-bold text-sm mb-3">{s.first_name} {s.last_name}</p>
                    <div className="grid grid-cols-1 gap-2">
                       {terms.map(t => (
                         <Button
                           key={t.id}
                           variant="outline"
                           size="sm"
                           className="justify-between group hover:border-letter-green hover:bg-letter-green/5 text-xs h-9 rounded-xl"
                           onClick={() => handleDownload(s.id, t.id, `${s.first_name} ${s.last_name}`, t.name)}
                           disabled={downloading === `${s.id}-${t.id}`}
                         >
                           <span>{t.name}</span>
                           <Download className="h-3 w-3 text-letter-green group-hover:scale-125 transition-transform" />
                         </Button>
                       ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildrenGrades;
