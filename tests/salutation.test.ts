import { describe, it, expect } from 'vitest';
import { salutation } from '../src/salutation';

describe('salutation', () => {
  it('defaults to casual and auto-detects male from "Văn"', () => {
    const result = salutation('Nguyễn Văn Nam');
    expect(result.honorific).toBe('Anh');
    expect(result.addressName).toBe('Nam');
    expect(result.salutation).toBe('Anh Nam');
    expect(result.fullSalutation).toBe('Anh Nam');
  });

  it('generates formal salutation for female name with "Thị"', () => {
    const result = salutation('Nguyễn Thị Lan', { formality: 'formal' });
    expect(result.honorific).toBe('Bà');
    expect(result.addressName).toBe('Lan');
    expect(result.salutation).toBe('Bà Lan');
    expect(result.fullSalutation).toBe('Kính gửi Bà Lan');
  });

  it('uses explicit gender override even when name signals differ', () => {
    const result = salutation('Trần Minh An', { gender: 'female', formality: 'casual' });
    expect(result.honorific).toBe('Chị');
    expect(result.addressName).toBe('An');
    expect(result.salutation).toBe('Chị An');
  });

  it('handles name without strong gender signal', () => {
    const result = salutation('Lê Bảo', { formality: 'formal' });
    // "Bảo" appears in multiple gender lists — detector may return male or unisex
    expect(result.addressName).toBe('Bảo');
    expect(['Ông', 'Bà', 'Quý khách']).toContain(result.honorific);
  });

  it('handles name without middle name in casual mode', () => {
    const result = salutation('Lê Bảo', { formality: 'casual' });
    expect(result.addressName).toBe('Bảo');
    expect(['Anh', 'Chị', 'Bạn']).toContain(result.honorific);
  });

  it('handles compound given name correctly', () => {
    const result = salutation('Nguyễn Văn Bảo Long');
    expect(result.addressName).toBe('Bảo Long');
    expect(result.honorific).toBe('Anh');
    expect(result.salutation).toBe('Anh Bảo Long');
  });

  it('generates professional salutation with "Thưa"', () => {
    const result = salutation('Nguyễn Văn Nam', { formality: 'professional' });
    expect(result.honorific).toBe('Ông');
    expect(result.addressName).toBe('Nam');
    expect(result.fullSalutation).toBe('Thưa Ông Nam');
  });

  it('handles single-word name', () => {
    const result = salutation('Nam');
    expect(result.addressName).toBe('Nam');
    expect(result.salutation).toContain('Nam');
  });

  it('handles empty string gracefully', () => {
    const result = salutation('');
    expect(result.addressName).toBe('');
    expect(result.honorific).toBe('Bạn');
  });
});
