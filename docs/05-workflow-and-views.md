# 05 — Workflow & Views — polemil.dev v2

**Auteur** : PO (Paul-Émile Moreau)
**Date** : 2026-05-10
**Statut** : actif
**Étape** : 5/5 — Backlog tickets + workflow `/develop`

---

## 1. Repos et Project

| Ressource | URL |
|---|---|
| Repo | https://github.com/Le-Polemil/le.polemil.dev |
| Project | https://github.com/users/Le-Polemil/projects/6 |

---

## 2. Statuts (cycle de vie d'un ticket)

Le champ Status du Project est configuré avec 5 options :

| Statut | Quand on y est | Action `/develop` |
|---|---|---|
| `Backlog` | Ticket créé mais pas encore prêt à être développé | Ignoré |
| `Ready` | Ticket prêt à être pické (dépendances résolues, AC clairs) | **Pické** par `/develop` |
| `In progress` | Quelqu'un développe le ticket | Ignoré |
| `Review` | PR ouverte, attente review | Ignoré |
| `Done` | PR merge, déployé en prod | Ignoré |

Au démarrage du projet : tous les tickets sont en `Backlog` sauf **#1** (`chore: finalize project bootstrap`) en `Ready`.

---

## 3. Champs custom du Project

| Champ | Type | Valeurs | Usage |
|---|---|---|---|
| `Phase` | single-select | `Phase 1`, `Phase 2` | Groupement MVP vs post-MVP |
| `Estimate` | single-select | `S`, `M`, `L` | T-shirt size |
| `Area` | single-select | `foundations`, `component`, `system`, `pattern`, `page`, `infra`, `i18n`, `test` | Filtrage par domaine |

---

## 4. Views à créer manuellement (limitation GitHub API)

Les Project v2 Views ne sont pas créables via l'API GitHub publique. Setup manuel — 3 vues recommandées :

### View 1 : `Board` (renommer la vue par défaut)
- **Layout** : Board
- **Group by** : Status
- **Visible fields** : Title, Phase, Estimate, Area, Labels
- **Sort** : aucun
- → Vue Kanban globale avec 5 colonnes Backlog / Ready / In progress / Review / Done.

### View 2 : `Ready Queue` (nouvelle vue, pour `/develop`)
- **Layout** : Table
- **Filter** : `status:"Ready"`
- **Sort** : `# asc`
- **Visible fields** : Title, Phase, Estimate, Area, Labels, Sub-issues progress
- → `/develop` picke le **premier** ticket de cette vue.

### View 3 : `By Phase` (planification)
- **Layout** : Board ou Table
- **Group by** : Phase
- **Visible fields** : Title, Status, Estimate, Area, Sub-issues progress
- → Vue de planification haute-niveau (combien reste en Phase 1).

---

## 5. Intégration `/develop`

La commande `/develop` (custom slash command Claude Code) suit ce workflow :

1. **Picker un ticket** : prendre le 1er item de la vue `Ready Queue` (ou via API CLI ci-dessous)
2. **Le passer en `In progress`** : update du field Status sur le project item
3. **Créer une branche** : `feat/<short-name>-#N` ou similaire
4. **Coder + commits Conventional**
5. **Pousser** et ouvrir une PR référençant l'issue (`Closes #N`)
6. **Passer en `Review`** : update Status
7. **Merge** → CI deploy → Status `Done` (automatisable par GitHub Actions)

### Snippets CLI pour `/develop`

**Récupérer le prochain ticket Ready (sortie compacte) :**
```bash
gh project item-list 6 --owner Le-Polemil --format json --jq \
  '[.items[] | select(.status=="Ready")] | sort_by(.content.number) | .[0]
   | "#\(.content.number) — \(.content.title)\n\(.content.url)"'
```

**Lister tous les Ready :**
```bash
gh project item-list 6 --owner Le-Polemil --format json --jq \
  '[.items[] | select(.status=="Ready")] | sort_by(.content.number)
   | .[] | "#\(.content.number) [\(.phase)/\(.estimate)/\(.area)] \(.content.title)"'
```

**Passer un ticket en `In progress`** (need item_id + project_id) :
```bash
gh project item-edit \
  --id <ITEM_ID> \
  --project-id PVT_kwHOAacMWs4BXS8v \
  --field-id PVTSSF_lAHOAacMWs4BXS8vzhSguO0 \
  --single-select-option-id 711cb195
```

Option IDs du field Status (mémo) :
- Backlog : `037003b8`
- Ready : `4eefccd4`
- In progress : `711cb195`
- Review : `b2c8a052`
- Done : `2d3b43ff`

Un helper `scripts/next-ticket.sh` est fourni à la racine pour la lecture rapide.

---

## 6. Labels de référence

Tous les tickets portent au minimum :
- 1 label `phase-1` ou `phase-2`
- 1 label `type:*` (feat / fix / chore / docs / refactor / perf / test)
- 1+ labels `area:*` (foundations / component / system / pattern / page / infra / i18n / test)

---

## 7. Milestones

| Milestone | Tickets | Critère de complétion |
|---|---|---|
| `Phase 1 — MVP démontrable` | #1 à #11 | Lighthouse ≥ 95, tests passent, screen Components/Experience livré en desktop + mobile + light/dark |
| `Phase 2 — Compléments` | #12 à #18 | Lighthouse 100/100, contenu réel finalisé, mode dev opérationnel |

---

## 8. Convention de commits

Cf. `04-architecture.md` §3.6 — Conventional Commits.

Format : `<type>(<scope>?): <subject>` — chaque commit lie son issue via `#N` dans le footer ou via la PR linkée.
