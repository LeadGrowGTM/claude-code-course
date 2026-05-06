---
phase: 03-classification-company-context
verified: 2026-05-06T19:15:00Z
status: gaps_found
score: 4/5 must-haves verified
overrides_applied: 0
gaps:
  - truth: "When call type is internal, all participants sharing a company domain matching the workspace internal list triggers internal classification"
    status: partial
    reason: "extract-company.js and SKILL.md Tier 1 classification rule only filter leadgrow.ai as an internal domain. leadgrowgtm.com is absent from both, despite being explicitly required in PLAN acceptance criteria and the interfaces block. A call where all participants are @leadgrowgtm.com would be misclassified as sales."
    artifacts:
      - path: "examples/skills/call-debrief/scripts/extract-company.js"
        issue: "Line 5 and 13: only checks `!== 'leadgrow.ai'`. Missing `&& domain !== 'leadgrowgtm.com'`"
      - path: "examples/skills/call-debrief/SKILL.md"
        issue: "Line 57: classification rule only lists @leadgrow.ai as internal signal. leadgrowgtm.com absent."
    missing:
      - "Add `&& domain !== 'leadgrowgtm.com'` to both domain filter conditions in extract-company.js (lines 5 and 13)"
      - "Add `leadgrowgtm.com` to the internal domain list in SKILL.md Step 1 Tier 1 classification rule (line 57)"
      - "Add a test case to extract-company.test.js: organizer_email @leadgrowgtm.com should return null (internal domain filter)"
---

# Phase 3: Classification + Company Context Verification Report

**Phase Goal:** Call type + company context + prior calls surfaced
**Verified:** 2026-05-06T19:15:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

Note: The orchestrator brief referenced this as "Phase 4" but the ROADMAP.md and planning directory label this as Phase 3. The git commits use `feat(04-01)` and `feat(04-02)` prefixes. Verification is against ROADMAP Phase 3 success criteria and the single plan at `03-classification-company-context/03-01-PLAN.md`.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | LLM classifies transcript as internal/sales/general; CP3 fires on low confidence only | VERIFIED | SKILL.md Step 2: `if confidence === "low"` triggers CP3; `confidence === "high"` explicitly skips it. Tier 1 prompt returns `{ type, sub_type, confidence }` schema. |
| 2 | Sales path uses Tier 2 full-transcript sub-classification (discovery/demo/proposal) | VERIFIED | SKILL.md Step 3: `fetch-transcript.js full <id>` via raw `Bun.spawn`, then Tier 2 LLM prompt on full text. |
| 3 | extract-company.js exists with 5 tests green; CP4 shows domain + overview before confirm | VERIFIED | `bun test scripts/` output: 14 pass, 0 fail across 2 files. CP4 in SKILL.md Step 5 runs WebSearch first, extracts web_overview, then presents domain + overview to user. |
| 4 | query-prior-calls.js wired; callContext assembled with prior_calls | VERIFIED | SKILL.md Step 7 invokes `query-prior-calls.js` via `Bun.spawn`. Step 9 assembles `callContext` including `prior_calls` field. Two reddit-find queries wired in Step 6 (company name + industry pain points). |
| 5 | Internal domain list includes both leadgrow.ai AND leadgrowgtm.com | FAILED | extract-company.js only filters `!== 'leadgrow.ai'`. SKILL.md Tier 1 rule only lists `@leadgrow.ai`. leadgrowgtm.com absent from both. |

**Score:** 4/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `examples/skills/call-debrief/SKILL.md` | Workflow with CP3, CP4, query-prior-calls, callContext | VERIFIED | 228 lines. All checkpoints present. Steps 1-9 in Phase 4 section. |
| `examples/skills/call-debrief/scripts/extract-company.js` | 5 tests green, domain + company_name extraction | VERIFIED | 35 lines. Exports `extractCompany`. Handles organizer_email priority, participants scan, returns null for internal-only calls. |
| `examples/skills/call-debrief/scripts/extract-company.test.js` | 5 test cases | VERIFIED | 5 `it()` cases covering: external organizer, leadgrow.ai fallback to participants, all-internal returns null, empty returns null, external organizer first. |
| `examples/skills/call-debrief/scripts/fetch-transcript.js` | Full submode: raw Bun.spawn, plain text, ID validation | VERIFIED | `mode === 'full'` branch (line 96-116): validates ID with `/^[a-zA-Z0-9_\-]+$/`, spawns `pull_transcript.py get <id>`, outputs plain text. |
| `examples/skills/call-debrief/scripts/save-call.js` | bun:sqlite INSERT with import.meta.main guard | VERIFIED | Exports `saveCall`, parameterized INSERT with `?` placeholders, CLI guard at `import.meta.main`. |
| `examples/skills/call-debrief/scripts/query-prior-calls.js` | Domain-scoped lookup, returns [] when no DB | VERIFIED | Returns `[]` when `calls.db` missing (existsSync guard). Parameterized SELECT. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| SKILL.md Phase 4 Step 2 | Checkpoint 3 | `confidence === "low"` branch | VERIFIED | Line 69: explicit conditional, line 72 confirms skip on high |
| SKILL.md Phase 4 Step 3 | fetch-transcript.js full mode | `Bun.spawn(['bun', 'scripts/fetch-transcript.js', 'full', transcript_id])` | VERIFIED | Lines 78-80 of SKILL.md; `mode === 'full'` branch confirmed in fetch-transcript.js |
| SKILL.md Phase 4 Step 5 | WebSearch (CP4) | WebSearch runs before CP4 prompt | VERIFIED | Step 5 runs WebSearch first (line 128-129), then presents domain + overview in CP4 block |
| SKILL.md Phase 4 Step 7 | query-prior-calls.js | `Bun.spawn(['bun', 'scripts/query-prior-calls.js', confirmedDomain])` | VERIFIED | Lines 172-177 of SKILL.md |
| SKILL.md Phase 4 Step 6 | reddit-find (2 queries) | company name query + industry pain points query | VERIFIED | Lines 150-161: proc1 (company_name) and proc2 (inferredIndustry pain points), both --titles-only --limit 10 |
| SKILL.md Phase 4 Step 9 | callContext assembly | Object literal with all fields including prior_calls | VERIFIED | Lines 196-206: callContext includes transcript_id, classification, domain, web_overview, reddit_threads, prior_calls |
| extract-company.js | SKILL.md Step 4 | `Bun.spawn(['bun', 'scripts/extract-company.js', JSON.stringify({...})])` | VERIFIED | SKILL.md lines 112-119; extract-company.js exports `extractCompany` matching the expected signature |

