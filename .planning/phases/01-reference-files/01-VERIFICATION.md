---
phase: 01-reference-files
verified: 2026-05-05T12:00:00Z
status: gaps_found
score: 4/5 must-haves verified
overrides_applied: 0
gaps:
  - truth: "sales-coach-discovery.md contains CLOSER, Gap Framework, Peel the Onion, Listen 2:1, Pain is the Pitch as named frameworks"
    status: partial
    reason: "CLOSER and Pain is the Pitch appear in body text, but Gap Framework, Peel the Onion, and Listen 2:1 are absent as named terms. Headings were renamed to functional descriptions: Gap Opening, Pain Surfacing, Outcome Connection, Qualification, Talk Ratio. The coaching content is substantive and correct, but the Hormozi framework names required by REF-01 and ROADMAP SC-1 are not present."
    artifacts:
      - path: "course/claude-code-course/examples/skills/call-debrief/references/sales-coach-discovery.md"
        issue: "Heading 'Qualification' should reference 'Gap Framework'; heading 'Pain Surfacing' should reference 'Peel the Onion'; heading 'Talk Ratio' should reference 'Listen 2:1'. The ROADMAP success criterion and REF-01 require these framework names to be present."
    missing:
      - "Add 'Gap Framework' name to the Qualification section (e.g. '### Qualification (Gap Framework)')"
      - "Add 'Peel the Onion' name to the Pain Surfacing section (e.g. '### Pain Surfacing (Peel the Onion)')"
      - "Add 'Listen 2:1' name to the Talk Ratio section (e.g. '### Talk Ratio (Listen 2:1)')"
---

# Phase 1: Reference Files Verification Report

**Phase Goal:** Write 5 Hormozi-based reference files that the call-debrief skill's processing vectors will load at runtime — covering discovery calls (5 frameworks), demo calls (4 frameworks), proposal calls (8 frameworks), content extraction (always-on), and internal meeting processing.
**Verified:** 2026-05-05T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | sales-coach-discovery.md exists with 5 Hormozi discovery frameworks, each with 4-section format | PARTIAL | File exists, 5 headings, 5x each required section. But named frameworks (Gap Framework, Peel the Onion, Listen 2:1) absent from file text — replaced with functional descriptions |
| 2 | sales-coach-demo.md exists with all 4 demo frameworks in canonical format | VERIFIED | 4 headings, 4x Hormozi original/B2B equivalent/Anti-pattern/Coaching prompt. Proof-Promise-Plan, Pain Anchoring, Three-Pillar Framing, Engagement all present |
| 3 | sales-coach-proposal.md exists with all 8 proposal frameworks in canonical format | VERIFIED | 8 headings, 8x all 4 required sections. All 8 named frameworks present: 3 Conviction Questions, AAA, Rocking Chair, Reason Reversal, 1-10 Scale, Best/Worst Case, Shut Up When They Say Yes, Price Framing and Order |
| 4 | content-ideas.md exists with actionable extraction guidelines for quotes and content angles | VERIFIED | File exists, 4 matches for "quotable", 3 matches for "content angle", 2 matches for avoid/anti-pattern, format options present. Guidelines are specific and operational |
| 5 | internal-team.md exists with processing guidelines for decisions, action items with owners, and blockers | VERIFIED | File exists, 4x "action item", 4x "blocker", 6x "owner", 2x "UNASSIGNED", 6x "decision". Hard no-orphan rule present. No Hormozi sales content contamination |

**Score:** 4/5 truths verified (1 partial — naming deviation in discovery file)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `references/sales-coach-discovery.md` | 5 frameworks, 4-section format each | PARTIAL | Exists, substantive, correct structure — Hormozi framework names missing from headings/body |
| `references/sales-coach-demo.md` | 4 frameworks, 4-section format each | VERIFIED | All acceptance criteria pass |
| `references/sales-coach-proposal.md` | 8 frameworks, 4-section format each | VERIFIED | All acceptance criteria pass |
| `references/content-ideas.md` | Extraction guidelines for quotes and angles | VERIFIED | Specific, actionable, correct format |
| `references/internal-team.md` | Processing guidelines with no-orphan rule | VERIFIED | Hard rules present, correct format |

