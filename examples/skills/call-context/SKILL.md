---
name: call-context
description: Extract campaign-ready context from sales call transcripts. Use when user references a call, meeting, transcript, or wants to turn a conversation into actionable briefs for outbound, content, or follow-up.
allowed-tools: Read, Write, Grep, WebSearch
---

## Phase 1: Get the Transcript

1. Ask the user for the transcript source:
   - Pasted text
   - File path to a transcript file
   - If they use Fireflies/Otter/etc, ask them to export and paste or provide the file

2. Read the full transcript

## Phase 2: Extract

Pull structured data from the conversation:

- **Company:** name, size, industry
- **Attendees:** names, titles, roles in the decision
- **Pain points:** in their exact words — what's broken, what's frustrating
- **Current tools:** what they use today, what they've tried
- **Buying triggers:** why now? What changed? What's the timeline?
- **Objections:** concerns raised, hesitations, blockers
- **Next steps:** what was agreed, who owes what
- **Quotable moments:** strong statements that reveal true sentiment

## Phase 3: Output Brief

Write a structured brief that feeds directly into outbound skills:

```
## Call Brief: [Company] — [Date]

### Attendees
- [Name] ([Title]) — [role in decision]

### Pain Points (Their Words)
1. "[exact quote]" — [context]
2. "[exact quote]" — [context]

### Current Stack
- [Tool]: [what they use it for]

### Buying Triggers
- [Why they're looking now]

### Objections
- [Concern]: [how it was addressed or left open]

### Next Steps
- [ ] [Action item] — [owner]

### Campaign Angles
- [2-3 angles for follow-up outbound based on the call]
```

## Quality Gates
- [ ] Pain points use prospect's exact language
- [ ] All attendees identified with titles
- [ ] Next steps are specific (not "follow up")
- [ ] Campaign angles connect to specific pain points raised
