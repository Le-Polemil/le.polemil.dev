# 01 — Product Brief — polemil.dev v2

**Auteur** : PO (Paul-Émile Moreau)
**Date** : 2026-05-09
**Statut** : à valider
**Étape** : 1/5 — Cadrage produit

---

## 1. Vision

polemil.dev v2 est un CV en ligne qui n'explique pas mes compétences en design system : il **les incarne**. Le site se présente comme la documentation d'un design system — chaque section du CV est un composant documenté, chaque expérience est un variant, chaque token est une preuve de craft.

Là où un CV classique demande au lecteur de croire ce qu'on lui raconte, ce site lui fait *manipuler* la chose. La forme valide le fond.

---

## 2. Positionnement

**Baseline (à comprendre en 5 secondes)** : *Front-end engineer spécialisé en design systems.*

Le site doit servir indistinctement deux finalités à parts égales :
- décrocher un poste salarié (lead front, design system engineer, design engineer)
- décrocher des missions freelance (audit DS, refonte front, mentoring)

Le contenu et la hiérarchie de l'information ne privilégient aucun des deux : les deux profils trouvent ce qu'ils cherchent sans friction.

---

## 3. Personas

### P1 — Recruteur tech (lead, EM, RH technique)
- **Contexte** : reçoit ma candidature ou tombe sur mon profil, ouvre le site dans un onglet pendant qu'il regarde 12 autres profils.
- **Cherche** : niveau de séniorité réel, dernière expérience, stack maîtrisée, qu'est-ce qui me différencie d'un autre lead front.
- **Réussit en 30 secondes** : il a vu mon poste actuel, mes années d'XP, et il a perçu que ce site *est* un design system → il sait pourquoi me convoquer.

### P2 — Dev / lead qui audite mon code
- **Contexte** : mon CV remonte au tour technique, il veut vérifier que le contenu n'est pas du marketing creux. Ouvre l'onglet Sources, le code source, regarde la qualité.
- **Cherche** : comment c'est construit, est-ce que les patterns sont propres, est-ce que les tokens sont cohérents, est-ce que l'a11y est traitée sérieusement.
- **Réussit en 3-5 minutes** : il a navigué Foundations + un composant + a ouvert le repo GitHub. Il peut dire *"ce gars fait ce qu'il prêche"*.

### P3 — Designer / Design Lead
- **Contexte** : intéressé par le profil parce que je travaille à la frontière design/code. Ouvre le site pour voir si je parle son langage.
- **Cherche** : tokens, variants, mode Inspect, sensibilité visuelle, micro-interactions, cohérence du système.
- **Réussit en 2-3 minutes** : la métaphore Dev Mode lui est familière, il navigue les variants, il a compris que je peux tenir une conversation design avec lui.

### P4 — Futur client / CTO en quête de freelance
- **Contexte** : on lui a recommandé mon profil ou il cherche un design system engineer. Veut savoir s'il peut me déclencher un brief.
- **Cherche** : projets passés (preuves), façon de bosser, dispo, comment me joindre vite.
- **Réussit en 1-2 minutes** : il a vu deux ou trois projets pertinents dans l'Inspect panel, il a un bouton Calendly accessible. Le frottement vers la prise de contact est minimal.

---

## 4. Parcours principaux

| Persona | Entrée | Action clé | Sortie / succès |
|---|---|---|---|
| P1 Recruteur | Home (Foundations/Colors) | Clique `<Experience />` dans la sidebar | Voit poste actuel + variant timeline + tags stack ≤ 30s |
| P2 Dev | Home | Onglets Code & Props sur un composant + ouvre le repo | Audite la qualité ≤ 5 min |
| P3 Designer | Home | Joue avec les variants + observe le panneau Inspect | Reconnaît la métaphore Dev Mode ≤ 3 min |
| P4 Client | Home | Parcourt projets dans Inspect + clique Contact | Réserve un créneau Calendly ≤ 2 min |

---

## 5. Concept produit

### 5.1 Métaphore structurante
Le site est organisé exactement comme une doc Radix / shadcn / Polaris :

- **Foundations** : Couleurs, Typographie, Espacements (et plus tard : Iconography, Motion).
- **Components** : `<Experience />`, `<Project />`, `<Skill />`, `<Contact />`, `<About />`.
- **Patterns** : Timeline (parcours pro), À propos (storytelling perso).

