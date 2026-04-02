import type { IGenderResult } from './types';
import { EGender } from './types';
import { INDEX_MIDDLE_NAME } from './data/middle-name';
import { givenNameIndex } from './data/given-name-compact';

/**
 * Collect all middle names that appear under a given gender key
 * across all regions and eras.
 */
function middleNameSetCollect(genderKey: string): Set<string> {
  const result = new Set<string>();
  const regionMap = INDEX_MIDDLE_NAME[genderKey];
  if (!regionMap) return result;
  for (const region of Object.keys(regionMap)) {
    for (const era of Object.keys(regionMap[region])) {
      for (const name of regionMap[region][era]) {
        result.add(name);
      }
    }
  }
  return result;
}

/**
 * Collect all given names that appear under a given gender key
 * across all regions and eras.
 */
function givenNameSetCollect(genderKey: string): Set<string> {
  const result = new Set<string>();
  const index = givenNameIndex();
  const regionMap = index[genderKey];
  if (!regionMap) return result;
  for (const region of Object.keys(regionMap)) {
    for (const era of Object.keys(regionMap[region])) {
      for (const entry of regionMap[region][era]) {
        result.add(entry.value);
      }
    }
  }
  return result;
}

let middleNameCache: { male: Set<string>; female: Set<string>; unisex: Set<string> } | null = null;
let givenNameCache: { male: Set<string>; female: Set<string>; unisex: Set<string> } | null = null;

function middleNameSets() {
  if (!middleNameCache) {
    middleNameCache = {
      male: middleNameSetCollect(EGender.Male),
      female: middleNameSetCollect(EGender.Female),
      unisex: middleNameSetCollect(EGender.Unisex),
    };
  }
  return middleNameCache;
}

function givenNameSets() {
  if (!givenNameCache) {
    givenNameCache = {
      male: givenNameSetCollect(EGender.Male),
      female: givenNameSetCollect(EGender.Female),
      unisex: givenNameSetCollect(EGender.Unisex),
    };
  }
  return givenNameCache;
}

function middleNameGenderDetect(name: string): EGender | 'unknown' {
  const sets = middleNameSets();
  const inMale = sets.male.has(name);
  const inFemale = sets.female.has(name);
  const inUnisex = sets.unisex.has(name);

  // Exclusive signals: appears in only one gendered list and not the other
  if (inMale && !inFemale && !inUnisex) return EGender.Male;
  if (inFemale && !inMale && !inUnisex) return EGender.Female;
  if (inUnisex && !inMale && !inFemale) return EGender.Unisex;

  // Mixed signals — name appears in multiple gender lists
  if (inMale && !inFemale) return EGender.Male;
  if (inFemale && !inMale) return EGender.Female;
  if (inMale || inFemale || inUnisex) return EGender.Unisex;

  return 'unknown';
}

function givenNameGenderDetect(name: string): EGender | 'unknown' {
  const sets = givenNameSets();
  const inMale = sets.male.has(name);
  const inFemale = sets.female.has(name);
  const inUnisex = sets.unisex.has(name);

  if (inMale && !inFemale && !inUnisex) return EGender.Male;
  if (inFemale && !inMale && !inUnisex) return EGender.Female;
  if (inUnisex && !inMale && !inFemale) return EGender.Unisex;

  if (inMale && !inFemale) return EGender.Male;
  if (inFemale && !inMale) return EGender.Female;
  if (inMale || inFemale || inUnisex) return EGender.Unisex;

  return 'unknown';
}

function nameParse(input: string): { surname: string; middleName: string; givenName: string } {
  const parts = input.trim().split(/\s+/);
  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
    return { surname: '', middleName: '', givenName: '' };
  }
  if (parts.length === 1) {
    return { surname: '', middleName: '', givenName: parts[0] };
  }
  if (parts.length === 2) {
    return { surname: parts[0], middleName: '', givenName: parts[1] };
  }
  // surname is first, middle name is second, given name is the rest
  return {
    surname: parts[0],
    middleName: parts[1],
    givenName: parts.slice(2).join(' '),
  };
}

/**
 * Detect the likely gender of a Vietnamese name.
 *
 * @param input - A Vietnamese full name string (e.g. "Nguyễn Thị Mai")
 * @returns An IGenderResult with gender, confidence, and individual signals
 */
export function detectGender(input: string): IGenderResult {
  const unknown: IGenderResult = { gender: 'unknown', confidence: 'low', signals: {} };

  if (!input || !input.trim()) {
    return unknown;
  }

  const { middleName, givenName } = nameParse(input);

  const signals: IGenderResult['signals'] = {};

  // Signal 1: Middle name
  let middleSignal: EGender | 'unknown' = 'unknown';
  if (middleName) {
    middleSignal = middleNameGenderDetect(middleName);
    signals.middleName = { gender: middleSignal, value: middleName };
  }

  // Signal 2: Given name
  let givenSignal: EGender | 'unknown' = 'unknown';
  if (givenName) {
    givenSignal = givenNameGenderDetect(givenName);
    signals.givenName = { gender: givenSignal, value: givenName };
  }

  // Combine signals: middle name is strongest
  // A middle name is "exclusive" if it appears in only one gender's middle-name
  // lists (not shared across male/female/unisex). Exclusive middle names are
  // high-confidence indicators.
  const sets = middleNameSets();
  const exclusiveMiddle = middleName !== '' && (
    (sets.male.has(middleName) && !sets.female.has(middleName) && !sets.unisex.has(middleName)) ||
    (sets.female.has(middleName) && !sets.male.has(middleName) && !sets.unisex.has(middleName))
  );

  // If middle name gives a definitive male/female signal
  if (middleSignal === EGender.Male || middleSignal === EGender.Female) {
    if (exclusiveMiddle) {
      return { gender: middleSignal, confidence: 'high', signals };
    }
    // Non-exclusive but still gendered middle name
    return { gender: middleSignal, confidence: 'medium', signals };
  }

  // Middle name is unisex or unknown — rely on given name
  if (givenSignal === EGender.Male || givenSignal === EGender.Female) {
    const confidence = middleSignal === 'unknown' && !middleName ? 'low' : 'low';
    return { gender: givenSignal, confidence, signals };
  }

  // Both signals are unisex or unknown
  if (middleSignal === EGender.Unisex || givenSignal === EGender.Unisex) {
    return { gender: EGender.Unisex, confidence: 'low', signals };
  }

  return { gender: 'unknown', confidence: 'low', signals };
}
