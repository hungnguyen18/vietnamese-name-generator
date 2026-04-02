import { INDEX_SURNAME } from './data/surname';
import { romanize } from './romanize';

export interface ISurnameInfo {
  surname: string;
  found: boolean;
  frequency: Record<string, number>;
  rank: Record<string, number>;
  isCompound: boolean;
  regionalVariants?: { north?: string; south?: string };
}

const LIST_COMPOUND_SURNAME = [
  'Ton That',
  'Ton Nu',
  'Nguyen Phuoc',
  'Hoang Phu',
  'Au Duong',
  'Thuong Quan',
  'Tu Ma',
  'Tu Do',
  'Gia Cat',
  'Ha Hau',
  'Tay Mon',
  'Vu Van',
  'Chung Ly',
];

const MAP_REGIONAL_VARIANT: Record<string, { north?: string; south?: string }> = {
  'Hoang': { south: 'Huynh' },
  'Huynh': { north: 'Hoang' },
  'Vu': { south: 'Vo' },
  'Vo': { north: 'Vu' },
};

const MAP_REGIONAL_VARIANT_VIETNAMESE: Record<string, { north?: string; south?: string }> = {
  'Hoàng': { south: 'Huỳnh' },
  'Huỳnh': { north: 'Hoàng' },
  'Vũ': { south: 'Võ' },
  'Võ': { north: 'Vũ' },
};

function rankBuild(region: string): Map<string, number> {
  const listEntry = INDEX_SURNAME[region];
  if (!listEntry) {
    return new Map();
  }
  const listSorted = [...listEntry].sort((a, b) => b.weight - a.weight);
  const mapRank = new Map<string, number>();
  for (let i = 0; i < listSorted.length; i += 1) {
    mapRank.set(listSorted[i].value, i + 1);
  }
  return mapRank;
}

function surnameFind(
  surname: string,
): { matchedValue: string; isRomanized: boolean } | null {
  const listRegion = Object.keys(INDEX_SURNAME);
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      if (listEntry[j].value === surname) {
        return { matchedValue: listEntry[j].value, isRomanized: false };
      }
    }
  }

  const surnameRomanized = surname;
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      if (romanize(listEntry[j].value) === surnameRomanized) {
        return { matchedValue: listEntry[j].value, isRomanized: true };
      }
    }
  }

  return null;
}

export function getSurnameInfo(surname: string): ISurnameInfo {
  const match = surnameFind(surname);

  if (!match) {
    return {
      surname,
      found: false,
      frequency: {},
      rank: {},
      isCompound: false,
    };
  }

  const matchedValue = match.matchedValue;
  const frequency: Record<string, number> = {};
  const rank: Record<string, number> = {};
  const listRegion = Object.keys(INDEX_SURNAME);

  for (let i = 0; i < listRegion.length; i += 1) {
    const region = listRegion[i];
    const listEntry = INDEX_SURNAME[region];
    const mapRank = rankBuild(region);

    for (let j = 0; j < listEntry.length; j += 1) {
      if (listEntry[j].value === matchedValue) {
        frequency[region] = listEntry[j].weight;
        rank[region] = mapRank.get(matchedValue) ?? 0;
        break;
      }
    }
  }

  const romanizedSurname = romanize(matchedValue);
  const isCompound = LIST_COMPOUND_SURNAME.includes(romanizedSurname);

  const variantVietnamese = MAP_REGIONAL_VARIANT_VIETNAMESE[matchedValue];
  const variantRomanized = MAP_REGIONAL_VARIANT[romanizedSurname];

  let regionalVariants: { north?: string; south?: string } | undefined;

  if (variantVietnamese) {
    regionalVariants = variantVietnamese;
  } else if (variantRomanized && match.isRomanized) {
    regionalVariants = variantRomanized;
  }

  const result: ISurnameInfo = {
    surname: matchedValue,
    found: true,
    frequency,
    rank,
    isCompound,
  };

  if (regionalVariants) {
    result.regionalVariants = regionalVariants;
  }

  return result;
}