Chaque composant CV est documenté avec **variants**, **props**, **tokens utilisés**, **screenshots de variants**, comme un vrai composant de design system.

### 5.2 Layout 3 zones (desktop)
1. **Sidebar** (gauche) — navigation Foundations / Components / Patterns.
2. **Zone de doc** (centre) — page courante, onglets Preview / Code / Props, grille des variants.
3. **Panneau Inspect** (droite) — Properties + Tokens utilisés + section "Used in".

**Décision UX clé** : le panneau Inspect est dynamique. Quand on sélectionne un item dans la liste centrale (une expérience donnée, un projet, une formation), c'est l'Inspect qui affiche le détail de cet item — *pas une page dédiée*. Conséquence : un seul item de la nav par composant, pas de profondeur d'URL inutile, et l'utilisateur reste dans le contexte de comparaison (les autres items restent visibles à gauche).

### 5.3 Header global
- Breadcrumb mono (`Components / Experience`)
- Toggle thème light/dark (View Transition)
- Toggle langue FR/EN (persisté en localStorage, **sans changement d'URL**)
- Badge version `v3.2.0` cliquable → ouvre un panneau changelog **hybride** : releases techniques du site + jalons de carrière mis en scène en release notes.

### 5.4 Données et backend
- **Pas de backend dédié au projet CV.** Toutes les données structurelles (expériences, projets, formations, skills, contact) vivent dans des fichiers TS typés dans le repo, version-controlled comme du code.
- **i18n modulaire par section.** Les contenus traduisibles sont séparés en fichiers par domaine fonctionnel pour faciliter l'édition sans toucher à des blobs JSON géants. Convention indicative : `src/i18n/fr/common.json`, `fr/experiences.json`, `fr/projects.json`, `fr/skills.json`, `fr/about.json`, `fr/contact.json`, et leurs équivalents `en/`.
- **Tout besoin backend (formulaire de contact, futurs endpoints) passe par bekoffice-v2.** Le CV reste un site statique Astro côté front ; le formulaire interne POST vers une route exposée par bekoffice-v2 (Strapi v5). Pas de nouveau service à créer pour ce projet.
- **Analytics** : Plausible ou Umami en SaaS, aucun backend custom requis.

---

## 6. Liste fonctionnelle (MoSCoW)

### Must — MVP démontrable
- Layout 3 colonnes responsive (desktop + drawer mobile + bottom sheet Inspect)
- Sidebar nav fonctionnelle
- Header complet (breadcrumb, toggle thème, toggle langue, badge version)
- Foundations/Colors avec interactions (swatches, hover, copie de token)
- Foundations/Typography
- Foundations/Spacing
- Composant `<Experience />` avec ses 4 variants (default / expanded / compact / timeline)
- Composant `<Project />` avec ses variants (card / hero / mini), pas de page détail
- Composant `<Skill />` avec ses variants (badge / bar / radar)
- Composant `<Contact />` (mailto + Calendly + LinkedIn / GitHub / réseaux + formulaire interne)
- Composant `<About />` (ton personnel narratif, easter eggs autorisés)
- Pattern Timeline (parcours pro chronologique)
- Pattern About (storytelling perso)
- Panneau Inspect dynamique connecté à la sélection (Experience / Project / Skill / formation)
- Bilingue FR + EN avec toggle persisté localStorage, sans changement d'URL
- Export PDF imprimable (via print stylesheet propre)
- Theme light/dark avec View Transition et `prefers-color-scheme` respecté
- Analytics privacy-first (Plausible ou Umami)
- A11y WCAG AA (focus visibles, contrastes, navigation clavier complète, `prefers-reduced-motion`)

### Should — souhaitable, post-MVP proche
- Onglets Preview / Code / Props sur chaque composant documenté
- Section "Used in" dans l'Inspect panel
- Changelog hybride dans le panneau du badge version
- Variants en scroll horizontal snappé (mobile)
- Open Graph + meta sociaux pour partage propre

### Could — agréable si temps disponible
- Mode Dev (overlay grid + dimensions au hover) — **explicitement Phase 2**
- Pattern "Case Study" deep-dive sur 1-2 projets phares
- **Pages détail par projet** (URL dédiée, hors Inspect panel) — Phase 2 ou backlog non planifié, à arbitrer plus tard si l'inspect ne suffit pas pour les projets les plus riches
- Foundations Iconography
- Foundations Motion (catalogue d'animations)
- Animations avancées (scroll-driven sur timeline, `@property` sur hovers)
- Easter eggs visibles seulement par dev (console, source HTML…)
- Lighthouse 100/100 sur les 4 catégories

### Won't (pas dans ce projet)
- CMS / back-office propre au CV (les données restent en TS dans le repo, par choix)
- **Backend dédié à polemil.dev** — tout besoin serveur passe par bekoffice-v2
- Blog / système d'articles
- Multi-langue au-delà de FR + EN
- Compte utilisateur, login, comments, like
- Routing i18n par préfixe d'URL (`/en/...`)
- A/B testing sur variantes du site

---

## 7. Critères de succès

### 7.1 Mesurables (techniques)
- Lighthouse ≥ 95 sur les 4 catégories en MVP, viser 100/100 en Phase 2
- LCP < 1.5s en 4G simulé
- 0 erreur axe-core sur les pages du MVP
- Bundle JS initial < 30 Ko (Astro 0-JS par défaut)
- Tests Playwright passent sur les parcours principaux des 4 personas

### 7.2 Comportementaux (Plausible)
- Taux de visiteurs qui interagissent avec un variant > 30 %
- Taux de visiteurs qui ouvrent l'onglet Code ou Props > 15 %
- Taux de visiteurs qui visitent au moins 2 sections > 50 %
- Durée moyenne sur le site > 90 s
- Au moins 5 clics Calendly + 5 clics mailto par mois en régime établi

### 7.3 Qualitatifs
- Au moins 3 retours spontanés positifs de pairs (designers ou devs front) dans les 2 semaines suivant la mise en ligne
- Le site est partagé sur au moins une newsletter ou compte de référence dans le milieu DS / front
- Lors d'un entretien, au moins un interlocuteur sur deux mentionne avoir trouvé le format singulier

---

## 8. Hors-scope explicite

Pour éviter les dérives en cours de route :

- **Pas de page projet dédiée au MVP**. Le détail vit dans l'Inspect panel. L'idée d'une URL dédiée par projet est gardée comme ticket de backlog hors MVP (Phase 2 ou non planifié), à rouvrir si on constate que le contenu déborde de l'Inspect.
- **Pas de routing i18n**. Toggle localStorage uniquement.
- **Pas de CMS**. Les données sont en TS dans le repo, version-controlled comme du code.
- **Pas de blog** ni de système d'articles.
- **Pas d'authentification** ni de zone privée.
- **Pas de compte client** / dashboard / mailing.
- **Pas de support de très anciens navigateurs**. Cible : evergreens (Chromium, Firefox, Safari récents). View Transitions, `@property`, container queries assumés.
- **Pas de SEO multilingue avancé**. Le bilinguisme local-only assume une perte de SEO côté EN, c'est un trade-off accepté par cohérence avec la décision UX.

---

## 9. Décisions PO consolidées

| Sujet | Décision |
|---|---|
| Public cible | Recruteurs salariés ET clients freelance (parts égales) |
| Bilinguisme | FR + EN, toggle header, localStorage, **même URL** |
| Repo | Refonte totale, repo neuf `Le-Polemil/le.polemil.dev` |
| Deadline | Aucune, qualité prime |
| Badge version | Hybride : semver site + storytelling carrière |
| Positionnement | Front-end engineer + Design Systems |
| Contact | Mailto + Calendly + réseaux + formulaire interne (les 4) |
| PDF | Oui dès le MVP |
| Ton "About" | Personnel et narratif, easter eggs autorisés |
| Analytics | Plausible / Umami (privacy-first) |
| Mode Dev overlay | Phase 2 |
| Pages projet | Aucune au MVP. Détail dans l'Inspect panel. Page dédiée par projet conservée comme ticket backlog hors MVP. |
| Données | Fichiers TS typés dans le repo, version-controlled. Pas de CMS, pas de backend dédié. |
| i18n | Fichiers JSON modulaires par section (`fr/common.json`, `fr/projects.json`, `fr/experiences.json`…) et leurs équivalents `en/`. |
| Besoins backend | Tout besoin serveur (formulaire de contact, futurs endpoints) passe par **bekoffice-v2**. Pas de nouveau service. |

---

## 10. Suite

À validation, on passe à l'étape 2 — UX/UI : maquette Figma complète (foundations, composants, écrans desktop + mobile, light + dark) et `02-ux-spec.md`.
