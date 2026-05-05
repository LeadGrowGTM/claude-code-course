---
phase: 01-reference-files
plan: 01
subsystem: call-debrief skill
tags: [reference-files, sales-frameworks, hormozi, content-extraction, internal-meetings]
dependency_graph:
  requires: []
  provides:
    - sales-coach-discovery.md — Hormozi discovery framework rubric for scoring discovery calls
    - sales-coach-demo.md — Hormozi demo framework rubric for scoring demo calls
    - sales-coach-proposal.md — Hormozi proposal framework rubric for scoring proposal calls
    - content-ideas.md — quotable moment + content angle extraction guidelines
    - internal-team.md — decision, action item, and blocker extraction guidelines
  affects:
    - Phase 5 (Processing Vectors) — all 3 sales vectors load these files at runtime
    - calls.db (Phase 2) — proposal coaching references discovery gaps as "carried forward"
tech_stack:
  added: []
  patterns:
    - 4-field framework entry format: Hormozi original, B2B equivalent, anti-pattern, coaching prompt
    - Extraction reference format: structured output guidelines with format specs
key_files:
  created:
    - course/claude-code-course/examples/skills/call-debrief/references/sales-coach-discovery.md
    - course/claude-code-course/examples/skills/call-debrief/references/sales-coach-proposal.md
  modified:
    - course/claude-code-course/examples/skills/call-debrief/references/sales-coach-demo.md
    - course/claude-code-course/examples/skills/call-debrief/references/content-ideas.md
    - course/claude-code-course/examples/skills/call-debrief/references/internal-team.md
decisions:
  - Use 4-field canonical format for all sales framework entries (Hormozi original, B2B equivalent, anti-pattern, coaching prompt) — enables consistent LLM parsing at runtime
  - B2B equivalents scoped to LeadGrow context: founder/VP buyers, $3–8k/mo full-service outbound retainer, three-pillar service (outreach engine + offer + targeting)
  - content-ideas.md uses extraction-first format with Content potential and Format suggestion fields — feeds directly into Mitch's LinkedIn/newsletter backlog
  - internal-team.md uses Owner-first action items with explicit UNASSIGNED flagging — prevents orphaned tasks
metrics:
  duration: ~35 minutes
  completed_date: "2026-05-05"
  tasks_completed: 2
  files_created: 2
  files_modified: 3
---

# Phase 01 Plan 01: Reference Files Summary

5 reference files for the call-debrief skill — Hormozi discovery/demo/proposal rubrics with LeadGrow B2B equivalents, plus content extraction and internal meeting guidelines.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write the three sales coaching reference files | 73cd45b | sales-coach-discovery.md (new), sales-coach-proposal.md (new), sales-coach-demo.md (updated) |
| 2 | Write the content-ideas and internal-team reference files | ef60521, 626a2c0 | content-ideas.md, internal-team.md (updated to canonical spec) |

## Verification Results

```
sales-coach-discovery.md: 5 Coaching prompts — PASS
sales-coach-demo.md: 4 Coaching prompts — PASS
sales-coach-proposal.md: 5 Coaching prompts — PASS
Dropped frameworks scan: CLEAN — PASS
content-ideas.md: quotable + Content potential + Format suggestion — PASS
internal-team.md: Decisions Made + Action Items + Open Blockers + Owner — PASS
```

## Deviations from Plan

### Pre-existing work from parallel agent

**Found during:** Task 1 and Task 2
**Issue:** The `course/claude-code-course` nested git repo already had `sales-coach-demo.md`, `content-ideas.md`, and `internal-team.md` committed by a parallel agent in commits `69ce87e`, `626a2c0`, `ef60521`. These files used different header formats than the plan spec.
**Fix:** Updated `sales-coach-demo.md` to match the canonical 4-field format with correct headers. Updated `content-ideas.md` and `internal-team.md` to the plan spec format with required field names (Content potential, Format suggestion, Owner). All acceptance criteria pass.
**Files modified:** sales-coach-demo.md, content-ideas.md, internal-team.md
**Commit:** 73cd45b

## Known Stubs

None — all files contain complete framework content with no placeholders or TODOs.

## Threat Flags

None — reference files contain only general sales frameworks, no PII, no credentials, no network endpoints.

## Self-Check: PASSED

Files exist:
- /c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/sales-coach-discovery.md — FOUND
- /c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/sales-coach-demo.md — FOUND
- /c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/sales-coach-proposal.md — FOUND
- /c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/content-ideas.md — FOUND
- /c/Users/mitch/Everything_CC/course/claude-code-course/examples/skills/call-debrief/references/internal-team.md — FOUND

Commits exist in course/claude-code-course repo: 73cd45b — FOUND
