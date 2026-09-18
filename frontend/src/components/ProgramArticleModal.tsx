import React from "react";
import {
  X, GraduationCap, Building2, BookOpen, Microscope,
  CheckCircle2, Clock, Users, Award, ChevronRight,
  BookMarked, FlaskConical, Globe, Music, Dumbbell, Palette,
  Star, ArrowRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProgramArticle {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  heroColor: string;        // Tailwind gradient classes
  accentColor: string;      // e.g. "blue"
  overview: string;
  highlights: string[];
  details: {
    duration: string;
    students: string;
    diplomas: string[];
    languages: string[];
  };
  sections: { title: string; content: string }[];
  cta: string;
}

// ─── Static article data per program ────────────────────────────────────────
const articles: Record<string, ProgramArticle> = {
  "0": {
    id: "0",
    icon: GraduationCap,
    badge: "Enseignement Supérieur",
    title: "Université & Facultés",
    subtitle: "Licence · Master · Doctorat",
    tagline: "Formez-vous aux plus hauts standards académiques, au coeur de l'Afrique.",
    heroColor: "from-blue-900 via-blue-800 to-indigo-900",
    accentColor: "blue",
    overview:
      "La branche universitaire d'Umurerwa Academy est un établissement d'enseignement supérieur reconnu, proposant des formations diplômantes de niveau LMD (Licence - Master - Doctorat) dans les domaines des sciences, du droit, de la gestion, de l'ingénierie et des technologies de l'information. Notre corps professoral composé d'experts nationaux et internationaux garantit une formation rigoureuse, ancrée dans les réalités africaines et ouverte sur le monde.",
    highlights: [
      "Formations LMD accréditées par le Ministère de l'Éducation Supérieure",
      "Laboratoires de recherche et ateliers technologiques de pointe",
      "Partenariats avec des universités européennes et africaines",
      "Programme d'insertion professionnelle et stage en entreprise",
      "Bibliothèque universitaire avec ressources numériques 24h/24",
    ],
    details: {
      duration: "3 à 8 ans selon le cycle",
      students: "500+ étudiants universitaires",
      diplomas: ["Licence (Bac+3)", "Master (Bac+5)", "Doctorat (Bac+8)"],
      languages: ["Français", "Anglais", "Kirundi"],
    },
    sections: [
      {
        title: "Facultés disponibles",
        content:
          "Sciences Informatiques & Intelligence Artificielle, Gestion des Entreprises & Finance, Droit & Sciences Politiques, Sciences de la Santé & Médecine, Sciences de l'Ingénieur, Communication & Journalisme. Chaque faculté dispose de son propre laboratoire, amphithéâtre et espace de coworking étudiant.",
      },
      {
        title: "Recherche & Innovation",
        content:
          "Umurerwa Academy encourage la recherche appliquée à travers des programmes de bourses, des incubateurs de startups étudiantes et des partenariats avec des organisations internationales. Chaque année, nos meilleurs mémoires font l'objet de publications scientifiques.",
      },
      {
        title: "Vie universitaire",
        content:
          "Résidences universitaires, restaurant académique, associations d'étudiants, clubs culturels, sportifs et scientifiques. Des événements de networking permettent aux étudiants de rencontrer des professionnels et des entrepreneurs burundais et de la région.",
      },
    ],
    cta: "Déposer une demande d'admission",
  },
  "1": {
    id: "1",
    icon: Building2,
    badge: "Lycée & Secondaire",
    title: "Lycée & Enseignement Secondaire",
    subtitle: "Sections Générales · Techniques · Professionnelles",
    tagline: "Une préparation solide aux examens d'État et à l'enseignement supérieur.",
    heroColor: "from-indigo-900 via-indigo-800 to-violet-900",
    accentColor: "indigo",
    overview:
      "Le lycée Umurerwa Academy propose un enseignement secondaire d'excellence en sections générales (sciences, lettres, économie), techniques et professionnelles. Avec des laboratoires équipés, des salles informatiques et des enseignants qualifiés, nos élèves atteignent des taux de réussite aux examens d'État parmi les plus élevés de la région.",
    highlights: [
      "Taux de réussite supérieur à 92% aux examens nationaux d'État",
      "Salles informatiques et laboratoires de chimie/physique/biologie",
      "Classes de soutien et tutorat personnalisé",
      "Orientation scolaire et bilan professionnel",
      "Partenariats avec les meilleures universités pour l'orientation",
    ],
    details: {
      duration: "3 à 4 ans (Secondaire 1 à 4)",
      students: "800+ élèves lycéens",
      diplomas: ["Diplôme d'État (Bac)", "Brevet de Technicien", "CAP Professionnel"],
      languages: ["Français", "Anglais", "Kirundi"],
    },
    sections: [
      {
        title: "Sections proposées",
        content:
          "Section Scientifique (Mathématiques, Sciences Physiques, Sciences Naturelles), Section Littéraire (Littérature, Philosophie, Histoire-Géo), Section Économique (Gestion, Commerce, Comptabilité), Section Technique Informatique, Section Technique Électronique.",
      },
      {
        title: "Préparation aux examens d'État",
        content:
          "Des sessions intensives de révision, des banques de sujets corrigés et un accompagnement individualisé par les professeurs titulaires assurent à chaque élève les meilleures chances de succès. Les classes de Terminale bénéficient de planning de révision structuré sur toute l'année.",
      },
      {
        title: "Activités parascolaires",
        content:
          "Clubs de débat, olympiades scientifiques et mathématiques, ateliers d'entrepreneuriat, équipes sportives, théâtre et arts de la scène. Un programme complet pour développer les compétences transversales de nos lycéens.",
      },
    ],
    cta: "S'inscrire au lycée",
  },
  "2": {
    id: "2",
    icon: BookOpen,
    badge: "École Primaire",
    title: "École Primaire & Fondamentale",
    subtitle: "Du CP au CM2 · Acquisition des fondamentaux",
    tagline: "Les bases solides d'une vie entière d'apprentissage.",
    heroColor: "from-emerald-900 via-emerald-800 to-teal-900",
    accentColor: "emerald",
    overview:
      "L'école primaire Umurerwa Academy accueille les enfants de 6 à 12 ans dans un cadre sécurisé et stimulant. Notre pédagogie active s'appuie sur des projets interdisciplinaires, des ateliers créatifs et une attention particulière portée au développement socio-émotionnel de chaque enfant. Nous formons des esprits curieux, autonomes et bienveillants.",
    highlights: [
      "Pédagogie active par projets et apprentissage collaboratif",
      "Petits effectifs (max 25 élèves par classe) pour un suivi individuel",
      "Enseignement trilingue : Français, Anglais, Kirundi",
      "Bibliothèque primaire et accès numérique supervisé",
      "Cantine équilibrée et espace de jeux sécurisé",
    ],
    details: {
      duration: "6 ans (CP à CM2)",
      students: "600+ élèves primaires",
      diplomas: ["Certificat de Fin de Primaire (CFP)", "Passage en secondaire"],
      languages: ["Français", "Anglais", "Kirundi"],
    },
    sections: [
      {
        title: "Programme académique",
        content:
          "Lecture et expression écrite, Mathématiques et logique, Sciences d'observation et environnement, Géographie et Histoire du Burundi, Langues (Français, Anglais, Kirundi), Éducation à la citoyenneté, Informatique initiation dès le CE2.",
      },
      {
        title: "Développement socio-émotionnel",
        content:
          "Ateliers de communication non-violente, médiation et résolution de conflits entre pairs, journaux de classe, projets solidaires avec la communauté. Nous accordons autant d'importance au développement émotionnel qu'au développement cognitif.",
      },
      {
        title: "Activités et clubs",
        content:
          "Atelier peinture et arts plastiques, club de lecture, musique et chorale, sports collectifs et athlétisme, jardin pédagogique, ateliers cuisine et sciences du vivant. Les mercredis après-midi sont dédiés aux activités parascolaires.",
      },
    ],
    cta: "Inscrire mon enfant au primaire",
  },
  "3": {
    id: "3",
    icon: Microscope,
    badge: "Maternelle & Éveil",
    title: "Maternelle & Éveil de l'Enfance",
    subtitle: "De 2 à 6 ans · Développement & Socialisation",
    tagline: "Un espace de tendresse, de jeu et de découverte pour les tout-petits.",
    heroColor: "from-amber-700 via-amber-800 to-orange-900",
    accentColor: "amber",
    overview:
      "La maternelle Umurerwa Academy est un espace pensé pour accueillir les enfants de 2 à 6 ans dans les meilleures conditions d'éveil et d'épanouissement. Nos éducatrices spécialisées accompagnent chaque enfant dans son rythme propre, en favorisant le jeu libre, la découverte sensorielle et les premières interactions sociales positives.",
    highlights: [
      "Encadrantes diplômées en petite enfance et éducation préscolaire",
      "Espaces de jeux intérieurs et extérieurs sécurisés et stimulants",
      "Éveil musical, artistique et moteur intégré au quotidien",
      "Liaison régulière avec les familles (carnets, réunions mensuelles)",
      "Repas et sieste adaptés à chaque tranche d'âge",
    ],
    details: {
      duration: "3 à 4 ans (Petite, Moyenne, Grande section)",
      students: "200+ tout-petits",
      diplomas: ["Attestation de Grande Section", "Préparation au CP"],
      languages: ["Français", "Kirundi", "Initiation Anglais"],
    },
    sections: [
      {
        title: "Notre pédagogie d'éveil",
        content:
          "Inspirée des meilleures pratiques Montessori et des pédagogies actives, notre approche place l'enfant au centre de ses apprentissages. Les coins jeux, les ateliers sensoriels et les projets collectifs permettent aux enfants d'apprendre en faisant, à leur propre rythme.",
      },
      {
        title: "Développement psychomoteur",
        content:
          "Séances de psychomotricité hebdomadaires, parcours moteurs adaptés, ateliers graphisme et pré-écriture, activités de manipulation et de motricité fine. Chaque compétence est travaillée progressivement avec des outils adaptés à l'âge.",
      },
      {
        title: "Transition vers le primaire",
        content:
          "La Grande Section prépare activement les enfants à l'entrée au CP : travail en petits groupes sur la conscience phonologique, les premiers chiffres, la vie en collectivité et la gestion de l'autonomie. Un passage de relais en douceur avec l'équipe primaire est organisé en fin d'année.",
      },
    ],
    cta: "Inscrire mon enfant à la maternelle",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  cardIndex: number | null;
  onClose: () => void;
}

const ProgramArticleModal: React.FC<Props> = ({ cardIndex, onClose }) => {
  if (cardIndex === null) return null;
  const article = articles[String(cardIndex)];
  if (!article) return null;

  const Icon = article.icon;

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      <div className="relative bg-white w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">

        {/* ── Hero Header ───────────────────────────────────────────── */}
        <div className={`relative bg-gradient-to-br ${article.heroColor} px-6 sm:px-10 pt-10 pb-8 text-white shrink-0`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-body font-bold uppercase tracking-widest bg-white/20 border border-white/30 px-3 py-1 rounded-full mb-4">
            <Icon className="w-3.5 h-3.5" />
            {article.badge}
          </span>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-2">
            {article.title}
          </h1>
          <p className="font-body text-sm sm:text-base text-white/80 font-medium mb-4">
            {article.subtitle}
          </p>
          <p className="font-body text-white/70 text-sm max-w-xl italic">
            "{article.tagline}"
          </p>

          {/* Stats Row */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-body text-xs font-semibold text-white">{article.details.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
              <Users className="w-4 h-4 text-amber-300" />
              <span className="font-body text-xs font-semibold text-white">{article.details.students}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
              <Globe className="w-4 h-4 text-amber-300" />
              <span className="font-body text-xs font-semibold text-white">{article.details.languages.join(" · ")}</span>
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 sm:px-10 py-8 space-y-8">

          {/* Overview */}
          <div>
            <p className="font-body text-slate-700 text-base leading-relaxed">
              {article.overview}
            </p>
          </div>

          {/* Points forts */}
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Points forts du programme
            </h2>
            <ul className="space-y-2.5">
              {article.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-body text-slate-700 text-sm leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diplômes */}
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-700" />
              Diplômes & certifications délivrés
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.details.diplomas.map((d, i) => (
                <span
                  key={i}
                  className="font-body text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Sections détaillées */}
          <div className="space-y-6">
            {article.sections.map((s, i) => (
              <div key={i} className="border-l-4 border-amber-400 pl-5">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4 pb-2">
            <a
              href="/inscription"
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${article.heroColor} text-white font-body font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 text-sm`}
            >
              {article.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="font-body text-xs text-slate-400 mt-3">
              Inscriptions ouvertes. Notre équipe vous contacte sous 24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramArticleModal;
