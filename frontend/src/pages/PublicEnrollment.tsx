import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import {
    UserPlus,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    CheckCircle2,
    ArrowRight,
    School,
    Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PublicEnrollment = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        fetchApi("/classes/").then(data => setClasses(data.results || data)).catch(console.error);
    }, []);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(step + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            await fetchApi("/enrollments/", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    target_class: formData.target_class
                })
            });
            setIsSubmitted(true);
            toast.success("Demande envoyée ! Nous l'étudierons prochainement.");
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full border-none shadow-2xl bg-white text-center p-8 rounded-3xl">
                        <div className="mb-6 flex justify-center">
                            <div className="h-20 w-20 bg-letter-green/10 rounded-full flex items-center justify-center text-letter-green animate-bounce">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-display text-letter-green mb-4">Félicitations !</CardTitle>
                        <CardDescription className="text-lg mb-8 leading-relaxed font-body">
                            La demande d'inscription pour <strong>{formData.first_name} {formData.last_name}</strong> a été enregistrée avec succès.
                            Nous vous contacterons par email ou téléphone dans les plus brefs délais.
                        </CardDescription>
                        <Button asChild className="w-full h-12 rounded-xl bg-letter-green hover:bg-letter-green/90 text-lg font-display">
                            <a href="/">Retour à l'accueil</a>
                        </Button>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
                <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-letter-blue/10 text-letter-blue rounded-full text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Admission Ouverte
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display text-foreground">
                            Inscrire <span className="text-letter-blue font-black italic underline decoration-wavy decoration-letter-orange">mon enfant</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-lg mx-auto font-body">
                            Rejoignez notre école et offrez à votre enfant une éducation d'excellence dans un cadre bienveillant.
                        </p>
                    </div>

                    <Card className="border-none shadow-playful bg-white overflow-hidden rounded-3xl">
                        <div className="h-2 bg-muted flex">
                            <div className={`h-full bg-letter-blue transition-all duration-500`} style={{ width: `${step * 50}%` }} />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-2xl font-display">
                                    {step === 1 ? <User className="h-6 w-6 text-letter-blue" /> : <Phone className="h-6 w-6 text-letter-blue" />}
                                    {step === 1 ? "Informations de l'élève" : "Informations du parent"}
                                </CardTitle>
                                <CardDescription className="font-body">
                                    Étape {step} sur 2 • {step === 1 ? "Détails personnels de l'enfant" : "Coordonnées de contact"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {step === 1 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="space-y-2">
                                            <Label htmlFor="student_first_name">Prénom</Label>
                                            <Input
                                                id="student_first_name"
                                                name="first_name"
                                                autoComplete="given-name"
                                                placeholder="Ex: Jean"
                                                value={formData.first_name}
                                                onChange={e => handleChange("first_name", e.target.value)}
                                                required
                                                className="h-12 border-muted hover:border-letter-blue/50 focus:border-letter-blue transition-colors rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="student_last_name">Nom</Label>
                                            <Input
                                                id="student_last_name"
                                                name="last_name"
                                                autoComplete="family-name"
                                                placeholder="Ex: Dupont"
                                                value={formData.last_name}
                                                onChange={e => handleChange("last_name", e.target.value)}
                                                required
                                                className="h-12 border-muted hover:border-letter-blue/50 focus:border-letter-blue transition-colors rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="student_birth_date">Date de naissance</Label>
                                            <Input
                                                id="student_birth_date"
                                                name="birth_date"
                                                type="date"
                                                autoComplete="bday"
                                                value={formData.birth_date}
                                                onChange={e => handleChange("birth_date", e.target.value)}
                                                required
                                                className="h-12 border-muted rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="student_gender">Genre</Label>
                                            <Select value={formData.gender} onValueChange={v => handleChange("gender", v)}>
                                                <SelectTrigger id="student_gender" className="h-12 border-muted rounded-xl">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M">Garçon</SelectItem>
                                                    <SelectItem value="F">Fille</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="student_target_class">Classe souhaitée</Label>
                                            <Select value={formData.target_class} onValueChange={v => handleChange("target_class", v)} required>
                                                <SelectTrigger id="student_target_class" className="h-12 border-muted rounded-xl">
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
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="space-y-2">
                                            <Label htmlFor="parent_name">Nom complet du tuteur / parent</Label>
                                            <Input
                                                id="parent_name"
                                                name="parent_name"
                                                autoComplete="name"
                                                placeholder="Ex: Marc Dupont"
                                                value={formData.parent_name}
                                                onChange={e => handleChange("parent_name", e.target.value)}
                                                required
                                                className="h-12 border-muted rounded-xl"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="parent_email">Email</Label>
                                                <Input
                                                    id="parent_email"
                                                    name="parent_email"
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="parent@exemple.com"
                                                    value={formData.parent_email}
                                                    onChange={e => handleChange("parent_email", e.target.value)}
                                                    required
                                                    className="h-12 border-muted rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="parent_phone">Téléphone</Label>
                                                <Input
                                                    id="parent_phone"
                                                    name="parent_phone"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    placeholder="+257 .."
                                                    value={formData.parent_phone}
                                                    onChange={e => handleChange("parent_phone", e.target.value)}
                                                    required
                                                    className="h-12 border-muted rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="parent_address">Adresse de résidence</Label>
                                            <Textarea
                                                id="parent_address"
                                                name="parent_address"
                                                autoComplete="street-address"
                                                placeholder="Quartier, Avenue, N°..."
                                                value={formData.address}
                                                onChange={e => handleChange("address", e.target.value)}
                                                required
                                                className="min-h-[100px] border-muted rounded-xl"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col gap-3 pt-6">
                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-letter-blue hover:bg-letter-blue/90 text-lg font-display gap-2 shadow-lg shadow-letter-blue/20 transition-all active:scale-95"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Envoi en cours..." : step === 1 ? "Continuer" : "Envoyer ma demande"}
                                    {step === 1 ? <ArrowRight className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                                </Button>
                                {step === 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-12 text-muted-foreground font-bold hover:bg-transparent hover:text-letter-blue"
                                        onClick={() => setStep(1)}
                                    >
                                        Revenir à l'étape précédente
                                    </Button>
                                )}
                            </CardFooter>
                        </form>
                    </Card>

                    <div className="flex justify-center gap-8 text-muted-foreground text-sm font-bold opacity-60">
                        <div className="flex items-center gap-2 font-display"><School className="h-4 w-4" /> Qualité</div>
                        <div className="flex items-center gap-2 font-display"><Sparkles className="h-4 w-4" /> Cadre</div>
                        <div className="flex items-center gap-2 font-display"><Mail className="h-4 w-4" /> Support</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PublicEnrollment;
