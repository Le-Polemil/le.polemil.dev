# Dual Subagent: Develop & Review Pipeline

## Project Context

- **Repo** : `Le-Polemil/le.polemil.dev`
- **GitHub Project** : https://github.com/users/Le-Polemil/projects/6 (number `6`, owner `Le-Polemil`)
- **Status column workflow** : `Backlog` → `Ready` → `In progress` → `Review` → (`To fix` ↩) → `Done`
- **Custom fields** : `Phase` (Phase 1 / Phase 2), `Estimate` (S / M / L), `Area`, `Time Used` (number), `Agent Count` (number)
- **Project ID (GraphQL)** : `PVT_kwHOAacMWs4BXS8v`
- **Status field ID** : `PVTSSF_lAHOAacMWs4BXS8vzhSguO0`
- **Status option IDs** : Backlog=`d81766bc`, Ready=`ccb5f5b7`, In progress=`848b6309`, Review=`f6b4e621`, To fix=`c3106430`, Done=`cd9d6fa6`
- **Helper** : `./scripts/next-ticket.sh` retourne le prochain ticket Ready

## Context
This command orchestrates two sequential subagents to autonomously develop the next ticket and review the resulting PR, simulating a real dev + lead-dev workflow.

```
[Subagent 1: @developer] ──output──▶ [Subagent 2: @lead-dev → /review]
```

Both subagents run **sequentially**. Subagent 2 waits for Subagent 1's return before starting.

---

## Ticket Prioritization

When picking the next ticket from the "Ready" column, follow this priority order:
1. **Tickets labeled `urgent` or `critical`** → always first.
2. **Tickets labeled `bug` or `fix`** → before features, stability first.
3. **Tickets with the smallest estimated effort** (if estimated) → quick wins first to unblock others.
4. **Order in the column** → if none of the above differentiates, pick the topmost ticket.

If the ticket is ambiguous, too large (no clear scope), or missing acceptance criteria, **stop and ask the user** before starting work.

---

## Timeout & Limits

Each subagent has a **soft time budget** to avoid infinite loops:
- **Subagent 1 (@developer):** ~30 min equivalent of work. If the task clearly exceeds this (e.g. massive feature), stop after scoping, note what's left, and ask the user whether to continue or split the ticket.
- **Subagent 2 (@lead-dev):** deferred to `/review` timeout (~15 min).

These are guidelines, not hard kills. The goal is awareness: if work is dragging, pause and communicate rather than spiral.

### Time & Pass Tracking

Both subagents **must track their execution time** (in minutes, rounded up).

- **"Time Used" custom field** (on the ticket): Each subagent (developer and lead-dev) **adds** its elapsed time to the existing value. This is cumulative across all passes.
- **"Agent Count" custom field** (on the ticket): Incremented by **1 each time a @developer subagent works on the ticket**. @lead-dev passes do **not** increment this counter.

This gives visibility on how much AI time a ticket consumed and how many dev passes were needed before it was ready.

---

## Inter-Subagent Contract

Subagent 1 **must** return a JSON object matching this exact schema. The `/review` command **must** validate it before starting.

```jsonc
{
  // Required fields — /review must reject if any is missing
  "ticket_id": "string",        // e.g. "PROJ-142"
  "ticket_title": "string",     // e.g. "Fix Safari auth redirect"
  "summary": "string",          // What was done, 2-5 sentences
  "pr_number": "number",        // e.g. 87
  "branch": "string",           // e.g. "fix/142-safari-auth-redirect"
  "status": "success | partial | failed",

  // Required arrays — can be empty []
  "difficulties": ["string"],   // Problems encountered
  "acceptance_criteria": ["string"], // Copied from ticket for review verification

  // Optional fields
  "diff_lines": "number | null",     // Approximate meaningful diff size
  "split_commits": "boolean",        // Whether work was split into multiple commits
  "notes_for_reviewer": "string | null" // Anything the dev wants the reviewer to know
}
```

**If `status` is `failed`:** `/review` skips the review, moves the ticket to "To Fix", comments with the failure reason, and returns a summary to the user.

**If `status` is `partial`:** `/review` reviews what's there but notes incomplete areas.

---

## Failure Handling & Cleanup

If **Subagent 1 fails or is interrupted** at any point:

