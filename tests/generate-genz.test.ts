import { describe, it, expect } from 'vitest';
import { generateGenZName } from '../src/generate-genz';
import type { IGenZResult, TGenZStyle } from '../src/generate-genz';

describe('generateGenZName', () => {
  it('returns all fields populated', () => {
    const result = generateGenZName({ seed: 1 });
    expect(result.surname).toBeTruthy();
    expect(result.middleName).toBeTruthy();
    expect(result.givenName).toBeTruthy();
    expect(result.fullName).toBeTruthy();
    expect(result.style).toBeTruthy();
    expect(result.gender).toBeTruthy();
    expect(result.romanized.surname).toBeTruthy();
    expect(result.romanized.middleName).toBeTruthy();
    expect(result.romanized.givenName).toBeTruthy();
    expect(result.romanized.fullName).toBeTruthy();
  });

  it('style filter works for short', () => {
    const result = generateGenZName({ style: 'short', seed: 10 });
    expect(result.style).toBe('short');
    expect(result.givenName.includes(' ')).toBe(false);
  });

  it('style filter works for compound', () => {
    const result = generateGenZName({ style: 'compound', seed: 20 });
    expect(result.style).toBe('compound');
    expect(result.givenName.includes(' ')).toBe(true);
  });

  it('style filter works for international', () => {
    const result = generateGenZName({ style: 'international', seed: 30 });
    expect(result.style).toBe('international');
  });

  it('gender filter works for male', () => {
    const result = generateGenZName({ gender: 'male', seed: 40 });
    expect(result.gender).toBe('male');
  });

  it('gender filter works for female', () => {
    const result = generateGenZName({ gender: 'female', seed: 50 });
    expect(result.gender).toBe('female');
  });

  it('gender filter works for unisex', () => {
    const result = generateGenZName({ gender: 'unisex', seed: 60 });
    expect(result.gender).toBe('unisex');
  });

  it('international style produces ASCII-friendly names after romanize', () => {
    const listResult: IGenZResult[] = [];
    for (let i = 0; i < 20; i += 1) {
      listResult.push(generateGenZName({ style: 'international', seed: i * 7 }));
    }
    for (let i = 0; i < listResult.length; i += 1) {
      const romanizedFull = listResult[i].romanized.fullName;
      // eslint-disable-next-line no-control-regex
      expect(romanizedFull).toMatch(/^[\x00-\x7F]+$/);
    }
  });

  it('is deterministic with the same seed', () => {
    const a = generateGenZName({ seed: 123 });
    const b = generateGenZName({ seed: 123 });
    expect(a.fullName).toBe(b.fullName);
    expect(a.style).toBe(b.style);
    expect(a.gender).toBe(b.gender);
    expect(a.romanized.fullName).toBe(b.romanized.fullName);
  });

  it('different seeds produce variety', () => {
    const listName = new Set<string>();
    for (let i = 0; i < 50; i += 1) {
      const result = generateGenZName({ seed: i });
      listName.add(result.fullName);
    }
    expect(listName.size).toBeGreaterThan(10);
  });
});
