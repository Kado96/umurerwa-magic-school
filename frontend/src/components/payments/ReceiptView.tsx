import React from 'react';
import { Payment } from '@/lib/api';

export const ReceiptView = ({ payment }: { payment: Payment | null }) => {
    if (!payment) return <div>Sélectionnez un paiement pour voir le reçu.</div>;

    return (
        <div className="border p-6 rounded shadow max-w-lg mx-auto bg-white" id="printable-receipt">
            <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider">Umurerwa Magic School</h1>
                <p className="text-gray-500">Reçu de Paiement</p>
            </div>
            
            <div className="mb-4">
                <p><span className="font-bold">N° Reçu :</span> {payment.receipt_number || 'N/A'}</p>
                <p><span className="font-bold">Date :</span> {payment.date}</p>
                <p><span className="font-bold">Élève :</span> {payment.student_name}</p>
                <p><span className="font-bold">Classe :</span> {payment.student_class_name}</p>
            </div>
            
            <table className="w-full mb-6">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Désignation</th>
                        <th className="text-right py-2">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2">{payment.payment_type}</td>
                        <td className="py-2 text-right font-bold">{payment.amount} BIF</td>
                    </tr>
                </tbody>
            </table>
            
            <div className="mb-6">
                <p><span className="font-bold">Méthode de paiement :</span> {payment.method}</p>
                {payment.reference && <p><span className="font-bold">Référence :</span> {payment.reference}</p>}
            </div>
            
            <div className="text-center mt-8 pt-4 border-t text-sm text-gray-500">
                <p>Merci pour votre paiement.</p>
                <p>Signature et Cachet de l'établissement</p>
            </div>

            <div className="mt-4 flex justify-center print:hidden">
                <button 
                    onClick={() => window.print()} 
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                >
                    Imprimer le Reçu
                </button>
            </div>
        </div>
    );
};
