import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

const db = new Database(dbPath);

// Migrate calls table to add UNIQUE NOT NULL on transcript_id if missing.
// SQLite doesn't support ALTER TABLE ADD CONSTRAINT, so we recreate the table.
const existingSchema = db.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='calls'").get();
if (existingSchema && !existingSchema.sql.includes('UNIQUE')) {
  db.run('ALTER TABLE calls RENAME TO calls_old');
  db.run(`
    CREATE TABLE calls (
      id INTEGER PRIMARY KEY,
      transcript_id TEXT UNIQUE NOT NULL,
      company_domain TEXT,
      call_type TEXT,
      call_date TEXT,
      gaps_json TEXT,
      findings_json TEXT
    )
  `);
  db.run('INSERT OR IGNORE INTO calls SELECT * FROM calls_old');
  db.run('DROP TABLE calls_old');
  console.log('Migrated calls table: added UNIQUE NOT NULL to transcript_id');
} else if (!existingSchema) {
  db.run(`
    CREATE TABLE calls (
      id INTEGER PRIMARY KEY,
      transcript_id TEXT UNIQUE NOT NULL,
      company_domain TEXT,
      call_type TEXT,
      call_date TEXT,
      gaps_json TEXT,
      findings_json TEXT
    )
  `);
}

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
