# 03 — Tech Stack — polemil.dev v2

**Auteur** : Lead Dev (Paul-Émile Moreau)
**Date** : 2026-05-10
**Statut** : à valider
**Étape** : 3/5 — Choix techno
**Briefs amont** : `01-product-brief.md`, `02-ux-spec.md`

---

## 1. Vision technique

Le site **incarne** ce qu'il prétend incarner. Le stack doit donc :
- Démontrer une maîtrise CSS moderne (l'argument central du brief)
- Tenir Lighthouse 95-100 sur les 4 catégories
- Rester maintenable seul sans charge mentale
- Réutiliser ce qui existe déjà dans l'écosystème personnel (bekoffice-v2 sur Coolify)

Pas de tooling pour faire moderne. Chaque brique doit pouvoir se justifier par un usage concret du site.

---

## 2. Synthèse du stack

| Brique | Choix | Justification courte |
|---|---|---|
| Framework | **Astro 5+** | 0 JS par défaut, View Transitions natives, partial hydration via islands, idéal pour un CV statique avec quelques interactions ciblées |
| Language | **TypeScript strict** | typage des données CV, autocomplétion sur les schémas, moins de bugs runtime |
| Styling | **CSS pur** + Astro scoped + Cascade Layers | aucun framework CSS — l'enjeu est de montrer la maîtrise CSS native |
| Islands interactives | **React 19** via `@astrojs/react` | runtime des îlots interactifs (ThemeToggle, LangToggle, InspectPanel dynamique, ContactForm) — server-rendered au build, hydratés côté client uniquement quand nécessaire |
| State partagé entre islands | **nanostores** | store réactif minimal (~1 KB) lu par plusieurs islands React (ex: l'item sélectionné dans le centre est lu par l'InspectPanel) |
| Données | **TS typés** dans `src/data/` | `experiences.ts`, `projects.ts`, `skills.ts` — typés, version-controlled, pas de CMS |
| i18n | **JSON par section** + helper TS, runtime swap localStorage | conforme étape 1 ; FR canonique pour SEO, EN sacrifié assumé |
| Animations | View Transitions API + Scroll-Driven Animations + `@property` + `prefers-reduced-motion` | tout natif, c'est *le* signal de craft du site |
| Lint/Format | **Biome** | un seul outil ultra-rapide en Rust pour lint + format ; 2026 standard |
| Hooks Git | **simple-git-hooks** | léger, pas d'overhead Husky |
| Tests UI | **Playwright** | parcours critiques par persona (4-5 tests max) |
| Tests a11y | **axe-core** intégré aux tests Playwright + axe DevTools en local | détecte les violations WCAG AA en CI |
| Analytics | **Plausible** ou **Umami** (privacy-first) | conforme étape 1 |
| Backend | **bekoffice-v2** (Strapi v5) | endpoint formulaire de contact ; pas de backend dédié au CV |
| Hosting | **Coolify** (même instance que bekoffice-v2) | infra déjà en place ; cohérence d'écosystème ; signal "self-hosted" assumé |
| CI/CD | **GitHub Actions** + **Coolify deploy hook** | build sur PR, deploy auto sur main, previews via Coolify (à confirmer selon plan Coolify) |

---

## 3. Détail par brique

### 3.1 Framework — Astro 5+ avec React islands

**Choix retenu** : Astro 5+ comme framework de page, **React 19** comme runtime des islands interactives via `@astrojs/react`.

**Répartition** :
- **Astro components (`.astro`)** pour tout le contenu statique : Header, Sidebar, Footer, layout 3 colonnes, listes statiques, ExperienceCard/ProjectCard/SkillCard, blocs de doc Code/Props
- **React components (`.tsx`)** pour les islands interactives uniquement :
  - `ThemeToggle` — toggle dark/light avec View Transition
  - `LangToggle` — toggle FR/EN + sync localStorage
  - `InspectPanel` — contenu qui change selon l'item sélectionné dans le centre
  - `ContactForm` — soumission vers bekoffice-v2 + états success/error
  - `VariantSwitcher` (Phase 2) — bascule entre variants d'un composant documenté

**Alternatives écartées** :
- *Next.js 15 App Router* — bien plus lourd. App Router force du React partout là où on n'en a pas besoin. Server Components ne servent à rien sur un site statique pré-rendu. Argument "serveur" inexistant ici puisqu'on délègue à bekoffice-v2.
- *Eleventy / Astro 4* — Eleventy minimaliste sans typage natif, sans islands, sans ViewTransition built-in. Astro 4 → 5 sans hésiter.
- *SvelteKit* — excellent mais signal différent ; Astro pose mieux le narratif "0 JS par défaut".
- *Vanilla TS islands seuls (sans React)* — plus léger (~40 KB économisés) mais moins de réutilisabilité hors projet et moins de patterns standards pour la gestion d'état partagé. Choix conscient d'accepter le surcoût pour l'écosystème React.

**Justification** :
- Astro = 0 JS par défaut sur les pages purement statiques (~95 % du site)
- React 19 = runtime moderne, server-rendered au build dans Astro, hydraté seulement sur les islands déclarées
- Bundle JS initial visé : < 60 KB gzip (vs < 30 KB sans React) — assumé pour le confort dev et la réutilisabilité
- Built-in View Transitions Astro côté navigation (`<ViewTransitions />`) ; les transitions intra-island restent CSS pur
- Content Collections + TS strict → typage des données CV vérifié au build

### 3.1bis SEO et hydratation des islands React (CRITIQUE)

**Règle absolue** : aucun composant React ne doit utiliser `client:only`. Toujours `client:load`, `client:idle` ou `client:visible`. Sinon le contenu n'est pas dans le HTML initial → invisible aux crawlers (Google JS-renderer fonctionne mal sur le contenu dynamique, Bing/social bots ne l'exécutent pas).

