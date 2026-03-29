import type { IRawNameEntry } from "../types";

export interface IValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalEntries: number;
    surnames: number;
    givenNames: number;
    middleNames: number;
    compoundGivenNames: number;
    withGender: number;
    withMeaning: number;
    withFrequency: number;
    withCategory: number;
  };
}

export function entriesValidate(entries: IRawNameEntry[]): IValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stats = {
    totalEntries: entries.length,
    surnames: 0,
    givenNames: 0,
    middleNames: 0,
    compoundGivenNames: 0,
    withGender: 0,
    withMeaning: 0,
    withFrequency: 0,
    withCategory: 0,
  };

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];

    if (entry.value !== entry.value.normalize("NFC")) {
      errors.push(`Entry "${entry.value}" is not NFC-normalized`);
    }

    if (entry.value.trim().length === 0) {
      errors.push(`Entry at index ${i} has empty value`);
    }

    switch (entry.type) {
      case "surname":
        stats.surnames += 1;
        break;
      case "givenName":
        stats.givenNames += 1;
        break;
      case "middleName":
        stats.middleNames += 1;
        break;
      case "compoundGivenName":
        stats.compoundGivenNames += 1;
        break;
    }

    if (entry.gender) {
      stats.withGender += 1;
    }
    if (entry.meaning) {
      stats.withMeaning += 1;
    }
    if (entry.frequency) {
      stats.withFrequency += 1;
    }
    if (entry.category) {
      stats.withCategory += 1;
    }
  }

  if (stats.surnames < 10) {
    warnings.push(`Only ${stats.surnames} surnames found (expected 100+)`);
  }
  if (stats.givenNames < 100) {
    warnings.push(
      `Only ${stats.givenNames} given names found (expected 1000+)`,
    );
  }

  const givenNamesWithoutGender = entries.filter(
    (e) => e.type === "givenName" && !e.gender,
  ).length;
  if (givenNamesWithoutGender > 0) {
    warnings.push(`${givenNamesWithoutGender} given names without gender tag`);
  }

  console.log("[validate] Stats:", JSON.stringify(stats, null, 2));
  if (errors.length > 0) {
    console.error(`[validate] ${errors.length} errors found`);
  }
  if (warnings.length > 0) {
    console.warn(`[validate] ${warnings.length} warnings`);
  }

  return { valid: errors.length === 0, errors, warnings, stats };
}
