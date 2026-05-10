# 02 — UX/UI Spec — polemil.dev v2

**Auteur** : UX/UI (Paul-Émile Moreau)
**Date** : 2026-05-09
**Statut** : draft, en cours de production Figma
**Étape** : 2/5 — Définition UX et maquette
**Brief amont** : `01-product-brief.md`

---

## 0. Lien Figma

- Fichier : https://www.figma.com/design/Xw8ocCGiqdKjKK4lrDT0il/Le.Polemil.Dev
- File key : `Xw8ocCGiqdKjKK4lrDT0il`
- Pages prévues : `00 — Cover`, `01 — Foundations`, `02 — Components`, `03 — Patterns`, `04 — Screens (Desktop)`, `05 — Screens (Mobile)`, `06 — Library` (variables + components)

---

## 1. Direction visuelle

### 1.1 Métaphore
Doc d'un design system, dense et technique, type Radix Themes / Linear / Vercel docs. Le visiteur doit avoir l'impression d'ouvrir une vraie doc d'outil, pas un site de portfolio classique.

### 1.2 Choix typographiques
| Usage | Famille | Notes |
|---|---|---|
| UI / corps de texte | **Inter** | Variable, weights 400 / 500 / 600. Utilisé partout sauf cas ci-dessous. |
| Mono — code, breadcrumb, badge, tokens, props | **JetBrains Mono** | Variable, weights 400 / 500. Tracking légèrement resserré. |
| Wordmark | **Bukhari Script** | Identique à polemil.dev v1. *Uniquement* pour "Polémil" dans le header. **Production** = Bukhari Script via webfont (Adobe Fonts ou self-hosted). **Figma maquette** = Pacifico comme proxy visuel : Bukhari Script est licenciée Adobe Fonts côté client et n'est pas chargeable depuis le runtime MCP plugin (`loadFontAsync` échoue). Le node `Tokens / display/wordmark` (id `10:94`) a été manuellement basculé sur Bukhari côté Figma desktop par PE et persiste avec la bonne fontName même si le runtime API ne peut pas la lire — il sert de référence canonique. |

### 1.3 Iconographie
- **Lucide** (stroke 1.5px, size 16 par défaut, 14 dans le header / inspect).
- Inlined en SVG `currentColor` pour héritage automatique du thème.
- Pas d'icônes custom au MVP.

### 1.4 Densité
Dense et technique. Repères :
- borders 1px (0.5px sur écrans Retina via subpixel)
- paddings serrés (8/12/16, rarement 24)
- font-size de base 14px (vs 16 standard)
- mono très présent pour signaler la nature "doc d'outil"

### 1.5 Wordmark
- Texte "Polémil" en **Bukhari Script**.
- Suivi d'un **point final** dont la couleur reflète l'accent de la page courante (blanc neutre sur Foundations, hue de la page sur Components/Patterns).
- Au hover du wordmark, le point s'anime en barre de soulignement glissant sous "Polémil" (gauche → droite, easing `ease-out`, durée `--duration-md`).
- Ce comportement est strictement identique à polemil.dev v1.

---

## 2. Système de couleurs

### 2.1 Principe directeur
- Light et dark sont deux **modes** d'un même set de variables.
- L'accent est **dynamique** par page, ce qui se traduit par une variable `--accent` réécrite à l'entrée de la page (pas par une duplication de tokens).
- Foundations = **pas d'accent** (la neutralité incarne le rôle "fondations" du DS lui-même).
- View Transition fluide sur l'accent et sur tous les neutres lors du switch de page et du switch dark/light. Le but : doux pour les yeux, jamais de flash blanc.

