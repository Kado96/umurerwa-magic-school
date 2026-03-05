import React from "react";
import RainbowSchoolName from "./RainbowSchoolName";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto px-4 text-center">
        <RainbowSchoolName size="sm" />
        <p className="mt-4 font-body text-sm" style={{ color: "hsl(var(--muted))" }}>
          L'école où chaque enfant brille ! 🌟
        </p>
        <div className="mt-4 flex items-center justify-center gap-1 font-body text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          <span>Fait avec</span>
          <Heart className="w-3 h-3 text-letter-red fill-letter-red" />
          <span>pour Umurerwa School © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
