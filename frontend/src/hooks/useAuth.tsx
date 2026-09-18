import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Enums } from "@/integrations/supabase/types";

type AppRole = Enums<"app_role"> | "ADMIN" | "TEACHER" | "PARENT";

interface User {
  id: string;
  username: string;
  role: AppRole;
  email?: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  loading: boolean;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  signIn: (token: string, userData: any) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  roles: [],
  hasRole: () => false,
  signIn: () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const token = localStorage.getItem("access_token");
    if (token) {
        try {
            // Un décodage basique de JWT pour récupérer les infos
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentUser: User = {
                id: payload.user_id?.toString() || "",
                username: payload.username || "",
                role: payload.role || "PARENT",
                photo: payload.photo || "",
            };
            setUser(currentUser);
            setSession({ access_token: token });
            setRoles([currentUser.role]);
        } catch (e) {
            console.error("Token invalide", e);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }
    setLoading(false);
  }, []);

  const hasRole = (role: AppRole) => roles.includes(role);

  const signIn = (token: string, payload: any) => {
    localStorage.setItem("access_token", token);
    const currentUser: User = {
        id: payload.user_id?.toString() || "",
        username: payload.username || "",
        role: payload.role || "PARENT",
        photo: payload.photo || "",
    };
    setUser(currentUser);
    setSession({ access_token: token });
    setRoles([currentUser.role]);
  };

  const signOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setSession(null);
    setRoles([]);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, hasRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