### 2.2 Tokens neutres — Light (cream warm)
| Token | Hex | Usage |
|---|---|---|
| `--bg-canvas` | `#F8F4EC` | Fond extérieur (crème chaude) |
| `--bg-app` | `#FBF8F2` | Fond du conteneur principal |
| `--bg-surface` | `#FFFFFF` | Fond des cards et zones surélevées |
| `--bg-subtle` | `#F1ECE2` | Hover doux, sidebar items |
| `--bg-inset` | `#EBE5D8` | Code blocks, inspect panel bg |
| `--border-subtle` | `#E5DECF` | Bords ténus |
| `--border-default` | `#D6CDB9` | Bords standards |
| `--border-strong` | `#B6AB91` | Bords pour focus / appui |
| `--fg-primary` | `#1F1B14` | Texte principal |
| `--fg-secondary` | `#52493A` | Texte secondaire |
| `--fg-tertiary` | `#8B816E` | Mute, captions |
| `--fg-on-accent` | `#FFFFFF` | Texte sur accent saturé |

### 2.3 Tokens neutres — Dark (low-light, "doux pour les yeux")
| Token | Hex | Usage |
|---|---|---|
| `--bg-canvas` | `#0F0F11` | Fond extérieur (anthracite chaud) |
| `--bg-app` | `#141417` | Fond du conteneur principal |
| `--bg-surface` | `#1A1A1E` | Cards |
| `--bg-subtle` | `#22222A` | Hover, sidebar items |
| `--bg-inset` | `#0A0A0C` | Code blocks |
| `--border-subtle` | `#2A2A33` | Bords ténus |
| `--border-default` | `#3A3A45` | Bords standards |
| `--border-strong` | `#5A5A6A` | Focus / appui |
| `--fg-primary` | `#F2EFE6` | Texte principal (off-white chaud) |
| `--fg-secondary` | `#B8B2A3` | Secondaire |
| `--fg-tertiary` | `#7B7768` | Mute |
| `--fg-on-accent` | `#0F0F11` | Texte sur accent saturé |

### 2.4 Accents par page (Components & Patterns)

L'accent est défini comme une variable haut niveau `--accent`, écrasée localement par chaque page. Light/dark partagent **la même** convention de hue mais avec des hex calibrés différemment.

| Page | Light hex | Dark hex | Hue |
|---|---|---|---|
| `<Experience />` | `#534AB7` | `#8E83F1` | violet |
| `<Project />` | `#E89A4B` | `#FDBA74` | orange chaud |
| `<Skill />` | `#5A8E2E` | `#AECC8A` | vert sage |
| `<Contact />` | `#1E78B4` | `#6FC5FF` | bleu ciel |
| `<About />` | `#C44A6B` | `#F08AA0` | framboise |
| Pattern Timeline | `#7A4FB7` | `#B79CF1` | mauve |
| Pattern Case Study (P2) | `#B7913D` | `#E5C880` | doré |

Pour chaque accent, on dérive en runtime (via `color-mix`) :
- `--accent-bg` : accent à 12% sur `--bg-app` (badge, surfaces accentuées)
- `--accent-bg-hover` : 18%
- `--accent-fg` : accent à 100%
- `--accent-fg-on-bg` : accent ajusté pour contraste AA sur `--accent-bg`
- `--accent-border` : accent à 40%

Tous les composants n'utilisent **que** ces variables dérivées, jamais l'accent en dur.

