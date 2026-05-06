import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pyScript = resolve(__dirname, '../../../../../../leadgrow-hq/tools/fireflies/pull_transcript.py');

const PYTHON = 'python';

export function parseTemporalSignal(arg) {
  const s = arg.toLowerCase();
  if (/yesterday/.test(s)) return 1;
  if (/last\s+week/.test(s)) return 7;
  if (/last\s+month/.test(s)) return 30;
  if (/last\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/.test(s)) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const target = days.findIndex((d) => s.includes(d));
    const today = new Date().getDay();
    const diff = (today - target + 7) % 7 || 7;
    return diff;
  }
  return null;
}

export function parsePeopleSignal(arg) {
  return (
    arg
      .replace(/\b(meeting|call|demo|with|the|a|an|last|this|about|yesterday)\b/gi, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)[0] || null
  );
}

async function spawnPy(args) {
  const proc = Bun.spawn([PYTHON, pyScript, ...args], { stderr: 'inherit' });
  const raw = await proc.stdout.text();
  await proc.exited;
  if (proc.exitCode !== 0) {
    console.error(`pull_transcript.py exited with code ${proc.exitCode}`);
    process.exit(1);
  }
  try {
    return JSON.parse(raw);
  } catch {
    console.error('Failed to parse JSON from pull_transcript.py:', raw.slice(0, 200));
    process.exit(1);
  }
}

function normalizeDate(t) {
  if (t.formatted_date) return t.formatted_date;
  return new Date(parseInt(t.date)).toISOString().slice(0, 10);
}

function getParticipants(t) {
  return (t.participants || []).map((p) => p.displayName || p.name || String(p)).join(', ');
}

// Only run main when executed directly, not when imported by tests
if (import.meta.main) {
  const mode = process.argv[2];

  if (!mode) {
    console.error('Usage: bun scripts/fetch-transcript.js <query>');
    console.error('       bun scripts/fetch-transcript.js summary <id>');
    process.exit(1);
  }

  if (mode === 'summary') {
    // Summary mode — Checkpoint 2 feed
    const id = process.argv[3];
    if (!id) {
      console.error('Usage: bun scripts/fetch-transcript.js summary <transcript_id>');
      process.exit(1);
    }
    // Validate ID is alphanumeric/dash/underscore (Fireflies UUIDs) — no path traversal
    if (!/^[a-zA-Z0-9_\-]+$/.test(id)) {
      console.error('Invalid transcript ID format.');
      process.exit(1);
    }
    const data = await spawnPy(['summary', id, '--json']);
    // summary command returns {id, title, summary:{overview,...}} — no date/participants
    // SKILL.md preserves list metadata (title/date/participants) from Checkpoint 1
    console.log(
      JSON.stringify(
        {
          id: data.id,
          title: data.title,
          overview: data.summary?.overview || '',
          action_items: data.summary?.action_items || [],
        },
        null,
        2,
      ),
    );
  } else if (mode === 'full') {
    // Full transcript mode — plain text for Tier 2 classification
    const id = process.argv[3];
    if (!id) {
      console.error('Usage: bun scripts/fetch-transcript.js full <transcript_id>');
      process.exit(1);
    }
    // Validate ID — same pattern as summary mode (no path traversal)
    if (!/^[a-zA-Z0-9_\-]+$/.test(id)) {
      console.error('Invalid transcript ID format.');
      process.exit(1);
    }
    // pull_transcript.py get <id> returns formatted plain text — no --json flag
    const proc = Bun.spawn([PYTHON, pyScript, 'get', id], { stderr: 'inherit' });
    const text = await proc.stdout.text();
    await proc.exited;
    if (proc.exitCode !== 0) {
      console.error('pull_transcript.py exited with error');
      process.exit(1);
    }
    console.log(text);
  } else {
    // List mode — Checkpoint 1 feed
    const query = process.argv.slice(2).join(' ');
    const days = parseTemporalSignal(query);
    const keyword = days === null ? parsePeopleSignal(query) : null;

    let transcripts = [];

    if (days !== null) {
      transcripts = await spawnPy(['list', '--days', String(days), '--json']);
    } else if (keyword) {
      transcripts = await spawnPy(['search', keyword, '--json']);
    } else {
      // Fallback: list last 7 days
      transcripts = await spawnPy(['list', '--days', '7', '--json']);
    }

    if (!Array.isArray(transcripts) || transcripts.length === 0) {
      console.error('No transcripts found for that query.');
      process.exit(1);
    }

    // Sort by date descending, cap at 8
    const sorted = transcripts.sort((a, b) => parseInt(b.date) - parseInt(a.date)).slice(0, 8);

    sorted.forEach((t, i) => {
      const date = normalizeDate(t);
      const participants = getParticipants(t);
      console.log(`${i + 1}. ${t.title} (${date}) | ${participants}`);
    });
  }
}
