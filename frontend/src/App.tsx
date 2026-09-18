import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ProgramArticlePage from "./pages/ProgramArticlePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicEnrollment from "./pages/PublicEnrollment";
import BlogPage from "./pages/Blog";
import NotFound from "./pages/NotFound";
import RoleProtectedRoute from "@/components/shared/RoleProtectedRoute";

// Admin
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Classes from "@/pages/admin/Classes";
import SchoolYears from "@/pages/admin/SchoolYears";
import Students from "@/pages/admin/Students";
import Teachers from "@/pages/admin/Teachers";
import AdminParents from "@/pages/admin/Parents";
import Subjects from "@/pages/admin/Subjects";
import Settings from "@/pages/admin/Settings";
import Statistics from "@/pages/admin/Statistics";
import AdminTimetable from "@/pages/admin/Timetable";
import AdminAnnouncements from "@/pages/admin/Announcements";
import AdminPayments from "@/pages/admin/Payments";
import AdminEnrollments from "@/pages/admin/Enrollments";
import AdminTeacherAttendance from "@/pages/admin/TeacherAttendance";
import AdminStudentAttendance from "@/pages/admin/StudentAttendance";
import AdminSalaries from "@/pages/admin/Salaries";
import AdminUsers from "@/pages/admin/Users";
import AdminHonorRoll from "@/pages/admin/HonorRoll";
import AdminMessages from "@/pages/admin/AdminMessages";

// Teacher
import TeacherLayout from "@/components/teacher/TeacherLayout";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import MyClasses from "@/pages/teacher/MyClasses";
import Grades from "@/pages/teacher/Grades";
import Attendance from "@/pages/teacher/Attendance";
import TeacherPlanning from "@/pages/teacher/TeacherPlanning";
import TeacherAnnouncements from "@/pages/teacher/TeacherAnnouncements";
import TeacherMessages from "@/pages/teacher/TeacherMessages";
import TeacherProfile from "@/pages/teacher/TeacherProfile";

// Parent
import ParentLayout from "@/components/parent/ParentLayout";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import MyChildren from "@/pages/parent/MyChildren";
import ChildrenGrades from "@/pages/parent/ChildrenGrades";
import ChildrenAttendance from "@/pages/parent/ChildrenAttendance";
import ParentPlanning from "@/pages/parent/ParentPlanning";
import ParentMessages from "@/pages/parent/ParentMessages";
import ParentAnnouncements from "@/pages/parent/ParentAnnouncements";
import ParentProfile from "@/pages/parent/ParentProfile";

const queryClient = new QueryClient();

// Composant pour l'effet de transition douce entre pages (évite le flash blanc)
const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-in fade-in duration-300 fill-mode-forwards">
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/programme/:slug" element={<ProgramArticlePage />} />
        <Route path="/inscription" element={<PublicEnrollment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Espace Administrateur */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="annees" element={<SchoolYears />} />
          <Route path="eleves" element={<Students />} />
          <Route path="professeurs" element={<Teachers />} />
          <Route path="parents" element={<AdminParents />} />
          <Route path="matieres" element={<Subjects />} />
          <Route path="parametres" element={<Settings />} />
          <Route path="statistiques" element={<Statistics />} />
          <Route path="emploi-du-temps" element={<AdminTimetable />} />
          <Route path="annonces" element={<AdminAnnouncements />} />
          <Route path="inscriptions" element={<AdminEnrollments />} />
          <Route path="paiements" element={<AdminPayments />} />
          <Route path="presences-profs" element={<AdminTeacherAttendance />} />
          <Route path="presences-eleves" element={<AdminStudentAttendance />} />
          <Route path="salaires" element={<AdminSalaries />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
          <Route path="excellence" element={<AdminHonorRoll />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* Espace Professeur */}
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="notes" element={<Grades />} />
          <Route path="presences" element={<Attendance />} />
          <Route path="planning" element={<TeacherPlanning />} />
          <Route path="annonces" element={<TeacherAnnouncements />} />
          <Route path="messages" element={<TeacherMessages />} />
          <Route path="profil" element={<TeacherProfile />} />
        </Route>

        {/* Espace Parent */}
        <Route
          path="/parent"
          element={
            <RoleProtectedRoute allowedRoles={["PARENT"]}>
              <ParentLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<ParentDashboard />} />
          <Route path="enfants" element={<MyChildren />} />
          <Route path="notes" element={<ChildrenGrades />} />
          <Route path="presences" element={<ChildrenAttendance />} />
          <Route path="planning" element={<ParentPlanning />} />
          <Route path="messages" element={<ParentMessages />} />
          <Route path="annonces" element={<ParentAnnouncements />} />
          <Route path="profil" element={<ParentProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
