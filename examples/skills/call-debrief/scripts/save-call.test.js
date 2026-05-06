import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { Database } from 'bun:sqlite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../memory/calls.db');

// Seed a call row before each test, clean up after
function seedCall(transcript_id) {
  const db = new Database(dbPath);
  db.run(
    'INSERT OR REPLACE INTO calls (transcript_id, company_domain, call_type, call_date, gaps_json, findings_json) VALUES (?, ?, ?, ?, ?, ?)',
    [transcript_id, 'test.com', 'discovery', '2026-01-01', null, null],
  );
  db.close();
}

function deleteCall(transcript_id) {
  const db = new Database(dbPath);
  db.run('DELETE FROM calls WHERE transcript_id = ?', [transcript_id]);
  db.close();
}

describe('updateCallGaps', () => {
  const TEST_ID = 'test-gaps-001';
  const GAPS_JSON = JSON.stringify([{ topic: 'budget', severity: 'high' }]);

  beforeEach(() => seedCall(TEST_ID));
  afterEach(() => deleteCall(TEST_ID));

  it('writes gaps_json to the matching row', async () => {
    const { updateCallGaps } = await import('./save-call.js');
    updateCallGaps({ transcript_id: TEST_ID, gaps_json: GAPS_JSON });

    const db = new Database(dbPath);
    const row = db.query('SELECT gaps_json FROM calls WHERE transcript_id = ?').get(TEST_ID);
    db.close();

    expect(row.gaps_json).toBe(GAPS_JSON);
  });

  it('does not affect other columns when updating gaps_json', async () => {
    const { updateCallGaps } = await import('./save-call.js');
    updateCallGaps({ transcript_id: TEST_ID, gaps_json: GAPS_JSON });

    const db = new Database(dbPath);
    const row = db.query('SELECT * FROM calls WHERE transcript_id = ?').get(TEST_ID);
    db.close();

    expect(row.company_domain).toBe('test.com');
    expect(row.call_type).toBe('discovery');
    expect(row.call_date).toBe('2026-01-01');
  });

  it('overwrites a previously set gaps_json value', async () => {
    const { updateCallGaps } = await import('./save-call.js');
    const first = JSON.stringify([{ topic: 'timeline', severity: 'medium' }]);
    const second = JSON.stringify([{ topic: 'budget', severity: 'high' }]);

    updateCallGaps({ transcript_id: TEST_ID, gaps_json: first });
    updateCallGaps({ transcript_id: TEST_ID, gaps_json: second });

    const db = new Database(dbPath);
    const row = db.query('SELECT gaps_json FROM calls WHERE transcript_id = ?').get(TEST_ID);
    db.close();

    expect(row.gaps_json).toBe(second);
  });
});
