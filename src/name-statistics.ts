import { INDEX_SURNAME } from './data/surname';
import { INDEX_MIDDLE_NAME } from './data/middle-name';
import { givenNameIndex } from './data/given-name-compact';
import { INDEX_COMPOUND_GIVEN_NAME } from './data/compound-given-name';

export interface IStatisticsResult {
  totalSurnames: number;
  totalGivenNames: number;
  totalCompoundNames: number;
  totalMiddleNames: number;
}

export interface IRankedName {
  name: string;
  weight?: number;
  count?: number;
}

/**
 * Get a high-level overview of the built-in Vietnamese name dataset, returning
 * counts of unique surnames, given names, compound names, and middle names.
 *
 * @returns Statistics object with totals for each name category
 * @example
 * ```typescript
 * getStatistics();
 * // { totalSurnames: 150, totalGivenNames: 800, totalCompoundNames: 120, totalMiddleNames: 30 }
 * ```
 */
export function getStatistics(): IStatisticsResult {
  // Unique surnames across all regions
  const setSurname = new Set<string>();
  const listRegion = Object.keys(INDEX_SURNAME);
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      setSurname.add(listEntry[j].value);
    }
  }

  // Unique given names across all gender/region/era combos
  const setGivenName = new Set<string>();
  const index = givenNameIndex();
  const listGender = Object.keys(index);
  for (let i = 0; i < listGender.length; i += 1) {
    const regionMap = index[listGender[i]];
    const listReg = Object.keys(regionMap);
    for (let j = 0; j < listReg.length; j += 1) {
      const eraMap = regionMap[listReg[j]];
      const listEra = Object.keys(eraMap);
      for (let k = 0; k < listEra.length; k += 1) {
        const listEntry = eraMap[listEra[k]];
        for (let l = 0; l < listEntry.length; l += 1) {
          setGivenName.add(listEntry[l].value);
        }
      }
    }
  }

  // Count compound names
  const setCompound = new Set<string>();
  const listCompoundGender = Object.keys(INDEX_COMPOUND_GIVEN_NAME);
  for (let i = 0; i < listCompoundGender.length; i += 1) {
    const eraMap = INDEX_COMPOUND_GIVEN_NAME[listCompoundGender[i]];
    const listEra = Object.keys(eraMap);
    for (let j = 0; j < listEra.length; j += 1) {
      const listName = eraMap[listEra[j]];
      for (let k = 0; k < listName.length; k += 1) {
        setCompound.add(listName[k]);
      }
    }
  }

  // Count unique middle names
  const setMiddle = new Set<string>();
  const listMiddleGender = Object.keys(INDEX_MIDDLE_NAME);
  for (let i = 0; i < listMiddleGender.length; i += 1) {
    const regionMap = INDEX_MIDDLE_NAME[listMiddleGender[i]];
    const listReg = Object.keys(regionMap);
    for (let j = 0; j < listReg.length; j += 1) {
      const eraMap = regionMap[listReg[j]];
      const listEra = Object.keys(eraMap);
      for (let k = 0; k < listEra.length; k += 1) {
        const listName = eraMap[listEra[k]];
        for (let l = 0; l < listName.length; l += 1) {
          setMiddle.add(listName[l]);
        }
      }
    }
  }

  return {
    totalSurnames: setSurname.size,
    totalGivenNames: setGivenName.size,
    totalCompoundNames: setCompound.size,
    totalMiddleNames: setMiddle.size,
  };
}

/**
 * Get the top N most common Vietnamese surnames ranked by frequency weight.
 * When a region is specified, uses that region's weights; otherwise averages across all regions.
 *
 * @param options - Optional filters: region ('north'|'central'|'south') and limit (default 10)
 * @returns Array of ranked surname entries sorted by weight descending
 * @example
 * ```typescript
 * getTopSurnames({ limit: 3 });
 * // [{ name: 'Nguyen', weight: 38.4 }, { name: 'Tran', weight: 11.2 }, ...]
 * getTopSurnames({ region: 'south', limit: 2 });
 * // [{ name: 'Nguyen', weight: 40.1 }, { name: 'Tran', weight: 10.8 }]
 * ```
 */
