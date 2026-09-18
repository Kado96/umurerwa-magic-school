# Spécification UI/UX et Architecture Composants React
## Application : Umurerwa Magic School

> **Auteur** : Senior UI/UX & Product Designer  
> **Date** : 17 Septembre 2026  
> **Statut** : Validé pour implémentation Frontend (React + Tailwind CSS + Lucide Icons + Shadcn UI)  

---

## 1. Directives Design System & Charte Graphique Existante

L'application **Umurerwa Magic School** s'appuie sur un univers visuel ludique, bienveillant, moderne et hautement lisible, adapté à un cadre éducatif africain (Burundi) tout en répondant aux normes internationales d'ergonomie et d'impression.

### 1.1 Palette de Couleurs & Tokens Sémantiques

| Rôle Visuel | Token CSS / Tailwind | Valeur / Code Couleur | Usage principal |
| :--- | :--- | :--- | :--- |
| **Fond Général** | `bg-background` | `hsl(40 60% 97%)` | Fond crème doux pour réduire la fatigue visuelle |
| **Cartes & Surfaces** | `bg-card` | `hsl(0 0% 100%)` | Surfaces blanches avec ombres douces `shadow-playful` |
| **Couleur Primaire** | `bg-primary` / `text-primary` | `hsl(340 82% 55%)` (Rose Vif / Magenta) | Boutons d'action principale, accents d'attention |
| **Couleur Secondaire** | `bg-secondary` | `hsl(45 100% 60%)` (Jaune Solaire) | Badges d'état, boutons secondaires |
| **Accent Turquoise** | `bg-accent` | `hsl(170 70% 45%)` (Teal) | Statuts d'excellence, validation, succès |
| **Orange Élevé** | `bg-letter-orange` | `hsl(25 95% 55%)` | Saisie des notes, avertissements modérés |
| **Bleu Éducatif** | `bg-letter-blue` | `hsl(210 85% 55%)` | Bulletins scolaires, navigation, actions d'exportation |
| **Vert Validation** | `bg-letter-green` | `hsl(140 70% 42%)` | Paiements reçus, mentions honorifiques |
| **Ombre Ludique** | `shadow-playful` | `0 8px 30px -8px hsl(340 82% 55% / 0.15)` | Élévation des cartes interactives et modales |

---

## 2. Composants Clés Spécifiés

1. **`GradebookMatrix.tsx` & `GradeEntryModal.tsx`** : Table matricielle avec colonnes élèves sticky, raccourcis clavier, surlignage couleur des moyennes, et indicateurs d'état (Brouillon, Publié, Verrouillé).
2. **`ReportCardView.tsx` & `ReportCardModal.tsx`** : Bulletin scolaire format A4 imprimable avec en-tête républicain / école, tableau par matière, moyennes/rangs, avis du conseil de classe, et bloc QR code d'authenticité.
3. **`ReceiptView.tsx`** : Reçu de paiement scolaire avec ventilation des frais, total perçu, reste à payer, statut du règlement et QR code de vérification financière.

Document complet disponible dans les artefacts du projet.
