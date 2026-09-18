import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  class_name: string;
  photo: string | null;
}

const MyChildren = () => {
  const navigate = useNavigate();
  const [childrenList, setChildrenList] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/students/");
        setChildrenList(data.results || data);
      } catch (e: any) {
        toast.error("Impossible de charger vos enfants");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-letter-blue" />
            Mes Enfants
          </h1>
          <p className="font-body text-muted-foreground">Profil et classe de vos enfants actuellement inscrits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)
        ) : childrenList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card rounded-3xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
             <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
             <h3 className="text-lg font-bold">Aucun enfant trouvé</h3>
             <p className="max-w-md mx-auto mt-2 text-sm">Si vous avez inscrit vos enfants mais qu'ils n'apparaissent pas, veuillez contacter l'administration de l'école pour lier leurs profils à votre compte.</p>
          </div>
        ) : (
          childrenList.map(child => (
            <Card key={child.id} className="border-none shadow-playful hover:-translate-y-1 transition-transform overflow-hidden relative group">
               <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-letter-blue/10 overflow-hidden flex items-center justify-center font-display text-letter-blue font-bold text-xl uppercase">
                       {child.photo ? (
                           <img src={child.photo} alt="Enfant" className="h-full w-full object-cover" />
                       ) : (
                           <span>{child.first_name[0]}{child.last_name[0]}</span>
                       )}
                    </div>
                   <div>
                     <h3 className="font-display text-lg leading-tight truncate w-40">{child.first_name} {child.last_name}</h3>
                     <p className="font-body text-xs text-muted-foreground mt-1">ID: STMS-{child.id.toString().padStart(4, "0")}</p>
                   </div>
                </div>
                <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center text-xs font-body mb-2">
                        <span className="px-3 py-1 bg-letter-blue/10 text-letter-blue rounded-full font-bold">
                            Classe : {child.class_name}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl text-[10px] h-8 border-letter-blue/20 hover:bg-letter-blue/10 text-letter-blue"
                            onClick={() => navigate('/parent/notes')}
                        >
                            Voir Notes
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl text-[10px] h-8 border-letter-green/20 hover:bg-letter-green/10 text-letter-green"
                            onClick={() => navigate('/parent/presences')}
                        >
                            Assiduité
                        </Button>
                    </div>
                </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyChildren;
