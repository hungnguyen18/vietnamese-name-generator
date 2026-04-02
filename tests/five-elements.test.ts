import { describe, it, expect } from 'vitest';
import {
  EElement,
  getElementInfo,
  getBirthYearElement,
  getNameElement,
  getNamesByElement,
} from '../src/five-elements';

describe('getElementInfo', () => {
  it('returns correct info for Kim (Metal)', () => {
    const info = getElementInfo(EElement.Kim);
    expect(info.element).toBe(EElement.Kim);
    expect(info.hanViet).toBe('金');
    expect(info.meaning).toBe('Metal');
    expect(info.generating).toBe(EElement.Thuy);
    expect(info.destroying).toBe(EElement.Moc);
  });

  it('returns correct info for Moc (Wood)', () => {
    const info = getElementInfo(EElement.Moc);
    expect(info.element).toBe(EElement.Moc);
    expect(info.hanViet).toBe('木');
    expect(info.meaning).toBe('Wood');
    expect(info.generating).toBe(EElement.Hoa);
    expect(info.destroying).toBe(EElement.Tho);
  });

  it('returns correct info for Thuy (Water)', () => {
    const info = getElementInfo(EElement.Thuy);
    expect(info.generating).toBe(EElement.Moc);
    expect(info.destroying).toBe(EElement.Hoa);
  });

  it('returns correct info for Hoa (Fire)', () => {
    const info = getElementInfo(EElement.Hoa);
    expect(info.generating).toBe(EElement.Tho);
    expect(info.destroying).toBe(EElement.Kim);
  });

  it('returns correct info for Tho (Earth)', () => {
    const info = getElementInfo(EElement.Tho);
    expect(info.generating).toBe(EElement.Kim);
    expect(info.destroying).toBe(EElement.Thuy);
  });

  it('generating cycle forms a complete loop', () => {
    let current = EElement.Kim;
    const visited: EElement[] = [current];
    for (let i = 0; i < 4; i += 1) {
      current = getElementInfo(current).generating;
      visited.push(current);
    }
    // Kim -> Thuy -> Moc -> Hoa -> Tho
    expect(visited).toEqual([
      EElement.Kim,
      EElement.Thuy,
      EElement.Moc,
      EElement.Hoa,
      EElement.Tho,
    ]);
    // And Tho generates Kim, completing the cycle
    expect(getElementInfo(EElement.Tho).generating).toBe(EElement.Kim);
  });

  it('destroying cycle forms a complete loop', () => {
    let current = EElement.Kim;
    const visited: EElement[] = [current];
    for (let i = 0; i < 4; i += 1) {
      current = getElementInfo(current).destroying;
      visited.push(current);
    }
    // Kim -> Moc -> Tho -> Thuy -> Hoa
    expect(visited).toEqual([
      EElement.Kim,
      EElement.Moc,
      EElement.Tho,
      EElement.Thuy,
      EElement.Hoa,
    ]);
    // And Hoa destroys Kim, completing the cycle
    expect(getElementInfo(EElement.Hoa).destroying).toBe(EElement.Kim);
  });
});

describe('getBirthYearElement', () => {
  it('returns Kim for 1990 (last digit 0)', () => {
    expect(getBirthYearElement(1990)).toBe(EElement.Kim);
  });

  it('returns Kim for 2001 (last digit 1)', () => {
    expect(getBirthYearElement(2001)).toBe(EElement.Kim);
  });

  it('returns Thuy for 2002 (last digit 2)', () => {
    expect(getBirthYearElement(2002)).toBe(EElement.Thuy);
  });

  it('returns Thuy for 1993 (last digit 3)', () => {
    expect(getBirthYearElement(1993)).toBe(EElement.Thuy);
  });

  it('returns Moc for 1995 (last digit 5)', () => {
    expect(getBirthYearElement(1995)).toBe(EElement.Moc);
  });

  it('returns Moc for 2024 (last digit 4)', () => {
    expect(getBirthYearElement(2024)).toBe(EElement.Moc);
  });

  it('returns Hoa for 1996 (last digit 6)', () => {
    expect(getBirthYearElement(1996)).toBe(EElement.Hoa);
  });

  it('returns Hoa for 2007 (last digit 7)', () => {
    expect(getBirthYearElement(2007)).toBe(EElement.Hoa);
  });

  it('returns Tho for 1998 (last digit 8)', () => {
    expect(getBirthYearElement(1998)).toBe(EElement.Tho);
  });

  it('returns Tho for 2019 (last digit 9)', () => {
    expect(getBirthYearElement(2019)).toBe(EElement.Tho);
  });
});

