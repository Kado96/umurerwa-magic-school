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

const PROGRAMS: Record<string, any> = {
  "universite": {
    icon: GraduationCap,
    badge: "Enseignement Supérieur",
    slug: "universite",
    title: "Université & Facultés d'Umurerwa Academy",
    subtitle: "Licence · Master · Doctorat",
    tagline: "Formez-vous aux plus hauts standards académiques, au cœur de l'Afrique.",
    heroGradient: "from-blue-900 via-blue-800 to-indigo-900",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200",
    accentText: "text-blue-900",
    accentBadge: "bg-blue-100 text-blue-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
    readingTime: "8 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "3 à 8 ans", students: "500+ étudiants", diplomas: ["Licence (Bac+3)", "Master (Bac+5)", "Doctorat (Bac+8)"], languages: ["Français", "Anglais", "Kirundi"] },
    intro: "Umurerwa Academy ouvre les portes de l'enseignement supérieur à une génération de leaders, chercheurs et innovateurs burundais. Notre université propose des formations diplômantes de niveau LMD dans les domaines les plus porteurs.",
    highlights: [
      "Formations LMD accréditées par le Ministère de l'Éducation Supérieure du Burundi",
      "Laboratoires de recherche et ateliers technologiques de pointe",
      "Partenariats actifs avec des universités européennes et africaines",
      "Programme d'insertion professionnelle et stage obligatoire en entreprise",
      "Bibliothèque universitaire avec ressources numériques accessibles 24h/24",
    ],
    sections: [
      {
        icon: BookMarked,
        title: "Nos facultés et filières",
        content: [
          "**Sciences Informatiques & IA** — Développement logiciel, cybersécurité, data science, IA appliquée.",
          "**Gestion des Entreprises & Finance** — Comptabilité, finance internationale, entrepreneuriat, marketing digital.",
          "**Droit & Sciences Politiques** — Droit des affaires, droit international, sciences administratives.",
          "**Sciences de la Santé** — Médecine générale, soins infirmiers, santé publique.",
        ]
      },
      {
        icon: FlaskConical,
        title: "Recherche & Innovation",
        content: [
          "Umurerwa Academy investit massivement dans la recherche appliquée. Chaque faculté dispose de son laboratoire de recherche.",
          "Notre **incubateur de startups** accompagne les meilleurs projets étudiants de l'idée au financement.",
        ]
      }
    ],
    cta: "Déposer une demande d'admission",
    ctaLink: "/inscription",
    nextSlug: "lycee",
    nextTitle: "Lycée & Secondaire",
  },
  "lycee": {
    icon: Building2,
    badge: "Lycée & Secondaire",
    slug: "lycee",
    title: "Lycée & Enseignement Secondaire",
    subtitle: "Sections Générales · Techniques · Professionnelles",
    tagline: "Une préparation solide aux examens d'État et à l'enseignement supérieur.",
    heroGradient: "from-indigo-900 via-indigo-800 to-violet-900",
    accentBg: "bg-indigo-50",
    accentBorder: "border-indigo-200",
    accentText: "text-indigo-900",
    accentBadge: "bg-indigo-100 text-indigo-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
    readingTime: "6 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "4 ans (S1 à S4)", students: "800+ élèves", diplomas: ["Diplôme d'État (Bac)", "Brevet de Technicien"], languages: ["Français", "Anglais", "Kirundi"] },
    intro: "Le lycée Umurerwa Academy est reconnu pour ses taux d'excellence aux examens nationaux d'État. Nous préparons chaque élève à réussir son baccalauréat.",
    highlights: [
      "Taux de réussite supérieur à 92% aux examens nationaux d'État",
      "Laboratoires équipés de chimie, physique, biologie et informatique",
      "Classes de soutien et tutorat personnalisé par les professeurs",
    ],
    sections: [
      {
        icon: BookMarked,
        title: "Sections & filières proposées",
        content: [
          "**Section Scientifique (S)** — Mathématiques avancées, Sciences Physiques, Chimie.",
          "**Section Littéraire (L)** — Littérature française, Philosophie, Histoire-Géo.",
          "**Section Économique (E)** — Gestion, Commerce, Comptabilité, Économie.",
          "**Section Technique Informatique (TI)** — Développement web, réseaux, bases de données.",
        ]
      }
    ],
    cta: "S'inscrire au lycée",
    ctaLink: "/inscription",
    nextSlug: "primaire",
    nextTitle: "École Primaire",
  },
  "primaire": {
    icon: BookOpen,
    badge: "École Primaire",
    slug: "primaire",
    title: "École Primaire & Fondamentale",
    subtitle: "Du CP au CM2 · Acquisition des fondamentaux",
    tagline: "Les bases solides d'une vie entière d'apprentissage.",
    heroGradient: "from-emerald-900 via-emerald-800 to-teal-900",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-900",
    accentBadge: "bg-emerald-100 text-emerald-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1600&auto=format&fit=crop",
    readingTime: "5 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "6 ans (CP à CM2)", students: "600+ élèves", diplomas: ["Certificat de Fin de Primaire (CFP)", "Passage en secondaire garanti"], languages: ["Français", "Anglais", "Kirundi"] },
    intro: "L'école primaire d'Umurerwa Academy accueille les enfants de 6 à 12 ans dans un environnement bienveillant, stimulant et sécurisé. Notre pédagogie active place l'élève au centre de ses apprentissages.",
    highlights: [
      "Pédagogie active par projets et apprentissage collaboratif en petits groupes",
      "Maximum 25 élèves par classe pour un suivi individualisé",
      "Enseignement trilingue dès le CP : Français, Anglais, Kirundi",
      "Bibliothèque primaire de 3 000 ouvrages et accès numérique supervisé",
      "Cantine avec repas équilibrés et espace de jeux sécurisé",
      "Bulletins trimestriels détaillés et réunions parents-professeurs régulières",
    ],
    sections: [
      {
        icon: BookMarked,
        title: "Programme académique complet",
        content: [
          "**Français & Expression écrite** — Lecture courante, expression orale, dictée, rédaction et grammaire.",
          "**Mathématiques & Logique** — Calcul mental, géométrie, résolution de problèmes.",
          "**Sciences de l'Observation & Environnement** — Expériences simples, jardinage pédagogique, sorties naturalistes.",
          "**Histoire & Géographie du Burundi** — Connaissance de son pays et de sa culture.",
        ]
      },
      {
        icon: Heart,
        title: "Développement socio-émotionnel",
        content: [
          "Ateliers de communication non-violente et médiation entre pairs.",
          "Projets solidaires réalisés par chaque classe à chaque trimestre.",
        ]
      }
    ],
    cta: "Inscrire mon enfant au primaire",
    ctaLink: "/inscription",
    nextSlug: "maternelle",
    nextTitle: "Maternelle & Éveil",
  },
  "maternelle": {
    icon: Microscope,
    badge: "Maternelle & Éveil",
    slug: "maternelle",
    title: "Maternelle & Éveil de l'Enfance",
    subtitle: "De 2 à 6 ans · Développement & Socialisation",
    tagline: "Un espace de tendresse, de jeu et de découverte pour les tout-petits.",
    heroGradient: "from-amber-700 via-amber-800 to-orange-900",
    accentBg: "bg-amber-50",
    accentBorder: "border-amber-200",
    accentText: "text-amber-900",
    accentBadge: "bg-amber-100 text-amber-900 font-bold",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
    readingTime: "5 min de lecture",
    publishDate: "Rentrée 2026",
    details: { duration: "3-4 ans (PS, MS, GS)", students: "200+ tout-petits", diplomas: ["Attestation de Grande Section", "Préparation au CP certifiée"], languages: ["Français", "Kirundi", "Anglais"] },
    intro: "La maternelle Umurerwa Academy est conçue comme un cocon chaleureux où chaque enfant de 2 à 6 ans est accueilli avec douceur et bienveillance.",
    highlights: [
      "Encadrantes diplômées en éducation préscolaire et petite enfance",
      "Espaces de jeux intérieurs et extérieurs sécurisés et très stimulants",
      "Éveil musical, artistique et moteur intégré au quotidien",
    ],
    sections: [
      {
        icon: Lightbulb,
        title: "Notre philosophie d'éveil",
        content: [
          "Pédagogie inspirée des approches **Montessori, Reggio Emilia et Pikler**.",
          "Coins jeux thématiques stimulant l'imagination et la motricité.",
        ]
      }
    ],
    cta: "Inscrire mon enfant à la maternelle",
    ctaLink: "/inscription",
    nextSlug: "universite",
    nextTitle: "Université & Facultés",
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
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white">Prêt à rejoindre Umurerwa Academy ?</h3>
            <p className="text-slate-200 text-base max-w-lg mx-auto">
              Notre équipe pédagogique est disponible pour répondre à toutes vos questions et vous accompagner dans l'inscription.
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
