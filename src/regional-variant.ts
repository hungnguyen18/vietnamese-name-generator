import { ERegion } from './types';
import { romanize } from './romanize';

type TVariantEntry = {
  region: ERegion;
  variant: Record<string, string>;
};

const VARIANT_MAP: TVariantEntry[] = [
  {
    region: ERegion.North,
    variant: { [ERegion.South]: 'Huỳnh' },
  },
  {
    region: ERegion.South,
    variant: { [ERegion.North]: 'Hoàng', [ERegion.Central]: 'Hoàng' },
  },
  {
    region: ERegion.North,
    variant: { [ERegion.South]: 'Võ' },
  },
  {
    region: ERegion.South,
    variant: { [ERegion.North]: 'Vũ', [ERegion.Central]: 'Vũ' },
  },
];

type TLookupEntry = {
  sourceRegion: ERegion;
  variant: Record<string, string>;
};

function buildLookup(): Map<string, TLookupEntry> {
  const lookup = new Map<string, TLookupEntry>();
  const listSurname = ['Hoàng', 'Huỳnh', 'Vũ', 'Võ'];

  for (let i = 0; i < listSurname.length; i += 1) {
    const surname = listSurname[i];
    const entry = VARIANT_MAP[i];
    const romanized = romanize(surname).toLowerCase();

    const lookupEntry: TLookupEntry = {
      sourceRegion: entry.region,
      variant: entry.variant,
    };

    lookup.set(surname, lookupEntry);
    lookup.set(surname.toLowerCase(), lookupEntry);
    lookup.set(romanized, lookupEntry);
  }

  return lookup;
}

const LOOKUP = buildLookup();

/**
 * Convert a Vietnamese surname to its regional variant (e.g. Hoang <-> Huynh, Vu <-> Vo).
 * Returns the original surname if no variant exists for the target region.
 * Supports both diacritical and romanized (ASCII) input.
 *
 * @param surname - Vietnamese surname to convert (e.g. "Hoang", "Vu")
 * @param targetRegion - Target region to get the variant for
 * @returns The regional variant of the surname, or the original if no variant exists
 * @example
 * ```typescript
 * getRegionalVariant('Hoang', ERegion.South); // 'Huynh'
 * getRegionalVariant('Vu', ERegion.South);    // 'Vo'
 * getRegionalVariant('Tran', ERegion.North);  // 'Tran' (no variant)
 * ```
 */
export function getRegionalVariant(surname: string, targetRegion: ERegion): string {
  const entry = LOOKUP.get(surname) || LOOKUP.get(surname.toLowerCase());

  if (!entry) {
    return surname;
  }

  if (entry.sourceRegion === targetRegion) {
    return surname;
  }

  // Central shares the same forms as North for these surnames
  if (targetRegion === ERegion.Central && !entry.variant[ERegion.Central]) {
    return surname;
  }

  return entry.variant[targetRegion] || surname;
}
