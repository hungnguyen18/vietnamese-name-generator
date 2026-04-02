import { LIST_PET_NAME, type TPetNameEntry } from './data/pet-name';
import { mulberry32, pickRandom } from './random';

export type TPetNameCategory = 'byColor' | 'byFood' | 'byNature' | 'byLuck' | 'byHumor' | 'byPopCulture' | 'endearment';

export interface IPetNameOptions {
  category?: TPetNameCategory;
  petType?: 'dog' | 'cat';
  furColor?: string;
  seed?: number;
}

export interface IPetNameResult {
  name: string;
  meaning: string;
  category: TPetNameCategory;
  petType?: string;
  furColor?: string;
}

const LIST_CATEGORY: TPetNameCategory[] = [
  'byColor', 'byFood', 'byNature', 'byLuck', 'byHumor', 'byPopCulture', 'endearment',
];

function filterEntry(listEntry: TPetNameEntry[], options?: IPetNameOptions): TPetNameEntry[] {
  let listFiltered = listEntry;

  if (options?.category) {
    listFiltered = listFiltered.filter((entry) => entry.category === options.category);
  }

  if (options?.petType) {
    listFiltered = listFiltered.filter(
      (entry) => !entry.petType || entry.petType === 'any' || entry.petType === options.petType,
    );
  }

  if (options?.furColor) {
    listFiltered = listFiltered.filter((entry) => entry.furColor === options.furColor);
  }

  return listFiltered;
}

export function generatePetName(options?: IPetNameOptions): IPetNameResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;
  const listFiltered = filterEntry(LIST_PET_NAME, options);

  if (listFiltered.length === 0) {
    throw new Error('No pet names match the given filters');
  }

  const entry = pickRandom(listFiltered, rng);

  return {
    name: entry.name,
    meaning: entry.meaning,
    category: entry.category as TPetNameCategory,
    petType: entry.petType,
    furColor: entry.furColor,
  };
}

export function generateManyPetNames(count: number, options?: IPetNameOptions): IPetNameResult[] {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;
  const listFiltered = filterEntry(LIST_PET_NAME, options);

  if (listFiltered.length === 0) {
    throw new Error('No pet names match the given filters');
  }

  const listResult: IPetNameResult[] = [];
  const setUsedIndex = new Set<number>();

  for (let i = 0; i < count; i += 1) {
    if (setUsedIndex.size >= listFiltered.length) {
      setUsedIndex.clear();
    }

    let entry: TPetNameEntry;
    let index: number;
    do {
      index = Math.floor((rng ?? Math.random)() * listFiltered.length);
      entry = listFiltered[index];
    } while (setUsedIndex.has(index) && setUsedIndex.size < listFiltered.length);

    setUsedIndex.add(index);

    listResult.push({
      name: entry.name,
      meaning: entry.meaning,
      category: entry.category as TPetNameCategory,
      petType: entry.petType,
      furColor: entry.furColor,
    });
  }

  return listResult;
}
