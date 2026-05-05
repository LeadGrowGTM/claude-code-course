---
phase: 01-reference-files
plan: "02"
subsystem: call-debrief/references
tags: [hormozi, sales-coaching, reference-files, demo, proposal]
dependency_graph:
  requires: []
  provides: [sales-coach-demo.md, sales-coach-proposal.md]
  affects: [SKILL.md sales coach vector]
tech_stack:
  added: []
  patterns: [canonical 4-section reference format]
key_files:
  created:
    - course/claude-code-course/examples/skills/call-debrief/references/sales-coach-demo.md
    - course/claude-code-course/examples/skills/call-debrief/references/sales-coach-proposal.md
  modified: []
decisions:
  - "Used 8 named frameworks in proposal file per plan spec, not the 5-framework condensed version written by parallel plan-01 agent"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-05"
  tasks_completed: 2
  files_created: 2
requirements: [REF-02, REF-03]
---

# Phase 1 Plan 02: Sales Coach Demo and Proposal Reference Files Summary

**One-liner:** Hormozi demo and proposal coaching reference files — 4 demo frameworks (Proof-Promise-Plan, Pain Anchoring, Three-Pillar, Engagement Ratio) and 8 proposal frameworks (3 Conviction Questions through Price Framing) in canonical 4-section format for the sales coach vector.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Write sales-coach-demo.md (4 frameworks) | 69ce87e | examples/skills/call-debrief/references/sales-coach-demo.md |
| 2 | Write sales-coach-proposal.md (8 frameworks) | 0b976c0 | examples/skills/call-debrief/references/sales-coach-proposal.md |

## Verification

All acceptance criteria passed:

**Demo file (sales-coach-demo.md):**
- Framework headers: 4
- Coaching prompts: 4
- Anti-patterns: 4
- B2B equivalents: 4
- Hormozi originals: 4
- Dropped frameworks: 0

**Proposal file (sales-coach-proposal.md) — verified from git HEAD:**
- Framework headers: 8
- Coaching prompts: 8
- Anti-patterns: 8
- B2B equivalents: 8
- Hormozi originals: 8
- Dropped frameworks: 0
- Key frameworks (Conviction, AAA, Rocking Chair, Reason Reversal, 1-10 Scale, Best/Worst, Shut Up, Price Framing): all present

## Deviations from Plan

### Parallel Agent Conflict

**Found during:** Task 2

**Issue:** A parallel wave-1 agent executing plan-01 (discovery) also wrote content to `sales-coach-proposal.md` before this agent could commit. The plan-01 agent created a 5-framework condensed version (Conviction Check, Objection Handling, Close Mechanics, Price Framing, Momentum) instead of the 8 named frameworks required by this plan's acceptance criteria.

**Fix:** Wrote the plan-02 specified 8-framework version and committed it, overwriting the plan-01 version. The committed version at `0b976c0` contains all 8 required frameworks.

**Files modified:** examples/skills/call-debrief/references/sales-coach-proposal.md

**Commit:** 0b976c0

### Demo File Modified by Parallel Agent

**Found during:** Task 1

**Issue:** After my commit `69ce87e` added sales-coach-demo.md, the plan-01 parallel agent modified the demo file in commit `73cd45b` (reformatted header from "Proof-Promise-Plan" to "Proof-Promise-Plan Opener", updated coaching prompt style). The 4-framework structure and all required section types were preserved.

**Assessment:** The modifications preserved the 4-framework structure and all acceptance criteria still pass. No corrective action needed for demo file — the plan-01 reformatting is compatible with this plan's requirements.

## Known Stubs

None. Both reference files contain complete framework content with specific scripts, B2B equivalents, anti-patterns, and coaching prompts ready for use by the sales coach vector.

## Threat Flags

None. Static markdown content only, no execution surface, no PII.

## Self-Check: PASSED

- sales-coach-demo.md: FOUND at examples/skills/call-debrief/references/sales-coach-demo.md
- sales-coach-proposal.md: FOUND at examples/skills/call-debrief/references/sales-coach-proposal.md (in git HEAD at 0b976c0)
- Commit 69ce87e: FOUND (demo file)
- Commit 0b976c0: FOUND (proposal file)
- All grep counts: PASSED (4/4 for demo, 8/8 for proposal)
