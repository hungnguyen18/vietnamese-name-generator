import { generate } from './generator';
import { EGender, ERegion } from './types';
import { xoroshiro128plus, pickRandom } from './random';
import { romanize } from './romanize';

export type TGenZStyle = 'short' | 'compound' | 'international';

export interface IGenZOptions {
  gender?: 'male' | 'female' | 'unisex';
  style?: TGenZStyle;
  region?: 'north' | 'central' | 'south';
  seed?: number;
}

export interface IGenZResult {
  surname: string;
  middleName: string;
  givenName: string;
  fullName: string;
  style: TGenZStyle;
  gender: string;
  romanized: { surname: string; middleName: string; givenName: string; fullName: string };
}

const LIST_BINARY_GENDER: Array<'male' | 'female'> = ['male', 'female'];
const LIST_STYLE: TGenZStyle[] = ['short', 'compound', 'international'];

/**
 * @deprecated Use generate({ style: 'japanese' | 'korean' | 'western' | 'hybrid' }) instead.
 * Kept for backward compatibility.
 */
export function generateGenZName(options?: IGenZOptions): IGenZResult {
  const rng = options?.seed !== undefined ? xoroshiro128plus(options.seed) : undefined;
  const gender: 'male' | 'female' | 'unisex' = options?.gender ?? pickRandom(LIST_BINARY_GENDER, rng);
  const style: TGenZStyle = options?.style ?? pickRandom(LIST_STYLE, rng);

  const genderEnum = gender === 'male' ? EGender.Male
    : gender === 'female' ? EGender.Female
    : EGender.Unisex;

  // Map old styles to generate() options:
  // 'international' -> style: 'western' (ASCII-safe crosscultural names)
  // 'compound'      -> compoundName: true (two-part Vietnamese given names with space)
  // 'short'         -> style: 'hybrid' (genz pool — all entries are single-word)
  const mappedStyle = style === 'international' ? 'western' as const
    : style === 'short' ? 'hybrid' as const
    : undefined;

  const result = generate({
    gender: genderEnum,
    region: options?.region as ERegion | undefined,
    style: mappedStyle,
    compoundName: style === 'compound' ? true : undefined,
    seed: options?.seed,
  });

  return {
    surname: result.surname,
    middleName: result.middleName,
    givenName: result.givenName,
    fullName: result.fullName,
    style,
    gender,
    romanized: result.romanized,
  };
}
