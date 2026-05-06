import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

export function saveCall({ transcript_id, company_domain, call_type, call_date }) {
  const db = new Database(dbPath);
  try {
    db.run(
      'INSERT OR REPLACE INTO calls (transcript_id, company_domain, call_type, call_date, gaps_json, findings_json) VALUES (?, ?, ?, ?, ?, ?)',
      [transcript_id, company_domain, call_type, call_date, null, null],
    );
  } finally {
    db.close();
  }
}

export function updateCallGaps({ transcript_id, gaps_json }) {
  const db = new Database(dbPath);
  try {
    const result = db.run('UPDATE calls SET gaps_json = ? WHERE transcript_id = ?', [gaps_json, transcript_id]);
    if (result.changes === 0) {
      throw new Error(`No row found for transcript_id: ${transcript_id}`);
    }
  } finally {
    db.close();
  }
}

if (import.meta.main) {
  if (process.argv[2] === '--update-gaps') {
    const transcript_id = process.argv[3];
    const gaps_json = process.argv[4];
    if (!transcript_id || !gaps_json) {
      console.error('Usage: bun scripts/save-call.js --update-gaps <transcript_id> <gaps_json>');
      process.exit(1);
    }
    let parsed;
    try {
      parsed = JSON.parse(gaps_json);
      if (!Array.isArray(parsed)) throw new Error('gaps_json must be an array');
    } catch (e) {
      console.error('Invalid gaps_json:', e.message);
      process.exit(1);
    }
    try {
      updateCallGaps({ transcript_id, gaps_json });
      console.log(JSON.stringify({ ok: true, transcript_id }));
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  } else {
    const [transcript_id, company_domain, call_type, call_date] = process.argv.slice(2);
    if (!transcript_id || !company_domain || !call_type || !call_date) {
      console.error('Usage: bun scripts/save-call.js <transcript_id> <domain> <call_type> <call_date>');
      process.exit(1);
    }
    saveCall({ transcript_id, company_domain, call_type, call_date });
    console.log(JSON.stringify({ ok: true, transcript_id }));
  }
}
