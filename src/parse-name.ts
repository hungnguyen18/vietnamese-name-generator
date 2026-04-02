import type { IParsedName } from './types';
import { INDEX_SURNAME } from './data/surname';
import { romanize } from './romanize';

const COMPOUND_SURNAMES = [
  'Tôn Thất',
  'Tôn Nữ',
  'Nguyễn Phước',
  'Hoàng Phủ',
  'Âu Dương',
  'Thượng Quan',
  'Tư Mã',
  'Tư Đồ',
  'Gia Cát',
  'Hạ Hầu',
  'Tây Môn',
  'Vũ Văn',
  'Chung Ly',
];

function buildSurnameSet(): Set<string> {
  const set = new Set<string>();
  const listRegion = Object.keys(INDEX_SURNAME);
  for (let i = 0; i < listRegion.length; i += 1) {
    const listEntry = INDEX_SURNAME[listRegion[i]];
    for (let j = 0; j < listEntry.length; j += 1) {
      set.add(listEntry[j].value);
    }
  }
  return set;
}

function buildRomanizedSurnameMap(surnameSet: Set<string>): Map<string, string> {
  const map = new Map<string, string>();
  surnameSet.forEach((surname) => {
    const romanized = romanize(surname).toLowerCase();
    if (!map.has(romanized)) {
      map.set(romanized, surname);
    }
  });
  return map;
}

function buildRomanizedCompoundMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < COMPOUND_SURNAMES.length; i += 1) {
    const romanized = romanize(COMPOUND_SURNAMES[i]).toLowerCase();
    map.set(romanized, COMPOUND_SURNAMES[i]);
  }
  return map;
}

const SURNAME_SET = buildSurnameSet();
const ROMANIZED_SURNAME_MAP = buildRomanizedSurnameMap(SURNAME_SET);
const COMPOUND_SURNAMES_LOWER = COMPOUND_SURNAMES.map((s) => s.toLowerCase());
const ROMANIZED_COMPOUND_MAP = buildRomanizedCompoundMap();

function emptyResult(): IParsedName {
  return { surname: '', middleName: '', givenName: '', fullName: '' };
}

function isSurnameMatch(word: string): boolean {
  if (SURNAME_SET.has(word)) {
    return true;
  }
  const lower = word.toLowerCase();
  return ROMANIZED_SURNAME_MAP.has(lower);
}

function matchCompoundSurname(first: string, second: string): string | null {
  const candidate = `${first} ${second}`;
  const candidateLower = candidate.toLowerCase();

  // Check exact Vietnamese match
  if (COMPOUND_SURNAMES_LOWER.indexOf(candidateLower) !== -1) {
    return candidate;
  }

  // Check romanized match
  const romanized = romanize(candidate).toLowerCase();
  if (ROMANIZED_COMPOUND_MAP.has(romanized)) {
    return candidate;
  }

  return null;
}

export function parseName(input: string): IParsedName {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return emptyResult();
  }

  const listWord = trimmed.split(/\s+/);
  const fullName = listWord.join(' ');

  // Single word
  if (listWord.length === 1) {
    if (isSurnameMatch(listWord[0])) {
      return { surname: listWord[0], middleName: '', givenName: '', fullName };
    }
    return { surname: '', middleName: '', givenName: listWord[0], fullName };
  }

  // Try compound surname (first 2 words)
  if (listWord.length >= 2) {
    const compound = matchCompoundSurname(listWord[0], listWord[1]);
    if (compound !== null) {
      const remaining = listWord.slice(2);
      if (remaining.length === 0) {
        return { surname: compound, middleName: '', givenName: '', fullName };
      }
      if (remaining.length === 1) {
        return { surname: compound, middleName: '', givenName: remaining[0], fullName };
      }
      return {
        surname: compound,
        middleName: remaining[0],
        givenName: remaining.slice(1).join(' '),
        fullName,
      };
    }
  }

  // Try single surname
  if (isSurnameMatch(listWord[0])) {
    if (listWord.length === 2) {
      return { surname: listWord[0], middleName: '', givenName: listWord[1], fullName };
    }
    return {
      surname: listWord[0],
      middleName: listWord[1],
      givenName: listWord.slice(2).join(' '),
      fullName,
    };
  }

  // No surname match — treat entire input as given name
  return { surname: '', middleName: '', givenName: fullName, fullName };
}
