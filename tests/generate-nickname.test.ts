import { describe, it, expect } from 'vitest';
import { generateNickname, TNicknameCategory } from '../src/generate-nickname';

describe('generateNickname', () => {
  it('returns a nickname with all fields populated', () => {
    const result = generateNickname();
    expect(result.nickname).toBeTruthy();
    expect(result.category).toBeTruthy();
    expect(result.meaning).toBeTruthy();
    expect(result.culturalNote).toBeTruthy();
  });

  it('filters by category', () => {
    const listCategory: TNicknameCategory[] = ['animal', 'descriptor', 'ordinal', 'food', 'endearment'];
    for (let i = 0; i < listCategory.length; i += 1) {
      const category = listCategory[i];
      const result = generateNickname({ category });
      expect(result.category).toBe(category);
    }
  });

  it('is deterministic with seed', () => {
    const first = generateNickname({ seed: 42 });
    const second = generateNickname({ seed: 42 });
    expect(first).toEqual(second);
  });

  it('produces different results with different seeds', () => {
    const first = generateNickname({ seed: 1 });
    const second = generateNickname({ seed: 9999 });
    // With different seeds, at least one field should differ
    const isDifferent = first.nickname !== second.nickname
      || first.category !== second.category;
    expect(isDifferent).toBe(true);
  });

  it('all categories produce results', () => {
    const listCategory: TNicknameCategory[] = ['animal', 'descriptor', 'ordinal', 'food', 'endearment'];
    for (let i = 0; i < listCategory.length; i += 1) {
      const result = generateNickname({ category: listCategory[i], seed: 123 });
      expect(result.nickname).toBeTruthy();
      expect(result.category).toBe(listCategory[i]);
    }
  });

  it('meaning is a non-empty English string', () => {
    const result = generateNickname({ seed: 7 });
    expect(typeof result.meaning).toBe('string');
    expect(result.meaning.length).toBeGreaterThan(0);
    // Should contain only ASCII/English characters and spaces
    expect(result.meaning).toMatch(/^[a-zA-Z\s-]+$/);
  });

  it('culturalNote is non-empty', () => {
    const listCategory: TNicknameCategory[] = ['animal', 'descriptor', 'ordinal', 'food', 'endearment'];
    for (let i = 0; i < listCategory.length; i += 1) {
      const result = generateNickname({ category: listCategory[i] });
      expect(typeof result.culturalNote).toBe('string');
      expect(result.culturalNote.length).toBeGreaterThan(0);
    }
  });
});
