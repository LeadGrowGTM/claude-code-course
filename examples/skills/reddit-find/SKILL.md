---
name: reddit-find
description: Research a topic, market, or ICP on Reddit. Find pain points, buyer language, competitor sentiment, and content angles. Use when researching a market, validating messaging, finding prospect pain, or mining voice-of-customer data.
allowed-tools: Read, Write, WebSearch, WebFetch, Bash
---

## Phase 1: Define Search

1. Clarify the research goal with the user:
   - What market/ICP are we researching?
   - What specific questions do we want answered?
   - Any known subreddits to prioritize?

2. Build search queries:
   - Primary pain-point queries (e.g., "frustrated with [tool]", "looking for alternative to")
   - Competitor-mention queries (e.g., "[competitor] review", "[competitor] vs")
   - Buying-signal queries (e.g., "recommend a [category]", "just switched from")

## Phase 2: Scan

1. Search Reddit via web search for each query
2. Scan post titles for signal density — skip low-quality threads
3. For high-signal posts, read the full thread
4. Extract:
   - Direct quotes (prospect's exact words)
   - Pain points (what hurts, what's broken)
   - Current tools mentioned (what they use now)
   - Buying triggers (what made them look for a solution)
   - Objections (what held them back)

## Phase 3: Output Brief

Write a structured research brief:

```
## Reddit Research: [Topic]

### Top Pain Points
1. [Pain] — "[exact quote]" (r/subreddit, upvotes)
2. ...

### Buyer Language
- Words they use: [list]
- Words they avoid: [list]

### Competitor Mentions
- [Competitor]: [sentiment summary]

### Buying Triggers
- [What makes them look for a solution]

### Content Angles
- [3-5 angles for outbound or content based on findings]
```

## Quality Gates
- [ ] Minimum 5 direct quotes from real posts
- [ ] Pain points use prospect's language, not marketing speak
- [ ] Each finding links back to a specific subreddit/post
- [ ] Content angles are specific and actionable, not generic
