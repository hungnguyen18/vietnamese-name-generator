import type { IRawNameEntry, ISourceResult } from "../types";

const SOURCE_NAME = "github-namedb";
const BASE_URL =
  "https://raw.githubusercontent.com/duyet/vietnamese-namedb/master";

async function fileFetch(filename: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.status}`);
  }
  const text = await response.text();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export async function sourceGithubNamedbCrawl(): Promise<ISourceResult> {
  const errors: string[] = [];
  const entries: IRawNameEntry[] = [];

  try {
    const [boyNames, girlNames] = await Promise.all([
      fileFetch("boy.txt"),
      fileFetch("girl.txt"),
    ]);

    for (let i = 0; i < boyNames.length; i += 1) {
      entries.push({
        value: boyNames[i],
        type: "givenName",
        gender: "male",
        source: SOURCE_NAME,
      });
    }
    for (let i = 0; i < girlNames.length; i += 1) {
      entries.push({
        value: girlNames[i],
        type: "givenName",
        gender: "female",
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
