import React, { useState, useEffect } from "react";
import { getClasses, createEnrollment, updateEnrollment } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface EnrollmentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: any;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const [classes, setClasses] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "M",
        target_class: "",
        parent_name: "",
        parent_email: "",
        parent_phone: "",
        address: ""
    });

    useEffect(() => {
        getClasses().then(setClasses).catch(console.error);
        if (initialData) {
            setFormData({
                first_name: initialData.first_name || "",
                last_name: initialData.last_name || "",
                birth_date: initialData.birth_date || "",
                gender: initialData.gender || "M",
                target_class: initialData.target_class?.toString() || "",
                parent_name: initialData.parent_name || "",
                parent_email: initialData.parent_email || "",
                parent_phone: initialData.parent_phone || "",
                address: initialData.address || ""
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.target_class) {
            toast({ title: "Erreur", description: "Veuillez choisir une classe", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                target_class: formData.target_class
            };

            if (initialData) {
                await updateEnrollment(initialData.id, payload);
                toast({ title: "Succès", description: "Dossier mis à jour" });
            } else {
                await createEnrollment(payload);
                toast({
                    title: "Demande envoyée !",
                    description: "Le dossier est maintenant en attente de validation."
                });
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'opération. Veuillez réessayer.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">Prénom de l'enfant</Label>
                    <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Ex: Jean"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Nom de l'enfant</Label>
                    <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Ex: Dupont"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birth_date">Date de naissance</Label>
                    <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select
                        value={formData.gender}
                        onValueChange={v => setFormData({ ...formData, gender: v })}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="M">Garçon</SelectItem>
                            <SelectItem value="F">Fille</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="target_class">Classe souhaitée</Label>
                    <Select
                        value={formData.target_class}
                        onValueChange={v => setFormData({ ...formData, target_class: v })}
                        required
                    >
                        <SelectTrigger id="target_class">
                            <SelectValue placeholder="Choisir une classe" />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.level})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="font-bold text-sm uppercase text-primary">Informations Parent / Tuteur</h3>
                <div className="space-y-2">
                    <Label htmlFor="parent_name">Nom complet du tuteur</Label>
                    <Input
                        id="parent_name"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={e => setFormData({ ...formData, parent_name: e.target.value })}
                        placeholder="Ex: Marie Dupont"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="parent_email">Email de contact</Label>
                        <Input
                            id="parent_email"
                            name="parent_email"
                            type="email"
                            value={formData.parent_email}
                            onChange={e => setFormData({ ...formData, parent_email: e.target.value })}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parent_phone">Téléphone</Label>
                        <Input
                            id="parent_phone"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={e => setFormData({ ...formData, parent_phone: e.target.value })}
                            placeholder="+257 ..."
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Adresse de résidence</Label>
                    <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Quartier, Avenue, etc."
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Annuler
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? "Envoi en cours..." : initialData ? "Mettre à jour" : "Envoyer le dossier"}
                </Button>
            </div>
        </form>
    );
};

export default EnrollmentForm;
