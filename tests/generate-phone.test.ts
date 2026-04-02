import { describe, it, expect } from 'vitest';
import { generatePhone } from '../src/generate-phone';
import { PHONE_PREFIX } from '../src/data/province';

describe('generatePhone', () => {
  it('generates a 10-digit string starting with 0', () => {
    const result = generatePhone({ seed: 1 });
    expect(result.number).toMatch(/^0\d{9}$/);
  });

  it('international format starts with +84 and is 12 chars', () => {
    const result = generatePhone({ seed: 1, format: 'international' });
    expect(result.number).toMatch(/^\+84\d{9}$/);
    expect(result.number.length).toBe(12);
  });

  it('carrier option constrains prefix', () => {
    const result = generatePhone({ seed: 1, carrier: 'viettel' });
    expect(result.carrier).toBe('viettel');
    const listPrefix = PHONE_PREFIX['viettel'];
    const matchPrefix = listPrefix.some((p: string) => result.number.startsWith(p));
    expect(matchPrefix).toBe(true);
  });

  it('is deterministic with the same seed', () => {
    const a = generatePhone({ seed: 99 });
    const b = generatePhone({ seed: 99 });
    expect(a.number).toBe(b.number);
    expect(a.carrier).toBe(b.carrier);
  });

  it('produces different results with different seeds', () => {
    const a = generatePhone({ seed: 1 });
    const b = generatePhone({ seed: 2 });
    expect(a.number).not.toBe(b.number);
  });

  it('defaults to local format', () => {
    const result = generatePhone({ seed: 1 });
    expect(result.format).toBe('local');
    expect(result.number.startsWith('0')).toBe(true);
  });
});
