import { useEffect, useState } from "react";
import { fetchApi, fetchFile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Save, FileText, Download, ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string;
  student_class: string;
}

interface Term {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

const Grades = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"entry" | "bulletins">("entry");
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [downloading, setDownloading] = useState<string | null>(null);
  
  const [gradesInput, setGradesInput] = useState<{ [key: string]: { id?: string, value: string, max_value: string, comment: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, termsRes, subjectsRes] = await Promise.all([
          fetchApi("/students/"),
          fetchApi("/terms/"),
          fetchApi("/subjects/")
        ]);
        setStudents(studentsRes.results || studentsRes);
        setTerms(termsRes.results || termsRes);
        setSubjects(subjectsRes.results || subjectsRes);
      } catch (e: any) {
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchExistingGrades = async () => {
      if (!selectedClassId || !selectedTermId || !selectedSubjectId || mode !== "entry") return;
      try {
        const data = await fetchApi(`/grades/?student__student_class=${selectedClassId}&term=${selectedTermId}&subject=${selectedSubjectId}`);
        const existingGrades = data.results || data;
        
        const newInput: any = {};
        existingGrades.forEach((g: any) => {
          newInput[g.student] = {
            id: g.id, // On stocke l'ID pour savoir si c'est un UPDATE ou POST
            value: String(g.value),
            max_value: String(g.max_value),
            comment: g.comment || ""
          };
        });
        setGradesInput(newInput);
      } catch (e) {
        console.error("Erreur récupération notes:", e);
      }
    };
    fetchExistingGrades();
  }, [selectedClassId, selectedTermId, selectedSubjectId, mode]);

  const uniqueClasses = Array.from(new Set(students.map(s => s.student_class))).map(classId => {
    const s = students.find(st => st.student_class === classId);
    return { id: classId, name: s?.class_name || "Inconnu" };
  });

  const filteredStudents = selectedClassId 
    ? students.filter(s => String(s.student_class) === selectedClassId)
    : [];

  const handleGradeChange = (studentId: string, field: string, val: string) => {
    setGradesInput(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        value: prev[studentId]?.value || "",
        max_value: prev[studentId]?.max_value || "20",
        comment: prev[studentId]?.comment || "",
        [field]: val
      }
    }));
  };

  const handleSaveGrades = async () => {
    if (!selectedTermId || !selectedSubjectId || !selectedClassId) {
      toast.error("Veuillez sélectionner une période, une matière et une classe.");
      return;
    }

    const payload = Object.entries(gradesInput)
      .filter(([_, data]) => data.value !== "")
      .map(([studentId, data]) => ({
        student: studentId,
        term: selectedTermId,
        subject: selectedSubjectId,
        value: parseFloat(data.value),
        max_value: parseFloat(data.max_value || "20"),
        comment: data.comment,
        date: new Date().toISOString().split('T')[0]
      }));

    if (payload.length === 0) {
      toast.info("Aucune nouvelle note à enregistrer.");
      return;
    }

    try {
      await Promise.all(payload.map(grade => {
        const studentGradesData = gradesInput[grade.student];
        if (studentGradesData?.id) {
           return fetchApi(`/grades/${studentGradesData.id}/`, {
             method: "PATCH",
             body: JSON.stringify(grade)
           });
        }
        return fetchApi("/grades/", {
          method: "POST",
          body: JSON.stringify(grade)
        });
      }));
      toast.success("Notes enregistrées avec succès !");
    } catch (e: any) {
      toast.error("Erreur lors de l'enregistrement des notes.");
    }
  };

  const downloadBulletin = async (studentId: string, studentName: string) => {
    if (!selectedTermId) {
      toast.error("Veuillez sélectionner une période.");
      return;
    }
    setDownloading(studentId);
    try {
      const termName = terms.find(t => String(t.id) === selectedTermId)?.name || "Trimestre";
      const blob = await fetchFile(`/students/${studentId}/export_bulletin/?term_id=${selectedTermId}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bulletin_${studentName.replace(/\s+/g, '_')}_${termName.replace(/\s+/g, '_')}.pdf`;
      a.click();
      toast.success("Bulletin téléchargé");
    } catch (e) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-letter-orange" />
            Espace Évaluations
          </h1>
          <p className="font-body text-muted-foreground">Saisie des notes et génération des bulletins.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="bg-letter-orange hover:bg-letter-orange/90 text-white rounded-2xl shadow-playful px-6 py-6"
            onClick={() => setMode("entry")}
          >
            <Plus className="h-5 w-5 mr-2" /> Nouvelle Note
          </Button>
          <div className="flex bg-card p-1 rounded-2xl shadow-playful border border-border/50">
            <Button 
              variant={mode === "entry" ? "default" : "ghost"} 
              className={cn("rounded-lg font-display", mode === "entry" ? "bg-letter-orange text-white" : "")}
              onClick={() => setMode("entry")}
            >
              <ListChecks className="mr-2 h-4 w-4" /> Saisie
            </Button>
            <Button 
              variant={mode === "bulletins" ? "default" : "ghost"} 
              className={cn("rounded-lg font-display", mode === "bulletins" ? "bg-letter-blue text-white" : "")}
              onClick={() => setMode("bulletins")}
            >
              <FileText className="mr-2 h-4 w-4" /> Bulletins
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-playful bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold">Classe</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls.id} value={String(cls.id)}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold">Trimestre / Période</label>
              <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le trimestre" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {mode === "entry" && (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-bold">Matière</label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner la matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {mode === "entry" ? (
            !selectedClassId || !selectedSubjectId || !selectedTermId ? (
              <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                Sélectionnez une classe, un trimestre et une matière pour commencer la saisie.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Élève</TableHead>
                        <TableHead className="w-[120px]">Note (/20)</TableHead>
                        <TableHead className="w-[120px]">Sur (/20)</TableHead>
                        <TableHead>Commentaire</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.last_name} {student.first_name}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              value={gradesInput[student.id]?.value || ""}
                              onChange={(e) => handleGradeChange(student.id, "value", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              placeholder="20" 
                              value={gradesInput[student.id]?.max_value || "20"}
                              onChange={(e) => handleGradeChange(student.id, "max_value", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              placeholder="Remarque..." 
                              value={gradesInput[student.id]?.comment || ""}
                              onChange={(e) => handleGradeChange(student.id, "comment", e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button onClick={handleSaveGrades} className="bg-letter-orange hover:bg-letter-orange/90 shadow-playful rounded-xl font-display px-8">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer les notes
                  </Button>
                </div>
              </>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredStudents.map(student => (
                  <div key={student.id} className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col items-center gap-3">
                     <div className="h-12 w-12 rounded-full bg-letter-blue/10 flex items-center justify-center font-bold text-letter-blue">
                        {student.first_name[0]}{student.last_name[0]}
                     </div>
                     <p className="text-sm font-bold text-center">{student.first_name} {student.last_name}</p>
                     <Button 
                       size="sm" 
                       className="w-full bg-letter-blue hover:bg-letter-blue/90 rounded-xl"
                       onClick={() => downloadBulletin(student.id, `${student.first_name} ${student.last_name}`)}
                       disabled={downloading === student.id}
                     >
                        <Download className="mr-2 h-4 w-4" /> Bulletin PDF
                     </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;
