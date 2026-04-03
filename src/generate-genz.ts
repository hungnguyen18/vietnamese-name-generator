import { INDEX_GENZ_GIVEN_NAME, INDEX_GENZ_MIDDLE_NAME } from './data/genz-names';
import { INDEX_SURNAME } from './data/surname';
import { mulberry32, pickRandom, pickWeighted } from './random';
import { romanize } from './romanize';
import { ERegion } from './types';

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
const LIST_REGION: ERegion[] = [ERegion.North, ERegion.Central, ERegion.South];

export function generateGenZName(options?: IGenZOptions): IGenZResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;

  const gender: 'male' | 'female' | 'unisex' = options?.gender ?? pickRandom(LIST_BINARY_GENDER, rng);
  const style: TGenZStyle = options?.style ?? pickRandom(LIST_STYLE, rng);
  const regionKey: ERegion = (options?.region as ERegion) ?? pickRandom(LIST_REGION, rng);

  const surname = pickWeighted(INDEX_SURNAME[regionKey], rng);

  const middleList = INDEX_GENZ_MIDDLE_NAME[gender];
  const middleName = pickRandom(middleList, rng);

  const givenNameList = INDEX_GENZ_GIVEN_NAME[gender]?.[style];
  if (!givenNameList || givenNameList.length === 0) {
    throw new Error(`No GenZ given names found for gender=${gender}, style=${style}`);
  }
  const givenName = pickRandom(givenNameList, rng);

  const fullName = `${surname} ${middleName} ${givenName}`;

  const romanizedSurname = romanize(surname);
  const romanizedMiddleName = romanize(middleName);
  const romanizedGivenName = romanize(givenName);
  const romanizedFullName = `${romanizedSurname} ${romanizedMiddleName} ${romanizedGivenName}`;

  return {
    surname,
    middleName,
    givenName,
    fullName,
    style,
    gender,
    romanized: {
      surname: romanizedSurname,
      middleName: romanizedMiddleName,
      givenName: romanizedGivenName,
      fullName: romanizedFullName,
    },
  };
}
