import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import RainbowSchoolName from "@/components/RainbowSchoolName";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Identifiants incorrects");
      }

      // Décoder le payload pour initialiser la session
      const payload = JSON.parse(atob(data.access.split('.')[1]));
      signIn(data.access, payload);

      // Redirection spécifique au Rôle du profil (issu du Token JWT)
      const role = payload.role;
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "TEACHER") {
        navigate("/teacher");
      } else if (role === "PARENT") {
        navigate("/parent");
      } else {
        navigate("/");
      }
      
    } catch (error: any) {
      toast({ 
        title: "Erreur de connexion", 
        description: error.message || "Impossible de se connecter au serveur", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <RainbowSchoolName size="sm" />
          </div>
          <CardTitle className="text-xl font-body text-muted-foreground">
            Espace Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Identifiant (Nom d'utilisateur)</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  type="text"
                  placeholder="Ex: donale"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-bold shadow-playful" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          {/* Boutons d'accès rapide Démo */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs font-body font-bold text-slate-500 text-center uppercase tracking-wider">
              Accès rapide démo
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs font-semibold border-blue-200 text-blue-900 hover:bg-blue-50 py-2 h-auto"
                onClick={() => { setUsername("prof_jean"); setPassword("Teacher123!"); }}
              >
                Prof. Jean-Pierre (Maths)
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-xs font-semibold border-indigo-200 text-indigo-900 hover:bg-indigo-50 py-2 h-auto"
                onClick={() => { setUsername("prof_claire"); setPassword("Teacher123!"); }}
              >
                Prof. Claire (Info & IA)
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-xs font-semibold border-emerald-200 text-emerald-900 hover:bg-emerald-50 py-2 h-auto"
                onClick={() => { setUsername("parent_patrick"); setPassword("Parent123!"); }}
              >
                Parent Patrick
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-xs font-semibold border-amber-200 text-amber-900 hover:bg-amber-50 py-2 h-auto"
                onClick={() => { setUsername("admin"); setPassword("admin"); }}
              >
                Admin Principal
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-center text-sm">
            <a href="/register" className="text-primary hover:underline font-bold transition-colors">
              Créer un compte enseignant ou parent
            </a>
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              ← Retour au site
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
