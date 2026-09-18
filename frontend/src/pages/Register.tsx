import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import RainbowSchoolName from "@/components/RainbowSchoolName";
import { User, Lock, Mail, Users, Briefcase } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_input: "PARENT"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (val: string) => {
    setFormData({ ...formData, role_input: val });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || Object.values(data)[0] || "Erreur lors de la création du compte.");
      }

      toast({ 
        title: "Compte créé !", 
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.", 
        variant: "default" 
      });
      navigate("/login");
      
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message || "Impossible de communiquer avec le serveur.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <RainbowSchoolName size="sm" />
          </div>
          <CardTitle className="text-xl font-body text-muted-foreground">
            Créer un compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="first_name">Prénom</Label>
                 <Input id="first_name" name="first_name" autoComplete="given-name" required value={formData.first_name} onChange={handleChange} />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="last_name">Nom de famille</Label>
                 <Input id="last_name" name="last_name" autoComplete="family-name" required value={formData.last_name} onChange={handleChange} />
               </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_input">Je suis...</Label>
              <Select value={formData.role_input} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARENT">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Un Parent d'élève</div>
                  </SelectItem>
                  <SelectItem value="TEACHER">
                     <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Un Professeur</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="username" name="username" autoComplete="username" type="text" placeholder="Ex: johndoe" required value={formData.username} onChange={handleChange} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" autoComplete="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" autoComplete="new-password" type="password" required value={formData.password} onChange={handleChange} className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full font-bold shadow-playful mt-6" disabled={loading}>
              {loading ? "Création en cours..." : "S'inscrire"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Vous avez déjà un compte ? Connectez-vous.
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
