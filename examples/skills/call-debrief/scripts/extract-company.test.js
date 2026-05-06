import { describe, it, expect } from 'bun:test';
import { extractCompany } from './extract-company.js';

describe('extractCompany', () => {
  it('returns domain from organizer_email when it is external', () => {
    const result = extractCompany({
      participants: ['John Smith', 'Mitchell Keller'],
      organizer_email: 'john@acme.com',
    });
    expect(result).toEqual({ domain: 'acme.com', company_name: 'acme' });
  });

  it('falls back to participants scan when organizer_email is @leadgrow.ai', () => {
    const result = extractCompany({
      participants: ['John Smith', 'john@prospect.io'],
      organizer_email: 'mitchell@leadgrow.ai',
    });
    expect(result).toEqual({ domain: 'prospect.io', company_name: 'prospect' });
  });

  it('returns null when organizer_email is @leadgrow.ai and no participant contains an external @domain', () => {
    const result = extractCompany({
      participants: ['John Smith', 'Mitchell Keller'],
      organizer_email: 'mitchell@leadgrow.ai',
    });
    expect(result).toBeNull();
  });

  it('returns null for empty participants and null organizer_email', () => {
    const result = extractCompany({
      participants: [],
      organizer_email: null,
    });
    expect(result).toBeNull();
  });

  it('returns domain from organizer_email even when organizer_email appears first (not leadgrow)', () => {
    const result = extractCompany({
      participants: ['Alice Jones', 'Bob Smith'],
      organizer_email: 'alice@bigcorp.com',
    });
    expect(result).toEqual({ domain: 'bigcorp.com', company_name: 'bigcorp' });
  });
});
