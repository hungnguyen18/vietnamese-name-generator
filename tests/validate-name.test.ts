import { describe, it, expect } from 'vitest';
import { validateName } from '../src/validate-name';

describe('validateName', () => {
  it('valid: "Nguyễn Văn An"', () => {
    const result = validateName('Nguyễn Văn An');
    expect(result.valid).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('valid: "Tôn Thất Minh An" (compound surname)', () => {
    const result = validateName('Tôn Thất Minh An');
    expect(result.valid).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('valid romanized: "Nguyen Van An"', () => {
    const result = validateName('Nguyen Van An');
    expect(result.valid).toBe(true);
    expect(result.reasons).toEqual([]);
  });

  it('invalid empty: ""', () => {
    const result = validateName('');
    expect(result.valid).toBe(false);
    expect(result.reasons.some((r) => r.toLowerCase().includes('empty'))).toBe(true);
  });

  it('invalid single word: "An"', () => {
    const result = validateName('An');
    expect(result.valid).toBe(false);
    expect(result.reasons.some((r) => r.toLowerCase().includes('part'))).toBe(true);
  });

  it('invalid unknown surname: "Xyz Văn An"', () => {
    const result = validateName('Xyz Văn An');
    expect(result.valid).toBe(false);
    expect(result.reasons.some((r) => r.includes('Unknown surname'))).toBe(true);
  });

  it('invalid lowercase: "nguyễn văn an"', () => {
    const result = validateName('nguyễn văn an');
    expect(result.valid).toBe(false);
    expect(result.reasons.some((r) => r.toLowerCase().includes('uppercase'))).toBe(true);
  });

  it('invalid special chars: "Nguyễn @# An"', () => {
    const result = validateName('Nguyễn @# An');
    expect(result.valid).toBe(false);
    expect(result.reasons.some((r) => r.toLowerCase().includes('character'))).toBe(true);
  });
});
