import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  class_name: string;
}

interface TeacherData {
  classes_display: string[];
  subjects_display: string[];
}

const MyClasses = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/students/");
        setStudents(data.results || data);
      } catch (e: any) {
        toast.error("Impossible de charger les élèves");
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
            <Users className="h-8 w-8 text-letter-green" />
            Mes Classes & Élèves
          </h1>
          <p className="font-body text-muted-foreground">Liste des élèves inscrits dans vos classes.</p>
        </div>
        <Button 
          className="bg-letter-green hover:bg-letter-green/90 text-white rounded-2xl shadow-playful px-6 py-6"
          onClick={() => window.location.href = '/teacher/inscription'}
        >
          <Plus className="h-5 w-5 mr-2" /> Inscrire un Élève
        </Button>
      </div>

      <Card className="border-none shadow-playful">
        <CardHeader>
          <CardTitle className="font-display">Mes Élèves</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Vous n'avez aucun élève assigné à vos classes pour le moment.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Classe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.last_name}</TableCell>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-letter-green/10 text-letter-green rounded-full text-xs font-bold">
                        {student.class_name}
                      </span>
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

export default MyClasses;
