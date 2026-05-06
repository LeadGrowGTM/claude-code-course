---
name: call-debrief
description: Sales call coaching skill. Given a natural language query (e.g. "yesterday's call with Acme"), fetches the transcript from Fireflies, classifies call type, extracts company context, and produces a scored Hormozi-style coaching report.
---

# call-debrief SKILL

Working directory for all `bun` commands: `examples/skills/call-debrief/`

---

## Phase 1: Transcript Selection (Checkpoint 1)

Run `bun scripts/fetch-transcript.js <user_query>` to list matching transcripts.
Present the numbered list to the user. Ask them to select one.
Store: `transcript_id`, `title`, `date`, `participants` (display names), `organizer_email`.

## Phase 2: Confirm Selection (Checkpoint 2)

Show the user the selected title, date, and participant list.
Ask: "Is this the right call? (y to confirm)"
If no: return to Phase 1 with a refined query.
Store confirmed: `transcript_id`, `title`, `date`, `participants`, `organizer_email`.

## Phase 3: Summary Fetch

Run:
```javascript
const proc = Bun.spawn(['bun', 'scripts/fetch-transcript.js', 'summary', transcript_id], { stderr: 'inherit' });
const summary = JSON.parse(await proc.stdout.text());
await proc.exited;
// summary: { id, title, overview, action_items }
```

Store `summary.overview` and `summary.action_items` for Phase 4 Tier 1 classification.

---

## Phase 4: Classification + Company Context

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

---

## Phase 5: Processing Vectors

_(Planned — not yet implemented)_

Route based on `callContext.type`:
- `"sales"` → Sales Coach vector (reads `sub_type`, `web_overview`, `reddit_threads`, `prior_calls`)
- `"internal"` → Internal Team vector
- All types → Content Ideas vector always runs

---

## Phase 6: Report Assembly

_(Planned — not yet implemented)_

Assemble coaching report from vector outputs. Present to user.
