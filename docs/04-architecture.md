# 04 — Architecture — polemil.dev v2

**Auteur** : Architecte (Paul-Émile Moreau)
**Date** : 2026-05-10
**Statut** : à valider
**Étape** : 4/5 — Structure du projet
**Briefs amont** : `01-product-brief.md`, `02-ux-spec.md`, `03-tech-stack.md`

---

## 1. Vision architecturale

Trois principes structurants :

1. **Bottom-up strict** — l'arborescence reflète la superposition Figma (Tokens → Primitives → Components → Patterns → Pages). Chaque couche ne consomme que les couches inférieures, jamais l'inverse.
2. **Statique par défaut, interactif sur demande** — `.astro` partout, `.tsx` uniquement où le brief l'exige. Pas de `client:only`. Aucun island vide en HTML initial.
3. **Tokens = source unique de toute valeur visuelle** — les variables CSS dans `@layer tokens` sont la seule autorité. Pas de hex, pas de pixel en dur ailleurs.

---

## 2. Arborescence complète

```
le.polemil.dev/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Lint + type-check + tests + Lighthouse
├── docs/                             # Étapes du brief (01..05)
├── public/                           # Assets servis tels quels
│   ├── fonts/                        # Bukhari Script (woff2) self-hosted
│   ├── og/                           # Open Graph images générées
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── primitives/               # Atomes (binds tokens)
│   │   │   ├── Badge.astro
│   │   │   ├── Button.astro
│   │   │   ├── CodeBlock.astro
│   │   │   ├── NavItem.astro
│   │   │   ├── PropertyRow.astro
│   │   │   ├── TokenSwatch.astro
│   │   │   ├── Pill.tsx              # Interactif
│   │   │   ├── ThemeToggle.tsx       # Interactif
│   │   │   └── LangToggle.tsx        # Interactif
│   │   ├── system/                   # Composites système
│   │   │   ├── Header.astro
│   │   │   ├── Sidebar.astro
│   │   │   ├── TabBar.astro
│   │   │   └── InspectPanel.tsx      # Interactif (contenu dynamique)
│   │   └── cv/                       # Cards de contenu
│   │       ├── ExperienceCard.astro
│   │       ├── ProjectCard.astro
│   │       ├── SkillCard.astro
│   │       ├── ContactForm.tsx       # Interactif (POST bekoffice-v2)
│   │       └── About.astro
│   ├── patterns/                     # Assemblages projet
│   │   ├── ExperiencePreview.astro
│   │   ├── Timeline.astro
│   │   └── Changelog.astro
│   ├── layouts/
│   │   └── DocLayout.astro           # Wrapper Header + 3 colonnes + ViewTransitions
│   ├── pages/
│   │   ├── index.astro               # Foundations/Colors par défaut
│   │   ├── foundations/
│   │   │   ├── colors.astro
│   │   │   ├── typography.astro
│   │   │   ├── spacing.astro
│   │   │   └── motion.astro
│   │   ├── components/
│   │   │   ├── experience.astro
│   │   │   ├── project.astro
│   │   │   ├── skill.astro
│   │   │   ├── contact.astro
│   │   │   └── about.astro
│   │   └── patterns/
│   │       ├── timeline.astro
│   │       └── about.astro
│   ├── data/                         # TS typés, source de vérité
│   │   ├── experiences.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── about.ts
│   │   ├── contact.ts
│   │   └── meta.ts                   # version, baseline, social
│   ├── i18n/                         # JSON modulaires par section
│   │   ├── fr/
│   │   │   ├── common.json
│   │   │   ├── experiences.json
│   │   │   ├── projects.json
│   │   │   ├── skills.json
│   │   │   ├── about.json
│   │   │   └── contact.json
│   │   └── en/
│   │       └── …                     # mêmes fichiers
│   ├── stores/                       # nanostores
│   │   ├── theme.ts
│   │   ├── lang.ts
│   │   └── selected-item.ts
│   ├── styles/
│   │   ├── global.css                # Imports + @layer
│   │   ├── reset.css                 # @layer reset
│   │   ├── tokens.css                # @layer tokens (variables CSS)
│   │   └── base.css                  # @layer base (typo, body)
│   ├── lib/
│   │   ├── i18n.ts                   # helper t(key, lang)
│   │   ├── theme.ts                  # init / persist theme
│   │   └── contact.ts                # POST helper vers bekoffice-v2
│   └── env.d.ts                      # types Astro
├── tests/
│   ├── playwright/                   # parcours critiques par persona
│   │   ├── recruiter.spec.ts
│   │   ├── dev-audit.spec.ts
│   │   ├── designer.spec.ts
│   │   └── client.spec.ts
│   └── a11y/                         # axe-core integration
│       └── all-pages.spec.ts
├── .gitignore
├── .nvmrc                            # Node 22 LTS
├── astro.config.mjs
├── biome.json
├── Dockerfile                        # nginx:alpine pour Coolify
├── package.json
├── README.md
├── tsconfig.json
└── playwright.config.ts
```

