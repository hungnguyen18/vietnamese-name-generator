import { sourceGithubNamedbCrawl } from "./sources/source-github-namedb";
import { sourceFakerViCrawl } from "./sources/source-faker-vi";
import { sourceWiktionaryCrawl } from "./sources/source-wiktionary";
import { sourceWikipediaSurnameCrawl } from "./sources/source-wikipedia-surname";
import { sourceSurnamEsCrawl } from "./sources/source-surnam-es";
import { sourceDrpapieCrawl } from "./sources/source-drpapie";
import { entriesMerge } from "./pipeline/merge";
import { entriesDeduplicate } from "./pipeline/deduplicate";
import { entriesTag } from "./pipeline/tag";
import { entriesValidate } from "./pipeline/validate";
import { entriesExport } from "./pipeline/export";

async function main() {
  console.log("=== Vietnamese Name Generator — Crawl Pipeline ===\n");

  console.log("--- Step 1: Crawling sources ---");
  const results = await Promise.all([
    sourceGithubNamedbCrawl(),
    sourceFakerViCrawl(),
    sourceWiktionaryCrawl(),
    sourceWikipediaSurnameCrawl(),
    sourceSurnamEsCrawl(),
    sourceDrpapieCrawl(),
  ]);

  console.log("\n--- Step 2: Merging ---");
  const merged = entriesMerge(results);

  console.log("\n--- Step 3: Deduplicating ---");
  const deduped = entriesDeduplicate(merged);

  console.log("\n--- Step 4: Tagging ---");
  const tagged = entriesTag(deduped);

  console.log("\n--- Step 5: Validating ---");
  const validation = entriesValidate(tagged);

  if (!validation.valid) {
    console.error("\nValidation failed:");
    for (let i = 0; i < validation.errors.length; i += 1) {
      console.error(`  - ${validation.errors[i]}`);
    }
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn("\nWarnings:");
    for (let i = 0; i < validation.warnings.length; i += 1) {
      console.warn(`  - ${validation.warnings[i]}`);
    }
  }

  console.log("\n--- Step 6: Exporting ---");
  entriesExport(tagged);

  console.log("\nPipeline complete!");
  console.log(
    `Stats: ${validation.stats.surnames} surnames, ${validation.stats.givenNames} given names`,
  );
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
