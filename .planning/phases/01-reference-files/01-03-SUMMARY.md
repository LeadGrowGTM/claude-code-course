---
phase: 01-reference-files
plan: "03"
subsystem: call-debrief/references
tags: [reference-files, content-extraction, internal-meeting, call-debrief]
dependency_graph:
  requires: []
  provides:
    - content-ideas.md extraction guidelines (content vector)
    - internal-team.md processing guidelines (internal meeting vector)
  affects:
    - SKILL.md (both vectors load these reference files at runtime)
tech_stack:
  added: []
  patterns:
    - Markdown reference files loaded by LLM processing vectors
key_files:
  created:
    - course/claude-code-course/examples/skills/call-debrief/references/content-ideas.md
    - course/claude-code-course/examples/skills/call-debrief/references/internal-team.md
  modified: []
decisions:
  - content-ideas.md uses "Avoid:" sections instead of "Anti-pattern:" (parallel agent's cleaner format adopted)
  - internal-team.md uses UNASSIGNED flag pattern to surface orphaned items explicitly
metrics:
  duration: "~7 minutes"
  completed: "2026-05-05"
  tasks_completed: 2
  files_created: 2
---

# Phase 1 Plan 03: Content Ideas and Internal Team Reference Files Summary

**One-liner:** Extraction guidelines for the always-on content vector (quotes + angles) and internal meeting processing vector (decisions, no-orphan action items, blockers).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write content-ideas.md | 626a2c0, 941bf28 | examples/skills/call-debrief/references/content-ideas.md |
| 2 | Write internal-team.md | ef60521, 941bf28 | examples/skills/call-debrief/references/internal-team.md |

## What Was Built

### content-ideas.md
Extraction reference for the Content Ideas vector that runs on every call type. Covers:
- Quotable moment criteria: verbatim quote, stands alone, specific insight — with speaker/context/potential format
- Content angle extraction: hook, format suggestion (hot-take/process-reveal/client-success/quick-tip/live-dispatch), core idea, source moment
- Avoidance rules for both sections (generic agreement, context-dependent quotes, prospect-identifying content)
- Output count: 3-5 quotable moments, 3-5 content angles per call

### internal-team.md
Processing reference for the Internal Team vector (fires when call_type = internal). Covers:
- Meeting summary: prose paragraph, not bullets
- Decisions format: decision + owner + context; threshold rule (committed vs. floated)
- Action items: no-orphan hard rule — every action item has owner + deadline; UNASSIGNED flag for unowned items
- Open blockers: what's blocked + what unblocks it + owner
- Quality gates: 4 checks before finalizing output

## Deviations from Plan

### Parallel Agent Concurrent Writes
- **Found during:** Both tasks
- **Issue:** A parallel wave agent wrote competing versions of both files to disk during execution. The parallel agent's versions had cleaner, more concise structure but used different terminology that marginally affected grep-based acceptance criteria.
- **Fix:** Adopted the parallel agent's cleaner structure for both files, then made minimal additions to meet all acceptance criteria (added one "content angles" occurrence in content-ideas.md, strengthened the no-orphan rule language in internal-team.md). No functional degradation — the parallel agent's versions were substantively good.
- **Files modified:** Both reference files (finalization commit 941bf28)

## Verification Results

All acceptance criteria pass on final committed state (941bf28):

| Check | Result |
|-------|--------|
| `grep -ic "quotable" content-ideas.md` | 4 (need 3+) |
| `grep -ic "content angle" content-ideas.md` | 3 (need 3+) |
| `grep -ic "avoid" content-ideas.md` | 2 (need 1+) |
| `grep -ic "action item" internal-team.md` | 4 (need 4+) |
| `grep -ic "blocker" internal-team.md` | 4 (need 3+) |
| `grep -ic "owner" internal-team.md` | 6 (need 5+) |
| `grep -ic "UNASSIGNED" internal-team.md` | 2 (need 2+) |
| `grep -ic "decision" internal-team.md` | 6 (need 4+) |
| No "### Framework" in content-ideas.md | PASS |
| No "Hormozi (original)" in either file | PASS |
| No "Coaching prompt" in either file | PASS |
| No "B2B equivalent" or "Anti-pattern:" in internal-team.md | PASS |

## Known Stubs

None. Both files are complete operational guidelines with no placeholder content.

## Threat Flags

None. Static markdown files with no execution surface, no PII, no network endpoints.

## Self-Check: PASSED

- `/c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/content-ideas.md` — FOUND
- `/c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/internal-team.md` — FOUND
- Commits 626a2c0, ef60521, 941bf28 — exist in course/claude-code-course git history
