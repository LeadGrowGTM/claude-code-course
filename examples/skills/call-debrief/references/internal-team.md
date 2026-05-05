# Internal Team — Extraction Reference

Loaded by the Internal Team vector when `call_type = internal`.
Extract structured meeting intelligence from internal calls, planning sessions, or team syncs.

## Purpose

Turn an internal call into an actionable record: what was decided, who owns what, and what's blocked.
This is a working document — precision over prose.

## Meeting Summary

Write a single paragraph (3–5 sentences) covering:

- What the meeting was about (topic and scope)
- What the main discussion covered
- What the overall outcome or direction was

No bullet points in the summary — prose only. Be specific: name the topic, the context, the outcome.

## Decisions Made

List every decision that was finalized in the call — not discussed, not tabled, not "let's think about it." Only decisions that were committed to.

Format:

- **Decision:** [what was decided, stated as a completed action or firm direction]
- **Owner:** [who is responsible for executing or following through]
- **Context:** [one sentence — why this was decided]

If no decisions were made, write: "No decisions made in this call."

Threshold for inclusion: If someone said "we'll do X" or "let's go with Y" and no one pushed back — it's a decision. If it ended in "we'll think about it" — it's not.

## Action Items

List every specific action item that someone committed to on the call. If it wasn't assigned to a person with at least an implied timeframe — it's not an action item, it's a blocker or a discussion point.

**Hard rule: no orphaned action items.** Every action item must have an owner. Every action item must have a deadline or be explicitly flagged as UNCONFIRMED.

Format:

- **Task:** [specific action, stated as a verb phrase]
- **Owner:** [name or role]
- **Deadline:** [explicit date if stated, or "before next call" / "this week" if implied — never blank]

If an action item has no clear owner, flag it as UNASSIGNED rather than omitting it — unowned action items are high-risk:

- **Task:** [action]
- **Owner:** UNASSIGNED — flag for Mitch
- **Deadline:** UNCONFIRMED — flag for Mitch

## Open Blockers

List anything that was flagged as blocking progress — unresolved dependencies, missing information, external waits, or decisions that couldn't be made.

Format:

- **Blocker:** [what is blocked]
- **Blocking on:** [what needs to happen to unblock it]
- **Owner:** [who needs to act to resolve it, if known]

If no blockers were raised, write: "No blockers identified."
