import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Calendar, Settings, LogOut, School
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
  { icon: School, label: "Classes", path: "/admin/classes" },
  { icon: Users, label: "Professeurs", path: "/admin/professeurs" },
  { icon: GraduationCap, label: "Élèves", path: "/admin/eleves" },
  { icon: BookOpen, label: "Matières", path: "/admin/matieres" },
  { icon: Calendar, label: "Années scolaires", path: "/admin/annees" },
  { icon: Settings, label: "Paramètres", path: "/admin/parametres" },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-display text-lg text-primary">Umurerwa</h2>
        <p className="text-xs text-muted-foreground font-body">Administration</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border">
        <button
          onClick={async () => { await signOut(); navigate("/login"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