### Key Link Verification

These are static reference files — they have no runtime wiring yet (SKILL.md is Phase 5). Key links specified in PLAN frontmatter describe future wiring to the skill vector, not current connections. Verification deferred to Phase 5.

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| sales-coach-discovery.md | SKILL.md sales coach vector | reference file load | DEFERRED | SKILL.md not yet written (Phase 5) |
| sales-coach-demo.md | SKILL.md sales coach vector | reference file load | DEFERRED | SKILL.md not yet written (Phase 5) |
| sales-coach-proposal.md | SKILL.md sales coach vector | reference file load | DEFERRED | SKILL.md not yet written (Phase 5) |
| content-ideas.md | SKILL.md content ideas vector | reference file load | DEFERRED | SKILL.md not yet written (Phase 5) |
| internal-team.md | SKILL.md internal team vector | reference file load | DEFERRED | SKILL.md not yet written (Phase 5) |

### Data-Flow Trace (Level 4)

Not applicable. These are static markdown reference files with no data source or dynamic rendering.

### Behavioral Spot-Checks

Step 7b: SKIPPED — reference files are static markdown documents with no runnable entry points.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| REF-01 | 01-01-PLAN.md | sales-coach-discovery.md with CLOSER, Gap Framework, Peel the Onion, Listen 2:1, Pain is the Pitch | PARTIAL | File exists with correct structure and content. Named frameworks CLOSER and Pain is the Pitch present in body. Gap Framework, Peel the Onion, Listen 2:1 absent as named terms — replaced by functional heading names |
| REF-02 | 01-02-PLAN.md | sales-coach-demo.md with 4 demo frameworks | SATISFIED | 4 frameworks, all 4 sections each, all framework names present |
| REF-03 | 01-02-PLAN.md | sales-coach-proposal.md with 8 proposal frameworks | SATISFIED | 8 frameworks, all 4 sections each, all framework names present |
| REF-04 | 01-03-PLAN.md | content-ideas.md with extraction guidelines | SATISFIED | Quotable moment + content angle guidelines, format templates, avoidance criteria present |
| REF-05 | 01-03-PLAN.md | internal-team.md with decisions/action items/blockers | SATISFIED | All three sections present, hard no-orphan rule stated, UNASSIGNED flag documented |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| None | — | — | All files are substantive. No placeholder content, no TODO markers, no empty implementations detected |

Checked for: TODO/FIXME, "placeholder", "not yet implemented", empty returns, raw transcript prose contamination. All files are clean.

### Human Verification Required

None. All verification was completable programmatically for this phase (static markdown content, grep-verifiable structure).

### Gaps Summary

One gap blocks full goal achievement:

**sales-coach-discovery.md framework naming (REF-01, ROADMAP SC-1):** The discovery reference file was written with functionally accurate coaching content for all 5 dimensions, but the Hormozi framework names specified in REF-01 and ROADMAP success criterion 1 are absent or incomplete:

- "Gap Framework" → file uses "Qualification" (Gap Framework not mentioned anywhere in the file)
- "Peel the Onion" → file uses "Pain Surfacing" (only "keep peeling" appears in body, not the framework name)
- "Listen 2:1" → file uses "Talk Ratio" (Listen 2:1 not mentioned anywhere in the file)

CLOSER is referenced in the Hormozi original section of "Gap Opening." "Pain is the Pitch" appears in the Hormozi original section of "Pain Surfacing."

The fix is minimal — add the Hormozi framework names to three section headings. The content does not need rewriting. Example: `### Pain Surfacing (Peel the Onion)` or add a brief parenthetical in the Hormozi original line naming the framework explicitly.

This matters because: (1) the ROADMAP success criterion is explicit about framework names, (2) REF-01 requires these names, and (3) when the skill vectors load this reference file they may reference framework names for scoring dimension labels — mismatches would create confusion between the reference file and any downstream code that references Hormozi framework names.

---

_Verified: 2026-05-05T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
