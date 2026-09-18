import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string;
  student_class: string;
}

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Local state for attendance: { studentId: { is_present: boolean, remark: string } }
  const [attendanceInput, setAttendanceInput] = useState<{ [key: string]: { is_present: boolean, remark: string } }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentsRes = await fetchApi("/students/");
        setStudents(studentsRes.results || studentsRes);
      } catch (e: any) {
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueClasses = Array.from(new Set(students.map(s => s.student_class))).map(classId => {
    const s = students.find(st => st.student_class === classId);
    return { id: classId, name: s?.class_name || "Inconnu" };
  });

  const filteredStudents = selectedClassId 
    ? students.filter(s => String(s.student_class) === selectedClassId)
    : [];

  // Initialize attendance input when class changes
  useEffect(() => {
    const initialInput: any = {};
    filteredStudents.forEach(s => {
      initialInput[s.id] = { is_present: true, remark: "" }; // default: present
    });
    setAttendanceInput(initialInput);
  }, [selectedClassId]);

  const handleAttendanceChange = (studentId: string, field: string, val: any) => {
    setAttendanceInput(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId || !attendanceDate) {
      toast.error("Veuillez sélectionner une classe et une date.");
      return;
    }

    const payload = Object.entries(attendanceInput).map(([studentId, data]) => ({
      student: studentId,
      date: attendanceDate,
      is_present: data.is_present,
      remark: data.remark || ""
    }));

    if (payload.length === 0) {
      toast.info("Aucun élève à enregistrer.");
      return;
    }

    try {
      await Promise.all(payload.map(att => 
        fetchApi("/attendances/", {
          method: "POST",
          body: JSON.stringify(att)
        })
      ));
      toast.success("Appel enregistré avec succès !");
    } catch (e: any) {
      toast.error("Erreur lors de l'enregistrement de l'appel.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-letter-pink" />
            Appel et Présences
          </h1>
          <p className="font-body text-muted-foreground">Faites l'appel de vos élèves par classe pour une journée donnée.</p>
        </div>
        <Button 
          className="bg-letter-pink hover:bg-letter-pink/90 text-white rounded-2xl shadow-playful px-6 py-6"
          onClick={() => { setSelectedClassId(""); setAttendanceDate(new Date().toISOString().split('T')[0]); }}
        >
          <Plus className="h-5 w-5 mr-2" /> Nouvel Appel
        </Button>
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
              <label className="text-sm font-bold">Date du jour</label>
              <Input 
                type="date" 
                value={attendanceDate} 
                onChange={(e) => setAttendanceDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          {!selectedClassId ? (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
              Sélectionnez une classe pour afficher la liste d'appel.
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Aucun élève dans cette classe.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead className="w-[150px]">Présent ?</TableHead>
                    <TableHead>Remarque (Retard / Motif d'absence)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.last_name} {student.first_name}</TableCell>
                      <TableCell>
                         <Switch 
                            checked={attendanceInput[student.id]?.is_present ?? true}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, "is_present", checked)}
                            className="data-[state=checked]:bg-letter-green"
                         />
                      </TableCell>
                      <TableCell>
                        <Input 
                          placeholder="Ex: 10 minutes de retard" 
                          value={attendanceInput[student.id]?.remark || ""}
                          onChange={(e) => handleAttendanceChange(student.id, "remark", e.target.value)}
                          disabled={attendanceInput[student.id]?.is_present && !attendanceInput[student.id]?.remark}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveAttendance} className="bg-letter-pink hover:bg-letter-pink/90 shadow-playful rounded-xl font-display">
                  <Save className="mr-2 h-4 w-4" /> Valider l'appel
                </Button>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
