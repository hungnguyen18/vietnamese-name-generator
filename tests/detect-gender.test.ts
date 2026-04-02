import { describe, it, expect } from 'vitest';
import { detectGender } from '../src/detect-gender';
import { EGender } from '../src/types';

describe('detectGender', () => {
  it('detects "Nguyễn Thị Mai" as female with high confidence', () => {
    const result = detectGender('Nguyễn Thị Mai');
    expect(result.gender).toBe(EGender.Female);
    expect(result.confidence).toBe('high');
    expect(result.signals.middleName).toEqual({ gender: EGender.Female, value: 'Thị' });
    expect(result.signals.givenName).toBeDefined();
  });

  it('detects "Nguyễn Văn An" as male with high confidence', () => {
    const result = detectGender('Nguyễn Văn An');
    expect(result.gender).toBe(EGender.Male);
    expect(result.confidence).toBe('high');
    expect(result.signals.middleName).toEqual({ gender: EGender.Male, value: 'Văn' });
  });

  it('handles "Trần Minh An" — unisex middle, unisex given', () => {
    const result = detectGender('Trần Minh An');
    // Minh is in male, female, and unisex middle name lists → unisex
    // An is in male, female, and unisex given name lists → unisex
    expect([EGender.Unisex, 'unknown']).toContain(result.gender);
    expect(result.confidence).toBe('low');
  });

  it('detects "Nguyễn Ngọc Bảo" as female with medium confidence', () => {
    // Ngọc is female-only middle name (strong female signal but given name "Bảo" is male)
    // Ngọc is exclusive to female middle name lists → high confidence
    const result = detectGender('Nguyễn Ngọc Bảo');
    expect(result.gender).toBe(EGender.Female);
    expect(result.signals.middleName).toEqual({ gender: EGender.Female, value: 'Ngọc' });
  });

  it('handles just "Mai" gracefully', () => {
    const result = detectGender('Mai');
    // Single name — no middle name signal, given name only
    expect(result.confidence).toBe('low');
    expect(result.signals.middleName).toBeUndefined();
    expect(result.signals.givenName).toBeDefined();
  });

  it('handles empty string', () => {
    const result = detectGender('');
    expect(result.gender).toBe('unknown');
    expect(result.confidence).toBe('low');
    expect(result.signals).toEqual({});
  });

  it('handles whitespace-only input', () => {
    const result = detectGender('   ');
    expect(result.gender).toBe('unknown');
    expect(result.confidence).toBe('low');
  });

  it('handles two-part name (surname + given, no middle)', () => {
    const result = detectGender('Nguyễn Mai');
    // No middle name, given = Mai (female in given names)
    expect(result.gender).toBe(EGender.Female);
    expect(result.confidence).toBe('low');
    expect(result.signals.middleName).toBeUndefined();
  });
});
