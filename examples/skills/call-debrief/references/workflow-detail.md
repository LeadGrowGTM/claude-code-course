# Workflow Detail — call-debrief

Implementation detail for each phase of the call-debrief workflow. SKILL.md links here for prompt text, Bun.spawn invocation patterns, and step-by-step orchestration. Read only the section(s) for the phase you are executing.

## Phase 1 — Transcript Selection

Run `bun scripts/fetch-transcript.js <user_query>` to list matching transcripts.
Present the numbered list to the user. Ask them to select one.
Store: `transcript_id`, `title`, `date`, `participants` (display names), `organizer_email`.

## Phase 2 — Confirm Selection

Show the user the selected title, date, and participant list.
Ask: "Is this the right call? (y to confirm)"
If no: return to Phase 1 with a refined query.
Store confirmed: `transcript_id`, `title`, `date`, `participants`, `organizer_email`.

## Phase 3 — Summary Fetch

Run:
```javascript
const proc = Bun.spawn(['bun', 'scripts/fetch-transcript.js', 'summary', transcript_id], { stderr: 'inherit' });
const summary = JSON.parse(await proc.stdout.text());
await proc.exited;
// summary: { id, title, overview, action_items }
```

Store `summary.overview` and `summary.action_items` for Phase 4 Tier 1 classification.

## Phase 4 — Classification + Company Context

### Step 1 — Tier 1 Classification

Read `summary.title` and `summary.overview` from Phase 3. Classify using this prompt:

```
You are classifying a business call from a transcript summary.

Title: {title}
Summary: {overview}

Classify this call. Respond with valid JSON only — no explanation.

Schema:
{ "type": "internal" | "sales" | "general", "sub_type": "discovery" | "demo" | "proposal" | null, "confidence": "high" | "low" }

Rules:
- "internal": team meeting, standup, internal planning, all participants @leadgrow.ai
- "sales": prospect is present; call involves pipeline, pitch, evaluation, or follow-up
- "general": advisory, partnership, vendor, or other external call not fitting sales
- sub_type: set only when type="sales"; null for all other types
- confidence: set "low" if you are unsure about type OR sub_type based on the summary alone
```

Parse JSON response as `classification = { type, sub_type, confidence }`.
Wrap in try/catch — if JSON.parse fails, set `classification = { type: null, sub_type: null, confidence: "low" }`.

### Step 2 — Checkpoint 3 Gate

If `classification.confidence === "low"`:
  Present CP3: "Detected type: {type} / sub_type: {sub_type}. Is this correct? Confirm or correct."
  User response updates `classification.type` and `classification.sub_type`.
If `classification.confidence === "high"`: skip CP3.

### Step 3 — Tier 2 Sub-Classification (sales path only)

If `classification.type === "sales"`, fetch the full transcript:

```javascript
const proc = Bun.spawn(['bun', 'scripts/fetch-transcript.js', 'full', transcript_id], { stderr: 'inherit' });
const transcriptText = await proc.stdout.text();
await proc.exited;
```

Then classify using Tier 2 prompt:

```
You are refining the sub-type classification for a confirmed sales call.

Full transcript:
{transcriptText}

The call has already been classified as type="sales". Determine the sales stage.
Respond with valid JSON only.

Schema:
{ "type": "sales", "sub_type": "discovery" | "demo" | "proposal", "confidence": "high" | "low" }

Rules:
- "discovery": first/early call; learning about prospect pain, situation, goals
- "demo": product walkthrough; showing capabilities, features, or proof of concept
- "proposal": pricing discussion, contract review, negotiation, or close attempt
- confidence: set "low" if the call mixes stages or the stage is genuinely ambiguous
```

Overwrite `classification.sub_type` with Tier 2 result.
If Tier 2 confidence is also "low": run CP3 again with the updated sub_type.

### Step 4 — Company Extraction

Pass `participants` (string array of display names) and `organizer_email` to extract-company.js:

```javascript
const proc = Bun.spawn(
  ['bun', 'scripts/extract-company.js', JSON.stringify({ participants, organizer_email })],
  { stderr: 'inherit' }
);
const raw = await proc.stdout.text();
await proc.exited;
const company = JSON.parse(raw); // { domain, company_name } | null
```

