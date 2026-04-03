import type { TGenerateOptions, INameResult } from './types';
import { generate } from './generator';
import { mulberry32, pickRandom } from './random';

export interface IEmailResult {
  email: string;
  name: INameResult;
}

export type TEmailOptions = TGenerateOptions & {
  domain?: string;
};

const LIST_DEFAULT_DOMAIN = ['gmail.com', 'yahoo.com', 'outlook.com'];

type TPatternFn = (first: string, middle: string, last: string) => string;

const LIST_EMAIL_PATTERN: TPatternFn[] = [
  (first, _middle, last) => `${first}.${last}`,
  (first, _middle, last) => `${last}.${first}`,
  (first, _middle, last) => `${first}${last}`,
  (first, middle, last) => middle ? `${first}.${middle}.${last}` : `${first}.${last}`,
  (first, _middle, last) => `${first[0]}${last}`,
];

export function generateEmail(options?: TEmailOptions): IEmailResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;

  const nameResult = generate(options);

  const firstName = nameResult.romanized.givenName.toLowerCase().replace(/[^a-z]/g, '');
  const middleName = nameResult.romanized.middleName.toLowerCase().replace(/[^a-z]/g, '');
  const lastName = nameResult.romanized.surname.toLowerCase().replace(/[^a-z]/g, '');

  const domain = options?.domain ?? pickRandom(LIST_DEFAULT_DOMAIN, rng);
  const pattern = pickRandom(LIST_EMAIL_PATTERN, rng);

  const localPart = pattern(firstName, middleName, lastName)
    .replace(/\s+/g, '')
    .toLowerCase();

  return {
    email: `${localPart}@${domain}`,
    name: nameResult,
  };
}
