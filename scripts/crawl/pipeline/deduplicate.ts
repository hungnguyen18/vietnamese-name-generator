import type { IRawNameEntry } from "../types";

// Common HTML/parsing artifacts to filter out
const GARBAGE_VALUES = new Set([
  "pub",
  "end",
  "var",
  "function",
  "return",
  "const",
  "let",
  "class",
  "export",
  "import",
  "default",
]);

function valueIsValid(value: string): boolean {
  if (value.length === 0) {
    return false;
  }
  if (GARBAGE_VALUES.has(value.toLowerCase())) {
    return false;
  }
  // Must contain at least one letter
  if (!/\p{L}/u.test(value)) {
    return false;
  }
  return true;
}

function valueNormalize(value: string): string {
  return value.normalize("NFC").trim();
}

export function entriesDeduplicate(entries: IRawNameEntry[]): IRawNameEntry[] {
  const seen = new Map<string, IRawNameEntry>();

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const normalized = valueNormalize(entry.value);
    entry.value = normalized;

    if (!valueIsValid(normalized)) {
      continue;
    }

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
