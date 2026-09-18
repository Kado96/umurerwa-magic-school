import React, { useState, useEffect } from 'react';
import { fetchApi, Student, Grade } from '@/lib/api';

interface ReportCardModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportCardModal = ({ student, isOpen, onClose }: ReportCardModalProps) => {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && student) {
            setLoading(true);
            fetchApi(`/grades/?student=${student.id}`)
                .then(data => {
                    setGrades(data.results || data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen, student]);

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Bulletin de Notes</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black font-bold">X</button>
                </div>
                
                <div className="mb-4">
                    <p><strong>Élève :</strong> {student?.first_name} {student?.last_name}</p>
                    <p><strong>Classe :</strong> {student?.class_name}</p>
                </div>

                <table className="w-full text-left border-collapse mb-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Matière</th>
                            <th className="border p-2">Note</th>
                            <th className="border p-2">Appréciation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="border p-2" colSpan={3} style={{textAlign: 'center'}}>
                                    Chargement des notes...
                                </td>
                            </tr>
                        ) : grades.length > 0 ? (
                            grades.map((grade, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{grade.subject_name || grade.subject || 'N/A'}</td>
                                    <td className="border p-2">{grade.value || grade.score} / {grade.max_value || grade.max_score || 20}</td>
                                    <td className="border p-2">{grade.comment || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border p-2" colSpan={3} style={{textAlign: 'center'}}>
                                    Aucune note disponible
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <div className="flex justify-end space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => window.print()}>
                        Imprimer
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};
