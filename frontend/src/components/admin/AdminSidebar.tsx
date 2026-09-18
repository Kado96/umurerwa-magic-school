import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Calendar, Settings, LogOut, School, BarChart3, Clock,
  Megaphone, CreditCard, FileText, UserCheck, Banknote, Award, UserPlus, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import RainbowSchoolName from "../RainbowSchoolName";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin" },
  { icon: School, label: "Classes", path: "/admin/classes" },
  { icon: Users, label: "Professeurs", path: "/admin/professeurs" },
  { icon: UserPlus, label: "Parents", path: "/admin/parents" },
  { icon: GraduationCap, label: "Élèves", path: "/admin/eleves" },
  { icon: BookOpen, label: "Matières", path: "/admin/matieres" },
  { icon: Calendar, label: "Années scolaires", path: "/admin/annees" },
  { icon: Clock, label: "Emploi du Temps", path: "/admin/emploi-du-temps" },
  { icon: Megaphone, label: "Annonces", path: "/admin/annonces" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  { icon: FileText, label: "Inscriptions", path: "/admin/inscriptions" },
  { icon: CreditCard, label: "Paiements", path: "/admin/paiements" },
  { icon: UserCheck, label: "Assiduité Prof.", path: "/admin/presences-profs" },
  { icon: Calendar, label: "Absences Élèves", path: "/admin/presences-eleves" },
  { icon: Banknote, label: "Salaires", path: "/admin/salaires" },
  { icon: Users, label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: Award, label: "Excellence", path: "/admin/excellence" },
  { icon: BarChart3, label: "Statistiques", path: "/admin/statistiques" },
  { icon: Settings, label: "Paramètres du Site", path: "/admin/parametres" },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <a href="/" target="_blank" rel="noreferrer" title="Voir la page d'accueil">
          <RainbowSchoolName size="sm" />
        </a>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-body font-semibold transition-all duration-200",
                isActive
                  ? "bg-blue-800 text-white shadow-md font-bold"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-400" : "text-slate-400")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={async () => { await signOut(); navigate("/login"); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-body text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
