import { describe, it, expect } from 'vitest';
import { getMeaning } from '../src/get-meaning';

describe('getMeaning', () => {
  it('finds "An" in multiple genders and regions', () => {
    const result = getMeaning('An');
    expect(result.found).toBe(true);
    expect(result.name).toBe('An');
    expect(result.genders.length).toBeGreaterThanOrEqual(2);
    expect(result.regions.length).toBeGreaterThanOrEqual(1);
    expect(result.isCompound).toBe(false);
  });

  it('does not find "Hữu" (middle name, not given name)', () => {
    const result = getMeaning('Hữu');
    expect(result.found).toBe(false);
    expect(result.genders).toEqual([]);
    expect(result.regions).toEqual([]);
    expect(result.eras).toEqual([]);
  });

  it('finds "Bảo Long" as a compound name', () => {
    const result = getMeaning('Bảo Long');
    expect(result.found).toBe(true);
    expect(result.isCompound).toBe(true);
  });

  it('returns found: false for "xyz"', () => {
    const result = getMeaning('xyz');
    expect(result.found).toBe(false);
    expect(result.genders).toEqual([]);
  });

  it('returns found: false for empty string', () => {
    const result = getMeaning('');
    expect(result.found).toBe(false);
    expect(result.name).toBe('');
  });

  it('populates category for a name with known meaning category', () => {
    const result = getMeaning('Hùng');
    expect(result.found).toBe(true);
    expect(result.category).toBe('strength');
  });

  it('supports romanized (ASCII) input via romanize() comparison', () => {
    const result = getMeaning('Hung');
    expect(result.found).toBe(true);
    expect(result.genders.length).toBeGreaterThanOrEqual(1);
  });

  it('populates category "virtue" for "An"', () => {
    const result = getMeaning('An');
    expect(result.category).toBe('virtue');
  });

  it('finds compound name "Minh Anh"', () => {
    const result = getMeaning('Minh Anh');
    expect(result.found).toBe(true);
    expect(result.isCompound).toBe(true);
  });
});
