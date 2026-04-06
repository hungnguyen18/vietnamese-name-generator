import { givenNameIndex, type TCompactGivenNameEntry } from './data/given-name-compact';
import { INDEX_COMPOUND_GIVEN_NAME } from './data/compound-given-name';
import { romanize } from './romanize';

export interface INameMeaning {
  name: string;
  found: boolean;
  category?: string;
  genders: string[];
  regions: string[];
  eras: string[];
  isCompound: boolean;
}

/**
 * Look up cultural metadata for a Vietnamese given name, including which genders,
 * regions, and eras it appears in, and whether it is a compound name.
 *
 * @param name - Vietnamese given name to look up (e.g. "Minh", "Thanh Huong")
 * @returns Name meaning result with gender/region/era usage and compound status
 * @example
 * ```typescript
 * getMeaning('Minh');
 * // { name: 'Minh', found: true, genders: ['male','female'], regions: ['north','south'], ... }
 * getMeaning('xyz');
 * // { name: 'xyz', found: false, genders: [], regions: [], eras: [], isCompound: false }
 * ```
 */
export function getMeaning(name: string): INameMeaning {
  const result: INameMeaning = {
    name,
    found: false,
    genders: [],
    regions: [],
    eras: [],
    isCompound: false,
  };

  if (!name || name.trim().length === 0) {
    return result;
  }

  const trimmed = name.trim();
  const romanized = romanize(trimmed).toLowerCase();

  const listGender = new Set<string>();
  const listRegion = new Set<string>();
  const listEra = new Set<string>();
  let category: string | undefined;

  // Search through givenNameIndex across all gender/region/era combinations
  const index = givenNameIndex();
  for (const gender of Object.keys(index)) {
    for (const region of Object.keys(index[gender])) {
      for (const era of Object.keys(index[gender][region])) {
        const listEntry: TCompactGivenNameEntry[] = index[gender][region][era];
        for (let i = 0; i < listEntry.length; i += 1) {
          const entry = listEntry[i];
          if (
            entry.value === trimmed
            || romanize(entry.value).toLowerCase() === romanized
          ) {
            listGender.add(gender);
            listRegion.add(region);
            listEra.add(era);
            if (!category && entry.category) {
              category = entry.category;
            }
          }
        }
      }
    }
  }

  // Search INDEX_COMPOUND_GIVEN_NAME
  for (const gender of Object.keys(INDEX_COMPOUND_GIVEN_NAME)) {
    const eraMap = INDEX_COMPOUND_GIVEN_NAME[gender];
    for (const era of Object.keys(eraMap)) {
      const listName: string[] = eraMap[era];
      for (let i = 0; i < listName.length; i += 1) {
        const compoundName = listName[i];
        if (
          compoundName === trimmed
          || romanize(compoundName).toLowerCase() === romanized
        ) {
          result.isCompound = true;
          listGender.add(gender);
          listEra.add(era);
        }
      }
    }
  }

  result.genders = Array.from(listGender);
  result.regions = Array.from(listRegion);
  result.eras = Array.from(listEra);
  result.found = result.genders.length > 0;

  if (category) {
    result.category = category;
  }

  return result;
}