---

## 3. Conventions de nommage

### 3.1 Fichiers et dossiers
- Dossiers : kebab-case (`experiences`, `i18n`, `stores`)
- Composants Astro/TSX : PascalCase, extension explicite (`ExperienceCard.astro`, `ContactForm.tsx`)
- Données TS : kebab-case par défaut, mais le contenu est camelCase (`experiences.ts`, `contact.ts`)
- Pages Astro : kebab-case ou single-word (`experience.astro`, `colors.astro`, `index.astro`)

### 3.2 Composants
- Nom = nom Figma exact (PascalCase, anglais)
- Une seule entité par fichier ; pas de `index.ts` agrégateur dans les dossiers `components/*` (on importe par chemin direct)
- Props typées par interface dans le même fichier ; nommées `<ComponentName>Props`
- **Story Storybook obligatoire** à côté du source (`<Name>.stories.tsx`) pour tout composant Phase 1+. La PR qui ajoute le composant ajoute aussi la story dans le même commit. La story couvre au minimum un cas par variant et un cas par état (active/inactive, light/dark via toolbar). Cf. `.storybook/` pour la config et les décorateurs (theme + page accent).

### 3.3 Classes CSS
- BEM-allégé dans les `<style>` Astro scoped : `.card`, `.card__title`, `.card--current`
- Pas de classes globales depuis le composant — Astro hash automatiquement
- Classes globales (rares) préfixées `app-` (ex: `.app-skip-link`) et déclarées dans `src/styles/base.css`

### 3.4 Variables CSS (tokens)
- `--<category>-<name>` ou `--<category>-<name>-<modifier>`
- Catégories : `bg`, `border`, `fg`, `status`, `accent`, `space`, `radius`, `size`, `font`, `duration`, `ease`
- Exemples : `--bg-canvas`, `--accent-experience`, `--space-4`, `--radius-md`, `--duration-md`
- **Aucune valeur en dur** dans aucun composant — utiliser exclusivement les tokens

### 3.5 Branches Git
- `main` — branche déployée en prod (Coolify webhook)
- `feat/<short-name>` — features (ex: `feat/experience-card`)
- `fix/<short-name>` — corrections
- `chore/<short-name>` — tooling, deps, infra
- `docs/<short-name>` — docs
- Pas de `develop` — flux GitHub Flow simple : branche → PR → merge main → deploy

### 3.6 Commits — Conventional Commits
Format obligatoire : `<type>(<scope>?): <subject>`

Types :
- `feat` — nouvelle feature visible utilisateur
- `fix` — correction de bug
- `chore` — tooling, deps, config (non visible utilisateur)
- `docs` — docs uniquement
- `refactor` — refactor sans changement fonctionnel
- `perf` — amélioration perf
- `test` — ajout/modification de tests
- `style` — formatting (Biome auto-géré, rare)

Exemples :
- `feat(experience-card): add timeline variant`
- `fix(theme-toggle): persist preference across navigation`
- `chore(deps): bump astro to 5.2`
- `docs: update step-04 architecture decisions`

Pas de body obligatoire sauf si la justification est non triviale ; pas de footer `Co-Authored-By` automatique pour ce projet (côté config Git tu décides).

---

## 4. Stratégie CSS

### 4.1 Cascade layers (déclarés dans `global.css`)

```css
@layer reset, tokens, base, components, utilities;
```

Ordre de priorité du moins au plus spécifique. Toute déclaration globale doit appartenir à une layer.

### 4.2 Scoping
- **Astro scoped `<style>` par défaut** (composants `.astro`)
- Pour les composants React `.tsx` : CSS Modules (`.module.css`) — Astro le supporte nativement
- Pas de `:global()` à moins d'un cas vraiment exceptionnel et documenté

### 4.3 Tokens
- Source : `src/styles/tokens.css` — un seul fichier, déclarations CSS pures
- Modes light/dark via attribut `[data-theme]` sur `<html>` :
  ```css
  @layer tokens {
    :root { /* light defaults */ --bg-canvas: #F8F4EC; … }
    [data-theme="dark"] { --bg-canvas: #0F0F11; … }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) { /* dark defaults if no manual choice */ }
    }
  }
  ```