If `company === null`: skip CP4, web search, and Reddit entirely.
Set `domain = null`, `web_overview = null`, `reddit_threads = null`, `prior_calls = []`.
Jump to Step 9.

### Step 5 — Checkpoint 4

Run WebSearch: `"{company.domain} company overview B2B"`
Extract a 1-2 sentence overview from the top results into `web_overview`.

Present CP4:
```
Detected company: {company.domain}
Overview: {web_overview}

Is this correct? (y to confirm, or type the correct domain)
```

If user types a correction: set `confirmedDomain` to the corrected value, re-run WebSearch with the new domain, update `web_overview`.
If user confirms: set `confirmedDomain = company.domain`.

### Step 6 — Silent Reddit Research

After CP4 confirmation — do NOT display these results to the user.

Infer the industry category from `web_overview` (e.g. "SaaS", "fintech", "agency"). Use the most specific label visible.

```javascript
const proc1 = Bun.spawn(
  ['reddit-find', 'search', company.company_name, '--limit', '10', '--titles-only'],
  { stderr: 'inherit' }
);
const redditCompany = await proc1.stdout.text();
await proc1.exited;

const proc2 = Bun.spawn(
  ['reddit-find', 'search', `${inferredIndustry} pain points`, '--limit', '10', '--titles-only'],
  { stderr: 'inherit' }
);
const redditIndustry = await proc2.stdout.text();
await proc2.exited;
```

If reddit-find exits non-zero or returns empty: store empty string (do not abort).
Fallback if reddit-find not found: `['python', '-m', 'reddit_find', 'search', ...]`.

Store as `reddit_threads = { company: redditCompany, industry: redditIndustry }`. Do NOT show to user.

### Step 7 — Prior Calls Lookup

```javascript
const proc = Bun.spawn(
  ['bun', 'scripts/query-prior-calls.js', confirmedDomain],
  { stderr: 'inherit' }
);
const priorCalls = JSON.parse(await proc.stdout.text() || '[]');
await proc.exited;
```

If `priorCalls` is non-empty: note the call chain in context (e.g. "2 prior calls: discovery (2026-03-01), demo (2026-04-15)").

### Step 8 — Write to calls.db

```javascript
const proc = Bun.spawn(
  ['bun', 'scripts/save-call.js', transcript_id, confirmedDomain, classification.type, date],
  { stderr: 'inherit' }
);
await proc.exited;
// If non-zero: log warning and continue — don't abort Phase 4 for a DB write failure
```

### Step 9 — Assemble callContext

```javascript
const callContext = {
  transcript_id, title, date, participants, organizer_email,
  type: classification.type,
  sub_type: classification.sub_type,
  domain: confirmedDomain || null,
  company_name: company?.company_name || null,
  web_overview: web_overview || null,
  reddit_threads: reddit_threads || null,
  prior_calls: priorCalls || [],
};
```

Announce: "Classification complete: {type}/{sub_type}, company: {domain}. Ready for Phase 5."

## Phase 5 — Processing Vectors

### Step 1 — Re-fetch Full Transcript

```javascript
const proc = Bun.spawn(['bun', 'scripts/fetch-transcript.js', 'full', callContext.transcript_id], {
  stderr: 'inherit',
});
const transcriptText = await proc.stdout.text();
await proc.exited;
// transcriptText: plain text, full call transcript
```

### Step 2 — Content Ideas Vector (always runs)

Read the content-ideas extraction guidelines from `references/content-ideas.md`. Then call the LLM inline:

```
You are extracting content value from a business call transcript for Mitchell Keller, founder of LeadGrow.

Transcript:
{transcriptText}

Extract content that meets the criteria in the guidelines below.

Guidelines:
{content-ideas.md full text}

Respond with valid JSON only.

Schema:
{
  "quotes": [
    { "quote": "exact verbatim text", "speaker": "name or role", "context": "one sentence", "content_potential": "why usable" }
  ],
  "angles": [
    { "hook": "first line of post", "format": "hot-take|process-reveal|client-success|quick-tip|live-dispatch", "core_idea": "2-3 sentences", "source_moment": "which part of call" }
  ],
  "note": "optional — include when fewer than 3 quotes meet criteria; describe the shortage"
}

Rules:
- quotes: 3-5 entries; verbatim only, no paraphrasing; must stand alone without call context
- angles: 3-5 entries; no confidential prospect details; no generic outbound advice anyone could write
- If transcript has fewer than 3 quotable moments meeting all criteria, include the best available and set the `note` field explaining the shortage
```

