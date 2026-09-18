import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Enums } from "@/integrations/supabase/types";

type AppRole = Enums<"app_role"> | "ADMIN" | "TEACHER" | "PARENT";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userHasAccess = allowedRoles.some(role => hasRole(role));

  if (!userHasAccess) {
    // Redirect to the appropriate dashboard based on their role
    if (hasRole("ADMIN")) return <Navigate to="/admin" replace />;
    if (hasRole("TEACHER")) return <Navigate to="/teacher" replace />;
    if (hasRole("PARENT")) return <Navigate to="/parent" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
