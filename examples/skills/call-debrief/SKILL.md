---
name: call-debrief
description: Processes sales call transcripts from Fireflies into scored coaching reports. Given a natural language query ("yesterday's call with Acme"), fetches the transcript, classifies call type (discovery/demo/proposal), extracts company context, and runs three vectors: Content Ideas (always), Internal Team (internal calls), Sales Coach (sales calls). Sales Coach scores Hormozi frameworks per dimension with company context injected. Use when the user says "call debrief", "debrief my call", "score my call", "coaching report", "Fireflies transcript", "score yesterday's call", or invokes /call-debrief with any temporal or company signal.
---

# call-debrief

Fetches a Fireflies transcript by natural language query, classifies it, and produces a saved coaching report — invoke from the skill's working directory.

Working directory: `course/claude-code-course/examples/skills/call-debrief/`

## Quick Start

```
/call-debrief <natural language query>
/call-debrief yesterday's call with Acme
```

Claude presents a numbered transcript list → you pick one → confirm title/date/participants → coaching report saved to `outputs/YYYY-MM-DD-[company].md`.

## Workflow

### Phase 1 — Transcript Selection

Run `bun scripts/fetch-transcript.js <user_query>`. Present numbered results. Ask user to select.
Detail: `references/workflow-detail.md` §Phase 1

### Phase 2 — Confirm Selection

Show selected title, date, participants. Ask "Is this the right call? (y to confirm)". If no, refine query.
Detail: `references/workflow-detail.md` §Phase 2

### Phase 3 — Summary Fetch

Fetch AI summary and action items via fetch-transcript.js `summary` submode. Store for classification.
Detail: `references/workflow-detail.md` §Phase 3

### Phase 4 — Classification + Company Context

Classify from summary (CP3 fires if low confidence). Sales path: sub-classify by stage + extract company + CP4 confirm + silent Reddit research + prior calls lookup + write to calls.db.
Detail: `references/workflow-detail.md` §Phase 4

### Phase 5 — Processing Vectors

Run three vectors in order: Content Ideas (always), Internal Team (type=internal), Sales Coach (type=sales). Sales Coach selects rubric by sub_type, prepends prior-call gaps on proposal path, persists gaps to calls.db.
Detail: `references/workflow-detail.md` §Phase 5

### Phase 6 — Report Assembly

Assemble the final report from `phaseOutputs` (set in Phase 5 Step 8) and save to `outputs/`.

```javascript
const { resolve } = await import('path');
const date = (callContext.date || new Date().toISOString()).slice(0, 10);
const company = (callContext.company_name || callContext.domain || 'unknown')
  .replace(/[^a-z0-9]/gi, '-')
  .toLowerCase();
const outPath = resolve('./outputs', `${date}-${company}.md`);

const reportBody = [
  `# Call Debrief — ${callContext.title}`,
  `**Date:** ${date} | **Company:** ${callContext.company_name || callContext.domain || 'Unknown'} | **Type:** ${callContext.type}/${callContext.sub_type || '—'}`,
  '',
  phaseOutputs.contentIdeasOutput,
  phaseOutputs.internalTeamOutput,
  phaseOutputs.salesCoachOutput,
].filter(Boolean).join('\n\n');

await Bun.write(outPath, reportBody);
console.log(`\nReport saved: ${outPath}`);
if (phaseOutputs.salesCoachOutput) {
  const score = phaseOutputs.salesCoachOutput.match(/\*\*Overall:.*\*\*/)?.[0];
  if (score) console.log(`Sales Coach ${score}`);
}
```

## Reference File Index

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| references/workflow-detail.md       | Full LLM prompts, Bun.spawn patterns, all steps  |
| references/sales-coach-discovery.md | Discovery scoring rubric (5 dimensions)          |
| references/sales-coach-demo.md      | Demo scoring rubric (4 dimensions)               |
| references/sales-coach-proposal.md  | Proposal scoring rubric (5 dimensions)           |
| references/content-ideas.md         | Content Ideas extraction guidelines              |
| references/internal-team.md         | Internal Team extraction guidelines              |
