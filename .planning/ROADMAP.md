# Roadmap: call-debrief Skill

**Project:** call-debrief — multi-vector Fireflies coaching skill
**Phases:** 6 | **Requirements:** 16 | **Coverage:** 100% ✓

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-----------------|
| 0 | Reference Files | Distill Hormozi frameworks into structured reference files | REF-01 to REF-05 | 5 |
| 1 | Memory Schema | SQLite schema for cross-call prospect tracking | DB-01, DB-02 | 3 |
| 2 | Transcript Fetch | Natural language args → Fireflies query → user picks transcript | FETCH-01, FETCH-02 | 4 |
| 3 | Classification | Call type detection + company context + prior call lookup | CLASS-01 to CLASS-03 | 4 |
| 4 | Processing Vectors | Content ideas, internal team, and sales coach vectors | VEC-01 to VEC-03 | 4 |
| 5 | SKILL.md | Pocock-compliant skill wrapper, report output, E2E test | SKILL-01 | 3 |

---

## Phase 0: Reference Files

**Goal:** Distill Hormozi video transcripts into five structured reference files — all sales coaching depends on these.

**Requirements:** REF-01, REF-02, REF-03, REF-04, REF-05

**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Write sales-coach-discovery.md (5 Hormozi discovery frameworks) ✓ 2026-05-05
- [x] 01-02-PLAN.md — Write sales-coach-demo.md (4 frameworks) + sales-coach-proposal.md (8 frameworks) ✓ 2026-05-05
- [x] 01-03-PLAN.md — Write content-ideas.md + internal-team.md (extraction guidelines) ✓ 2026-05-05

**Success criteria:**
1. `references/sales-coach-discovery.md` contains CLOSER, Gap Framework, Peel the Onion, Listen 2:1, Pain is the Pitch — each with Hormozi original / B2B equivalent / anti-pattern / coaching prompt
2. `references/sales-coach-demo.md` and `references/sales-coach-proposal.md` follow identical structure with their respective frameworks
3. `references/content-ideas.md` and `references/internal-team.md` contain actionable extraction guidelines (not raw transcript)
4. No raw transcript content in any file — everything distilled into structured format
5. 4 irrelevant frameworks absent from all files (team mgmt, scheduling, spouse close, cheap competitor)

**Deliverables:**
- `course/claude-code-course/examples/skills/call-debrief/references/sales-coach-discovery.md`
- `course/claude-code-course/examples/skills/call-debrief/references/sales-coach-demo.md`
- `course/claude-code-course/examples/skills/call-debrief/references/sales-coach-proposal.md`
- `course/claude-code-course/examples/skills/call-debrief/references/content-ideas.md`
- `course/claude-code-course/examples/skills/call-debrief/references/internal-team.md`

---

## Phase 1: Memory Schema

**Goal:** SQLite database that links discovery → demo → proposal calls per prospect for cross-session coaching continuity.

**Requirements:** DB-01, DB-02

**Success criteria:**
1. `bun scripts/init-db.js` creates `memory/calls.db` with correct schema (no errors)
2. `bun scripts/query-prior-calls.js acme.com` returns empty result cleanly when no prior calls exist
3. After manually inserting a test discovery record, query returns it with gaps_json parsed

**Deliverables:**
- `course/claude-code-course/examples/skills/call-debrief/scripts/init-db.js`
- `course/claude-code-course/examples/skills/call-debrief/scripts/query-prior-calls.js`
- `course/claude-code-course/examples/skills/call-debrief/memory/calls.db` (created at runtime, gitignored)

---

## Phase 2: Transcript Fetch

**Goal:** Natural language args parse to Fireflies API query; user picks transcript via numbered list; title/summary displayed for confirmation.

**Requirements:** FETCH-01, FETCH-02

**Success criteria:**
1. `/call-debrief yesterday` returns a real numbered list of transcripts from Fireflies (Checkpoint 1)
2. `/call-debrief meeting with Sarah` filters by participant name signal
3. Selecting a number displays: title · date · participants · AI summary (Checkpoint 2)
4. `n` at Checkpoint 2 returns to list; `y` advances to classification

**Deliverables:**
- `course/claude-code-course/examples/skills/call-debrief/scripts/fetch-transcript.js`

---

## Phase 3: Classification + Company Context

**Goal:** LLM classifies call type; sales path extracts company, fetches web context, and queries prior calls from SQLite.

**Requirements:** CLASS-01, CLASS-02, CLASS-03

**Success criteria:**
1. Internal call correctly classified as `internal` without Checkpoint 3
2. Sales call sub-classified as `discovery` / `demo` / `proposal` correctly
3. Ambiguous call triggers Checkpoint 3 asking user to confirm type
4. Sales path: company extracted from email domain, confirmed (Checkpoint 4), web search returns company overview

**Deliverables:**
- Classification logic in SKILL.md workflow section
- Company extraction + web search wired into skill flow

---

## Phase 4: Processing Vectors

**Goal:** Three parallel processing vectors fire based on call type; each generates its section of the final report.

**Requirements:** VEC-01, VEC-02, VEC-03

**Success criteria:**
1. Content ideas vector always produces 3-5 quotable moments + 3-5 content angles from any transcript
2. Internal team vector generates decisions, action items with owners (no orphaned items), and open blockers
3. Sales coach vector loads correct reference file, injects company context + prior gaps from `calls.db`, scores each dimension X/10 with specific evidence from transcript

**Deliverables:**
- Content ideas section in generated report
- Internal team section in generated report
- Sales coach scored section in generated report (discovery / demo / proposal format)

---

## Phase 5: SKILL.md

**Goal:** Pocock-compliant SKILL.md wrapper ties all vectors together; report saved to outputs/; end-to-end verified on a real Fireflies call.

**Requirements:** SKILL-01

**Success criteria:**
1. `SKILL.md` is under 100 lines; description is ≤1024 chars in third person with explicit invocation triggers
2. Report saved to `outputs/YYYY-MM-DD-[company].md` and path printed to terminal
3. End-to-end: `/call-debrief` on a real Fireflies sales call produces a complete scored report with company context — anonymized for course demo

**Deliverables:**
- `course/claude-code-course/examples/skills/call-debrief/SKILL.md`
- Example report in `outputs/` (anonymized, checked in as demo artifact)

---

## Dependency Order

```
Phase 0 (Reference Files)
    ↓
Phase 1 (Memory Schema)   ← can run in parallel with Phase 0
    ↓
Phase 2 (Transcript Fetch)
    ↓
Phase 3 (Classification)
    ↓
Phase 4 (Vectors)
    ↓
Phase 5 (SKILL.md + E2E)
```

Phase 0 and Phase 1 are independent and can run in parallel.
Phases 2–5 are sequential (each depends on prior layer).

---
*Roadmap created: 2026-05-05*
*Requirements coverage: 16/16 ✓*
