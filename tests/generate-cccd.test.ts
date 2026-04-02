import { describe, it, expect } from 'vitest';
import { generateCCCD } from '../src/generate-cccd';

describe('generateCCCD', () => {
  it('generates a 12-digit string', () => {
    const result = generateCCCD({ seed: 1 });
    expect(result.number).toMatch(/^\d{12}$/);
  });

  it('is deterministic with the same seed', () => {
    const a = generateCCCD({ seed: 42 });
    const b = generateCCCD({ seed: 42 });
    expect(a.number).toBe(b.number);
    expect(a.province.code).toBe(b.province.code);
    expect(a.gender).toBe(b.gender);
    expect(a.birthYear).toBe(b.birthYear);
  });

  it('province code matches first 3 digits', () => {
    const result = generateCCCD({ seed: 10 });
    expect(result.number.slice(0, 3)).toBe(result.province.code);
  });

  it('gender option affects digit 4 (male 1900s = 0, female 1900s = 1)', () => {
    const male = generateCCCD({ seed: 1, gender: 'male', birthYear: 1990 });
    const female = generateCCCD({ seed: 1, gender: 'female', birthYear: 1990 });
    expect(male.number[3]).toBe('0');
    expect(female.number[3]).toBe('1');
  });

  it('gender option affects digit 4 (male 2000s = 2, female 2000s = 3)', () => {
    const male = generateCCCD({ seed: 1, gender: 'male', birthYear: 2001 });
    const female = generateCCCD({ seed: 1, gender: 'female', birthYear: 2001 });
    expect(male.number[3]).toBe('2');
    expect(female.number[3]).toBe('3');
  });

  it('birth year option affects digits 5-6', () => {
    const result = generateCCCD({ seed: 1, birthYear: 1995 });
    expect(result.number.slice(4, 6)).toBe('95');
  });

  it('accepts province by name', () => {
    const result = generateCCCD({ seed: 1, province: 'Ha Noi' });
    expect(result.province.nameEn).toBe('Ha Noi');
  });

  it('accepts province by cccd code', () => {
    const result = generateCCCD({ seed: 1, province: '001' });
    expect(result.province.code).toBe('001');
    expect(result.number.slice(0, 3)).toBe('001');
  });
});
