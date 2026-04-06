// Pronoun pair data indexed by age gap range and region
// Compact: ageDiffMin,ageDiffMax|selfM,addresseeM|selfF,addresseeF|selfM_C,addresseeM_C|selfF_C,addresseeF_C|selfM_S,addresseeM_S|selfF_S,addresseeF_S
// Regions: N=North, C=Central, S=South
// Gender: M=male addressee, F=female addressee
// Sorted by age gap descending (listener older → listener younger)

import type { EGender, ERegion } from '../types';

export interface IPronounPairData {
  ageDiffMin: number;
  ageDiffMax: number;
  pairs: Record<string, Record<string, { self: string; addressee: string }>>;
}

// Age gap = addresseeAge - speakerAge
// Positive = addressee is older, Negative = addressee is younger
const RAW = `20,999|con,ông|con,bà|con,ông|con,bà|con,ông|con,bà
10,19|cháu,chú|cháu,cô|cháu,chú|cháu,o|cháu,chú|cháu,cô
3,9|em,anh|em,chị|em,anh|em,chị|em,anh|em,chị
-2,2|em,anh|em,chị|em,anh|em,chị|em,anh|em,chị
-9,-3|anh,em|chị,em|anh,em|chị,em|anh,em|chị,em
-19,-10|chú,cháu|cô,cháu|chú,cháu|o,cháu|chú,cháu|cô,cháu
-999,-20|ông,con|bà,con|ông,con|bà,con|ông,con|bà,con`;

const REGIONS = ['north', 'central', 'south'];
const GENDERS = ['male', 'female'];

let cache: IPronounPairData[] | null = null;

export function pronounPairIndex(): IPronounPairData[] {
  if (cache) return cache;
  cache = RAW.split('\n').map(line => {
    const listSegment = line.split('|');
    const [min, max] = listSegment[0].split(',').map(Number);
    const pairs: Record<string, Record<string, { self: string; addressee: string }>> = {};
    for (let r = 0; r < REGIONS.length; r += 1) {
      pairs[REGIONS[r]] = {};
      for (let g = 0; g < GENDERS.length; g += 1) {
        const idx = 1 + r * 2 + g;
        const [self, addressee] = listSegment[idx].split(',');
        pairs[REGIONS[r]][GENDERS[g]] = { self, addressee };
      }
    }
    return { ageDiffMin: min, ageDiffMax: max, pairs };
  });
  return cache;
}

export function pronounPairLookup(
  ageDiff: number,
  gender: EGender | 'male' | 'female',
  region: ERegion | 'north' | 'central' | 'south',
): { self: string; addressee: string } {
  const data = pronounPairIndex();
  const g = gender === 'unisex' ? 'male' : gender;
  const r = region || 'north';
  for (let i = 0; i < data.length; i += 1) {
    if (ageDiff >= data[i].ageDiffMin && ageDiff <= data[i].ageDiffMax) {
      return data[i].pairs[r]?.[g] || data[i].pairs.north[g];
    }
  }
  // Fallback: formal neutral
  return { self: 'tôi', addressee: ageDiff >= 0 ? 'ông' : 'em' };
}
