# polemil.dev v2

CV présenté comme la documentation d'un design system. Le site n'explique pas ses compétences front/Figma, il les **incarne**.

Stack : Astro 5+ · TypeScript strict · CSS pur (cascade layers + scoped Astro) · React 19 (islands uniquement) · Biome · Playwright + axe-core · Coolify.

## Démarrer en local

Prérequis : Node 22 (cf. `.nvmrc`) et pnpm 9.

```bash
pnpm install
pnpm exec playwright install --with-deps chromium  # une fois, pour les tests
pnpm dev
```

Ouvre `http://localhost:4321`.

`pnpm install` installe aussi le hook `pre-commit` (lint + type-check) via `simple-git-hooks`.

## Scripts

- `pnpm dev` — serveur de développement Astro
- `pnpm build` — build de production (type-check inclus)
- `pnpm preview` — sert le `dist/` localement
- `pnpm lint` — Biome lint
- `pnpm lint:fix` — Biome lint + autofix
- `pnpm type-check` — astro check (TypeScript)
- `pnpm test` — Playwright (tous les parcours)
- `pnpm test:ui` — Playwright UI mode
- `pnpm test:a11y` — axe-core a11y uniquement
- `pnpm lh` — Lighthouse CI local
- `pnpm storybook` — Storybook en local sur `http://localhost:6006` (atlas visuel des tokens / primitives / components / patterns)
- `pnpm build-storybook` — build statique de Storybook dans `storybook-static/`

## Architecture

Voir `docs/04-architecture.md` pour la structure complète.

Hiérarchie respectée bottom-up :

```
Tokens (CSS variables)
   ↓
Primitives (.astro statiques + .tsx interactifs minoritaires)
   ↓
System (Header, Sidebar, InspectPanel, TabBar)
   ↓
CV cards (ExperienceCard, ProjectCard, SkillCard)
   ↓
Patterns (ExperiencePreview, Timeline)
   ↓
Pages
```

## Verification visuelle (Storybook)

Chaque composant Phase 1+ livre **sa story `*.stories.tsx`** à côté du source.
Avant d'implémenter un ticket UI, on **pull la maquette Figma** (cf. `docs/02-ux-spec.md` §0) ; après implém', on ouvre Storybook (`pnpm storybook`) et on compare side-by-side. Le toolbar permet de switcher light/dark + page accent.

## Décisions documentées

- `docs/01-product-brief.md` — cadrage PO
- `docs/02-ux-spec.md` — UX/UI + spec Figma
- `docs/03-tech-stack.md` — stack et arbitrage techno
- `docs/04-architecture.md` — structure projet, conventions, déploiement

## Backend

Tout besoin serveur (formulaire de contact) passe par **bekoffice-v2** (Strapi v5 sur Coolify, `bo2.polemil.dev`). Pas de backend dédié à ce projet.

## Déploiement

Coolify (même instance que bekoffice-v2). Build Docker `nginx:alpine` qui sert le `dist/` Astro. Webhook GitHub Actions sur merge `main`.

## Convention de commits

Conventional Commits : `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`. Voir `docs/04-architecture.md` §3.6.
