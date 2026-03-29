import type { IRawNameEntry, ISourceResult } from "../types";

export function entriesMerge(results: ISourceResult[]): IRawNameEntry[] {
  const merged: IRawNameEntry[] = [];
  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.errors.length > 0) {
      console.warn(
        `[merge] ${result.sourceName} had ${result.errors.length} errors:`,
      );
      for (let j = 0; j < result.errors.length; j += 1) {
        console.warn(`  - ${result.errors[j]}`);
      }
    }
    console.log(
      `[merge] ${result.sourceName}: ${result.entries.length} entries`,
    );
    merged.push(...result.entries);
  }
  console.log(`[merge] Total: ${merged.length} entries`);
  return merged;
}
