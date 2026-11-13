import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  GraduationCap, Building2, BookOpen, Microscope,
  CheckCircle2, Clock, Users, Award, Globe,
  ArrowLeft, ArrowRight, Star, ChevronRight,
  FlaskConical, Laptop, BookMarked, Trophy, Heart, Lightbulb
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTickerBar from "@/components/NewsTickerBar";

import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Baby, BookOpen, Heart,
  CheckCircle2, Clock, Users, Award, Globe,
  ArrowLeft, ArrowRight, Star, ChevronRight,
  FlaskConical, Laptop, BookMarked, Trophy, Lightbulb, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsTickerBar from "@/components/NewsTickerBar";

const PROGRAMS: Record<string, any> = {
  "creche": {
    icon: Baby,
    badge: "Crèche & Garderie",
    slug: "creche",
    title: "Crèche & Garderie d'Umurerwa School",
    subtitle: "De 3 mois à 2 ans · Petite Enfance",
    tagline: "Un cocon d'amour, de sécurité et d'éveil pour les tout-petits.",
    heroGradient: "from-amber-700 via-amber-800 to-orange-900",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-900",
    accentBadge: "bg-amber-100 text-amber-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop",
    readingTime: "4 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "Dès 3 mois", students: "60 tout-petits", diplomas: ["Carnet d'éveil personnalisé", "Passage en Maternelle"], languages: ["Français", "Kirundi"] },
    intro: "La crèche d'Umurerwa School offre aux tout-petits un univers sécurisé, chaleureux et stimulants. Notre personnel soignant et éducatif dévoué veille au bien-être, à la motricité et aux premières découvertes sensorielles de chaque enfant.",
    highlights: [
      "Personnel diplômé en petite enfance, puériculture et premiers secours",
      "Espaces calmes, dortoirs climatisés et zones de motricité protégées",
      "Stimulation sensorielle précoce adaptée au rythme de chaque bébé",
      "Protocoles d'hygiène stricts et suivi de santé quotidien",
      "Communication quotidienne détaillée avec les parents",
    ],
    sections: [
      {
        icon: Heart,
        title: "Notre approche bienveillante",
        content: [
          "**Éveil sensoriel et moteur** — Tapis d'éveil, jeux d'encastrement, comptines et stimulation tactile douce.",
          "**Rythme individuel respecté** — Repas personnalisés, siestes adaptées et attention constante de nos puéricultrices.",
          "**Sécurité absolue** — Locaux sécurisés, accès contrôlé et matériel adapté aux tout-petits.",
        ]
      },
      {
        icon: Lightbulb,
        title: "Socialisation précoce",
        content: [
          "Les enfants apprennent en douceur la vie en communauté, le partage et la découverte de l'autre sous le regard attentif des éducatrices.",
        ]
      }
    ],
    cta: "Inscrire mon bébé à la crèche",
    ctaLink: "/inscription",
    nextSlug: "maternelle",
    nextTitle: "École Maternelle",
  },
  "maternelle": {
    icon: Heart,
    badge: "École Maternelle",
    slug: "maternelle",
    title: "École Maternelle d'Umurerwa School",
    subtitle: "De 2 à 6 ans · Petite, Moyenne & Grande Section",
    tagline: "Un espace de tendresse, de jeu et d'apprentissage pour grandir heureux.",
    heroGradient: "from-rose-800 via-rose-700 to-pink-900",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200",
    accentText: "text-rose-900",
    accentBadge: "bg-rose-100 text-rose-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
    readingTime: "5 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "3-4 ans (PS, MS, GS)", students: "200+ enfants", diplomas: ["Attestation de Grande Section", "Préparation au CP certifiée"], languages: ["Français", "Kirundi", "Initiation Anglais"] },
    intro: "La maternelle Umurerwa School est conçue comme un cocon chaleureux où chaque enfant de 2 à 6 ans est accueilli avec bienveillance. Nos éducatrices passionnées favorisent le jeu libre, la découverte sensorielle et l'apprentissage des premières notions.",
    highlights: [
      "Encadrantes formées à la pédagogie active et à l'éducation préscolaire",
      "Espaces de jeux intérieurs et extérieurs sécurisés et très stimulants",
      "Éveil musical, artistique, corporel et initiation aux lettres et chiffres",
      "Préparation rigoureuse et rassurante au passage vers le CP",
    ],
    sections: [
      {
        icon: Lightbulb,
        title: "Notre pédagogie d'éveil",
        content: [
          "Pédagogie inspirée des approches actives : **Montessori, Reggio Emilia et Decroly**.",
          "Coins jeux thématiques stimulant l'imagination, le langage et la motricité fine.",
          "Ateliers quotidiens de graphisme, manipulation mathématique et découverte du monde.",
        ]
      },
      {
        icon: Heart,
        title: "Bien-être et socialisation",
        content: [
          "Apprentissage de la vie collective, respect des règles, gestion des émotions et entraide.",
          "Temps calmes, histoires contées et activités motrices en plein air.",
        ]
      }
    ],
    cta: "Inscrire mon enfant en maternelle",
    ctaLink: "/inscription",
    nextSlug: "primaire",
    nextTitle: "École Primaire",
  },
  "primaire": {
    icon: BookOpen,
    badge: "École Primaire",
    slug: "primaire",
    title: "École Primaire & Fondamentale d'Umurerwa School",
    subtitle: "De la 1ère à la 6ème année · Acquisition des fondamentaux",
    tagline: "Les bases solides d'une vie entière de savoir, de curiosité et de réussite.",
    heroGradient: "from-emerald-900 via-emerald-800 to-teal-900",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-900",
    accentBadge: "bg-emerald-100 text-emerald-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
    readingTime: "5 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "6 ans (1ère à 6ème)", students: "600+ élèves", diplomas: ["Certificat de Fin d'Études Primaires", "Passage en Fondamental supérieur"], languages: ["Français", "Anglais", "Kirundi"] },
    intro: "L'école primaire d'Umurerwa School accueille les enfants de 6 à 12 ans dans un environnement d'apprentissage stimulant, rigoureux et bienveillant. Notre enseignement garantit la maîtrise complète des compétences fondamentales.",
    highlights: [
      "Programme académique homologué avec un encadrement personnalisé",
      "Effectifs maîtrisés pour permettre un accompagnement individuel de chaque élève",
      "Enseignement trilingue dès le primaire : Français, Anglais, Kirundi",
      "Bibliothèque scolaire riche, salle informatique et ateliers scientifiques",
      "Cantine équilibrée, cour arborée et activités parascolaires variées",
    ],
    sections: [
      {
        icon: BookMarked,
        title: "Programme académique complet",
        content: [
          "**Français & Expression écrite** — Maîtrise de la lecture fluide, dictée, enrichissement du vocabulaire et grammaire structurée.",
          "**Mathématiques & Logique** — Calcul mental, géométrie pratique, opérations et résolution de problèmes.",
          "**Sciences & Éveil Technologique** — Découverte de l'environnement, du vivant, expérimentation et initiation à l'informatique.",
          "**Histoire, Géographie & Citoyenneté** — Découverte du Burundi, ouverture sur le monde et valeurs civiques.",
        ]
      },
      {
        icon: Heart,
        title: "Épanouissement et valeurs",
        content: [
          "Développement de l'autonomie, de la pensée critique et de la confiance en soi.",
          "Projets coopératifs, théâtre d'école, chorale et activités sportives.",
        ]
      }
    ],
    cta: "Inscrire mon enfant au primaire",
    ctaLink: "/inscription",
    nextSlug: "activites",
    nextTitle: "Activités & Périscolaire",
  },
  "activites": {
    icon: Sparkles,
    badge: "Activités & Périscolaire",
    slug: "activites",
    title: "Activités & Périscolaire d'Umurerwa School",
    subtitle: "Ateliers créatifs, sportifs et soutien scolaire",
    tagline: "Cultiver les talents, la créativité et la passion dès le plus jeune âge.",
    heroGradient: "from-blue-900 via-indigo-900 to-violet-900",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200",
    accentText: "text-blue-900",
    accentBadge: "bg-blue-100 text-blue-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1600&auto=format&fit=crop",
    readingTime: "4 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "Toute l'année", students: "Tous niveaux", diplomas: ["Certificats d'ateliers", "Médailles sportives"], languages: ["Français", "Anglais", "Kirundi"] },
    intro: "Au-delà des heures de classe, Umurerwa School propose un programme complet d'activités périscolaires pour permettre à chaque enfant d'explorer ses passions, de bouger et d'apprendre avec enthousiasme.",
    highlights: [
      "Clubs artistiques : peinture, modelage, dessin et arts plastiques",
      "Éveil musical et chorale d'école pour tous les âges",
      "Activités physiques : football, mini-basket, athlétisme et gymnastique douce",
      "Ateliers d'éveil aux contes et club de lecture en bibliothèque",
      "Aide aux devoirs et études surveillées en fin d'après-midi",
    ],
    sections: [
      {
        icon: Sparkles,
        title: "Les ateliers artistiques et culturels",
        content: [
          "**Arts plastiques & Dessin** — Expression créative par la couleur, le découpage et les formes.",
          "**Musique & Danse** — Rythme, percussion, chants traditionnels et modernes pour développer l'oreille musicale.",
          "**Théâtre et contes** — Prendre la parole en public, vaincre la timidité et incarner des récits inspirants.",
        ]
      },
      {
        icon: Trophy,
        title: "Sport et motricité",
        content: [
          "Développement de la coordination motrice, respect des règles du jeu et esprit d'équipe sur des terrains sécurisés.",
        ]
      }
    ],
    cta: "Découvrir les inscriptions",
    ctaLink: "/inscription",
    nextSlug: "creche",
    nextTitle: "Crèche & Garderie",
  }
};

const ProgramArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const program = slug ? PROGRAMS[slug] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 font-body">
        <p className="text-slate-600 text-lg mb-4">Programme introuvable.</p>
        <button onClick={() => navigate("/")} className="text-blue-900 font-bold underline">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const Icon = program.icon;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-body pb-12">
      <Navbar />

      {/* Hero Header */}
      <section className={`relative bg-gradient-to-br ${program.heroGradient} text-white`}>
        <div className="absolute inset-0 overflow-hidden">
          <img src={program.heroImage} alt={program.title} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 md:px-8 max-w-5xl pt-24 pb-16">
          <nav className="flex items-center gap-2 text-white/70 text-xs md:text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4 text-white/50" />
            <Link to="/#apropos" className="hover:text-white transition-colors">Programmes</Link>
            <ChevronRight className="w-4 h-4 text-white/50" />
            <span className="text-white font-semibold">{program.badge}</span>
          </nav>

          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <Icon className="w-4 h-4 text-amber-300" />
            {program.badge}
          </span>

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow">
            {program.title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl font-light leading-relaxed">
            {program.tagline}
          </p>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm text-white/90">
            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20"><Clock className="w-4 h-4 text-amber-300" /> {program.readingTime}</span>
            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20"><Award className="w-4 h-4 text-amber-300" /> {program.publishDate}</span>
            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20"><Users className="w-4 h-4 text-amber-300" /> {program.details.students}</span>
          </div>
        </div>
      </section>

      {/* Main Content - Fond Blanc et texte très lisible */}
      <main className="container mx-auto px-4 md:px-8 max-w-5xl py-14 flex flex-col lg:flex-row gap-12">
        <article className="flex-1 min-w-0 space-y-10">
          <p className="text-slate-800 text-lg md:text-xl leading-relaxed border-l-4 border-amber-500 pl-6 italic font-light bg-slate-50 p-6 rounded-r-2xl border border-slate-200">
            {program.intro}
          </p>

          <div className={`${program.accentBg} border ${program.accentBorder} rounded-3xl p-7 shadow-sm`}>
            <h2 className={`font-display text-xl font-bold ${program.accentText} mb-5 flex items-center gap-2.5`}>
              <Star className="w-5 h-5 text-amber-500" />
              Les points forts du programme
            </h2>
            <ul className="space-y-3.5">
              {program.highlights.map((h: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 text-sm md:text-base font-normal leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            {program.sections.map((s: any, i: number) => {
              const SIcon = s.icon;
              return (
                <section key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <SIcon className="w-5 h-5 text-blue-900" />
                    </span>
                    {s.title}
                  </h2>
                  <div className="space-y-4 pt-2">
                    {s.content.map((para: string, j: number) => (
                      <p key={j} className="text-slate-700 text-base leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                        }}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-14 p-8 md:p-10 bg-blue-900 border border-blue-800 rounded-3xl text-white text-center shadow-xl space-y-4">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white">Prêt à rejoindre Umurerwa School ?</h3>
            <p className="text-slate-200 text-base max-w-lg mx-auto">
              Notre équipe pédagogique est disponible pour répondre à toutes vos questions et vous accompagner dans l'inscription de votre enfant.
            </p>
            <div className="pt-2">
              <Link to={program.ctaLink} className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-base px-8 py-4 rounded-2xl shadow-lg transition-all">
                {program.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>

        <aside className="lg:w-80 shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md sticky top-24">
            <h3 className="font-display text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">Informations clés</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Durée</p>
                  <p className="text-sm text-slate-900 font-semibold">{program.details.duration}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Effectifs</p>
                  <p className="text-sm text-slate-900 font-semibold">{program.details.students}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Langues</p>
                  <p className="text-sm text-slate-900 font-semibold">{program.details.languages.join(", ")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">Diplômes</p>
                  <div className="space-y-1.5">
                    {program.details.diplomas.map((d: string, i: number) => (
                      <span key={i} className={`block text-xs ${program.accentBadge} px-3 py-1 rounded-full`}>{d}</span>
                    ))}
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <Link to={program.ctaLink} className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-3.5 rounded-xl shadow transition text-sm">
                {program.cta}
              </Link>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
      <NewsTickerBar />
    </div>
  );
};

export default ProgramArticlePage;
