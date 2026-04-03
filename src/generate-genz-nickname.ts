import { xoroshiro128plus, pickRandom } from './random';
import { romanize } from './romanize';
import { parseName } from './parse-name';
import { generate } from './generator';
import { EGender } from './types';
import {
  type TGenZNicknameStyle,
  NICKNAME_TEMPLATES,
  CUTE_ANIMALS,
  CUTE_FOODS,
  MEME_PHRASES,
  FUNNY_TITLES,
  WESTERN_MALE,
  WESTERN_FEMALE,
  HANDLE_PREFIXES,
  CULTURAL_NOTES,
} from './data/genz-nickname-patterns';

export type { TGenZNicknameStyle } from './data/genz-nickname-patterns';

export interface IGenZNicknameOptions {
  name?: string;
  style?: TGenZNicknameStyle;
  gender?: 'male' | 'female' | 'unisex';
  seed?: number;
  secure?: boolean;
}

export interface IGenZNicknameResult {
  nickname: string;
  style: TGenZNicknameStyle;
  origin: string;
  culturalNote: string;
}

const LIST_STYLE: TGenZNicknameStyle[] = [
  'social-handle', 'jp-suffix', 'kr-suffix', 'cute', 'meme', 'english-viet',
];

const ORIGIN_MAP: Record<TGenZNicknameStyle, string> = {
  'social-handle': 'vietnamese-social-media',
  'jp-suffix': 'japanese-honorific',
  'kr-suffix': 'korean-honorific',
  'cute': 'vietnamese-cute-tradition',
  'meme': 'vietnamese-internet-meme',
  'english-viet': 'viet-diaspora-english',
};

type TNameParts = { surname: string; middleName: string; givenName: string };

function nameParsedOrGenerate(
  inputName: string | undefined,
  gender: 'male' | 'female' | 'unisex' | undefined,
  rng?: () => number,
): TNameParts {
  if (inputName) {
    const parsed = parseName(inputName);
    return { surname: parsed.surname, middleName: parsed.middleName, givenName: parsed.givenName };
  }
  const g = gender === 'male' ? EGender.Male
    : gender === 'female' ? EGender.Female
    : undefined;
  const result = generate({ gender: g, seed: rng ? Math.floor(rng() * 2147483647) : undefined });
  return { surname: result.surname, middleName: result.middleName, givenName: result.givenName };
}

function syllableDouble(name: string): string {
  const romanized = romanize(name).toLowerCase();
  const first = romanized.length <= 2 ? romanized : romanized.slice(0, 2);
  const cap = first.charAt(0).toUpperCase() + first.slice(1);
  return cap + cap.toLowerCase();
}

function templateResolve(
  template: string,
  parts: TNameParts,
  gender: 'male' | 'female',
  rng?: () => number,
): string {
  const givenRomanized = romanize(parts.givenName).toLowerCase();
  const surnameRomanized = romanize(parts.surname);
  const year = String(2000 + Math.floor((rng ?? Math.random)() * 10)).slice(2);
  const rand2 = String(Math.floor((rng ?? Math.random)() * 100)).padStart(2, '0');

  let result = template;
  result = result.replace(/\{given\}/g, parts.givenName);
  result = result.replace(/\{given_lower\}/g, givenRomanized);
  result = result.replace(/\{surname\}/g, surnameRomanized);
  result = result.replace(/\{middle\}/g, romanize(parts.middleName));
  result = result.replace(/\{initial\}/g, givenRomanized.charAt(0));
  result = result.replace(/\{year\}/g, year);
  result = result.replace(/\{rand2\}/g, rand2);
  result = result.replace(/\{prefix\}/g, pickRandom(HANDLE_PREFIXES, rng));
  result = result.replace(/\{animal\}/g, pickRandom(CUTE_ANIMALS, rng));
  result = result.replace(/\{food\}/g, pickRandom(CUTE_FOODS, rng));
  result = result.replace(/\{meme_phrase\}/g, pickRandom(MEME_PHRASES, rng));
  result = result.replace(/\{funny_title\}/g, pickRandom(FUNNY_TITLES, rng));

  const westernList = gender === 'female' ? WESTERN_FEMALE : WESTERN_MALE;
  result = result.replace(/\{western\}/g, pickRandom(westernList, rng));

  return result;
}

export function generateGenZNickname(options?: IGenZNicknameOptions): IGenZNicknameResult {
  const rng = options?.seed !== undefined ? xoroshiro128plus(options.seed) : undefined;
  const style = options?.style ?? pickRandom(LIST_STYLE, rng);
  const gender = options?.gender ?? 'unisex';
  const parts = nameParsedOrGenerate(options?.name, gender, rng);

  const templates = NICKNAME_TEMPLATES[style];
  const template = pickRandom(templates, rng);

  let nickname: string;

  if (style === 'cute' && template === '{syl}{syl}') {
    nickname = syllableDouble(parts.givenName);
  } else {
    nickname = templateResolve(template, parts, gender === 'unisex' ? 'male' : gender, rng);
  }

  return {
    nickname,
    style,
    origin: ORIGIN_MAP[style],
    culturalNote: CULTURAL_NOTES[style],
  };
}
