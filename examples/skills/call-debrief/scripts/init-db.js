import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

const db = new Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY,
    transcript_id TEXT,
    company_domain TEXT,
    call_type TEXT,
    call_date TEXT,
    gaps_json TEXT,
    findings_json TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS call_links (
    call_a_id INTEGER,
    call_b_id INTEGER,
    relationship TEXT
  )
`);

console.log(`DB initialized: ${dbPath}`);
console.log('Tables: calls, call_links');

db.close();
