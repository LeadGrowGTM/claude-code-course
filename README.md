# Claude Code for GTM Operators

The companion repo for [the course](https://claude-code-course-kappa.vercel.app). Everything you need to go from zero to a full GTM operation running from one terminal.

## Quick Start

1. Download [Cursor](https://cursor.com) (VS Code with AI built in)
2. Open the integrated terminal (`Ctrl + `` ` on Windows / `Cmd + `` ` on Mac)
3. Install Claude Code:

```bash
# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex

# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Also available via npm, Homebrew, or WinGet
npm i -g @anthropic-ai/claude-code
```

4. Run `claude` and follow the auth flow
5. Clone this repo and copy `starter/` into your workspace
6. Start building

## What's In This Repo

### `/starter` — Your Starting Point

Copy these into your workspace root. Pre-configured CLAUDE.md, rules, settings, folder structure, and company doc templates.

```
starter/
  CLAUDE.md              ← workspace identity + behavioral rules
  .claude/
    settings.json        ← permissions allowlist
    rules/
      archive-safety.md  ← never delete, always archive
      ask-vs-act.md      ← when to ask vs just do
      file-conventions.md← where files go
  company/
    ICP.md               ← ideal customer profile template
    voice-guide.md       ← brand voice definition
  campaigns/             ← active campaign work
  clients/               ← per-client folders
  content/               ← drafts, ideas, templates
  archive/               ← completed work
```

### `/examples` — Real Skills & Configs

Working examples from the course. Drop these into `.claude/skills/` in your workspace.

- **cold-email/** — Generate sequences using your voice guide and ICP
- **prospect-research/** — Research a company and produce a campaign-ready brief
- **.mcp.json** — Starter MCP server config (Context7 pre-configured)

## Essential Tools & Repos

### Claude Code Itself

| Resource | What | Why |
|----------|------|-----|
| [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code) | Official documentation | Start here. Everything else builds on this. |
| [Claude Code GitHub](https://github.com/anthropics/claude-code) | Source + issues | Bug reports, feature requests, community discussion |

### Claude Code Power Tools

| Repo | What | Why |
|------|------|-----|
| [Get Shit Done (GSD)](https://github.com/LeadGrowGTM/get-shit-done-claude) | Meta-prompting, context engineering, spec-driven development system | The project management layer. Plan phases, execute with verification, track progress across sessions. Turns Claude from chatbot to project manager. |
| [Caveman Mode](https://github.com/cabbageamulet/claude-code-caveman) | Ultra-compressed communication skill | Cuts tokens ~75%. Same technical substance, zero filler. Essential for long sessions. |
| [Agent Browser](https://github.com/vercel-labs/agent-browser) | Browser automation CLI for AI agents | Navigate pages, fill forms, take screenshots, scrape data — all from Claude Code. Web QA, research, automation. |
| [Continuous Claude](https://github.com/LeadGrowGTM/internal-continuous-claude) | Context management via hooks and ledgers | Solves the "Claude forgot everything" problem. Handoffs, state persistence, MCP execution without context pollution. |
| [DeepSeek Stack](https://github.com/LeadGrowGTM/claudecode-deepseek-stack) | Run Claude Code on DeepSeek V4 for ~$7/mo | 95x cheaper than Anthropic billing. Two env vars, no third-party tool. |

### GTM Skills (Open Source)

| Repo | What | Why |
|------|------|-----|
| [Poke the Bear Skill](https://github.com/LeadGrowGTM/poke-the-bear-skill) | Josh Braun's cold email methodology as a Claude Code skill | Principle-driven outbound. No templates — generates from pain points. |
| [Reddit Find](https://github.com/LeadGrowGTM/reddit-find) | GTM research from Reddit | Discover communities, extract pain points, buyer language, content angles. Two-pass workflow: scan titles fast, then deep-dive posts. |
| [n8n CLI](https://github.com/LeadGrowGTM/leadgrow-n8n-cli) | The most comprehensive n8n CLI — 85+ commands | 100% API coverage, GitOps, Clay integration, workflow templates, MCP server. Control n8n from Claude Code. |

### MCP Servers for GTM

| Server | What | When to Use |
|--------|------|-------------|
| [Context7](https://github.com/upstash/context7) | Live docs for any framework | Day one install. Claude gets up-to-date docs without hallucinating. |
| [Exa MCP](https://github.com/exa-labs/exa-mcp-server) | AI-native web search | Research prospects, find company info, competitive intel. |
| [Google Drive MCP](https://github.com/nicholasgriffintn/google-drive-mcp) | Read/write Google Sheets & Docs | Lead lists, reports, shared docs with clients. |
| [Slack MCP](https://modelcontextprotocol.io/integrations/slack) | Read/send Slack messages | Client comms, team notifications, alert routing. |
| [GitHub MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/github) | GitHub issues, PRs, repos | Track bugs, manage projects, code review. |
| [Firecrawl MCP](https://github.com/mendableai/firecrawl-mcp-server) | Web scraping + crawling | Prospect research, competitor monitoring, content extraction. |
| [Brave Search MCP](https://github.com/nicholasgriffintn/brave-search-mcp) | Web search via Brave API | Free tier available. Good for prospect research. |

To add an MCP server, edit `.mcp.json` in your project root (see `examples/.mcp.json` for the format).

### Automation Platforms (Where Does It Run?)

| Tool | When to Use | Link |
|------|------------|------|
| **Claude Code** | Needs judgment, touches codebase, one-off tasks | You're here |
| **n8n** | Repeats on schedule, webhook triggers, no judgment needed | [n8n.io](https://n8n.io) |
| **Trigger.dev** | Durable execution, retries, long-running cloud jobs | [trigger.dev](https://trigger.dev) |

Rule: if it needs to think, use an agent. If it needs to repeat, automate. If both, agent skill triggered by automation.

### Data & Enrichment

| Tool | What | Role in Waterfall |
|------|------|-------------------|
| [Clay](https://clay.com) | Data enrichment platform | Tier 2 — paid lookups, 80+ data providers |
| [Apollo](https://apollo.io) | Contact database + enrichment | Tier 1-2 — email finding, company data |
| [Icypeas](https://icypeas.com) | Email finder + verifier | Tier 2 — per-lookup email validation |

### Email Senders

| Tool | What | Why |
|------|------|-----|
| [EmailBison](https://emailbison.com) | Cold email infrastructure | Multi-inbox rotation, warmup, deliverability tracking |
| [Smartlead](https://smartlead.ai) | Cold email at scale | Alternative to Bison. Good UI, auto-rotation. |
| [Instantly](https://instantly.ai) | Cold email + lead database | Combined sending + data. Good for starters. |

### CRMs

| Tool | What | Why |
|------|------|-----|
| [HubSpot](https://hubspot.com) | Full CRM + marketing | Industry standard. Free tier available. |
| [Attio](https://attio.com) | Modern CRM for startups | Clean API, flexible data model, good for operators. |

## Power User Tips

### Plan First
Type `/plan` before any 3+ step task. Claude writes the plan, you approve, then it executes. No surprises.

### Kill Permission Noise
Add allowlists in `.claude/settings.json` for read-only commands. Stop approving `git status` every 30 seconds.

### Commit = Handoff
Context compresses mid-session. You lose memory. Commit often. Git history IS your handoff doc. Don't rely on conversation memory.

### Spawn, Don't Read
Don't read 10 files in main context. Spawn an agent — it reads them, you get a 200-token summary. Protects your context window.

### Caveman Mode
Type `/caveman`. Cuts conversation tokens ~75%. Same technical substance, zero filler.

### Rules Are Modular
Each file in `.claude/rules/` loads separately. Don't cram everything into CLAUDE.md. Split by domain. Load on demand.

## Course Slides

View the full 44-slide deck: **[claude-code-course-kappa.vercel.app](https://claude-code-course-kappa.vercel.app)**

## About LeadGrow

We build GTM systems that book meetings on autopilot. The course teaches our method.

**[leadgrow.ai](https://www.leadgrow.ai)** — Want us to build this for you?
