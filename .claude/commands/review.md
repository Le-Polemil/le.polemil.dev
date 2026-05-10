# /review — Lead-Dev PR Review

## Context
Standalone review command using @lead-dev role. Can be triggered manually on any PR, or called automatically by the Develop & Review pipeline.

> Use a **different GitHub identity** if possible (e.g. a dedicated review bot account or another configured user) to clearly separate authorship from review.

---

## Input

This command accepts **either**:

**A) A subagent contract** (from the pipeline):
```jsonc
{
  "ticket_id": "string",
  "ticket_title": "string",
  "summary": "string",
  "pr_number": "number",
  "branch": "string",
  "status": "success | partial | failed",
  "difficulties": ["string"],
  "acceptance_criteria": ["string"],
  "diff_lines": "number | null",
  "split_commits": "boolean",
  "notes_for_reviewer": "string | null"
}
```

**B) A manual call** with minimal info:
```
/review <pr_number>
```
In this case, the lead-dev must:
- Fetch the PR details, linked ticket, and acceptance criteria autonomously.
- Read the `work/<ticket-id>.md` if it exists for additional context.

---

## Timeout

This command has a **soft time budget of ~15 minutes**. If the PR is too large to review meaningfully within this window:
- Stop the line-by-line review.
- Leave a summary comment on the PR flagging it as too large to review effectively.
- Suggest splitting the PR into smaller, focused PRs.
- Move the ticket to "To fix" with a comment explaining the PR needs to be split.
- Return to the user with this recommendation.

---

## Review Philosophy: Équilibré

- **Block only on real problems** that would cause bugs, security issues, or significant maintainability debt.
- Important design or pattern concerns → request changes with clear explanation.
- Minor style/naming nits → suggest as non-blocking comments.
- Don't block on subjective preferences if the code works and is readable.

---

## Pre-flight

1. **If input is a contract:** validate against the schema. If any required field is missing, stop and report to the user.
2. **If `status` is `failed`:** skip review, move ticket to "To Fix", comment with failure reason, return summary.
3. **If input is manual (`/review <pr_number>`):** fetch PR, find linked ticket, extract acceptance criteria, read `work/<ticket-id>.md` if available.

4. **Check for existing reviews on the PR:**
   - If the PR already has a review from the same lead-dev identity: **do not create a duplicate review**.
   - Instead, read the existing review, check if the issues flagged have been addressed in new commits since that review, and **update the existing review** (re-review) rather than adding a new one.
   - If nothing has changed since the last review, return immediately: `"PR #<number> already reviewed, no new commits since last review."`

5. **Read existing PR comments and reviews** (from humans or previous agents):
   - Note all existing comments, suggestions, and change requests.
   - During the review: **do not flag issues already raised** by another reviewer unless adding meaningful context.
   - If a previous reviewer flagged something and the code was updated since: verify the fix and acknowledge it (e.g. "Resolved since @reviewer's comment").
   - If a previous reviewer approved something the lead-dev disagrees with: flag it as a new concern, referencing the previous approval for context.

6. **Determine if the PR is linked to a ticket:**
   - If yes → proceed normally with all ticket-related steps (acceptance criteria, move, comment).
   - If no → enter **code-only review mode** (see below).

---

## Code-Only Review Mode (PR without linked ticket)

When no ticket is linked to the PR:
- **Skip** acceptance criteria verification (step 2).
- **Skip** ticket-related actions: moving columns, commenting on ticket, updating custom fields.
- **Focus exclusively** on code quality, patterns, tests, and the PR description.
- **Adjust return format** (see Return section below).

---

## Steps

1. **Review the PR** (`#<pr_number>`) thoroughly, using all available context (contract, ticket, work doc, PR description). For each issue found, **leave a code suggestion or comment directly on the concerned line(s)** in the PR. Categorize:
   - 🔴 **Blocking:** Bugs, security issues, broken logic, missing error handling, data loss risks.
   - 🟡 **Important:** Bad patterns, poor design, weak/missing tests, significant code duplication.
   - 🟢 **Nit:** Style, readability, minor naming improvements, optional refactors.

2. **Verify acceptance criteria** _(skip in code-only mode)_:
   - Cross-check every item in acceptance criteria against the actual code changes.
   - For each criterion, mark it as: ✅ met, ⚠️ partially met (explain what's missing), or ❌ not met.
   - Missing acceptance criteria count as 🔴 **Blocking**.

3. **Review the work document** (`work/<ticket-id>.md`) if it exists:
   - Check that decisions documented make sense and align with project patterns.
   - Flag any undocumented decisions visible in the code but absent from the doc.
   - Suggest additions or corrections if needed (as a PR comment).
   - Append a dated section: `## <YYYY-MM-DD> — Code review notes` with findings and recommendations.

4. **Add a summary comment on the ticket** _(skip in code-only mode)_ listing:
   - Acceptance criteria status (✅/⚠️/❌ for each).
   - What needs to be fixed (blocking + important).
   - What's optional to improve (nits).

5. **Move the ticket** _(skip in code-only mode)_:
   - → **"Review"** if **no blocking issues** and **all acceptance criteria met**.
   - → **"To fix"** if **at least one blocking issue** or **any acceptance criteria not met**.

6. **Submit the PR review** as "Approve" or "Request Changes" accordingly.

7. **Cleanup the worktree** (if one exists for this branch):
   - If approved: remove the worktree with `git worktree remove <path>`.
   - If changes requested: **keep the worktree** so the next dev pass can reuse it.

8. **Update ticket custom fields** _(skip in code-only mode)_:
   - **"Time Used"**: add elapsed time (in minutes, rounded up) to the current value.
   - **Do NOT increment "Agent Count"** (only @developer passes count).

---

## Failure Handling

If the review **fails or is interrupted** at any point:

1. **Do not leave the review in an inconsistent state:**
   - If a "Request Changes" review was partially submitted, complete it with a note that the review was interrupted.
   - If the ticket was not yet moved, leave it where it is (don't move it to an incorrect column).

2. **Append a failure section** in `work/<ticket-id>.md` (if a ticket exists):
   ```markdown
   ## <YYYY-MM-DD> — ❌ Review failed: <short reason>
   - Step reached: <last completed step>
   - Error: <error details>
   - Partial findings: <any issues already identified>
   - Action needed: <re-run /review or manual review>
   ```

3. **Return to the user** with:
   ```
   ❌ Review of PR #<number> failed at step <n>.
   Reason: <short explanation>.
   Partial findings: <n> issues found before failure.
   Action: <re-run /review or review manually>.
   ```

---

## Return

**Standard mode (with ticket):**
```
Ticket <ID> → "<column>".
<1-2 sentence reason>.
Acceptance criteria: <n>/<total> met.
Fixes: <n> blocking, <n> important, <n> nits.
```

**Code-only mode (no ticket):**
```
PR #<number> reviewed.
<1-2 sentence summary>.
Fixes: <n> blocking, <n> important, <n> nits.
```

**Already reviewed (no new commits):**
```
PR #<number> already reviewed, no new commits since last review.
```