### Data-Flow Trace (Level 4)

Not applicable — this phase produces workflow prose (SKILL.md) and utility scripts, not components rendering dynamic data. Tests confirm extract-company.js data flow from JSON input to structured output.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 14 tests pass (extract-company 5 tests + fetch-transcript 9 tests) | `bun test scripts/` in call-debrief dir | `14 pass, 0 fail` in 38ms | PASS |
| TDD RED commit before GREEN commit | `git log --oneline` | `368cdd1 test(04-01): add failing tests for extractCompany` precedes `8a1c0d4 feat(04-01): implement extractCompany — all 5 tests pass` | PASS |
| Full submode ID validation | Code inspection of fetch-transcript.js lines 103-106 | `/^[a-zA-Z0-9_\-]+$/` regex guards before any spawn | PASS |
| CP3 fires only on confidence=low | Code inspection of SKILL.md lines 69-72 | Explicit `=== "low"` condition; `=== "high"` explicitly skips | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CLASS-01 | 03-01-PLAN.md | LLM classifies transcript as internal/sales/general; uncertain cases surface for Checkpoint 3 | SATISFIED | SKILL.md Tier 1 prompt, CP3 gate on confidence=low, Tier 2 sub-classification for sales path |
| CLASS-02 | 03-01-PLAN.md | For sales calls: extracts company from email domain, presents for Checkpoint 4 (CP4), runs web search for company overview | SATISFIED (partial gap) | extract-company.js working, CP4 with web search wired. leadgrowgtm.com missing from internal domain filter. |
| CLASS-03 | 03-01-PLAN.md | Queries calls.db for prior calls with same company_domain; surfaces linked gaps before report | SATISFIED | SKILL.md Step 7 invokes query-prior-calls.js, prior_calls included in callContext Step 9 |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `scripts/extract-company.js` | 5, 13 | `!== 'leadgrow.ai'` — missing `leadgrowgtm.com` filter | Warning | Calls where all participants are @leadgrowgtm.com will not return null; extract-company returns a company record treating leadgrowgtm as an external domain, causing incorrect sales classification |
| `SKILL.md` | 57 | Internal classification rule only lists `@leadgrow.ai` — missing `leadgrowgtm.com` | Warning | Same functional impact as above at the LLM classification level |

### Human Verification Required

None — all behavioral checks are programmatically verifiable for this phase. Phase 3 produces workflow prose and utility scripts; no UI, real-time, or external service behavior that needs manual validation.

### Gaps Summary

One gap blocking a PLAN acceptance criterion:

**leadgrowgtm.com internal domain filter missing.** The PLAN's interfaces block, Task 1 constraints, and Task 2 constraints all explicitly required `leadgrowgtm.com` as a second internal domain alongside `leadgrow.ai`. The implementation only implemented `leadgrow.ai`. This affects two places:

1. `extract-company.js` will return a non-null company record for calls where the organizer or participants are `@leadgrowgtm.com`, causing those calls to be treated as sales calls.
2. SKILL.md's Tier 1 classification rule only lists `@leadgrow.ai` as the internal domain signal, so the LLM will not classify `@leadgrowgtm.com`-only calls as `internal`.

The ROADMAP success criteria do not explicitly name `leadgrowgtm.com`, so this gap is against PLAN acceptance criteria only, not the top-level roadmap contract. If LeadGrow only sends calls via `leadgrow.ai` addresses in practice, this may have no operational impact — but it is a spec deviation.

Root cause: a single two-word omission that appears in both the extraction script and the SKILL.md classification rule. Fix is mechanical — no architectural change required.

---

_Verified: 2026-05-06T19:15:00Z_
_Verifier: Claude (gsd-verifier)_
