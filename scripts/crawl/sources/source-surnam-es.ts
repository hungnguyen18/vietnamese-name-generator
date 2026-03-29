import type { IRawNameEntry, ISourceResult } from "../types";

const SOURCE_NAME = "surnam-es";
const PAGE_URL = "https://surnam.es/vietnam";

function surnamesParseHtml(
  html: string,
): Array<{ value: string; count: number }> {
  const results: Array<{ value: string; count: number }> = [];

  const listItemRegex =
    /<li[^>]*>.*?<a[^>]*>([^<]+)<\/a>.*?<span[^>]*>([\d,]+)<\/span>/gi;
  let match = listItemRegex.exec(html);

  while (match) {
    const surname = match[1].trim();
    const count = parseInt(match[2].replace(/,/g, ""), 10);
    if (surname && !isNaN(count)) {
      results.push({ value: surname, count });
    }
    match = listItemRegex.exec(html);
  }

  if (results.length === 0) {
    const simpleRegex = /(\p{L}[\p{L}\s]*?)\s*[-–]\s*([\d,]+)/gu;
    let simpleMatch = simpleRegex.exec(html);
    while (simpleMatch) {
      const surname = simpleMatch[1].trim();
      const count = parseInt(simpleMatch[2].replace(/,/g, ""), 10);
      if (surname.length > 0 && surname.length < 30 && !isNaN(count)) {
        results.push({ value: surname, count });
      }
      simpleMatch = simpleRegex.exec(html);
    }
  }

  return results;
}

export async function sourceSurnamEsCrawl(): Promise<ISourceResult> {
  const errors: string[] = [];
  const entries: IRawNameEntry[] = [];

  try {
    const response = await fetch(PAGE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch surnam.es: ${response.status}`);
    }
    const html = await response.text();
    const surnames = surnamesParseHtml(html);

    let totalPopulation = 0;
    for (let i = 0; i < surnames.length; i += 1) {
      totalPopulation += surnames[i].count;
    }

    for (let i = 0; i < surnames.length; i += 1) {
      const frequency =
        totalPopulation > 0
          ? (surnames[i].count / totalPopulation) * 100
          : undefined;
      entries.push({
        value: surnames[i].value,
        type: "surname",
        source: SOURCE_NAME,
        frequency,
      });
    }
  } catch (err) {
    errors.push(
      `${SOURCE_NAME}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return { sourceName: SOURCE_NAME, entries, errors };
}