export function getTopSurnames(options?: { region?: string; limit?: number }): IRankedName[] {
  const limit = options?.limit ?? 10;
  const region = options?.region;

  if (region) {
    const listEntry = INDEX_SURNAME[region];
    if (!listEntry) {
      return [];
    }
    const listSorted = [...listEntry].sort((a, b) => b.weight - a.weight);
    const listResult: IRankedName[] = [];
    const count = Math.min(limit, listSorted.length);
    for (let i = 0; i < count; i += 1) {
      listResult.push({ name: listSorted[i].value, weight: listSorted[i].weight });
    }
    return listResult;
  }

  // Average weights across all regions
  const mapWeight = new Map<string, { total: number; count: number }>();
  const listRegion = Object.keys(INDEX_SURNAME);
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      const existing = mapWeight.get(listEntry[j].value);
      if (existing) {
        existing.total += listEntry[j].weight;
        existing.count += 1;
      } else {
        mapWeight.set(listEntry[j].value, { total: listEntry[j].weight, count: 1 });
      }
    }
  }

  const listAveraged: IRankedName[] = [];
  mapWeight.forEach((data, name) => {
    listAveraged.push({
      name,
      weight: Math.round((data.total / data.count) * 100) / 100,
    });
  });

  listAveraged.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));

  return listAveraged.slice(0, limit);
}

/**
 * Count given names in the dataset, optionally filtered by gender, region, and/or era.
 * Returns the total count across all matching combinations.
 *
 * @param options - Optional filters: gender ('male'|'female'), region ('north'|'central'|'south'), era
 * @returns Number of given name entries matching the filters
 * @example
 * ```typescript
 * getGivenNameCount({ gender: 'female', region: 'north' });
 * // 245
 * getGivenNameCount();
 * // 1800 (total across all combinations)
 * ```
 */
export function getGivenNameCount(options?: { gender?: string; region?: string; era?: string }): number {
  const index = givenNameIndex();
  const gender = options?.gender;
  const region = options?.region;
  const era = options?.era;

  // If all three specified, return direct count
  if (gender && region && era) {
    const regionMap = index[gender];
    if (!regionMap) {
      return 0;
    }
    const eraMap = regionMap[region];
    if (!eraMap) {
      return 0;
    }
    const listEntry = eraMap[era];
    return listEntry ? listEntry.length : 0;
  }

  // Otherwise, count across matching combos
  let total = 0;
  const listGender = gender ? [gender] : Object.keys(index);
  for (let i = 0; i < listGender.length; i += 1) {
    const regionMap = index[listGender[i]];
    if (!regionMap) {
      continue;
    }
    const listReg = region ? [region] : Object.keys(regionMap);
    for (let j = 0; j < listReg.length; j += 1) {
      const eraMap = regionMap[listReg[j]];
      if (!eraMap) {
        continue;
      }
      const listEra = era ? [era] : Object.keys(eraMap);
      for (let k = 0; k < listEra.length; k += 1) {
        const listEntry = eraMap[listEra[k]];
        if (listEntry) {
          total += listEntry.length;
        }
      }
    }
  }

  return total;
}

/**
 * Get a sorted list of unique given names from the dataset, optionally filtered
 * by gender and limited to a maximum number of results.
 *
 * @param options - Optional filters: gender ('male'|'female') and result limit
 * @returns Alphabetically sorted array of unique Vietnamese given names
 * @example
 * ```typescript
 * getUniqueGivenNames({ gender: 'female', limit: 3 });
 * // ['An', 'Anh', 'Bach']
 * getUniqueGivenNames({ limit: 5 });
 * // ['An', 'Anh', 'Bach', 'Bao', 'Binh']
 * ```
 */
export function getUniqueGivenNames(options?: { gender?: string; limit?: number }): string[] {
  const index = givenNameIndex();
  const gender = options?.gender;
  const limit = options?.limit;

  const setName = new Set<string>();
  const listGender = gender ? [gender] : Object.keys(index);

  for (let i = 0; i < listGender.length; i += 1) {
    const regionMap = index[listGender[i]];
    if (!regionMap) {
      continue;
    }
    const listReg = Object.keys(regionMap);
    for (let j = 0; j < listReg.length; j += 1) {
      const eraMap = regionMap[listReg[j]];
      const listEra = Object.keys(eraMap);
      for (let k = 0; k < listEra.length; k += 1) {
        const listEntry = eraMap[listEra[k]];
        for (let l = 0; l < listEntry.length; l += 1) {
          setName.add(listEntry[l].value);
        }
      }
    }
  }

  const listResult = Array.from(setName).sort();

  if (limit) {
    return listResult.slice(0, limit);
  }

  return listResult;
}
