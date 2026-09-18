import React, { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface RainbowSchoolNameProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-xl font-bold tracking-tight",
  md: "text-2xl md:text-3xl font-bold tracking-tight",
  lg: "text-3xl md:text-4xl font-extrabold tracking-tight",
  xl: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight",
};

const RainbowSchoolName: React.FC<RainbowSchoolNameProps> = ({ size = "lg" }) => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchApi("/settings/1/")
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const schoolName = settings?.school_name || "UMURERWA ACADEMY";
  const slogan = settings?.slogan || "Complexe Scolaire & Universitaire";
  const logoUrl = settings?.logo;

  return (
    <div className="inline-flex items-center gap-3">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={schoolName} 
          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0 bg-white" 
        />
      ) : (
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
          <GraduationCap className="h-6 w-6 md:h-7 md:w-7" />
        </div>
      )}
      <div className="text-left leading-none">
        <span className={`block font-display text-slate-900 ${sizeClasses[size]}`}>
          {schoolName}
        </span>
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1 block">
          {slogan}
        </span>
      </div>
    </div>
  );
};

export default RainbowSchoolName;
