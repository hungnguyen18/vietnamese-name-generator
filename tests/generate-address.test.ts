import { describe, it, expect } from 'vitest';
import { generateAddress } from '../src/generate-address';

describe('generateAddress', () => {
  it('returns all fields non-empty', () => {
    const result = generateAddress({ seed: 1 });
    expect(result.street.length).toBeGreaterThan(0);
    expect(result.ward.length).toBeGreaterThan(0);
    expect(result.district.length).toBeGreaterThan(0);
    expect(result.province.length).toBeGreaterThan(0);
    expect(result.postalCode.length).toBeGreaterThan(0);
    expect(result.full.length).toBeGreaterThan(0);
  });

  it('full contains province name', () => {
    const result = generateAddress({ seed: 42 });
    expect(result.full).toContain(result.province);
  });

  it('is deterministic with seed', () => {
    const a = generateAddress({ seed: 123 });
    const b = generateAddress({ seed: 123 });
    expect(a).toEqual(b);
  });

  it('province option constrains province in result', () => {
    const result = generateAddress({ province: 'Hà Nội', seed: 1 });
    expect(result.province).toBe('Hà Nội');
  });

  it('province option works with cccdCode', () => {
    const result = generateAddress({ province: '079', seed: 1 });
    expect(result.province).toBe('Hồ Chí Minh');
  });

  it('province option works with English name', () => {
    const result = generateAddress({ province: 'Da Nang', seed: 1 });
    expect(result.province).toBe('Đà Nẵng');
  });

  it('postalCode is 6 digits', () => {
    for (let i = 0; i < 20; i += 1) {
      const result = generateAddress({ seed: i });
      expect(result.postalCode).toMatch(/^\d{6}$/);
    }
  });

  it('city provinces use Quận and Phường', () => {
    const result = generateAddress({ province: 'Hà Nội', seed: 5 });
    expect(result.district).toMatch(/^Quận \d+$/);
    expect(result.ward).toMatch(/^Phường \d+$/);
  });

  it('non-city provinces use Huyện and Xã', () => {
    const result = generateAddress({ province: 'Bắc Giang', seed: 5 });
    expect(result.district).toMatch(/^Huyện .+$/);
    expect(result.ward).toMatch(/^Xã .+$/);
  });

  it('throws for unknown province', () => {
    expect(() => generateAddress({ province: 'Narnia' })).toThrow('Province not found');
  });

  it('produces variety without a seed', () => {
    const listFull: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      listFull.push(generateAddress().full);
    }
    const unique = new Set(listFull);
    expect(unique.size).toBeGreaterThan(1);
  });
});
