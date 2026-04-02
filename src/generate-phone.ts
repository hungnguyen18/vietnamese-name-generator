import { mulberry32, pickRandom } from './random';
import { PHONE_PREFIX } from './data/province';

export interface IPhoneOptions {
  carrier?: string;
  format?: 'local' | 'international';
  seed?: number;
}

export interface IPhoneResult {
  number: string;
  carrier: string;
  format: string;
}

export function generatePhone(options?: IPhoneOptions): IPhoneResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : Math.random;
  const format = options?.format ?? 'local';

  const listCarrier = Object.keys(PHONE_PREFIX);
  const carrier = options?.carrier && PHONE_PREFIX[options.carrier]
    ? options.carrier
    : pickRandom(listCarrier, rng);

  const listPrefix = PHONE_PREFIX[carrier];
  const prefix = pickRandom(listPrefix, rng);

  let remaining = '';
  const digitCount = 10 - prefix.length;
  for (let i = 0; i < digitCount; i += 1) {
    remaining += String(Math.floor(rng() * 10));
  }

  const localNumber = `${prefix}${remaining}`;

  const number = format === 'international'
    ? `+84${localNumber.slice(1)}`
    : localNumber;

  return {
    number,
    carrier,
    format,
  };
}
