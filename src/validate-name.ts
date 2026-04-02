import type { IValidationResult } from './types';
import { INDEX_SURNAME } from './data/surname';
import { romanize } from './romanize';

const VIETNAMESE_NAME_REGEX = /^[\p{L}\s]+$/u;
const MAX_PARTS = 6;
const MIN_PARTS = 2;

function surnameSetBuild(): { vietnamese: Set<string>; romanized: Set<string> } {
  const vietnamese = new Set<string>();
  const romanized = new Set<string>();

  const listRegion = Object.keys(INDEX_SURNAME);
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      const value = listEntry[j].value;
      vietnamese.add(value);
      romanized.add(romanize(value));
    }
  }

  return { vietnamese, romanized };
}

const SURNAME_SET = surnameSetBuild();

function surnameMatch(listPart: string[]): { matched: boolean; surnameLength: number; surname: string } {
  // Try compound surname first (2 words)
  if (listPart.length >= 2) {
    const compound = `${listPart[0]} ${listPart[1]}`;
    if (SURNAME_SET.vietnamese.has(compound) || SURNAME_SET.romanized.has(compound)) {
      return { matched: true, surnameLength: 2, surname: compound };
    }
  }

  // Try single surname
  const single = listPart[0];
  if (SURNAME_SET.vietnamese.has(single) || SURNAME_SET.romanized.has(single)) {
    return { matched: true, surnameLength: 1, surname: single };
  }

  return { matched: false, surnameLength: 0, surname: single };
}

export function validateName(input: string): IValidationResult {
  const listReason: string[] = [];

  // Rule 1: Must be non-empty string after trim
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { valid: false, reasons: ['Name must not be empty'] };
  }

  // Rule 4: Must contain only Vietnamese alphabet characters (Unicode letters + spaces)
  if (!VIETNAMESE_NAME_REGEX.test(trimmed)) {
    listReason.push('Name must contain only Vietnamese alphabet characters and spaces');
  }

  // Split into parts
  const listPart = trimmed.split(/\s+/);

  // Rule 2: Must have at least 2 parts
  if (listPart.length < MIN_PARTS) {
    listReason.push(`Name must have at least ${MIN_PARTS} parts (surname and given name)`);
  }

  // Rule 6: Maximum 6 parts
  if (listPart.length > MAX_PARTS) {
    listReason.push(`Name must have at most ${MAX_PARTS} parts`);
  }

  // Rule 5: Each part must start with uppercase
  for (let i = 0; i < listPart.length; i += 1) {
    const part = listPart[i];
    if (part.length > 0 && part[0] !== part[0].toUpperCase()) {
      listReason.push('Each part of the name must start with an uppercase letter');
      break;
    }
  }

  // Rule 3: First word (or first 2 words for compound) must be a known surname
  if (listPart.length >= MIN_PARTS) {
    const result = surnameMatch(listPart);
    if (!result.matched) {
      listReason.push(`Unknown surname: ${result.surname}`);
    }
  }

  return {
    valid: listReason.length === 0,
    reasons: listReason,
  };
}
