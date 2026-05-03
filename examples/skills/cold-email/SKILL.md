---
name: cold-email-starter
description: Generate cold email sequences using your voice guide and ICP. Use when writing outbound copy, building sequences, or launching campaigns.
allowed-tools: Read, Write, Grep
---

## Phase 1: Load Context
1. Read company/ICP.md
2. Read company/voice-guide.md
3. If client folder exists, read client _master.md

## Phase 2: Generate
1. 2-email sequence (initial + follow-up)
2. Subject lines under 40 characters
3. No links in email body
4. Personalization variables in {FIRST_NAME}, {COMPANY} format

## Phase 3: Quality Gates
- [ ] Subject < 40 chars
- [ ] No generic openers ("I hope this finds you well")
- [ ] Variables render correctly
- [ ] Matches voice guide tone
- [ ] Specific pain point referenced (not generic value prop)