Parse JSON response as `contentIdeasRaw = { quotes, angles }`.
Wrap in try/catch — if JSON.parse fails, set `contentIdeasRaw = { quotes: [], angles: [] }`.

Render `contentIdeasOutput` as markdown:

```
## Content Ideas

### Quotable Moments
[for each quote: **Quote:** "..." / **Speaker:** ... / **Context:** ... / **Content potential:** ...]

### Content Angles
[for each angle: **Hook:** ... / **Format:** ... / **Core idea:** ... / **Source moment:** ...]
```

### Step 3 — Internal Team Vector (runs when `callContext.type === "internal"`)

If `callContext.type !== "internal"`: set `internalTeamOutput = null` and skip to Step 4.

Read the internal-team extraction guidelines from `references/internal-team.md`. Then call the LLM inline:

```
You are extracting structured meeting intelligence from an internal business call.

Transcript:
{transcriptText}

Participants: {callContext.participants.join(', ')}
Date: {callContext.date}

Extract meeting intelligence following these guidelines:
{internal-team.md full text}

Respond with valid JSON only.

Schema:
{
  "summary": "3-5 sentence prose paragraph",
  "decisions": [
    { "decision": "what was decided", "owner": "who is responsible", "context": "why decided" }
  ],
  "action_items": [
    { "task": "verb phrase", "owner": "name or role or UNASSIGNED", "deadline": "explicit date or implied timeframe or UNCONFIRMED" }
  ],
  "blockers": [
    { "blocker": "what is blocked", "blocking_on": "what needs to happen", "owner": "who resolves or unknown" }
  ]
}

Rules:
- decisions: only finalized commitments, not discussions; if none, return empty array
- action_items: every item must have owner; use UNASSIGNED if unclear; deadline must never be blank — use UNCONFIRMED if unknown
- blockers: unresolved dependencies, missing info, external waits; if none, return empty array
```

Parse JSON response as `internalTeamRaw = { summary, decisions, action_items, blockers }`.
Wrap in try/catch — if JSON.parse fails, set `internalTeamRaw = { summary: "", decisions: [], action_items: [], blockers: [] }`.

Render `internalTeamOutput` as markdown:

```
## Internal Team Report

{summary paragraph}

### Decisions Made
[for each decision: **Decision:** ... / **Owner:** ... / **Context:** ...]
[if empty: "No decisions made in this call."]

### Action Items
[for each item: **Task:** ... / **Owner:** ... / **Deadline:** ...]

### Open Blockers
[for each blocker: **Blocker:** ... / **Blocking on:** ... / **Owner:** ...]
[if empty: "No blockers identified."]
```

### Step 4 — Sales Coach Vector (runs when `callContext.type === "sales"`)

If `callContext.type !== "sales"`: set `salesCoachOutput = null` and skip to Step 8.

Select reference file by `callContext.sub_type`:

- `"discovery"` → read `references/sales-coach-discovery.md` (5 dimensions: Gap Opening, Pain Surfacing, Outcome Connection, Qualification, Talk Ratio)
- `"demo"` → read `references/sales-coach-demo.md` (4 dimensions: Proof-Promise-Plan Opener, Pain Anchoring, Three-Pillar Framing, Engagement)
- `"proposal"` → read `references/sales-coach-proposal.md` (5 dimensions: 3 Conviction Questions, AAA Objection Handling, Rocking Chair Close, Reason Reversal, Price Framing and Order)

Store reference file contents as `coachRef`. The executor (Claude) reads this file from session context — it is loaded via the `@` reference in this plan's `<context>` block, not via `Bun.file()` at runtime. `coachRef` is a string held in the current session that Claude inlines into the LLM prompt in Step 6.

