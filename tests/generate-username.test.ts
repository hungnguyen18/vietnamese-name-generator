import { describe, it, expect } from 'vitest';
import { generateUsername } from '../src/generate-username';

describe('generateUsername', () => {
  it('generates a valid username with no spaces or special chars except _ and .', () => {
    const result = generateUsername();
    expect(result.username).toMatch(/^[a-z0-9_.]+$/);
    expect(result.username.length).toBeGreaterThan(0);
  });

  it('produces all lowercase ASCII', () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generateUsername();
      expect(result.username).toMatch(/^[a-z0-9_.]+$/);
    }
  });

  it('is deterministic with the same seed', () => {
    const a = generateUsername({ seed: 12345 });
    const b = generateUsername({ seed: 12345 });
    expect(a.username).toBe(b.username);
    expect(a.name.fullName).toBe(b.name.fullName);
  });

  it('produces different usernames with different seeds', () => {
    const a = generateUsername({ seed: 1 });
    const b = generateUsername({ seed: 999 });
    expect(a.username).not.toBe(b.username);
  });

  it('returns a valid INameResult in the name field', () => {
    const result = generateUsername({ seed: 42 });
    expect(result.name).toHaveProperty('surname');
    expect(result.name).toHaveProperty('givenName');
    expect(result.name).toHaveProperty('romanized');
    expect(result.name).toHaveProperty('gender');
    expect(result.name).toHaveProperty('region');
    expect(result.name).toHaveProperty('era');
  });

  it('produces variety across multiple calls without seed', () => {
    const listUsername = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      listUsername.add(generateUsername().username);
    }
    expect(listUsername.size).toBeGreaterThan(1);
  });
});
