import { describe, it, expect } from 'vitest';
import { getRegionalVariant } from '../src/regional-variant';
import { ERegion } from '../src/types';

describe('getRegionalVariant', () => {
  it('converts Hoàng to Huỳnh for south region', () => {
    expect(getRegionalVariant('Hoàng', ERegion.South)).toBe('Huỳnh');
  });

  it('converts Huỳnh to Hoàng for north region', () => {
    expect(getRegionalVariant('Huỳnh', ERegion.North)).toBe('Hoàng');
  });

  it('converts Vũ to Võ for south region', () => {
    expect(getRegionalVariant('Vũ', ERegion.South)).toBe('Võ');
  });

  it('converts Võ to Vũ for north region', () => {
    expect(getRegionalVariant('Võ', ERegion.North)).toBe('Vũ');
  });

  it('returns original surname when no variant exists', () => {
    expect(getRegionalVariant('Nguyễn', ERegion.South)).toBe('Nguyễn');
  });

  it('handles romanized (ASCII) input', () => {
    expect(getRegionalVariant('Hoang', ERegion.South)).toBe('Huỳnh');
  });

  it('returns original when surname already matches target region', () => {
    expect(getRegionalVariant('Huỳnh', ERegion.South)).toBe('Huỳnh');
  });

  it('converts Huỳnh to Hoàng for central region', () => {
    expect(getRegionalVariant('Huỳnh', ERegion.Central)).toBe('Hoàng');
  });

  it('keeps Hoàng unchanged for central region', () => {
    expect(getRegionalVariant('Hoàng', ERegion.Central)).toBe('Hoàng');
  });

  it('handles case-insensitive romanized input', () => {
    expect(getRegionalVariant('hoang', ERegion.South)).toBe('Huỳnh');
    expect(getRegionalVariant('HOANG', ERegion.South)).toBe('Huỳnh');
  });
});
