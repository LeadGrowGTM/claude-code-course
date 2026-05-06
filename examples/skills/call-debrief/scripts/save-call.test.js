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

  it('throws when transcript_id does not exist', async () => {
    const { updateCallGaps } = await import('./save-call.js');
    expect(() => updateCallGaps({ transcript_id: 'nonexistent-id-xyz', gaps_json: '[]' })).toThrow(
      'No row found for transcript_id: nonexistent-id-xyz',
    );
  });
});

describe('saveCall', () => {
  const TEST_ID = 'test-save-001';

  afterEach(() => deleteCall(TEST_ID));

  it('inserts a new row with gaps_json and findings_json as null', async () => {
    const { saveCall } = await import('./save-call.js');
    saveCall({ transcript_id: TEST_ID, company_domain: 'acme.com', call_type: 'discovery', call_date: '2026-02-01' });

    const db = new Database(dbPath);
    const row = db.query('SELECT * FROM calls WHERE transcript_id = ?').get(TEST_ID);
    db.close();

    expect(row).toBeTruthy();
    expect(row.transcript_id).toBe(TEST_ID);
    expect(row.company_domain).toBe('acme.com');
    expect(row.call_type).toBe('discovery');
    expect(row.call_date).toBe('2026-02-01');
    expect(row.gaps_json).toBeNull();
    expect(row.findings_json).toBeNull();
  });

  it('is idempotent — second call with same transcript_id replaces without error', async () => {
    const { saveCall } = await import('./save-call.js');
    saveCall({ transcript_id: TEST_ID, company_domain: 'acme.com', call_type: 'discovery', call_date: '2026-02-01' });
    saveCall({ transcript_id: TEST_ID, company_domain: 'acme2.com', call_type: 'demo', call_date: '2026-02-02' });

    const db = new Database(dbPath);
    const rows = db.query('SELECT * FROM calls WHERE transcript_id = ?').all(TEST_ID);
    db.close();

    expect(rows.length).toBe(1);
    expect(rows[0].company_domain).toBe('acme2.com');
  });
});