### 2.5 Foundations — sans accent
Sur Foundations/*, `--accent` prend la valeur de `--fg-primary`. Tous les composants restent fonctionnels (badges, cards), mais n'ont plus de couleur d'identification : la neutralité joue le rôle d'identité.

### 2.6 Couleurs sémantiques (status/data)
| Token | Light | Dark |
|---|---|---|
| `--status-success-bg` | `#E1F5EE` | `#0F2F26` |
| `--status-success-fg` | `#085041` | `#9FE5CC` |
| `--status-warning-bg` | `#FBEFD3` | `#3A2D0E` |
| `--status-warning-fg` | `#6B4A0A` | `#F5D88A` |
| `--status-danger-bg` | `#FBE3E3` | `#3A1414` |
| `--status-danger-fg` | `#8C2222` | `#F4A6A6` |
| `--status-info-bg` | `#DCEEFB` | `#0E2C3D` |
| `--status-info-fg` | `#0E4D7A` | `#9BD1F0` |

Ces tokens sont **stables**, indépendants de l'accent de page.

---

## 3. Typographie (échelle)

| Token | Taille | Line-height | Usage |
|---|---|---|---|
| `--text-2xs` | 10px | 14px | uppercase eyebrow, labels Inspect |
| `--text-xs` | 11px | 16px | breadcrumb, props, helpers |
| `--text-sm` | 13px | 20px | corps de texte secondaire, sidebar |
| `--text-base` | 14px | 22px | corps de texte principal |
| `--text-md` | 16px | 24px | sous-titres |
| `--text-lg` | 20px | 28px | titre composant `<h2>` |
| `--text-xl` | 28px | 36px | titre page `<h1>` |
| `--text-2xl` | 40px | 48px | hero / wordmark |

Tracking : `-0.01em` sur tout sauf mono (`0`).

---

## 4. Espacements et radius

### 4.1 Spacing (échelle 4px)
`--space-0: 0`, `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`, `--space-12: 48px`, `--space-16: 64px`, `--space-20: 80px`.

### 4.2 Radius
`--radius-xs: 2px`, `--radius-sm: 4px`, `--radius-md: 6px`, `--radius-lg: 10px`, `--radius-xl: 16px`, `--radius-full: 9999px`.

### 4.3 Borders
`--border-thin: 0.5px` (Retina), `--border-default: 1px`, `--border-strong: 2px` (focus rings).

### 4.4 Shadows
`--shadow-1: 0 1px 0 0 var(--border-subtle)` (séparateur subtil)
`--shadow-2: 0 4px 8px -2px rgb(0 0 0 / 0.06)` (popover/inspect)
`--shadow-3: 0 12px 24px -8px rgb(0 0 0 / 0.10)` (overlay)

---

## 5. Motion

### 5.1 Durées
`--duration-xs: 80ms`, `--duration-sm: 140ms`, `--duration-md: 220ms`, `--duration-lg: 360ms`.

### 5.2 Easings
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — defaults (entrées, hover)
- `--ease-in: cubic-bezier(0.7, 0, 0.84, 0)` — sorties
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` — réservé aux interactions de jeu (variants, theme toggle)

### 5.3 View Transitions
- Switch de page : crossfade neutres + accent morph (tous deux animés via `@property --accent` et `@property` sur les neutres clés).
- Switch dark/light : durée `--duration-lg`, easing `--ease-out`. Pas de flash.
- Switch de variant dans une grille : élément animé via `view-transition-name` unique par variant.

`prefers-reduced-motion: reduce` désactive toutes les transitions de couleur, ne garde que les changements de focus.

---

## 6. Layout

### 6.1 Desktop (≥ 1024px)
Grille principale 3 colonnes :
- Sidebar : largeur fixe **220px**, padding `--space-3`
- Zone de doc : `1fr` minmax(0, 720px), padding `--space-6 --space-8`
- Inspect : largeur fixe **280px**, padding `--space-4`

Header global : full-width, hauteur **48px**, sticky, séparé de la grille par un `border-bottom`.

### 6.2 Tablet (768–1023px)
Sidebar reste, Inspect passe en panneau collapsible à droite (toggle dans le header).

### 6.3 Mobile (< 768px)
- Sidebar → drawer (icône hamburger header gauche), full-height overlay.
- Inspect → bottom sheet (handle drag), 3 hauteurs (peek 60px / mid 50% / full 90%).
- Variants → scroll horizontal snappé (snap mandatory, snap-align center).
- Header reste sticky avec wordmark, badge version, toggles thème + langue.

---

## 7. Header

| Élément | Comportement |
|---|---|
| Wordmark "Polémil." | Bukhari Script + point coloré (`--accent`). Hover : underline animé glissant gauche→droite. |
| Breadcrumb | Mono, séparateurs `/`. Cliquable jusqu'au niveau précédent. |
| Toggle thème | Icône Lucide `sun` / `moon`. View Transition au clic. |
| Toggle langue | Pill `FR`/`EN`. Switch qui inverse le contenu sans changer d'URL, persiste en localStorage. |
| Badge version | `v3.2.0`, mono, border subtle. Click → ouvre un panneau "Changelog" hybride (releases site + jalons carrière). |

---

## 8. Sidebar (navigation)

Trois sections, dans l'ordre :

1. **Foundations** (sans accent) — Couleurs, Typographie, Espacements, Motion *(P2 : Iconography)*.
2. **Components** — `<Experience />`, `<Project />`, `<Skill />`, `<Contact />`, `<About />`. Chaque item a un point coloré devant lui (= accent de la page).
3. **Patterns** — Timeline, About *(P2 : Case Study)*.

Comportements :
- État `current` : background `--bg-subtle`, foreground `--fg-primary`, point d'accent saturé.
- État `hover` : background `--bg-subtle`, transition `--duration-sm`.
- Focus visible : outline 2px `--accent` offset 2px.

---

## 9. Inspect panel (droite)

### 9.1 Contexte
Le panneau **change de contenu** selon ce qui est sélectionné dans la zone centrale. Pas d'URL dédiée pour les détails ; l'Inspect est *l'écran de détail*.

### 9.2 Sections du panneau
1. **Eyebrow** — type du composant sélectionné, en mono uppercase 10px.
2. **Properties** — table clé/valeur en mono 11px (ex : `role: Lead front-end`, `company: Elao`, `duration: 5 ans`, `stack[]: 7 items`).
3. **Tokens** — liste des variables utilisées, avec swatch + nom (ex : carré `--accent`, carré `--bg-subtle`).
4. **Used in** — autres pages où le composant ou la donnée apparaît (ex : `Pattern Timeline`, `Component Skill`).

### 9.3 États
- **Vide** (aucun élément sélectionné) → message "Sélectionne un élément pour voir ses propriétés."
- **Multiple** (multi-sélection plus tard, hors MVP) → indicateur "n éléments sélectionnés".

### 9.4 Mobile (bottom sheet)
- Peek (60px) : juste l'eyebrow + premier prop, drag handle visible.
- Mid (50%) : 3 sections sans Used in.
- Full (90%) : tout y compris Used in.

---

## 10. Composants documentés

Chaque composant CV vit en **3 vues** :
1. **Preview** — rendu visuel
2. **Code** — extrait de markup illustratif (template-litéraux)
3. **Props** — table des propriétés exposées

Onglets en haut, sticky sous le breadcrumb.

### 10.1 `<Experience />`
- **Variants** : `default` / `expanded` / `compact` / `timeline`
- **States** : `default` / `current` / `expanded`
- **Anatomie** : avatar entreprise (carré 28×28, radius `--radius-sm`, fond `--accent`) · titre `role · company` · dates en mono · badge "current" si applicable · stack tags (mono) · description (uniquement en `expanded`)
- **Props** : `role`, `company`, `start`, `end`, `current?`, `stack[]`, `description?`, `links[]`

### 10.2 `<Project />`
- **Variants** : `card` / `hero` / `mini`
- **States** : `default` / `current` (en cours) / `archived`
- **Anatomie** : titre · pitch (1-2 lignes) · stack tags · liens (GitHub, live demo, case study)
- **Props** : `name`, `pitch`, `year`, `stack[]`, `links[]`, `status`

### 10.3 `<Skill />`
- **Variants** : `badge` / `bar` / `radar`
- **States** : `default` / `featured`
- **Anatomie** : nom skill · niveau (visualisation différente par variant) · catégorie
- **Props** : `name`, `category`, `level` (1-5), `years?`, `featured?`

### 10.4 `<Contact />`
- **Variants** : `inline` (mailto + Calendly + social en ligne) / `expanded` (formulaire interne complet) / `mini` (3 icônes seules)
- **States** : `default` / `success` (post-soumission form) / `error`
- **Anatomie variant `expanded`** : email field · subject select (Poste / Mission / Autre) · message textarea · bouton "Envoyer" · liens secondaires (Calendly, LinkedIn, GitHub)
- **Props** : `mode`, `prefilledSubject?`

### 10.5 `<About />`
- **Variants** : `bio` / `manifesto` / `timeline`
- **States** : `default`
- **Anatomie** : portrait optionnel · texte narratif · easter eggs (touches d'humour, soulignements interactifs sur certains mots)
- **Props** : `mode`, `language`

---

## 11. Primitives partagées

| Composant | Variants | Notes |
|---|---|---|
| `<Button />` | `primary` / `secondary` / `ghost` / `link` × `sm` / `md` | Hauteur 28/36, radius `--radius-md`, focus 2px outline |
| `<Badge />` | `neutral` / `accent` / `success` / `warning` / `danger` / `info`, taille `xs` / `sm` | Mono, radius `--radius-md` |
| `<TokenSwatch />` | `color` / `space` / `radius` / `font` | Carré + label + valeur, copy on click |
| `<CodeBlock />` | `inline` / `block`, language tag optionnel | Mono, bg `--bg-inset`, scrollable |
| `<TabBar />` | tabs `Preview` / `Code` / `Props` | Mono pour les labels, indicateur underline accent |
| `<NavItem />` | `default` / `current` | Point coloré + label |
| `<PropertyRow />` | `default` / `truncated` | Clé secondaire + valeur mono |
| `<Pill />` (toggles header) | `dual` (FR/EN, light/dark) | 2 segments, le segment actif en accent |

---

## 12. Patterns

### 12.1 Timeline (parcours pro)
- Axe vertical à gauche (14px du bord), graduation par année.
- Cards `<Experience variant="timeline" />` connectées à l'axe par un trait court horizontal.
- Couleur de l'axe = mauve (`--accent` fixe sur Patterns/Timeline).
- Animation : à l'entrée scroll-driven, opacité + translateY de 8px sur chaque card.

### 12.2 About (storytelling)
- Layout 1 colonne, max-width 640px, centré dans la zone de doc.
- Largeur d'Inspect réduite (le storytelling est moins manipulable).
- Mix de paragraphes longue forme + petites surfaces typographiques (citations, "manifesto") + easter eggs.

---

## 13. Accessibilité

- Contraste WCAG AA minimum sur tous les couples bg/fg, AAA visé sur le corps de texte.
- Focus visible **partout**, ring 2px `--accent` (ou `--fg-primary` sur Foundations) avec offset 2px.
- Navigation clavier complète : Tab pour parcourir, Esc pour fermer drawer/bottom sheet, Cmd/Ctrl+K plus tard pour ouvrir un palette de commandes (Phase 2).
- `prefers-reduced-motion: reduce` respecté : transitions de couleur supprimées, scroll-driven animations supprimées, View Transition désactivée.
- ARIA : sidebar nav avec `role="navigation"` + `aria-current="page"`, inspect panel avec `aria-live="polite"` pour annoncer le changement de sélection.
- Tous les textes images via `alt` descriptifs.
- Skip link "Aller au contenu" visible au focus.

---

## 14. États interactifs (résumé global)

| Catégorie | Comportement |
|---|---|
| Hover sur surface cliquable | bg passe à `--bg-subtle`, transition `--duration-sm` |
| Hover sur lien texte | underline + couleur `--accent-fg` |
| Active (mousedown) | scale `0.98` (sauf reduced-motion) |
| Focus visible | outline 2px `--accent`, offset 2px |
| Disabled | opacity 0.5, cursor `not-allowed`, pas de hover |
| Loading | shimmer doux sur skeleton, mono dot dot dot pour async |

---

## 15. Justifications UX clés

1. **Pas de page projet dédiée** — décision PO. UX : on gagne en cohérence (1 seul mental model, l'Inspect = le détail), on perd un peu d'expressivité narrative pour les projets riches → assumé, ré-ouvrable en backlog.
2. **Foundations sans accent** — la neutralité incarne le rôle "fondations" du DS lui-même. Ailleurs, l'accent identifie la page courante : un signal clair de "où je suis".
3. **i18n même URL, localStorage** — parti pris pour une UX 1-clic au détriment du SEO multilingue. Cohérent avec la cible (recruteurs / clients arrivent par lien direct, pas par recherche organique).
4. **Densité élevée** — signal "doc d'outil pro" plutôt que "site marketing". Compense par contraste typo très clair et hiérarchie ferme.
5. **Accent par page animé via View Transition** — c'est *le* signal de craft. Fait ce qu'il prêche : montre la maîtrise CSS moderne (`@property` + View Transitions API) en l'utilisant dans une fonctionnalité utile (orientation visuelle), pas comme gadget.

---

## 16. Production Figma — état livré

Fichier : https://www.figma.com/design/Xw8ocCGiqdKjKK4lrDT0il/Le.Polemil.Dev

### Pages
| # | Nom | Contenu |
|---|---|---|
| 0 | Tokens | Référence visuelle complète (Colors, Spacing, Radius, Typography, Shadows) |
| 1 | Primitives | Button, Badge, NavItem, TokenSwatch, PropertyRow, CodeBlock, Pill |
| 2 | Components | Header, Sidebar, InspectPanel, TabBar |
| 3 | Patterns | Experience (4 variants), Project (3 variants) |
| 4 | Pages — Desktop | Components/Experience light+dark, Patterns/Timeline light |
| 5 | Pages — Mobile | Components/Experience light+dark |

### Variable collections (Figma)
| Collection | Modes | Variables | Notes |
|---|---|---|---|
| Colors | Light, Dark | 27 | bg/* (5), border/* (3), fg/* (4), status/* (8), accent/* (7) |
| Spacing | (single) | 12 | 0 → 80px scale 4-based |
| Radius | (single) | 6 | xs (2) → full (9999) |
| Sizing | (single) | 10 | icon, control, header, sidebar, inspect, center-max |

### Text styles + Effect styles
- 8 styles `text/*` (Inter regular/medium/semi-bold/bold)
- 5 styles `mono/*` (JetBrains Mono) + `mono/eyebrow` (uppercase)
- 1 style `display/wordmark` — **Pacifico** (proxy Bukhari Script en Figma — voir contrainte §1.2)
- 4 effect styles `shadow/*`

### Composants Figma (par couche)

**Primitives** (atomes — bindent les Tokens)
| Composant | Variants |
|---|---|
| Button | default / secondary / ghost |
| Badge | neutral / accent / success / warning / danger / info |
| NavItem | default / current |
| TokenSwatch | color / space / radius |
| PropertyRow | (single component) |
| CodeBlock | inline / block |
| Pill | kind=lang (FR/EN) — kind=theme déprécié, remplacé par ThemeToggle |
| **ThemeToggle** | (single) — sun (Lucide) + track-knob + moon (Lucide) |

**Components** (composites système et cards de contenu — instancient des Primitives)
| Composant | Composé de | Notes |
|---|---|---|
| Header (desktop, 1280×56) | Bukhari wordmark (clone Tokens) + dot + breadcrumb + Badge (version) + Pill (lang) + ThemeToggle | |
| MobileHeader (390×56) | Hamburger + Pacifico wordmark fontSize 22 + dot + Pill (lang) + ThemeToggle | Pacifico car Bukhari à 28px = 420px, ne tient pas en 390 |
| Sidebar (220×auto) | Section eyebrows + NavItem instances | state=current swappable, accent dot override par item |
| InspectPanel (280×auto) | Eyebrow + property rows + token swatches + used-in links | |
| TabBar | active=Preview / Code / Props | |
| **ExperienceCard** | default / expanded / compact / timeline | badge-current = instance `Badge variant=success` |
| **ProjectCard** | card / hero / mini | `card` variant inclut une image de projet (gradient placeholder) |
| **SkillCard** | badge / bar / radar | radar = SVG inline (pentagone + filled polygon) |

**Patterns** (composites projet — instancient des Components et Primitives)
| Pattern | Composé de | Usage |
|---|---|---|
| **ExperiencePreview** | Surface frame + 4 instances ExperienceCard en grille 2×2 | Onglet Preview du screen `<Experience />` |

### Hiérarchie effective (vérifiée)

```
Tokens (variables Colors/Spacing/Radius/Sizing + Text/Effect Styles)
   ↓ bound by
Primitives (Button, Badge, NavItem, TokenSwatch, PropertyRow, CodeBlock, Pill, ThemeToggle)
   ↓ instantiated in
Components (Header, MobileHeader, Sidebar, InspectPanel, TabBar)
   ↓ instantiated in
Patterns (Experience uses Badge instance, Project)
   ↓ instantiated in
Pages (Desktop & Mobile screens use Header/Sidebar/InspectPanel/TabBar instances + Pattern instances)
```

Aucune duplication inline — chaque couche consomme la précédente.

### Substitution Bukhari Script
- **Desktop Header (1280px)** : Bukhari Script via clone du node Tokens `10:94` (Adobe Fonts indisponible côté MCP runtime, mais le node manuellement édité par PE persiste avec la bonne fontName ; clone préserve sans nécessiter `loadFontAsync`)
- **MobileHeader (390px)** : Bukhari ne tient pas (le glyph "Polémil" mesure ~420px à fontSize 28, hors viewport mobile). Fallback **Pacifico** fontSize 22 utilisé.
- **Production** : Bukhari Script via webfont (Adobe Fonts CDN ou self-host) sur les deux breakpoints.

### Screens livrés (refonte v3 — tous instancient les Components et Patterns)
- `Pages — Desktop / Screen — Components/Experience — Desktop, Light` ✓ — onglet Preview avec ExperiencePreview Pattern instance
- `Pages — Desktop / Screen — Components/Experience — Desktop, Dark` ✓ — clone via setExplicitVariableModeForCollection
- `Pages — Desktop / Screen — Components/Experience — Desktop, Code (Light)` ✓ — TabBar swap vers active=Code, CodeBlock primitive instance avec JSX
- `Pages — Desktop / Screen — Components/Experience — Desktop, Props (Light)` ✓ — TabBar swap vers active=Props, table inline (NAME / TYPE / DEFAULT / DESCRIPTION)
- `Pages — Desktop / Screen — Patterns/Timeline — Desktop, Light` ✓ — Sidebar avec NavItem Timeline swappé en state=current, accent du wordmark = `accent/timeline`
- `Pages — Mobile / Screen — Components/Experience — Mobile, Light` ✓ (MobileHeader + variants scroll horizontal + bottom sheet peek)
- `Pages — Mobile / Screen — Components/Experience — Mobile, Dark` ✓

### Patterns / Composants à compléter en suivant si besoin (pas dans le scope minimum brief)
- Skill, Contact, About patterns (variants définis dans le spec mais non encore montés en Figma)
- Foundations/Colors *écran wrappé* (la page Tokens en sert déjà de référence)
- Patterns/Timeline en dark
- Mobile pour Foundations/Timeline

### Screenshots de référence
- `/tmp/figma-shots/tokens-page.png` — page Tokens complète
- `/tmp/figma-shots/desktop-experience-light-v2.png` — screen principal light
- `/tmp/figma-shots/desktop-experience-dark.png` — version dark
- `/tmp/figma-shots/desktop-timeline-light.png` — pattern Timeline

---

## 17. Hors-scope de l'étape UX

- Choix du framework (Astro, Next, etc.) → étape 3 Lead Dev.
- Stratégie de scoping CSS → étape 4 Architecte.
- Données réelles (textes définitifs FR/EN) → contenu Phase 2.

---

## 18. Suite

Une fois l'accès Figma résolu, je produis dans le fichier :
1. Variables (modes Light + Dark + Foundations vs accents par page)
2. Composants (primitives puis CV)
3. Écrans (Foundations/Colors, Components/Experience, Patterns/Timeline) en desktop + mobile
4. Update de ce fichier avec les noms exacts des nodes Figma
