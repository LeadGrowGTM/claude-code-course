import { test, expect, describe } from 'bun:test';
import { parseTemporalSignal, parsePeopleSignal } from './fetch-transcript.js';

describe('parseTemporalSignal', () => {
  test('yesterday → 1', () => {
    expect(parseTemporalSignal('yesterday')).toBe(1);
  });

  test('last week → 7', () => {
    expect(parseTemporalSignal('last week')).toBe(7);
  });

  test('last month → 30', () => {
    expect(parseTemporalSignal('last month')).toBe(30);
  });

  test('last Tuesday → 1-7', () => {
    const d = parseTemporalSignal('last tuesday');
    expect(d).toBeGreaterThanOrEqual(1);
    expect(d).toBeLessThanOrEqual(7);
  });

  test('people signal → null', () => {
    expect(parseTemporalSignal('meeting with Sarah')).toBeNull();
  });

  test('empty string → null', () => {
    expect(parseTemporalSignal('')).toBeNull();
  });
});

describe('parsePeopleSignal', () => {
  test('meeting with Sarah → Sarah', () => {
    expect(parsePeopleSignal('meeting with Sarah')).toBe('Sarah');
  });

  test('Acme call → Acme', () => {
    expect(parsePeopleSignal('Acme call')).toBe('Acme');
  });

  test('TechSight demo → TechSight', () => {
    expect(parsePeopleSignal('TechSight demo')).toBe('TechSight');
  });
});
