import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { Radio } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: string;
}

const NewsTickerBar = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [paused, setPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi("/announcements/");
        const all: Announcement[] = res.results || res || [];
        const publicOnes = all.filter(
          (a) => !a.target_role || a.target_role === "ALL" || a.target_role === ""
        );
        setAnnouncements(publicOnes.length > 0 ? publicOnes : all.slice(0, 5));
      } catch {
        setAnnouncements([
          { id: "1", title: "Rentrée scolaire", content: "Bienvenue à Umurerwa School — Année Scolaire 2025-2026", target_role: "ALL" },
          { id: "2", title: "Inscriptions", content: "Inscriptions ouvertes pour la Crèche, la Maternelle et l'École Primaire", target_role: "ALL" },
          { id: "3", title: "Activités", content: "Découvrez nos ateliers d'éveil, clubs artistiques et cours de renforcement", target_role: "ALL" },
        ]);
      }
    };
    load();
  }, []);

  if (announcements.length === 0) return null;

  const sep = "   ◆   ";
  const doubled = [...announcements, ...announcements, ...announcements];
  const itemText = doubled.map((a) => (a.title ? a.title + " : " + a.content : a.content)).join(sep);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-slate-950 border-t border-amber-500/30 shadow-2xl overflow-hidden select-none">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white shrink-0 z-10 font-bold">
        <Radio className="h-4 w-4 animate-pulse text-white" />
        <span className="text-xs uppercase tracking-widest whitespace-nowrap font-display">
          INFOS ÉCOLE
        </span>
      </div>

      <div className="w-0 h-0 border-t-[40px] border-t-transparent border-b-0 border-l-[16px] border-l-red-600 shrink-0 z-10" />

      <div
        className="flex-1 overflow-hidden cursor-pointer flex items-center bg-slate-900/90 backdrop-blur-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        title="Survolez pour mettre en pause"
      >
        <div
          ref={tickerRef}
          className="whitespace-nowrap inline-block py-2"
          style={{ animation: paused ? "none" : "ticker-scroll 95s linear infinite" }}
        >
          <span className="text-slate-100 text-sm font-medium font-body px-6 tracking-wide">
            {itemText}
          </span>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-slate-950 pointer-events-none z-10" />

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default NewsTickerBar;
