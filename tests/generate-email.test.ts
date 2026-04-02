import { describe, it, expect } from 'vitest';
import { generateEmail } from '../src/generate-email';

describe('generateEmail', () => {
  it('generates a valid email format', () => {
    const result = generateEmail({ seed: 1 });
    expect(result.email).toContain('@');
    const parts = result.email.split('@');
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1]).toContain('.');
  });

  it('is deterministic with the same seed', () => {
    const a = generateEmail({ seed: 42 });
    const b = generateEmail({ seed: 42 });
    expect(a.email).toBe(b.email);
    expect(a.name.fullName).toBe(b.name.fullName);
  });

  it('uses a custom domain when provided', () => {
    const result = generateEmail({ seed: 1, domain: 'example.com' });
    expect(result.email.endsWith('@example.com')).toBe(true);
  });

  it('produces all lowercase ASCII email with no diacritics', () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generateEmail({ seed: i });
      expect(result.email).toBe(result.email.toLowerCase());
      expect(result.email).toMatch(/^[a-z0-9.@]+$/);
    }
  });

  it('produces variety without a seed', () => {
    const listEmail: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      listEmail.push(generateEmail().email);
    }
    const unique = new Set(listEmail);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('returns a valid INameResult in the name field', () => {
    const result = generateEmail({ seed: 7 });
    expect(result.name).toBeDefined();
    expect(result.name.fullName).toBeTruthy();
    expect(result.name.romanized).toBeDefined();
    expect(result.name.romanized.givenName).toBeTruthy();
    expect(result.name.romanized.surname).toBeTruthy();
  });

  it('picks from default domains when no domain is specified', () => {
    const listDefaultDomain = ['gmail.com', 'yahoo.com', 'outlook.com'];
    for (let i = 0; i < 20; i += 1) {
      const result = generateEmail({ seed: i });
      const domain = result.email.split('@')[1];
      expect(listDefaultDomain).toContain(domain);
    }
  });
});