- Accent par page via attribut `[data-page]` sur `<body>` :
  ```css
  body[data-page="experience"] { --accent: var(--accent-experience); }
  body[data-page="project"]    { --accent: var(--accent-project); }
  /* etc. */
  ```
- `--accent` est déclarée comme `<color>` interpolable via `@property` :
  ```css
  @property --accent {
    syntax: "<color>";
    inherits: true;
    initial-value: #534AB7;
  }
  ```
  → la transition entre pages anime fluidement la couleur via View Transitions.

### 4.4 Pas de pipeline TS → CSS
Décision étape 3 : tokens directement en CSS. Si besoin d'accéder aux valeurs depuis TS (rare), un `tokens.ts` typé en miroir peut être ajouté ; pour l'instant, hors-scope.

---

## 5. Architecture des données

### 5.1 Source de vérité
- **Données structurelles** (expériences, projets, skills, formations) → `src/data/*.ts` typés
- **Contenu rédactionnel par langue** (titres, descriptions, bio) → `src/i18n/<lang>/*.json`
- Une donnée structurelle référence une **clé i18n**, jamais un texte direct

Exemple :
```ts
// src/data/experiences.ts
export const experiences: Experience[] = [
  {
    id: 'lead-elao',
    role_i18n: 'experiences.leadElao.role',         // clé pour t()
    company: 'Elao',                                // pas traduit
    start: '2021',
    end: null,
    current: true,
    stack: ['react', 'remix', 'a11y', 'typescript', 'testing'],
    description_i18n: 'experiences.leadElao.description',
  },
  // …
];
```

```json
// src/i18n/fr/experiences.json
{
  "leadElao": {
    "role": "Lead front-end",
    "description": "Construit et maintient le design system…"
  }
}
```

### 5.2 Helper i18n
- Fichier : `src/lib/i18n.ts`
- Signature : `t(key: I18nKey, lang: 'fr' | 'en'): string`
- Type `I18nKey` dérivé du type union de tous les chemins `.json` (verifié au build)
- À utiliser dans les composants Astro server-side ET les composants React via prop

### 5.3 Stratégie de rendu i18n
Décision étape 3 : **même URL + runtime swap, FR canonique pour SEO**.

Rendu :
1. Au build, chaque page Astro rend **les deux langues simultanément** dans le HTML.
2. Chaque texte traduisible vit dans `<span lang="fr">…</span>` et `<span lang="en" hidden>…</span>` (ou via slots).
3. Au mount client, `LangToggle.tsx` (île React) lit `localStorage.lang`, met à jour `<html data-lang="…">`.
4. Une règle CSS globale : `[data-lang="fr"] [lang="en"], [data-lang="en"] [lang="fr"] { display: none }`.
5. Default `<html data-lang="fr">` côté server-render → SEO indexe FR.

Coût HTML : ~1.7× la taille monolingue. Compression Brotli ramène à ~10-20 % en réseau.

---

## 6. Architecture des islands React

### 6.1 Liste exhaustive (5 islands maximum)
| Island | Directive | Justification |
|---|---|---|
| `ThemeToggle.tsx` | `client:idle` | Bascule fluide light/dark, pas critique au paint |
| `LangToggle.tsx` | `client:idle` | Bascule FR/EN, pas critique au paint |
| `Pill.tsx` | `client:idle` | Toggle générique 2-segments (réutilisable pour ThemeToggle / LangToggle) |
| `InspectPanel.tsx` | `client:visible` | Hydrate quand visible, lit `selected-item` store |
| `ContactForm.tsx` | `client:load` | Critique d'avoir l'état réactif si l'utilisateur scroll vite vers le formulaire |

### 6.2 State partagé
- Bibliothèque : `nanostores` (~1 KB)
- Stores :
  - `theme.ts` — `'light' | 'dark' | 'system'` ; persistance localStorage
  - `lang.ts` — `'fr' | 'en'` ; persistance localStorage
  - `selected-item.ts` — `{ kind: 'experience' | 'project' | … ; id: string } | null` ; en mémoire uniquement
- Lecture côté React via `@nanostores/react` (hook `useStore`)
- Lecture côté Astro `<script>` via import direct du store

### 6.3 Fallback statique obligatoire
Chaque island doit avoir un état initial cohérent dans le HTML server-rendered :
- `ThemeToggle` server-render : icônes sun/moon visibles, knob côté light par défaut
- `LangToggle` : segment `FR` actif par défaut
- `InspectPanel` : panneau visible avec un état "Sélectionne un élément" pré-rempli
- `ContactForm` : formulaire complet visible, prêt à être soumis (state interactif uniquement après hydratation)

