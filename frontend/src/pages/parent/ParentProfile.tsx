import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Mail, Lock } from "lucide-react";

const ParentProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-letter-blue" />
            Mon Profil
          </h1>
          <p className="font-body text-muted-foreground">Consultez vos informations personnelles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-playful">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <User className="h-5 w-5 text-letter-blue" /> Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
              <div className="h-16 w-16 rounded-3xl bg-letter-blue/20 overflow-hidden flex items-center justify-center font-display font-bold text-2xl text-letter-blue">
                {user?.photo ? (
                    <img src={user.photo} alt="Profil" className="h-full w-full object-cover" />
                ) : (
                    <span>{user?.username?.[0]?.toUpperCase() || "P"}</span>
                )}
              </div>
              <div>
                <h3 className="font-display text-lg">{user?.username || "Parent"}</h3>
                <p className="text-xs text-muted-foreground font-body mt-1">Rôle : Parent</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm font-body">
                <Mail className="h-4 w-4 text-letter-blue" />
                <span className="text-muted-foreground">Email : </span>
                <span className="font-medium">{user?.email || "Non renseigné"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-playful">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Lock className="h-5 w-5 text-letter-orange" /> Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
              <Lock className="h-8 w-8 text-letter-orange/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground">Changement de mot de passe</p>
              <p className="text-xs mt-1 max-w-xs mx-auto">Contactez l'administration si vous souhaitez modifier votre mot de passe.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentProfile;