| Directive | Quand l'utiliser ici |
|---|---|
| (sans directive) | Composants Astro purs, statiques |
| `client:idle` | ThemeToggle, LangToggle (interactifs mais pas critiques au paint) |
| `client:visible` | InspectPanel (s'hydrate quand visible — pas avant) |
| `client:load` | ContactForm (souvent critique d'avoir l'état réactif tout de suite si l'utilisateur scroll directement vers le formulaire) |
| `client:only` | **Interdit sur ce projet** |

**Fallback statique obligatoire** : pour chaque island React, le HTML server-rendered doit contenir un état "par défaut" lisible (ex: ThemeToggle affiche le mode défaut, InspectPanel affiche un état initial au lieu de rien). Aucune île n'est purement vide en statique.

### 3.2 Style — CSS pur + Astro scoped + Cascade Layers

**Choix retenu** :
- Chaque `.astro` a son `<style>` Astro auto-scoped (Astro hash les classes par fichier, isolation gratuite)
- Tokens et reset dans un fichier global `src/styles/global.css` organisé en **cascade layers** :
  ```css
  @layer reset, tokens, base, components, utilities;
  ```
- Tokens depuis le Figma posés en `--bg-canvas`, `--accent`, `--space-*`, `--radius-*`, etc., directement dans `@layer tokens`

**Alternatives écartées** :
- *Tailwind CSS* — explicitement écarté par le brief. L'enjeu est de montrer la maîtrise du CSS, pas de la classe utilitaire.
- *CSS Modules* — moins natif Astro, moins fluide qu'un `<style>` scoped intégré
- *Vanilla Extract* — TS-typed CSS séduisant mais ajoute une étape de build et un signal "trop d'outils"
- *Tokens TS générant tokens.css* — une option élégante (signal DS engineering) mais ajoute une dépendance pour un gain marginal sur ce site. À garder en réserve si le projet s'étend.

**Justification** :
- Astro scoped = isolation gratuite par composant, sans annotation manuelle
- Cascade layers = ordre de cascade explicite et lisible, signal de maîtrise CSS moderne
- Variables CSS comme source de vérité = transitions de couleur via `@property` triviales

### 3.3 Démos techniques natives — l'argument central du site

Chacune de ces APIs doit être *utilisée pour quelque chose d'utile*, pas en démo gratuite :

| API | Usage concret |
|---|---|
| **View Transitions API** | Transition douce entre pages (FR↔EN, Light↔Dark, Components/Experience↔Components/Project) — l'accent change de hue en fluide |
| **`@property`** | Déclarer `--accent` comme `<color>` interpolable → la transition de couleur entre pages devient animable |
| **Scroll-Driven Animations** | Apparition douce des cards Timeline (`animation-timeline: view()`) sans JS |
| **Container queries** | Les cards ExperienceCard adaptent leur layout selon la largeur du parent (preview-surface vs sidebar vs inspect) |
| **`animation-composition: add`** | Hover sur un variant cumule scale + rotate sans race condition |
| **`color-mix()`** | Dérivés runtime (`--accent-bg`, `--accent-border`) calculés depuis `--accent` sans variables intermédiaires |
| **`prefers-reduced-motion`** | Désactive transitions de couleur et scroll-driven, garde uniquement les changements de focus |

**Garde-fou** : les fallbacks fonctionnent partout (Chromium, Firefox récent, Safari récent). Pas de support des navigateurs anciens — c'est un parti pris assumé dans le brief.

### 3.4 i18n — JSON par section + runtime swap

**Choix retenu** :
- Contenu i18n en JSON modulaires par section : `src/i18n/fr/common.json`, `fr/experiences.json`, `fr/projects.json`, etc., et leurs équivalents `en/`
- Helper TS typé `t(key, lang)` qui lit depuis le bon fichier selon `lang`
- Au build, les composants Astro rendent **les deux langues simultanément** dans le HTML (l'EN dans des `<span data-lang="en" hidden>`)
- Au mount, un script léger lit `localStorage.lang` (défaut FR, fallback `navigator.language`) et bascule la visibilité

**Alternative écartée** :
- *Astro i18n built-in (URLs `/` + `/en/`)* — meilleur SEO bilingue mais viole la décision PO étape 1 ("même URL"). Décision SEO confirmée à l'étape 3 : EN sacrifié, FR canonique.

**Conséquences SEO assumées** :
- FR est la langue indexée par Google
- EN n'est pas crawlable séparément — invisible aux recherches anglophones
- Acceptable car cible primaire = marché français ; le nom propre `polemil moreau` rank #1 grâce au domaine quoi qu'il arrive

**Conséquences perf** :
- HTML environ 1.7× la taille d'une version monolingue (les deux langues coexistent)
- Pas de hit serveur supplémentaire, pas de redirect : UX fluide
- Compression Brotli ramène le surcoût à ~10-20 % en effet réseau

### 3.5 Données — TS typés dans `src/data/`

**Choix retenu** :
```
src/data/
├── experiences.ts
├── projects.ts
├── skills.ts
├── about.ts
├── contact.ts
└── meta.ts            // version, baseline, social links
```

Chaque fichier exporte des structures typées (interfaces/types). Le contenu rédactionnel par langue vit dans `src/i18n/`, pas ici.

**Alternative écartée** :
- *Astro Content Collections* — overkill ici, on n'a pas de blog ni de markdown long. Les données sont structurées et tiennent en TS pur.
- *CMS* — explicitement écarté par le brief.

### 3.6 Tests

**Choix retenu** :
- **Playwright** pour les parcours critiques (4-5 tests par persona) :
  - Recruteur tech voit l'expérience actuelle ≤ 30 s
  - Dev clique sur Code/Props et voit le contenu réel
  - Designer joue avec un variant et voit l'inspect changer
  - Client clique Calendly → ouvre la bonne URL
- **axe-core** intégré dans les tests Playwright (`@axe-core/playwright`) → assertion 0 violation WCAG AA sur chaque page
- **Lighthouse CI** sur le main pour traquer les régressions perf/a11y/SEO/best-practices

**Alternatives écartées** :
- *Vitest seul* — pas adapté, on a très peu de logique pure ; les tests doivent vérifier le rendu et l'interaction.
- *Cypress* — Playwright a dépassé Cypress côté DX et perf en 2025-2026.

### 3.7 Lint + Format + Hooks

**Choix retenu** : **Biome** + **simple-git-hooks**

Config :
- `biome.json` à la racine — un seul fichier
- `simple-git-hooks` config dans `package.json` — lance `biome check --apply` sur les fichiers stagés via `lint-staged` (ou `lefthook` si on veut éviter `lint-staged`)

**Alternatives écartées** :
- *ESLint + Prettier + Husky + lint-staged* — solidement éprouvé mais 4 outils, 3 fichiers de config, runtime Node lent
- *Prettier seul* — pas de lint formel, on s'en remet trop à TS strict

### 3.8 Hosting — Coolify (instance existante)

**Choix retenu** : Coolify, sur la même VM que bekoffice-v2

**Alternatives écartées** :
- *Cloudflare Pages* — excellent et gratuit, mais signal "tout sous le même toit" perdu et 2 plateformes à maintenir
- *Vercel* — meilleure DX previews mais idem 2 plateformes
- *GitHub Pages* — pas de previews PR, deploy plus lent

**Justification** :
- Cohérence avec bekoffice-v2 ; tout est dans Coolify
- Signal pro "self-hosted, je gère mon infra" = bonus crédibilité freelance
- Pas de runtime particulier requis (site statique) → Coolify peut servir un dossier `dist/` via un Dockerfile minimal `nginx:alpine` ou un buildpack static

**Setup déploiement** :
- App Coolify de type **Static Site** ou **Dockerfile** (à arbitrer)
- Domaine : `https://polemil.dev` (canonique) — la v1 actuelle bascule progressivement
- Previews PR : à configurer si Coolify le permet sur ce plan ; sinon previews manuelles via branches déployées

### 3.9 CI/CD — GitHub Actions + Coolify webhook

**Workflow** :
1. Push sur PR → GH Actions lance `biome check`, `astro check` (TS), Playwright + axe-core, Lighthouse CI
2. Merge sur `main` → GH Actions déclenche le webhook Coolify pour rebuild/deploy
3. Branche → URL preview Coolify (si supporté)

**Coût** : nul si on reste dans la limite des minutes GH Actions free tier

---

## 4. Stratégie de conception bottom-up (alignée avec la doc Synchro UX-Dev)

Conformément à la règle de superposition Figma (`Tokens → Primitives → Components → Patterns → Pages`), le code suit la même topologie :

```
src/
├── styles/                # @layer tokens — la source de vérité CSS
├── components/
│   ├── primitives/        # .astro pour static (Button, Badge, NavItem) ; .tsx pour interactif (ThemeToggle, LangToggle, Pill)
│   ├── system/            # Header.astro, Sidebar.astro ; InspectPanel.tsx (interactif)
│   └── cv/                # ExperienceCard.astro, ProjectCard.astro, SkillCard.astro (statiques)
├── patterns/              # ExperiencePreview.astro, Timeline.astro
├── pages/                 # *.astro uniquement
│   ├── foundations/
│   ├── components/
│   └── patterns/
├── data/                  # experiences.ts, projects.ts, skills.ts…
├── i18n/                  # fr/, en/ (JSON modulaires par section)
├── stores/                # nanostores : selectedItem.ts, theme.ts, lang.ts
└── lib/                   # helpers, t() i18n, contact form fetch
```

**Convention d'extension** :
- `.astro` = composant statique server-rendered, peut accueillir du HTML/CSS uniquement (et `<script>` minimal si besoin)
- `.tsx` = island React, exclusivement les composants nommés ci-dessus + leurs sous-composants utilitaires
- **Aucun mélange** : un composant statique ne doit pas être en `.tsx`, un composant interactif ne doit pas être en `.astro`

Une `Page` n'inline jamais un composant qu'elle pourrait instancier. Une `cv/ExperienceCard` n'inline jamais un `Badge`, elle l'importe depuis `primitives/`. Etc.

---

## 5. Risques et mitigations

| Risque | Mitigation |
|---|---|
| Compat View Transitions sur Firefox | Le polyfill via `view-transitions/polyfill` est OK ; sinon graceful degradation (pas de transition mais navigation classique) |
| Bukhari Script en webfont — coût réseau | Self-host woff2 + `font-display: swap` ; weight Regular uniquement ; ~25-40 KB max |
| Coolify Static Site moins bien doc que Cloudflare Pages | Si blocage, fallback Dockerfile `nginx:alpine` + sites-available config simple |
| EN non indexé = perte de visibilité internationale | Assumée explicitement (cible primaire = FR) ; ré-ouvrable en Phase 2 si on bascule vers URLs séparées |
| Bundle Astro initial trop gros si trop d'islands | Audit Lighthouse sur main + budget bundle JS dans la CI (cible : < 60 KB gzip pour la home) |
| React runtime ajoute ~40 KB gzip | Limiter strictement le nombre d'islands ; préférer un seul gros composant React partagé plutôt que 10 micro-islands ; vérifier en build qu'aucun composant Astro statique n'embarque React par erreur |

---

## 6. Hors-scope explicite

- Pas de SSR / runtime serveur sur ce projet (tout est statique)
- Pas de framework UI runtime (React/Vue/Svelte) — Astro components suffisent + islands TS si besoin
- Pas de CMS, pas de DB
- Pas de routes API sur le site lui-même → tout passe par bekoffice-v2
- Pas de support IE / vieux Edge / Safari < 15
- Pas d'i18n routée par URL (assumé)
- Pas de feature flags, pas d'A/B testing

---

## 7. Décisions consolidées (tableau)

| Sujet | Décision |
|---|---|
| Framework | Astro 5+ |
| Islands runtime | React 19 via `@astrojs/react` ; **directives autorisées : `client:load` / `client:idle` / `client:visible` ; `client:only` interdit (perte SEO)** |
| State partagé inter-islands | nanostores |
| TS | strict, noUncheckedIndexedAccess on |
| CSS | Astro scoped `<style>` + cascade layers globaux ; pas de Tailwind |
| Tokens | CSS variables dans `@layer tokens` (synchronisés avec les variables Figma) |
| Animations | View Transitions, `@property`, Scroll-Driven, container queries — tout natif |
| Reduced motion | respecté partout |
| Données | TS dans `src/data/` |
| i18n | JSON modulaires par section, runtime swap, **même URL** |
| Langue par défaut indexée | FR |
| Tests | Playwright + axe-core + Lighthouse CI |
| Lint/format | Biome |
| Hooks | simple-git-hooks |
| Hosting | Coolify (instance existante) |
| Backend | bekoffice-v2 (Strapi v5) pour formulaire de contact |
| Analytics | Plausible ou Umami |

---

## 8. Suite

À validation, on passe à l'**étape 4 — Architecte** : structure projet détaillée + scaffolding réel du repo (squelette uniquement, pas de composant CV à ce stade) + conventions de nommage + stratégie de déploiement.
