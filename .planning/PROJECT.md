# call-debrief Skill

## What This Is

A multi-vector Claude Code skill that processes Fireflies call transcripts and generates structured coaching reports. Built as a live demo for the Claude Code course — real production skill Mitch uses, students study the pattern. Invoked with natural language args (`/call-debrief yesterday`, `/call-debrief meeting with Sarah`).

## Core Value

A sales call produces a scored Hormozi-framework coaching report with company-specific context and linked prior-call history — saving from output, not generating filler.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Five Hormozi reference files built with framework/B2B/anti-pattern/coaching-prompt structure
- [ ] SQLite memory schema links discovery → demo → proposal per prospect
- [ ] Natural language args parse to Fireflies query (temporal + people signals)
- [ ] Two-checkpoint transcript confirmation UX before processing
- [ ] LLM classifies call type; uncertain cases surface to user (Checkpoint 3)
- [ ] Sales path: company extraction → web context → sub-classification → scored report
- [ ] Content ideas vector always runs (3-5 quotes + 3-5 angles)
- [ ] Internal team vector: decisions + action items with owners + blockers
- [ ] SKILL.md under 100 lines, Pocock conventions, third-person description
- [ ] Report saved to `outputs/YYYY-MM-DD-[company].md`

### Out of Scope

- Real-time coaching / live call monitoring — batch post-call only
- Feed the killers / scheduling optimization / Decision Maker close / Cheap Competitor close — irrelevant for solo B2B context (documented in plan)
- Multi-level reference nesting — one level deep only (SKILL.md → reference files)

## Context

- Fireflies API client exists at `leadgrow-hq/tools/fireflies/pull_transcript.py`
- Hormozi video transcripts already fetched; Phase 0 distills them into structured reference files
- Existing transcript skill at `lg-content/skills/transcript/SKILL.md` for reference
- youtube-transcript skill at `course/claude-code-course/examples/skills/youtube-transcript/SKILL.md` for reference
- Skill location: `course/claude-code-course/examples/skills/call-debrief/`
- Course context: Mitch demos live, students study multi-vector design, UX checkpoints, conditional routing, reference file architecture

## Constraints

- **Skill size**: SKILL.md hard cap 100 lines — routing logic, invocation, flow only. No framework content inline.
- **Reference depth**: One level. Reference files do not nest further.
- **Runtime**: Bun for scripts (`init-db.js`, `fetch-transcript.js`, `query-prior-calls.js`)
- **Output format**: Markdown report only — no dashboard, no web UI

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Content ideas vector always runs | Maximizes course demo value regardless of call type | — Pending |
| SQLite for call memory | Zero-dependency, portable, course-demo-friendly | — Pending |
| Natural language args (not flags) | More ergonomic for demo; temporal/people signals map naturally | — Pending |
| Pocock SKILL.md conventions | Keeps skill file scannable; course demonstrates the pattern | — Pending |
| 4 Hormozi frameworks dropped | Irrelevant for solo B2B: team mgmt, scheduling, spouse close, cheap competitor | — Pending |

---
*Last updated: 2026-05-05 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
