import { parseName } from './parse-name';
import { romanize } from './romanize';
import { getRegionalVariant } from './regional-variant';
import { ERegion } from './types';

export interface ISimilarityResult {
  score: number;
  exactMatch: boolean;
  romanizedMatch: boolean;
  details: {
    surnameMatch: boolean;
    givenNameMatch: boolean;
    middleNameMatch: boolean;
  };
}

const WEIGHT_SURNAME = 0.3;
const WEIGHT_MIDDLE_NAME = 0.2;
const WEIGHT_GIVEN_NAME = 0.5;

const LIST_REGION = [ERegion.North, ERegion.Central, ERegion.South];

function partMatchExact(a: string, b: string): boolean {
  return a === b;
}

function partMatchRomanized(a: string, b: string): boolean {
  if (a.length === 0 && b.length === 0) {
    return true;
  }
  if (a.length === 0 || b.length === 0) {
    return false;
  }
  return romanize(a).toLowerCase() === romanize(b).toLowerCase();
}

function partMatchRegionalVariant(a: string, b: string): boolean {
  if (a.length === 0 || b.length === 0) {
    return false;
  }
  for (let i = 0; i < LIST_REGION.length; i += 1) {
    const variantA = getRegionalVariant(a, LIST_REGION[i]);
    const variantB = getRegionalVariant(b, LIST_REGION[i]);
    if (variantA === variantB) {
      return true;
    }
    if (romanize(variantA).toLowerCase() === romanize(variantB).toLowerCase()) {
      return true;
    }
  }
  return false;
}

function scorePart(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) {
    return 1.0;
  }
  if (a.length === 0 || b.length === 0) {
    return 0.0;
  }
  if (partMatchExact(a, b)) {
    return 1.0;
  }
  if (partMatchRomanized(a, b)) {
    return 0.9;
  }
  if (partMatchRegionalVariant(a, b)) {
    return 0.8;
  }
  return 0.0;
}

function scoreFromParts(
  surname1: string,
  middleName1: string,
  givenName1: string,
  surname2: string,
  middleName2: string,
  givenName2: string,
): number {
  const surnameScore = scorePart(surname1, surname2);
  const middleScore = scorePart(middleName1, middleName2);
  const givenScore = scorePart(givenName1, givenName2);
  return surnameScore * WEIGHT_SURNAME + middleScore * WEIGHT_MIDDLE_NAME + givenScore * WEIGHT_GIVEN_NAME;
}

function buildResult(
  score: number,
  surname1: string,
  middleName1: string,
  givenName1: string,
  surname2: string,
  middleName2: string,
  givenName2: string,
): ISimilarityResult {
  const surnameExact = partMatchExact(surname1, surname2) || (surname1.length === 0 && surname2.length === 0);
  const middleExact = partMatchExact(middleName1, middleName2) || (middleName1.length === 0 && middleName2.length === 0);
  const givenExact = partMatchExact(givenName1, givenName2) || (givenName1.length === 0 && givenName2.length === 0);

  const surnameRomanized = partMatchRomanized(surname1, surname2);
  const middleRomanized = partMatchRomanized(middleName1, middleName2);
  const givenRomanized = partMatchRomanized(givenName1, givenName2);

  return {
    score,
    exactMatch: surnameExact && middleExact && givenExact,
    romanizedMatch: surnameRomanized && middleRomanized && givenRomanized,
    details: {
      surnameMatch: surnameExact || surnameRomanized || partMatchRegionalVariant(surname1, surname2),
      givenNameMatch: givenExact || givenRomanized,
      middleNameMatch: middleExact || middleRomanized,
    },
  };
}

/**
 * Generate all permutations of words in a name string.
 * For names with more than 4 words, only return the original and reversed to avoid explosion.
 */
function listWordPermutation(input: string): string[] {
  const listWord = input.trim().split(/\s+/);
  if (listWord.length <= 1) {
    return [input.trim()];
  }
  if (listWord.length > 4) {
    return [input.trim(), listWord.slice().reverse().join(' ')];
  }
  const result: string[] = [];
  const permute = (arr: string[], current: string[]): void => {
    if (arr.length === 0) {
      result.push(current.join(' '));
      return;
    }
    for (let i = 0; i < arr.length; i += 1) {
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      permute(remaining, current.concat([arr[i]]));
    }
  };
  permute(listWord, []);
  return result;
}

export function nameSimilarity(name1: string, name2: string): ISimilarityResult {
  const parsed1 = parseName(name1);
  const parsed2 = parseName(name2);

  // Collect candidates: [score, surname1, middle1, given1, surname2, middle2, given2]
  type TCandidate = [number, string, string, string, string, string, string];
  const listCandidate: TCandidate[] = [];

  // 1. Direct comparison
  const directScore = scoreFromParts(
    parsed1.surname, parsed1.middleName, parsed1.givenName,
    parsed2.surname, parsed2.middleName, parsed2.givenName,
  );
  listCandidate.push([directScore, parsed1.surname, parsed1.middleName, parsed1.givenName, parsed2.surname, parsed2.middleName, parsed2.givenName]);

  // 2. Try all word permutations of both names to handle order differences
  const listPerm1 = listWordPermutation(name1);
  const listPerm2 = listWordPermutation(name2);

  for (let i = 0; i < listPerm1.length; i += 1) {
    const p1 = parseName(listPerm1[i]);
    const s = scoreFromParts(
      p1.surname, p1.middleName, p1.givenName,
      parsed2.surname, parsed2.middleName, parsed2.givenName,
    );
    listCandidate.push([s, p1.surname, p1.middleName, p1.givenName, parsed2.surname, parsed2.middleName, parsed2.givenName]);
  }

  for (let j = 0; j < listPerm2.length; j += 1) {
    const p2 = parseName(listPerm2[j]);
    const s = scoreFromParts(
      parsed1.surname, parsed1.middleName, parsed1.givenName,
      p2.surname, p2.middleName, p2.givenName,
    );
    listCandidate.push([s, parsed1.surname, parsed1.middleName, parsed1.givenName, p2.surname, p2.middleName, p2.givenName]);
  }

  // 3. Missing middle name comparison
  if (
    (parsed1.middleName.length === 0) !== (parsed2.middleName.length === 0)
  ) {
    const missingMiddleScore = scorePart(parsed1.surname, parsed2.surname) * WEIGHT_SURNAME
      + 1.0 * WEIGHT_MIDDLE_NAME * 0.5
      + scorePart(parsed1.givenName, parsed2.givenName) * WEIGHT_GIVEN_NAME;
    listCandidate.push([missingMiddleScore, parsed1.surname, parsed1.middleName, parsed1.givenName, parsed2.surname, parsed2.middleName, parsed2.givenName]);
  }

  let best: TCandidate = listCandidate[0];
  for (let i = 1; i < listCandidate.length; i += 1) {
    if (listCandidate[i][0] > best[0]) {
      best = listCandidate[i];
    }
  }

  return buildResult(
    Math.round(best[0] * 1000) / 1000,
    best[1], best[2], best[3],
    best[4], best[5], best[6],
  );
}
