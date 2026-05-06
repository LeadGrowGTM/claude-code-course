import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

export function saveCall({ transcript_id, company_domain, call_type, call_date }) {
  const db = new Database(dbPath);
  db.run(
    'INSERT INTO calls (transcript_id, company_domain, call_type, call_date, gaps_json, findings_json) VALUES (?, ?, ?, ?, ?, ?)',
    [transcript_id, company_domain, call_type, call_date, null, null],
  );
  db.close();
}

if (import.meta.main) {
  const [transcript_id, company_domain, call_type, call_date] = process.argv.slice(2);
  if (!transcript_id || !company_domain || !call_type || !call_date) {
    console.error('Usage: bun scripts/save-call.js <transcript_id> <domain> <call_type> <call_date>');
    process.exit(1);
  }
  saveCall({ transcript_id, company_domain, call_type, call_date });
  console.log(JSON.stringify({ ok: true, transcript_id }));
}
