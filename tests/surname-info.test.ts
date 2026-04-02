import { describe, it, expect } from 'vitest';
import { getSurnameInfo } from '../src/surname-info';

describe('getSurnameInfo', () => {
  it('returns correct info for Nguyễn (highest frequency, rank 1 in all regions)', () => {
    const info = getSurnameInfo('Nguyễn');
    expect(info.found).toBe(true);
    expect(info.surname).toBe('Nguyễn');
    expect(info.frequency.north).toBe(31.5);
    expect(info.frequency.central).toBeGreaterThan(0);
    expect(info.frequency.south).toBeGreaterThan(0);
    expect(info.rank.north).toBe(1);
    expect(info.rank.central).toBe(1);
    expect(info.rank.south).toBe(1);
    expect(info.isCompound).toBe(false);
  });

  it('returns same result for romanized "Nguyen"', () => {
    const info = getSurnameInfo('Nguyen');
    expect(info.found).toBe(true);
    expect(info.surname).toBe('Nguyễn');
    expect(info.frequency.north).toBe(31.5);
    expect(info.rank.north).toBe(1);
    expect(info.rank.central).toBe(1);
    expect(info.rank.south).toBe(1);
    expect(info.isCompound).toBe(false);
  });

  it('returns regional variants for Huỳnh', () => {
    const info = getSurnameInfo('Huỳnh');
    expect(info.found).toBe(true);
    expect(info.surname).toBe('Huỳnh');
    expect(info.regionalVariants).toBeDefined();
    expect(info.regionalVariants?.north).toBe('Hoàng');
  });

  it('identifies Tôn Thất as a compound surname', () => {
    const info = getSurnameInfo('Tôn Thất');
    expect(info.found).toBe(true);
    expect(info.surname).toBe('Tôn Thất');
    expect(info.isCompound).toBe(true);
  });

  it('returns found: false for unknown surname "Xyz"', () => {
    const info = getSurnameInfo('Xyz');
    expect(info.found).toBe(false);
    expect(info.surname).toBe('Xyz');
    expect(info.frequency).toEqual({});
    expect(info.rank).toEqual({});
    expect(info.isCompound).toBe(false);
  });
});
