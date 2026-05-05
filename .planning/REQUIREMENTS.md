# Requirements: call-debrief Skill

**Defined:** 2026-05-05
**Core Value:** Sales call → scored Hormozi coaching report with company context and linked prior-call history

## v1 Requirements

### Reference Files

- [ ] **REF-01**: `references/sales-coach-discovery.md` exists with CLOSER, Gap Framework, Peel the Onion, Listen 2:1, Pain is the Pitch — each as Hormozi original + B2B equivalent + anti-pattern + coaching prompt
- [ ] **REF-02**: `references/sales-coach-demo.md` exists with Proof-Promise-Plan, Three-Pillar framing, pain anchoring, engagement ratio — same structure
- [ ] **REF-03**: `references/sales-coach-proposal.md` exists with 3 Conviction Qs, AAA objection handling, Rocking Chair, Reason Reversal, 1-10 Scale, Best/Worst, Shut Up When They Say Yes, pricing order — same structure
- [ ] **REF-04**: `references/content-ideas.md` exists with extraction guidelines for quotes and angles
- [ ] **REF-05**: `references/internal-team.md` exists with processing guidelines for decisions, action items with owners, blockers

### Memory Schema

- [ ] **DB-01**: `scripts/init-db.js` creates `memory/calls.db` with schema: `calls(id, transcript_id, company_domain, call_type, call_date, gaps_json, findings_json)` + `call_links(call_a_id, call_b_id, relationship)`
- [ ] **DB-02**: `scripts/query-prior-calls.js` accepts company_domain and returns linked calls + their gaps

### Transcript Fetch

- [ ] **FETCH-01**: `scripts/fetch-transcript.js` wraps `pull_transcript.py`, parses temporal/people args from natural language, returns up to 8 matching transcripts for selection (Checkpoint 1)
- [ ] **FETCH-02**: After selection, displays title + date + participants + AI summary for confirmation (Checkpoint 2: y/n)

### Classification + Company Context

- [ ] **CLASS-01**: LLM classifies transcript as internal / sales / general; uncertain cases surface for user confirmation (Checkpoint 3)
- [ ] **CLASS-02**: For sales calls: extracts company from email domain, presents for confirmation (Checkpoint 4), runs web search for company overview as coaching lens
- [ ] **CLASS-03**: Queries `calls.db` for prior calls with same company_domain; surfaces linked gaps before generating report

### Processing Vectors

- [ ] **VEC-01**: Content Ideas vector always runs — generates 3-5 quotable moments + 3-5 content angles from any call type
- [ ] **VEC-02**: Internal Team vector runs when call type = internal — generates decisions, action items with owners, open blockers
- [ ] **VEC-03**: Sales Coach vector runs when call type = sales — loads appropriate reference file (discovery/demo/proposal), injects company context + prior gaps, generates scored report (each dimension X/10 + overall)

### Skill Authoring

- [ ] **SKILL-01**: `SKILL.md` under 100 lines, third-person description ≤1024 chars with explicit triggers, sections: Quick start → Workflow → reference file index; report saved to `outputs/YYYY-MM-DD-[company].md` with terminal path display

## v2 Requirements

### Enhancements

- **ENH-01**: Batch processing — run debrief on multiple calls from same company in one command
- **ENH-02**: Trend report — compare scores across multiple sessions with same prospect
- **ENH-03**: Slack/Telegram push of report summary after generation

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time / live call coaching | Batch post-call only; live requires different infra |
| Feed the killers framework | Assumes setter-closer team; Mitch is solo |
| Scheduling optimization framework | Volume-based ops tactic, not call coaching |
| Decision Maker / spouse close | Consumer tactic; B2B has institutional authority |
| Cheap Competitor close | Anchors to price; LeadGrow sells trust not commodity |
| Multi-level reference nesting | One level deep only per Pocock conventions |
| Web UI / dashboard | Terminal output only for course demo |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REF-01 | Phase 0 | Pending |
| REF-02 | Phase 0 | Pending |
| REF-03 | Phase 0 | Pending |
| REF-04 | Phase 0 | Pending |
| REF-05 | Phase 0 | Pending |
| DB-01 | Phase 1 | Pending |
| DB-02 | Phase 1 | Pending |
| FETCH-01 | Phase 2 | Pending |
| FETCH-02 | Phase 2 | Pending |
| CLASS-01 | Phase 3 | Pending |
| CLASS-02 | Phase 3 | Pending |
| CLASS-03 | Phase 3 | Pending |
| VEC-01 | Phase 4 | Pending |
| VEC-02 | Phase 4 | Pending |
| VEC-03 | Phase 4 | Pending |
| SKILL-01 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-05*
*Last updated: 2026-05-05 after initialization*
