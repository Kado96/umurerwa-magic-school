import React, { useEffect, useState } from "react";
import RainbowSchoolName from "./RainbowSchoolName";
import { Heart } from "lucide-react";
import { fetchApi } from "@/lib/api";

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchApi("/settings/1/").then((data) => setSettings(data)).catch(() => {});
  }, []);

  const tagline = settings?.footer_tagline || "Plateforme de gestion pour établissements scolaires d'excellence";
  const copyright = settings?.footer_copyright || "Système de Gestion Scolaire";
  const address = settings?.address || "Avenue Démo, Ville Test";
  const facebookUrl = settings?.facebook_url || "";

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 text-center space-y-4">
        <RainbowSchoolName size="sm" />
        <p className="font-body text-sm text-slate-300 font-semibold max-w-xl mx-auto">
          {tagline}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          {facebookUrl && (
            <>
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                Page Facebook Officielle
              </a>
              <span>•</span>
            </>
          )}
          <span>{address}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 font-body text-xs text-slate-500 pt-2">
          <span>Fait avec</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>{copyright} © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
