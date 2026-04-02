import { romanize } from './romanize';

export const VIETNAMESE_NAME_REGEX = /^[\p{L}\s]+$/u;

export function normalize(input: string): string {
  return input.normalize('NFC');
}

export function accentInsensitiveMatch(text: string, query: string): boolean {
  return romanize(text).toLowerCase().includes(romanize(query).toLowerCase());
}

export function accentInsensitiveEqual(a: string, b: string): boolean {
  return romanize(a).toLowerCase() === romanize(b).toLowerCase();
}
