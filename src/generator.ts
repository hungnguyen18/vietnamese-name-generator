import type { TGenerateOptions, INameResult } from "./types";
import type { TCompactGivenNameEntry } from "./data/given-name-compact";
import { EGender, ERegion, EEra, ENameFormat } from "./types";
import { mulberry32, pickRandom, pickWeighted } from "./random";
import { romanize } from "./romanize";
import { formatName } from "./format";
import { INDEX_SURNAME } from "./data/surname";
import { INDEX_MIDDLE_NAME } from "./data/middle-name";
import { givenNameIndex } from "./data/given-name-compact";
import { INDEX_COMPOUND_GIVEN_NAME } from "./data/compound-given-name";

const LIST_BINARY_GENDER = [EGender.Male, EGender.Female];
const LIST_REGION = [ERegion.North, ERegion.Central, ERegion.South];
const LIST_ERA = [EEra.Traditional, EEra.Modern];

function optionResolve(options?: TGenerateOptions, rng?: () => number) {
  const gender = options?.gender ?? pickRandom(LIST_BINARY_GENDER, rng);
  const region = options?.region ?? pickRandom(LIST_REGION, rng);
  const era = options?.era ?? pickRandom(LIST_ERA, rng);
  const withMiddleName = options?.withMiddleName ?? true;
  const compoundName = options?.compoundName;
  const meaningCategory = options?.meaningCategory;

  return { gender, region, era, withMiddleName, compoundName, meaningCategory };
}

function givenNamePick(
  gender: EGender,
  region: ERegion,
  era: EEra,
  compoundName: boolean | undefined,
  meaningCategory: string | undefined,
  rng?: () => number,
): string {
  const rand = rng ?? Math.random;
  const useCompound =
    compoundName === true ||
    (compoundName === undefined && era === EEra.Modern && rand() < 0.3);

  if (useCompound) {
    const compoundList = INDEX_COMPOUND_GIVEN_NAME[gender]?.[era];
    if (compoundList && compoundList.length > 0) {
      return pickRandom(compoundList, rng);
    }
  }

  let list: TCompactGivenNameEntry[] =
    givenNameIndex()[gender]?.[region]?.[era] ?? [];

  if (meaningCategory) {
    const filtered = list.filter((entry) => entry.category === meaningCategory);
    if (filtered.length > 0) {
      list = filtered;
    }
  }

  if (list.length === 0) {
    throw new Error(
      `No given names found for gender=${gender}, region=${region}, era=${era}`,
    );
  }

  return pickRandom(list, rng).value;
}

export function generate(options?: TGenerateOptions): INameResult {
  const rng = options?.seed !== undefined ? mulberry32(options.seed) : undefined;
  const { gender, region, era, withMiddleName, compoundName, meaningCategory } =
    optionResolve(options, rng);

  const surname = pickWeighted(INDEX_SURNAME[region], rng);

  let middleName = "";
  if (withMiddleName) {
    const middleList = INDEX_MIDDLE_NAME[gender]?.[region]?.[era];
    if (middleList && middleList.length > 0) {
      middleName = pickRandom(middleList, rng);
    }
  }

  const givenName = givenNamePick(
    gender,
    region,
    era,
    compoundName,
    meaningCategory,
    rng,
  );

  const fullName = middleName
    ? `${surname} ${middleName} ${givenName}`
    : `${surname} ${givenName}`;

  const romanizedSurname = romanize(surname);
  const romanizedMiddleName = romanize(middleName);
  const romanizedGivenName = romanize(givenName);
  const romanizedFullName = romanizedMiddleName
    ? `${romanizedSurname} ${romanizedMiddleName} ${romanizedGivenName}`
    : `${romanizedSurname} ${romanizedGivenName}`;

  const romanized = {
    surname: romanizedSurname,
    middleName: romanizedMiddleName,
    givenName: romanizedGivenName,
    fullName: romanizedFullName,
  };

  const parts = { surname, middleName, givenName, fullName, romanized };

  const formatList = options?.format
    ? Array.isArray(options.format) ? options.format : [options.format]
    : [ENameFormat.Full];

  const formatted: Partial<Record<ENameFormat, string>> = {};
  for (let i = 0; i < formatList.length; i += 1) {
    formatted[formatList[i]] = formatName(parts, formatList[i]);
  }

  return { ...parts, gender, region, era, formatted };
}

export function generateFullName(options?: TGenerateOptions): string {
  return generate(options).fullName;
}

export function generateMany(
  count: number,
  options?: TGenerateOptions,
): INameResult[] {
  if (count <= 0) {
    throw new Error("Count must be greater than 0");
  }

  const resolved = optionResolve(options);
  const surnameCount = INDEX_SURNAME[resolved.region].length;
  const middleCount = resolved.withMiddleName
    ? (INDEX_MIDDLE_NAME[resolved.gender]?.[resolved.region]?.[resolved.era]
        ?.length ?? 1)
    : 1;
  const givenCount =
    givenNameIndex()[resolved.gender]?.[resolved.region]?.[resolved.era]
      ?.length ?? 0;
  const compoundCount =
    INDEX_COMPOUND_GIVEN_NAME[resolved.gender]?.[resolved.era]?.length ?? 0;
  const totalGivenCount = givenCount + compoundCount;
  const maxCombinations = surnameCount * middleCount * totalGivenCount;

  if (count > maxCombinations) {
    throw new Error(
      `Cannot generate ${count} unique names. Maximum possible combinations: ${maxCombinations}`,
    );
  }

  const results: INameResult[] = [];
  const seen = new Set<string>();
  const maxRetries = count * 3;
  let retries = 0;
  let iteration = 0;

  while (results.length < count) {
    const iterSeed = options?.seed !== undefined ? options.seed + iteration : undefined;
    const result = generate({ ...options, seed: iterSeed });
    iteration += 1;
    if (!seen.has(result.fullName)) {
      seen.add(result.fullName);
      results.push(result);
      retries = 0;
    } else {
      retries += 1;
      if (retries > maxRetries) {
        throw new Error(
          `Cannot generate ${count} unique names after ${maxRetries} retries. Generated ${results.length} so far.`,
        );
      }
    }
  }

  return results;
}

export function generateManyFullNames(
  count: number,
  options?: TGenerateOptions,
): string[] {
  return generateMany(count, options).map((r) => r.fullName);
}
