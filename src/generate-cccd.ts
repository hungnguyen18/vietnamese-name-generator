import { mulberry32, pickRandom } from './random';
import { LIST_PROVINCE, type TProvince } from './data/province';

export interface ICCCDOptions {
  province?: string;
  gender?: 'male' | 'female';
  birthYear?: number;
  seed?: number;
}

export interface ICCCDResult {
  number: string;
  province: { name: string; nameEn: string; code: string };
  gender: string;
  birthYear: number;
}

function provinceFind(query: string): TProvince | undefined {
  const normalized = query.trim().toLowerCase();
  for (let i = 0; i < LIST_PROVINCE.length; i += 1) {
    const p = LIST_PROVINCE[i];
    if (
      p.cccdCode === normalized
      || p.name.toLowerCase() === normalized
      || p.nameEn.toLowerCase() === normalized
    ) {
      return p;
    }
  }
  return undefined;
}

export function generateCCCD(options?: ICCCDOptions): ICCCDResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : Math.random;

  const province = options?.province
    ? provinceFind(options.province) ?? pickRandom(LIST_PROVINCE, rng)
    : pickRandom(LIST_PROVINCE, rng);

  const gender = options?.gender ?? (rng() < 0.5 ? 'male' : 'female');

  const birthYear = options?.birthYear ?? (1960 + Math.floor(rng() * 46));

  const century = Math.floor(birthYear / 100);
  let genderCenturyDigit: number;
  if (century === 19) {
    genderCenturyDigit = gender === 'male' ? 0 : 1;
  } else {
    genderCenturyDigit = gender === 'male' ? 2 : 3;
  }

  const yearSuffix = String(birthYear % 100).padStart(2, '0');

  let randomSuffix = '';
  for (let i = 0; i < 6; i += 1) {
    randomSuffix += String(Math.floor(rng() * 10));
  }

  const number = `${province.cccdCode}${genderCenturyDigit}${yearSuffix}${randomSuffix}`;

  return {
    number,
    province: { name: province.name, nameEn: province.nameEn, code: province.cccdCode },
    gender,
    birthYear,
  };
}
