import type { IRawNameEntry } from "../types";

function valueNormalize(value: string): string {
  return value.normalize("NFC").trim();
}

export function entriesDeduplicate(entries: IRawNameEntry[]): IRawNameEntry[] {
  const seen = new Map<string, IRawNameEntry>();

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const normalized = valueNormalize(entry.value);
    entry.value = normalized;

    const key = `${entry.type}:${normalized}:${entry.gender ?? "any"}`;

    if (seen.has(key)) {
      const existing = seen.get(key)!;
      if (!existing.meaning && entry.meaning) {
        existing.meaning = entry.meaning;
      }
      if (!existing.sinoVietnamese && entry.sinoVietnamese) {
        existing.sinoVietnamese = entry.sinoVietnamese;
      }
      if (!existing.frequency && entry.frequency) {
        existing.frequency = entry.frequency;
      }
      if (!existing.category && entry.category) {
        existing.category = entry.category;
      }
      if (!existing.source.includes(entry.source)) {
        existing.source = `${existing.source},${entry.source}`;
      }
    } else {
      seen.set(key, { ...entry });
    }
  }

  const result = Array.from(seen.values());
  console.log(
    `[dedup] ${entries.length} -> ${result.length} entries (${entries.length - result.length} duplicates removed)`,
  );
  return result;
}
