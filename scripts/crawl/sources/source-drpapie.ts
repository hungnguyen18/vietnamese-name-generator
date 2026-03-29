import type { IRawNameEntry, ISourceResult } from "../types";

const SOURCE_NAME = "drpapie";

interface IPageConfig {
  url: string;
  gender: "male" | "female";
}

const LIST_PAGE: IPageConfig[] = [
  { url: "https://drpapie.com.vn/ten-cho-be-trai/", gender: "male" },
  { url: "https://drpapie.com.vn/ten-cho-be-gai/", gender: "female" },
];

function namesParseHtml(
  html: string,
  gender: "male" | "female",
): IRawNameEntry[] {
  const entries: IRawNameEntry[] = [];

  const strongRegex =
    /<strong>([^<]{1,30})<\/strong>\s*[-–:]\s*([^<]{1,200})/gi;
  let match = strongRegex.exec(html);
  while (match) {
    const name = match[1].trim();
    const meaning = match[2].trim().replace(/<[^>]+>/g, "");
    if (name.length >= 1 && name.length <= 20 && !/\d/.test(name)) {
      entries.push({
        value: name,
        type: "givenName",
        gender,
        source: SOURCE_NAME,
        meaning: meaning.length > 0 ? meaning : undefined,
      });
    }
    match = strongRegex.exec(html);
  }

  const boldRegex = /<b>([^<]{1,30})<\/b>\s*[-–:]\s*([^<]{1,200})/gi;
  let boldMatch = boldRegex.exec(html);
  while (boldMatch) {
    const name = boldMatch[1].trim();
    const meaning = boldMatch[2].trim().replace(/<[^>]+>/g, "");
    if (name.length >= 1 && name.length <= 20 && !/\d/.test(name)) {
      entries.push({
        value: name,
        type: "givenName",
        gender,
        source: SOURCE_NAME,
        meaning: meaning.length > 0 ? meaning : undefined,
      });
    }
    boldMatch = boldRegex.exec(html);
  }

  return entries;
}

export async function sourceDrpapieCrawl(): Promise<ISourceResult> {
  const errors: string[] = [];
  const entries: IRawNameEntry[] = [];

  for (let i = 0; i < LIST_PAGE.length; i += 1) {
    const page = LIST_PAGE[i];
    try {
      const response = await fetch(page.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${page.url}: ${response.status}`);
      }
      const html = await response.text();
      const parsed = namesParseHtml(html, page.gender);
      entries.push(...parsed);
    } catch (err) {
      errors.push(
        `${SOURCE_NAME} ${page.url}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return { sourceName: SOURCE_NAME, entries, errors };
}