describe('getNameElement', () => {
  it('returns Thuy for "Hải"', () => {
    expect(getNameElement('Hải')).toBe(EElement.Thuy);
  });

  it('returns Tho for "Sơn"', () => {
    expect(getNameElement('Sơn')).toBe(EElement.Tho);
  });

  it('returns Kim for "Bảo"', () => {
    expect(getNameElement('Bảo')).toBe(EElement.Kim);
  });

  it('returns Moc for "Lâm"', () => {
    expect(getNameElement('Lâm')).toBe(EElement.Moc);
  });

  it('returns Hoa for "Quang"', () => {
    expect(getNameElement('Quang')).toBe(EElement.Hoa);
  });

  it('returns null for unknown name "xyz"', () => {
    expect(getNameElement('xyz')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getNameElement('')).toBeNull();
  });

  it('trims whitespace before lookup', () => {
    expect(getNameElement('  Hải  ')).toBe(EElement.Thuy);
  });
});

describe('getNamesByElement', () => {
  it('returns array of water names for Thuy', () => {
    const listName = getNamesByElement(EElement.Thuy);
    expect(Array.isArray(listName)).toBe(true);
    expect(listName.length).toBeGreaterThan(0);
    expect(listName).toContain('Thủy');
    expect(listName).toContain('Hải');
    expect(listName).toContain('Giang');
  });

  it('returns array of metal names for Kim', () => {
    const listName = getNamesByElement(EElement.Kim);
    expect(listName).toContain('Kim');
    expect(listName).toContain('Ngân');
    expect(listName).toContain('Bảo');
  });

  it('returns array of wood names for Moc', () => {
    const listName = getNamesByElement(EElement.Moc);
    expect(listName).toContain('Lâm');
    expect(listName).toContain('Mai');
    expect(listName).toContain('Lan');
  });

  it('returns array of fire names for Hoa', () => {
    const listName = getNamesByElement(EElement.Hoa);
    expect(listName).toContain('Quang');
    expect(listName).toContain('Minh');
    expect(listName).toContain('Hùng');
  });

  it('returns array of earth names for Tho', () => {
    const listName = getNamesByElement(EElement.Tho);
    expect(listName).toContain('Sơn');
    expect(listName).toContain('An');
    expect(listName).toContain('Long');
  });

  it('respects limit option', () => {
    const listName = getNamesByElement(EElement.Thuy, { limit: 3 });
    expect(listName.length).toBe(3);
  });

  it('returns filtered names with gender option', () => {
    const listMale = getNamesByElement(EElement.Tho, { gender: 'male' });
    const listFemale = getNamesByElement(EElement.Moc, { gender: 'female' });
    // Both should return arrays (may be empty if names not in that gender dataset)
    expect(Array.isArray(listMale)).toBe(true);
    expect(Array.isArray(listFemale)).toBe(true);
    // Male earth names should include common male names
    if (listMale.length > 0) {
      // At least some earth names are male
      for (let i = 0; i < listMale.length; i += 1) {
        expect(getNameElement(listMale[i])).toBe(EElement.Tho);
      }
    }
  });

  it('returns empty array for invalid gender', () => {
    const listName = getNamesByElement(EElement.Kim, { gender: 'nonexistent' });
    expect(listName).toEqual([]);
  });

  it('combines gender and limit options', () => {
    const listName = getNamesByElement(EElement.Moc, { gender: 'female', limit: 2 });
    expect(listName.length).toBeLessThanOrEqual(2);
  });
});
