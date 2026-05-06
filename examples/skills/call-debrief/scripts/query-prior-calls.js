import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

const domain = process.argv[2];
if (!domain) {
  console.error('Usage: bun scripts/query-prior-calls.js <company_domain>');
  process.exit(1);
}

if (!existsSync(dbPath)) {
  console.log('[]');
  process.exit(0);
}

const db = new Database(dbPath, { readonly: true });

const rows = db.query(`
  SELECT DISTINCT
    c.id,
    c.transcript_id,
    c.company_domain,
    c.call_type,
    c.call_date,
    c.gaps_json,
    c.findings_json
  FROM calls c
  JOIN call_links cl ON (cl.call_a_id = c.id OR cl.call_b_id = c.id)
  WHERE EXISTS (
    SELECT 1 FROM calls base
    WHERE base.company_domain = ?
      AND (cl.call_a_id = base.id OR cl.call_b_id = base.id)
  )
  ORDER BY c.call_date DESC
`).all(domain);

console.log(JSON.stringify(rows, null, 2));

db.close();