Before proceeding to Step 6, confirm `coachRef` is a non-empty string. If it is empty or undefined, halt Phase 5 with: "Coaching reference file for sub_type={sub_type} was not loaded. Reload the skill with the correct @reference." Set `salesCoachOutput = null` and skip to Step 8.

### Step 5 — Sales Coach: Carried Forward Section (proposal path only)

If `callContext.sub_type === "proposal"` and `callContext.prior_calls` contains entries with non-null `gaps_json`:

Collect gaps from prior calls:

```javascript
const priorGaps = callContext.prior_calls
  .filter((c) => c.gaps_json)
  .flatMap((c) => {
    try {
      return [{ call_type: c.call_type, call_date: c.call_date, gaps: JSON.parse(c.gaps_json) }];
    } catch {
      return [];
    }
  });
```

Prepend this section to the Sales Coach output (before dimension scores):

```
### Carried Forward from Prior Calls
[for each prior call with gaps: list the gaps under a subheading showing call_type + call_date]
These gaps were identified in prior calls and are provided as context — not re-scored here.
```

If no prior calls have gaps_json: omit this section entirely.

### Step 6 — Sales Coach: Score Each Dimension

Call the LLM inline with the selected reference file, full transcript, and company context:

```
You are a sales coach scoring a {callContext.sub_type} call for Mitchell Keller (LeadGrow).

Company: {callContext.company_name || callContext.domain || "unknown"}
Company overview: {callContext.web_overview || "not available"}
Reddit signals: {callContext.reddit_threads ? JSON.stringify(callContext.reddit_threads) : "not available"}

Full transcript:
{transcriptText}

Score each dimension using the coaching frameworks below. For each dimension, provide specific observations from the transcript, then a score.

Frameworks:
{coachRef — full text of the selected reference file}

Respond with valid JSON only.

Schema:
{
  "dimensions": [
    {
      "name": "dimension name exactly as in frameworks",
      "observations": "2-4 sentences citing specific transcript moments",
      "score": 7
    }
  ],
  "gaps": ["gap 1 as a short phrase", "gap 2", "gap 3"]
}

Rules:
- score: integer 1-10 per dimension based on coaching prompt criteria in the frameworks
- observations: cite specific things said (not generic commentary); reference company context where relevant
- gaps: 2-5 short phrases naming the coaching gaps — what the rep missed or did poorly; used for future proposal cross-reference
- Use exactly the dimension names from the frameworks — do not rename or merge dimensions
```

Parse JSON response as `coachRaw = { dimensions, gaps }`.
Wrap in try/catch — if JSON.parse fails, set `coachRaw = { dimensions: [], gaps: [] }`.

Calculate overall score:

```javascript
const overall =
  coachRaw.dimensions.length > 0
    ? (coachRaw.dimensions.reduce((sum, d) => sum + d.score, 0) / coachRaw.dimensions.length).toFixed(1)
    : 'N/A';
```

Render `salesCoachOutput` as markdown (per D-05: overall score at top, each dimension scored inline after coaching notes):

```
## Sales Coach — {sub_type} Call
**Overall: {overall}/10**

[if carried forward section exists from Step 5: insert here]

### {dimension.name}
{dimension.observations}
**Score: {dimension.score}/10**

[repeat for each dimension]
```

### Step 7 — Persist Gaps to calls.db (sales path only)

```javascript
const safeGaps = Array.isArray(coachRaw.gaps) ? coachRaw.gaps.filter((g) => typeof g === 'string') : [];
const gaps_json = JSON.stringify(safeGaps);
const proc = Bun.spawn(['bun', 'scripts/save-call.js', '--update-gaps', callContext.transcript_id, gaps_json], {
  stderr: 'inherit',
});
await proc.exited;
// If non-zero: log warning and continue — don't abort Phase 5 for a DB write failure
```

### Step 8 — Store Outputs in Session Context

```javascript
const phaseOutputs = {
  contentIdeasOutput, // markdown string, always present
  internalTeamOutput, // markdown string | null
  salesCoachOutput, // markdown string | null
};
```

Phase 5 produces only these markdown strings. No file writes. Phase 6 assembles and saves the report.

### Step 9 — Announce Completion

Announce: "Processing complete. Ready for Phase 6."
