import { useEffect, useState } from "react";
import { fetchApi, uploadMedia } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, School, Save, Palette, Type, Image as ImageIcon, Sparkles, Heart, Megaphone, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Settings = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/settings/1/");
        setSettings(data);
      } catch {
        setSettings({
          school_name: "UMURERWA ACADEMY",
          slogan: "Complexe Scolaire & Universitaire",
          hero_title: "L'excellence académique de la maternelle à l'université.",
          hero_description: "Umurerwa Academy offre un parcours d'études complet, rigoureux et moderne. De la petite enfance aux diplômes universitaires, nous formons les leaders et chercheurs de demain.",
          carousel_img_1: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
          carousel_caption_1: "Campus Universitaire & Recherche",
          carousel_img_2: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
          carousel_caption_2: "Facultés & Salles d'Amphithéâtre",
          carousel_img_3: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
          carousel_caption_3: "Maternelle, Primaire & Secondaire",
          carousel_img_4: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
          carousel_caption_4: "Laboratoires Informatiques & Innovation",
          title_font_size: 52,
          body_font_size: 18,
          primary_color: "#1e3a8a",
          accent_color: "#f59e0b",
          bg_color: "#f8fafc",
          address: "Bujumbura, Burundi",
          phone: "+257 68 00 00 00",
          email: "contact@umurerwa-academy.bi",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi("/settings/1/", {
        method: "PATCH",
        body: JSON.stringify(settings)
      });
      toast.success("Paramètres, logo et charte graphique enregistrés !");
    } catch (e: any) {
      toast.error(e.message || "Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-blue-900" /> Administration du Site, Logo & Charte
          </h1>
          <p className="font-body text-slate-600">Personnalisez le nom, le logo, les actualités, le bandeau d'information et les visuels de votre établissement.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-md px-6 py-6 flex gap-2 font-body font-bold"
        >
          <Save className="h-5 w-5 text-amber-300" /> <span>{saving ? "Enregistrement..." : "Appliquer les modifications"}</span>
        </Button>
      </div>

      {/* Raccourcis d'Administration Directs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900">Éditeur du Blog & Actualités</h3>
              <p className="text-xs text-slate-600">Ajoutez, modifiez ou supprimez les articles du blog avec leurs images.</p>
            </div>
          </div>
          <Link to="/admin/annonces" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition">
            Gérer le Blog →
          </Link>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900">Bandeau d'Info Défilant</h3>
              <p className="text-xs text-slate-600">Publiez les annonces qui défilent en bas de page style France 24.</p>
            </div>
          </div>
          <Link to="/admin/annonces" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition">
            Gérer les Infos →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Identité, Logo & Textes Principaux */}
        <Card className="border-slate-200 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="font-display text-slate-900 flex items-center gap-2">
              <School className="h-5 w-5 text-blue-900" /> Identité, Logo & Titres d'Accueil
            </CardTitle>
            <CardDescription>Nom de l'école, slogan et téléversement du logo officiel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Gestion du Logo */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <Label className="text-xs font-bold text-blue-900 block">Logo Officiel de l'Établissement</Label>
              <div className="flex items-center gap-4">
                {/* Prévisualisation */}
                {settings.logo ? (
                  <div className="relative shrink-0 group">
                    <img src={settings.logo} alt="Logo" className="h-20 w-20 object-contain rounded-2xl border-2 border-blue-200 bg-white p-1.5 shadow-md" />
                    <button
                      type="button"
                      onClick={async () => {
                        setSettings({ ...settings, logo: "" });
                        await fetchApi("/settings/1/", {
                          method: "PATCH",
                          body: JSON.stringify({ logo: "" }),
                        });
                        toast.info("Logo supprimé de la base de données.");
                      }}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer le logo"
                    >✕</button>
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 text-blue-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                {/* Zone d'upload */}
                <label className="flex-1 flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition" />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700 transition text-center">
                    {uploadingLogo ? "Téléversement en cours..." : settings.logo ? "Changer le logo" : "Cliquer pour téléverser votre logo"}
                  </span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, SVG — enregistrement automatique dans media/</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadingLogo(true);
                        try {
                          const result = await uploadMedia(file, "site");
                          const newSettings = { ...settings, logo: result.url };
                          setSettings(newSettings);

                          // Sauvegarde automatique immédiate en base de données !
                          await fetchApi("/settings/1/", {
                            method: "PATCH",
                            body: JSON.stringify({ logo: result.url }),
                          });

                          toast.success("Logo téléversé et enregistré dans la base de données !");
                        } catch (err: any) {
                          toast.error(err.message || "Erreur de téléversement");
                        } finally {
                          setUploadingLogo(false);
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="school_name" className="text-xs font-bold text-slate-700">Nom de l'établissement</Label>
              <Input id="school_name" value={settings.school_name || ""} onChange={e => setSettings({ ...settings, school_name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slogan" className="text-xs font-bold text-slate-700">Sous-titre / Slogan officiel</Label>
              <Input id="slogan" value={settings.slogan || ""} onChange={e => setSettings({ ...settings, slogan: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hero_title" className="text-xs font-bold text-slate-700">Titre Principal de la Page d'Accueil</Label>
              <Input id="hero_title" value={settings.hero_title || ""} onChange={e => setSettings({ ...settings, hero_title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hero_description" className="text-xs font-bold text-slate-700">Description de Présentation</Label>
              <Textarea id="hero_description" className="min-h-[90px]" value={settings.hero_description || ""} onChange={e => setSettings({ ...settings, hero_description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Charte Graphique & Couleurs */}
        <Card className="border-slate-200 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="font-display text-slate-900 flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-900" /> Charte Graphique, Couleurs & Typographie
            </CardTitle>
            <CardDescription>Ajustez les couleurs et la taille de police globale du site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="title_font_size" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Type className="h-3.5 w-3.5 text-blue-800" /> Taille Titre (px)
                </Label>
                <Input id="title_font_size" type="number" value={settings.title_font_size || 52} onChange={e => setSettings({ ...settings, title_font_size: parseInt(e.target.value) || 32 })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="body_font_size" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Type className="h-3.5 w-3.5 text-blue-800" /> Taille Texte Body (px)
                </Label>
                <Input id="body_font_size" type="number" value={settings.body_font_size || 18} onChange={e => setSettings({ ...settings, body_font_size: parseInt(e.target.value) || 16 })} />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-700">Palette de Couleurs Principales</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">Principale (Bleu)</span>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.primary_color || "#1e3a8a"} onChange={e => setSettings({ ...settings, primary_color: e.target.value })} className="h-9 w-12 rounded-lg cursor-pointer border-none" />
                    <Input className="text-xs h-9" value={settings.primary_color || "#1e3a8a"} onChange={e => setSettings({ ...settings, primary_color: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">Accent (Or)</span>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.accent_color || "#f59e0b"} onChange={e => setSettings({ ...settings, accent_color: e.target.value })} className="h-9 w-12 rounded-lg cursor-pointer border-none" />
                    <Input className="text-xs h-9" value={settings.accent_color || "#f59e0b"} onChange={e => setSettings({ ...settings, accent_color: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">Fond (Arrière-plan)</span>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.bg_color || "#f8fafc"} onChange={e => setSettings({ ...settings, bg_color: e.target.value })} className="h-9 w-12 rounded-lg cursor-pointer border-none" />
                    <Input className="text-xs h-9" value={settings.bg_color || "#f8fafc"} onChange={e => setSettings({ ...settings, bg_color: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs font-bold text-slate-700">Coordonnées de l'établissement</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Input placeholder="Adresse" value={settings.address || ""} onChange={e => setSettings({ ...settings, address: e.target.value })} />
                <Input placeholder="Téléphone" value={settings.phone || ""} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Galerie photos du carrousel */}
      <Card className="border-slate-200 shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-900" /> Galerie & Images du Carrousel d'Accueil
          </CardTitle>
          <CardDescription>Téléversez directement vos photos depuis votre ordinateur. Elles seront immédiatement enregistrées dans media/ et visibles sur la page d'accueil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {[1, 2, 3, 4].map((num) => {
              const imgKey = `carousel_img_${num}`;
              const capKey = `carousel_caption_${num}`;
              const imgUrl = settings[imgKey];

              return (
                <div key={num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-900 block">Photo {num} du Carrousel</span>
                    {imgUrl && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Activité OK</span>
                    )}
                  </div>

                  {/* Zone de prévisualisation + upload */}
                  <div className="flex items-center gap-3">
                    {imgUrl ? (
                      <div className="relative shrink-0 group">
                        <img src={imgUrl} alt={`Photo ${num}`} className="h-16 w-24 object-cover rounded-xl border-2 border-blue-200 bg-white shadow-sm" />
                        <button
                          type="button"
                          onClick={async () => {
                            const newSettings = { ...settings, [imgKey]: "" };
                            setSettings(newSettings);
                            await fetchApi("/settings/1/", {
                              method: "PATCH",
                              body: JSON.stringify({ [imgKey]: "" })
                            });
                            toast.info(`Photo ${num} supprimée`);
                          }}
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"
                          title="Supprimer la photo"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="h-16 w-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center shrink-0 text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}

                    <label className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-3 rounded-xl border border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition group text-center">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
                        {imgUrl ? "Changer la photo" : "Téléverser depuis le PC"}
                      </span>
                      <span className="text-[10px] text-slate-400">Stocké dans media/carousel/</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              toast.loading(`Téléversement photo ${num}...`, { id: `up-${num}` });
                              const res = await uploadMedia(file, "carousel");
                              setSettings(prev => ({ ...prev, [imgKey]: res.url }));

                              // Sauvegarde DB instantanée
                              await fetchApi("/settings/1/", {
                                method: "PATCH",
                                body: JSON.stringify({ [imgKey]: res.url })
                              });

                              toast.success(`Photo ${num} enregistrée avec succès !`, { id: `up-${num}` });
                            } catch (err: any) {
                              toast.error("Erreur d'upload de l'image", { id: `up-${num}` });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-600">Légende / Titre sur la photo</Label>
                    <Input 
                      placeholder={`Légende de la photo ${num}`} 
                      value={settings[capKey] || ""} 
                      onChange={e => setSettings({ ...settings, [capKey]: e.target.value })} 
                      onBlur={async () => {
                        await fetchApi("/settings/1/", {
                          method: "PATCH",
                          body: JSON.stringify({ [capKey]: settings[capKey] })
                        });
                        toast.success(`Légende ${num} mise à jour`);
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </CardContent>
      </Card>

      {/* Pied de Page */}
      <Card className="border-slate-200 shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display text-slate-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" /> Pied de Page (Footer)
          </CardTitle>
          <CardDescription>Modifiez le slogan du pied de page et le texte du copyright.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Slogan du Pied de Page</Label>
              <Input
                placeholder="Ex: L'excellence académique & l'épanouissement..."
                value={settings.footer_tagline || ""}
                onChange={e => setSettings({ ...settings, footer_tagline: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Texte Copyright & Entité</Label>
              <Input
                placeholder="Ex: pour Umurerwa Academy"
                value={settings.footer_copyright || ""}
                onChange={e => setSettings({ ...settings, footer_copyright: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
