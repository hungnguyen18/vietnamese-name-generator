import { mulberry32, pickRandom } from './random';

export type TNicknameCategory = 'animal' | 'descriptor' | 'ordinal' | 'food' | 'endearment';

export interface INicknameOptions {
  category?: TNicknameCategory;
  seed?: number;
}

export interface INicknameResult {
  nickname: string;
  category: TNicknameCategory;
  meaning: string;
  culturalNote: string;
}

type TNicknameEntry = {
  nickname: string;
  meaning: string;
};

const NICKNAME_DATA: Record<TNicknameCategory, TNicknameEntry[]> = {
  animal: [
    { nickname: 'C\u00f3c', meaning: 'toad' },
    { nickname: 'T\u00fd', meaning: 'mouse' },
    { nickname: 'Ch\u00ed', meaning: 'louse' },
    { nickname: 'M\u00e8o', meaning: 'cat' },
    { nickname: 'B\u00f2', meaning: 'cow' },
    { nickname: 'G\u00e0', meaning: 'chicken' },
    { nickname: 'V\u1ecbt', meaning: 'duck' },
    { nickname: 'C\u00fan', meaning: 'puppy' },
    { nickname: 'Heo', meaning: 'pig' },
    { nickname: 'Ki\u1ebfn', meaning: 'ant' },
    { nickname: '\u1ed0c', meaning: 'snail' },
    { nickname: 'Cua', meaning: 'crab' },
    { nickname: 'T\u00f4m', meaning: 'shrimp' },
    { nickname: 'S\u00e2u', meaning: 'worm' },
    { nickname: 'B\u1ecd', meaning: 'beetle' },
  ],
  descriptor: [
    { nickname: '\u0110en', meaning: 'dark' },
    { nickname: 'G\u1ea7y', meaning: 'skinny' },
    { nickname: 'M\u1eadp', meaning: 'chubby' },
    { nickname: 'L\u00f9n', meaning: 'short' },
    { nickname: 'X\u1ea5u', meaning: 'ugly' },
    { nickname: '\u0110\u1eb9t', meaning: 'flat' },
    { nickname: 'L\u00e9', meaning: 'cross-eyed' },
    { nickname: 'S\u00fan', meaning: 'gap-toothed' },
    { nickname: 'Gh\u1ebb', meaning: 'scabby' },
    { nickname: 'Tr\u00f2n', meaning: 'round' },
  ],
  ordinal: [
    { nickname: 'Hai', meaning: 'second' },
    { nickname: 'Ba', meaning: 'third' },
    { nickname: 'T\u01b0', meaning: 'fourth' },
    { nickname: 'N\u0103m', meaning: 'fifth' },
    { nickname: 'S\u00e1u', meaning: 'sixth' },
    { nickname: 'B\u1ea3y', meaning: 'seventh' },
    { nickname: 'T\u00e1m', meaning: 'eighth' },
    { nickname: '\u00dat', meaning: 'youngest' },
  ],
  food: [
    { nickname: 'B\u1eafp', meaning: 'corn' },
    { nickname: '\u0110\u1eadu', meaning: 'bean' },
    { nickname: 'Khoai', meaning: 'potato' },
    { nickname: 'M\u00edt', meaning: 'jackfruit' },
    { nickname: 'Xo\u00e0i', meaning: 'mango' },
    { nickname: 'B\u01b0\u1edfi', meaning: 'pomelo' },
    { nickname: 'B\u00ed', meaning: 'pumpkin' },
    { nickname: 'Na', meaning: 'custard apple' },
    { nickname: '\u1ed4i', meaning: 'guava' },
    { nickname: 'Cam', meaning: 'orange' },
    { nickname: 'M\u1eadn', meaning: 'plum' },
    { nickname: 'Nh\u00e3n', meaning: 'longan' },
  ],
  endearment: [
    { nickname: 'T\u00ed', meaning: 'tiny' },
    { nickname: 'B\u00e9', meaning: 'small' },
    { nickname: 'Cu', meaning: 'boy' },
    { nickname: 'B\u1ed1ng', meaning: 'fish' },
    { nickname: 'B\u00f4ng', meaning: 'cotton' },
    { nickname: 'B\u00fan', meaning: 'noodle' },
    { nickname: 'Bim', meaning: 'snack' },
    { nickname: 'Bin', meaning: 'baby' },
    { nickname: 'G\u1ea5u', meaning: 'bear' },
    { nickname: 'B\u1ecd', meaning: 'bug' },
  ],
};

const CULTURAL_NOTE: Record<TNicknameCategory, string> = {
  animal: 'Named after animals considered lowly to make evil spirits think the child is worthless',
  descriptor: 'Deliberately unflattering names to ward off jealous spirits',
  ordinal: 'Birth order names \u2014 practical and humble',
  food: 'Simple, earthy food names \u2014 humble origins protect the child',
  endearment: 'Cute diminutive names used at home \u2014 the modern evolution of t\u00ean x\u1ea5u',
};

const LIST_CATEGORY: TNicknameCategory[] = ['animal', 'descriptor', 'ordinal', 'food', 'endearment'];

/**
 * Generate a traditional Vietnamese protective nickname (ten xau de nuoi).
 * These deliberately unflattering names are given to ward off evil spirits,
 * a longstanding Vietnamese cultural practice.
 *
 * @param options - Optional generation settings: category and seed for deterministic output
 * @returns Nickname result with the name, category, meaning, and cultural context
 * @example
 * ```typescript
 * generateNickname({ category: 'animal' });
 * // { nickname: 'Coc', category: 'animal', meaning: 'toad', culturalNote: '...' }
 * generateNickname({ seed: 42 });
 * // deterministic output based on seed
 * ```
 */
export function generateNickname(options?: INicknameOptions): INicknameResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;
  const category = options?.category ?? pickRandom(LIST_CATEGORY, rng);
  const listEntry = NICKNAME_DATA[category];
  const entry = pickRandom(listEntry, rng);

  return {
    nickname: entry.nickname,
    category,
    meaning: entry.meaning,
    culturalNote: CULTURAL_NOTE[category],
  };
}
