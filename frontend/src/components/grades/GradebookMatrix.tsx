import React, { useState, useEffect } from 'react';
import { submitBatchGrades, fetchApi, Student, Assessment, GradePayload } from '@/lib/api';

export const GradebookMatrix = ({ assessmentId }: { assessmentId: string }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [grades, setGrades] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const studentsData = await fetchApi('/students/');
                setStudents(studentsData);
                
                if (assessmentId) {
                    const assessmentData = await fetchApi(`/assessments/${assessmentId}/`);
                    setAssessment(assessmentData);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données", error);
            }
        };
        loadData();
    }, [assessmentId]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload: GradePayload[] = Object.entries(grades).map(([student_id, score]) => ({
                student_id,
                score
            }));
            await submitBatchGrades(assessmentId, payload);
            alert("Notes sauvegardées !");
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (studentId: string | number, value: string) => {
        if (value === '') {
            const newGrades = { ...grades };
            delete newGrades[studentId];
            setGrades(newGrades);
            return;
        }
        
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
            setGrades({ ...grades, [studentId]: parsed });
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Saisie des notes</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Élève</th>
                        <th className="border p-2">Note</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td className="border p-2">{student.first_name} {student.last_name}</td>
                            <td className="border p-2">
                                <input 
                                    type="number" 
                                    className="border p-1 w-24 rounded" 
                                    value={grades[student.id] !== undefined ? grades[student.id] : ''} 
                                    onChange={e => handleGradeChange(student.id, e.target.value)}
                                    min={0}
                                    max={assessment?.max_score || 20}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>
        </div>
    );
};
