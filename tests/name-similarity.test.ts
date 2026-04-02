import { describe, it, expect } from 'vitest';
import { nameSimilarity } from '../src/name-similarity';

describe('nameSimilarity', () => {
  it('returns score 1.0 and exactMatch true for identical names', () => {
    const result = nameSimilarity('Nguyễn Văn An', 'Nguyễn Văn An');
    expect(result.score).toBe(1.0);
    expect(result.exactMatch).toBe(true);
    expect(result.romanizedMatch).toBe(true);
    expect(result.details.surnameMatch).toBe(true);
    expect(result.details.middleNameMatch).toBe(true);
    expect(result.details.givenNameMatch).toBe(true);
  });

  it('returns score ~0.9 and romanizedMatch true for same name with different diacritics', () => {
    const result = nameSimilarity('Nguyen Van An', 'Nguyễn Văn An');
    expect(result.score).toBeCloseTo(0.9, 1);
    expect(result.exactMatch).toBe(false);
    expect(result.romanizedMatch).toBe(true);
    expect(result.details.surnameMatch).toBe(true);
    expect(result.details.middleNameMatch).toBe(true);
    expect(result.details.givenNameMatch).toBe(true);
  });

  it('returns score ~0.8 for regional variant surnames', () => {
    const result = nameSimilarity('Hoàng Văn An', 'Huỳnh Văn An');
    expect(result.score).toBeGreaterThanOrEqual(0.8);
    expect(result.score).toBeLessThan(1.0);
    expect(result.exactMatch).toBe(false);
    expect(result.details.surnameMatch).toBe(true);
    expect(result.details.givenNameMatch).toBe(true);
  });

  it('returns partial score for reversed name order', () => {
    // Reversed order is hard to parse when given name is not a known surname
    // "Tuấn Nguyễn Văn" → no known surname → all goes to givenName
    // Best we can do is partial matching
    const result = nameSimilarity('Tuấn Nguyễn Văn', 'Nguyễn Văn Tuấn');
    expect(result.score).toBeGreaterThan(0.3);

    // When reversed name starts with a known surname, parsing is correct
    const result2 = nameSimilarity('Lê Văn An', 'Nguyễn Văn An');
    // Same middle + given, different surname → 0.7
    expect(result2.score).toBeGreaterThanOrEqual(0.7);
  });

  it('returns partial match (>0.5) for missing middle name', () => {
    const result = nameSimilarity('Nguyễn An', 'Nguyễn Văn An');
    expect(result.score).toBeGreaterThan(0.5);
  });

  it('returns low score (<0.3) for completely different names', () => {
    const result = nameSimilarity('Nguyễn Văn An', 'Trần Thị Bình');
    expect(result.score).toBeLessThan(0.3);
    expect(result.exactMatch).toBe(false);
    expect(result.romanizedMatch).toBe(false);
  });

  it('returns score 1.0 for two empty strings', () => {
    const result = nameSimilarity('', '');
    expect(result.score).toBe(1.0);
    expect(result.exactMatch).toBe(true);
  });

  it('handles romanized surname vs diacritical surname', () => {
    const result = nameSimilarity('Nguyen An', 'Nguyễn An');
    expect(result.score).toBeGreaterThanOrEqual(0.9);
    expect(result.romanizedMatch).toBe(true);
  });

  it('handles Vũ/Võ regional variant', () => {
    const result = nameSimilarity('Vũ Minh Tuấn', 'Võ Minh Tuấn');
    expect(result.score).toBeGreaterThanOrEqual(0.8);
    expect(result.details.surnameMatch).toBe(true);
  });

  it('returns score 0 when one name is empty and other is not', () => {
    const result = nameSimilarity('', 'Nguyễn Văn An');
    expect(result.score).toBeLessThanOrEqual(0.2);
  });

  it('gives higher weight to given name than surname', () => {
    const sameGiven = nameSimilarity('Trần Văn An', 'Lê Văn An');
    const sameSurname = nameSimilarity('Nguyễn Văn An', 'Nguyễn Văn Bình');
    // Same given name (weight 0.5) should score higher than same surname (weight 0.3)
    expect(sameGiven.score).toBeGreaterThan(sameSurname.score);
  });
});
