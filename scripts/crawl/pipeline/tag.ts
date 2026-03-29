import type { IRawNameEntry } from "../types";
import meaningCategories from "../enrichment/meaning-categories.json";

const MEANING_MAP = new Map<string, string>();
for (const [category, names] of Object.entries(meaningCategories)) {
  for (let i = 0; i < (names as string[]).length; i += 1) {
    MEANING_MAP.set((names as string[])[i], category);
  }
}

export function entriesTag(entries: IRawNameEntry[]): IRawNameEntry[] {
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (entry.type === "givenName" && !entry.category) {
      const category = MEANING_MAP.get(entry.value);
      if (category) {
        entry.category = category;
      }
    }
  }

  const taggedCount = entries.filter((e) => e.category).length;
  console.log(
    `[tag] ${taggedCount}/${entries.length} entries have meaning categories`,
  );
  return entries;
}
