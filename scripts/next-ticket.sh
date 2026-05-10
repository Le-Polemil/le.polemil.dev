#!/usr/bin/env bash
# Returns the next "Ready" ticket on the polemil.dev Project.
# Used by /develop to pick the next task. Requires `gh` CLI authenticated.
set -euo pipefail

PROJECT_NUMBER=6
OWNER="Le-Polemil"

gh project item-list "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq \
  '[.items[] | select(.status=="Ready")]
   | sort_by(.content.number)
   | .[0]
   | if . == null then
       "No Ready ticket found — promote a Backlog ticket to Ready first."
     else
       "#\(.content.number) — \(.content.title)\n\(.content.url)\nphase=\(.phase // "—") estimate=\(.estimate // "—") area=\(.area // "—")"
     end'