1. **Do not leave orphan resources.** Clean up in reverse order:
   - Remove the worktree if it was created: `git worktree remove <path>`
   - Delete the remote branch if it was pushed but no PR was opened: `git push origin --delete <branch>`
   - If a PR was opened but work is unusable, close it with a comment explaining the failure.
   - If the ticket was moved, move it back to "Ready".

2. **Write a failure section** in `work/<ticket-id>.md`:
   ```markdown
   ## <YYYY-MM-DD> — ❌ Failed: <short reason>
   - Step reached: <last completed step>
   - Error: <error details>
   - Cleanup done: <what was rolled back>
   - Action needed: <what the user should do>
   ```

3. **Return to the user** with a clear explanation of what happened, what was cleaned up, and what remains to do.

> Failure handling for Subagent 2 is managed by the `/review` command itself.

---

## Subagent 1 — @developer : Develop Next Ticket

**Input:** Previous subagent return (if any), or default base branch `main`.

### Steps:

1. **Pick the next ticket** from the project board using the prioritization rules above.

2. **Create a new branch** from the base ref (previous subagent's branch, or `main` by default).
   - Branch naming: `<prefix>/<ticket-number>-<slug>`
   - Prefix based on ticket type:
     - `feat/` → new feature
     - `fix/` → bug fix
     - `doc/` → documentation only
     - `config/` → configuration change
     - `test/` → test additions/changes
     - `refactor/` → code refactoring
   - Slug: 2-3 words describing the ticket, kebab-case.
   - Example: `fix/142-safari-auth-redirect`

3. **Create a git worktree** on that branch to isolate work.

4. **Develop the feature / fix:**
   - Read the ticket description, acceptance criteria, and any linked resources.
   - Follow the app context, existing docs (`/docs`, `README`, etc.), and global code patterns already in the codebase.
   - Incorporate any context returned by previous subagents.
   - Write or update **tests** to cover the changes.

5. **Diff size check:** If the diff exceeds ~400 lines of meaningful changes (excluding generated files, locks, etc.):
   - Split the work into logical, independently reviewable commits.
   - If it can't be split meaningfully, note it in the work document and PR description as a warning for the reviewer.

6. **Run tests & lint before committing:**
   - Run the project's test suite and linter.
   - **If failures:** attempt to fix them autonomously (max 2 attempts).
   - **If still failing after 2 attempts:** stop, notify the user with the exact errors, and wait for the user to fix them and confirm the agent can re-run tests/lint.
   - **Only proceed to commit once tests & lint pass.**

7. **Self-review before push:**
   - Re-read the full diff as if reviewing someone else's code.
   - Check for: dead code, leftover debug logs, missing error handling, inconsistent naming, forgotten TODOs, unused imports.
   - Fix anything found, then re-run tests/lint if changes were made.

8. **Conflict check before PR:**
   - Fetch latest from the base branch and check for merge conflicts.
   - If conflicts exist: attempt to resolve them. If resolution is ambiguous, stop and ask the user.

9. **Update the work document** at `work/<ticket-id>.md`:
   - If the file doesn't exist, create it with the ticket title as `# <ticket-id> — <ticket title>`.
   - If the file already exists, **append** a new section at the end.
   - Each section starts with a date header: `## <YYYY-MM-DD> — <short action summary>` (e.g. `## 2026-02-24 — Initial development`).
   - Section content:
     - Summary of what was done.
     - Key decisions taken and their rationale.
     - Difficulties encountered or uncertainties.
     - Any notes about diff size or split commits if applicable.

10. **Commit, push, and open a PR** with a clear title and description referencing the ticket. Include acceptance criteria in the PR description for the reviewer.

11. **Move the ticket** to the **"Review"** column on the project board.

12. **Comment on the ticket** with any difficulties or open questions encountered during development.

13. **Update ticket custom fields:**
    - **"Time Used"**: add elapsed time (in minutes, rounded up) to the current value.
    - **"Agent Count"**: increment by 1.

### Return:
Return a JSON object matching the inter-subagent contract schema above. Copy acceptance criteria from the ticket verbatim into the `acceptance_criteria` array.

---

## Subagent 2 — @lead-dev : Review the PR

**Execute the `/review` command**, passing the full JSON return from Subagent 1 as contract input.