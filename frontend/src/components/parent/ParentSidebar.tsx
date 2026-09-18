import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, Calendar, 
  Settings, LogOut, CheckCircle, Megaphone, Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/parent" },
  { icon: Users, label: "Mes Enfants", path: "/parent/enfants" },
  { icon: BookOpen, label: "Notes & Résultats", path: "/parent/notes" },
  { icon: CheckCircle, label: "Présences", path: "/parent/presences" },
  { icon: Calendar, label: "Emploi du Temps", path: "/parent/planning" },
  { icon: Inbox, label: "Messagerie", path: "/parent/messages" },
  { icon: Megaphone, label: "Annonces", path: "/parent/annonces" },
  { icon: Settings, label: "Mon Profil", path: "/parent/profil" },
];

const ParentSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="font-display text-2xl text-letter-blue animate-bounce-gentle">Umurerwa</h1>
        <p className="text-xs text-muted-foreground font-body">Espace Parents</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-200",
                isActive
                  ? "bg-letter-blue text-white shadow-playful translate-x-1"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-letter-blue")} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border">
        <button
          onClick={async () => { await signOut(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default ParentSidebar;
