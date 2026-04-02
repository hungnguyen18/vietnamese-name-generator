import { describe, it, expect } from 'vitest';
import { getHanViet } from '../src/get-han-viet';

describe('getHanViet', () => {
  it('returns correct entry for "Minh"', () => {
    const result = getHanViet('Minh');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u660E');
    expect(result!.meaning).toBe('bright');
  });

  it('returns correct entry for "Lan"', () => {
    const result = getHanViet('Lan');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u862D');
    expect(result!.meaning).toBe('orchid');
  });

  it('"Minh" has alternates', () => {
    const result = getHanViet('Minh');
    expect(result).not.toBeNull();
    expect(result!.alternates).toBeDefined();
    expect(result!.alternates!.length).toBeGreaterThanOrEqual(2);
    expect(result!.alternates![0].character).toBe('\u9298');
  });

  it('returns null for "xyz"', () => {
    const result = getHanViet('xyz');
    expect(result).toBeNull();
  });

  it('returns null for empty string', () => {
    const result = getHanViet('');
    expect(result).toBeNull();
  });

  it('matches romanized (ASCII) input', () => {
    const result = getHanViet('Minh');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u660E');
    expect(result!.meaning).toBe('bright');
  });

  it('matches diacritical name via romanized fallback', () => {
    // "Duc" (no diacritics) should match "\u0110\u1EE9c"
    const result = getHanViet('Duc');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u5FB7');
    expect(result!.meaning).toBe('virtue');
  });

  it('returns correct entry for shared name "Kim"', () => {
    const result = getHanViet('Kim');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u91D1');
    expect(result!.meaning).toBe('gold');
  });

  it('returns correct entry for female name "Thu"', () => {
    const result = getHanViet('Thu');
    expect(result).not.toBeNull();
    expect(result!.character).toBe('\u79CB');
    expect(result!.meaning).toBe('autumn');
  });

  it('includes pinyin when available', () => {
    const result = getHanViet('Long');
    expect(result).not.toBeNull();
    expect(result!.pinyin).toBe('long');
  });
});
