import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, School, BookOpen } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ classes: 0, students: 0, teachers: 0, subjects: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [classes, students, subjects] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        classes: classes.count || 0,
        students: students.count || 0,
        teachers: 0,
        subjects: subjects.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: School, label: "Classes", value: stats.classes, color: "text-letter-blue" },
    { icon: GraduationCap, label: "Élèves", value: stats.students, color: "text-letter-green" },
    { icon: Users, label: "Professeurs", value: stats.teachers, color: "text-letter-orange" },
    { icon: BookOpen, label: "Matières", value: stats.subjects, color: "text-letter-purple" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display text-foreground mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-body text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
