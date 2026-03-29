import type { IRawNameEntry, ISourceResult } from "../types";

const SOURCE_NAME = "faker-vi";
const BASE_URL =
  "https://raw.githubusercontent.com/faker-js/faker/main/src/locales/vi/person";

function namesExtract(tsContent: string, arrayName: string): string[] {
  const regex = new RegExp(`${arrayName}\\s*:\\s*\\[([^\\]]+)\\]`, "s");
  const match = tsContent.match(regex);
  if (!match) {
    return [];
  }
  return match[1]
    .split(",")
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
    .filter((s) => s.length > 0 && !s.startsWith("//"));
}

async function fileFetch(filename: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.status}`);
  }
  return response.text();
}

export async function sourceFakerViCrawl(): Promise<ISourceResult> {
  const errors: string[] = [];
  const entries: IRawNameEntry[] = [];

  try {
    const [firstNameContent, lastNameContent] = await Promise.all([
      fileFetch("first_name.ts"),
      fileFetch("last_name.ts"),
    ]);

    const genericNames = namesExtract(firstNameContent, "generic");
    const maleNames = namesExtract(firstNameContent, "male");
    const femaleNames = namesExtract(firstNameContent, "female");

    for (let i = 0; i < genericNames.length; i += 1) {
      entries.push({
        value: genericNames[i],
        type: "givenName",
        gender: "unisex",
        source: SOURCE_NAME,
      });
    }
    for (let i = 0; i < maleNames.length; i += 1) {
      entries.push({
        value: maleNames[i],
        type: "givenName",
        gender: "male",
        source: SOURCE_NAME,
      });
    }
    for (let i = 0; i < femaleNames.length; i += 1) {
      entries.push({
        value: femaleNames[i],
        type: "givenName",
        gender: "female",
        source: SOURCE_NAME,
      });
    }

    const surnames = namesExtract(lastNameContent, "generic");
    for (let i = 0; i < surnames.length; i += 1) {
      entries.push({
        value: surnames[i],
        type: "surname",
        source: SOURCE_NAME,
      });
    }
  } catch (err) {
    errors.push(
      `${SOURCE_NAME}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return { sourceName: SOURCE_NAME, entries, errors };
}