### 6.4 Interdit absolu
- `client:only` sur tout composant qui contribue au contenu indexable
- Importer React dans un composant `.astro` (signal d'erreur Biome custom rule à ajouter en Phase 2)
- Plus de 5 islands actives sans justification (audit bundle)

---

## 7. Stratégie de tests

### 7.1 Playwright — parcours critiques par persona
Un fichier par persona dans `tests/playwright/` :
- `recruiter.spec.ts` — Home → Components/Experience → variant timeline visible ≤ 30s, current badge visible, mono breadcrumb correct
- `dev-audit.spec.ts` — Components/Experience → onglet Code → JSX présent ; onglet Props → table présente
- `designer.spec.ts` — Components/Experience → click sur variant `expanded` → Inspect change pour refléter
- `client.spec.ts` — Components/Contact → click Calendly → ouvre la bonne URL ; ContactForm → submit → état success

### 7.2 axe-core — a11y
- Intégré aux tests Playwright via `@axe-core/playwright`
- Assertion : 0 violation sur les pages clé (home + 5 components + timeline + about + contact)
- Niveau cible : **WCAG 2.1 AA**

### 7.3 Lighthouse CI
- Workflow GitHub Actions sur push `main`
- 4 catégories : performance, a11y, best-practices, SEO
- Cible MVP : **≥ 95 partout** ; Phase 2 : 100/100

### 7.4 Tests pendant développement local
- `pnpm test` lance Playwright en mode UI
- `pnpm test:axe` lance uniquement les tests a11y
- `pnpm lh` ouvre Lighthouse local sur la build de prod

---

## 8. Stratégie de déploiement

### 8.1 Coolify — Static Site
- App Coolify de type **Dockerfile** (plus prévisible que Static Site managé)
- Image : `nginx:alpine`, sert `/usr/share/nginx/html` qui contient le build Astro
- Volumes : aucun (site statique)
- Domaine : `polemil.dev` (déjà géré côté DNS)
- TLS : Let's Encrypt via Coolify

### 8.2 Dockerfile (à scaffold)
```dockerfile
# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 8.3 Branches → URLs
- `main` → `https://polemil.dev` (prod)
- `main` (artifacts Storybook) → `https://sb.polemil.dev` (verif visuelle des tokens / primitives / components / patterns)
- Branches feature → URLs preview Coolify si supporté par le plan, sinon previews via build local + tunnel ngrok pour share
- Pas de staging dédié au MVP — la coverage tests + Lighthouse sur PR limite le besoin

#### Storybook deploy (sb.polemil.dev)
- App Coolify séparée, même pattern Dockerfile + `nginx:alpine`
- `Dockerfile.storybook` à la racine du repo : build `pnpm build-storybook` → `storybook-static/` → servi via `nginx.storybook.conf`
- nginx config : SPA fallback `try_files $uri $uri/ /index.html` (Storybook gère son routing client-side)
- TLS : Let's Encrypt auto via Coolify
- Webhook : même `deploy.yml` (à étendre) ou un webhook Coolify dédié à `chore/27-storybook-coolify`
- Coolify config (manuelle, à faire dans l'UI Coolify) :
  - Type : **Dockerfile**
  - Build context : racine du repo
  - Dockerfile : `Dockerfile.storybook`
  - Domain : `sb.polemil.dev`
  - Webhook URL : à connecter à GitHub Actions sur push `main`

### 8.4 Variables d'environnement
- `PUBLIC_BEKOFFICE_API_URL` — endpoint `bo2.polemil.dev/api`
- `PUBLIC_BEKOFFICE_FORM_TOKEN` — token public read-only pour soumission form (à créer dans Strapi)
- `PUBLIC_PLAUSIBLE_DOMAIN` — `polemil.dev`
- Toutes préfixées `PUBLIC_` car exposées au client — aucune secret côté front

### 8.5 CI/CD
Workflow `.github/workflows/ci.yml` :
1. Push PR → install (pnpm cache) → `biome check` → `astro check` (TS) → build → Playwright + axe → Lighthouse CI
2. Merge `main` → workflow `deploy.yml` déclenche le webhook Coolify
3. Échec à n'importe quelle étape = pas de merge

---

## 9. Suite

À validation, on passe à l'**étape 5 — PO** : transformation de cette architecture en backlog GitHub (tickets actionnables avec critères d'acceptation, labels, dépendances, organisation en Phase 1 / Phase 2).

Le squelette projet est scaffoldé en parallèle (commit initial). Les composants CV ne sont pas encore créés — ils seront issus du backlog ticket par ticket.
