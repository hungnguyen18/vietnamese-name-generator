import type { TGenerateOptions, INameResult } from './types';
import { generate } from './generator';
import { mulberry32, pickRandom } from './random';

export interface IUsernameResult {
  username: string;
  name: INameResult;
}

type TPatternFn = (first: string, last: string, rng?: () => number) => string;

const LIST_PATTERN: TPatternFn[] = [
  // firstnamelastname → annguyen
  (first, last) => `${first}${last}`,
  // firstname_lastname → an_nguyen
  (first, last) => `${first}_${last}`,
  // firstname.lastname → an.nguyen
  (first, last) => `${first}.${last}`,
  // lastnameFirstinitial → nguyena
  (first, last) => `${last}${first.charAt(0)}`,
  // firstname + 2-digit number → an42
  (first, _last, rng) => {
    const rand = rng ?? Math.random;
    const num = Math.floor(rand() * 90) + 10;
    return `${first}${num}`;
  },
];

/**
 * Generate a username from a randomly generated Vietnamese name using common
 * username patterns (dot-separated, underscore, initial+surname, etc.).
 *
 * @param options - Optional generation options (gender, region, era, seed)
 * @returns Object containing the generated username and the full name result
 * @example
 * ```typescript
 * generateUsername({ seed: 42 });
 * // { username: 'minh_nguyen', name: { fullName: 'Nguyen Van Minh', ... } }
 * generateUsername();
 * // { username: 'lan.tran', name: { fullName: 'Tran Thi Lan', ... } }
 * ```
 */
export function generateUsername(options?: TGenerateOptions): IUsernameResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;
  const name = generate(options);

  const first = name.romanized.givenName.toLowerCase().replace(/[^a-z]/g, '');
  const last = name.romanized.surname.toLowerCase().replace(/[^a-z]/g, '');

  const pattern = pickRandom(LIST_PATTERN, rng);
  const username = pattern(first, last, rng);

  return { username, name };
}
