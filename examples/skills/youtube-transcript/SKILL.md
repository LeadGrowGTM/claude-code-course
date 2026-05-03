---
name: youtube-transcript
description: Fetch and analyze YouTube video transcripts. Extract key points, quotes, frameworks, and content angles. Use when the user shares a YouTube URL, asks to summarize a video, or wants to extract ideas from video content.
allowed-tools: Read, Write, WebFetch
---

## Phase 1: Fetch Transcript

1. Extract the video ID from the URL
2. Fetch the transcript using available transcript tools
3. If transcript unavailable, inform the user and suggest alternatives

## Phase 2: Analyze

Based on what the user needs, extract:

**For content repurposing:**
- Key frameworks or mental models presented
- Quotable one-liners
- Contrarian or surprising takes
- Statistics or data points cited

**For research:**
- Main thesis and supporting arguments
- Expert opinions or credentials cited
- Tools, products, or services mentioned
- Actionable advice given

**For competitive intel:**
- Claims about their product/service
- Positioning language used
- Customer stories or case studies referenced

## Phase 3: Output

Write a structured brief in the format the user needs:
- Summary (3-5 bullet points)
- Key quotes (with timestamps if available)
- Extracted frameworks/models
- Content angles (if repurposing)

## Quality Gates
- [ ] Transcript was actually fetched (not hallucinated)
- [ ] Timestamps referenced where available
- [ ] Quotes are exact, not paraphrased
- [ ] Output format matches what user asked for
