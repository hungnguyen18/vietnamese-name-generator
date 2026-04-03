#!/usr/bin/env node

import { generate, generateMany } from "./generator";
import { parseName } from "./parse-name";
import { validateName } from "./validate-name";
import { detectGender } from "./detect-gender";
import { EGender, ERegion, EEra, EMeaningCategory, ENameFormat } from "./types";
import type { TGenerateOptions, INameResult } from "./types";

const VERSION = "0.11.1";

const HELP = `Usage: vietnamese-name-generator [options]

Generate, parse, validate, and analyze Vietnamese names.

Commands:
  --parse <name>           Parse a Vietnamese name into parts
  --validate <name>        Validate a Vietnamese name
  --detect <name>          Detect gender from a Vietnamese name

Generate Options:
  --count, -n <number>     Number of names to generate (default: 1)
  --gender, -g <value>     Gender: male, female, unisex (default: random)
  --region, -r <value>     Region: north, central, south (default: random)
  --era, -e <value>        Era: traditional, modern (default: random)
  --seed, -s <number>      Seed for deterministic output
  --format, -f <value>     Output format: full, abbreviated, reversed, slug
                           (comma-separated for multiple, default: full)
  --compound               Force compound given names
  --meaning <value>        Meaning category: strength, virtue, nature,
                           precious, beauty, celestial, season, intellect,
                           prosperity
  --no-middle              Omit middle name

Output Options:
  --json                   Output as JSON
  --export <format>        Export as csv or json (default: json)
                           Generates --count names and outputs in format
  --help, -h               Show this help message
  --version, -v            Show version`;

function argParse(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--version" || arg === "-v") {
      args.version = true;
    } else if (arg === "--json") {
      args.json = true;
    } else if (arg === "--compound") {
      args.compound = true;
    } else if (arg === "--no-middle") {
      args.noMiddle = true;
    } else if (arg === "--count" || arg === "-n") {
      args.count = argv[++i];
    } else if (arg === "--gender" || arg === "-g") {
      args.gender = argv[++i];
    } else if (arg === "--region" || arg === "-r") {
      args.region = argv[++i];
    } else if (arg === "--era" || arg === "-e") {
      args.era = argv[++i];
    } else if (arg === "--seed" || arg === "-s") {
      args.seed = argv[++i];
    } else if (arg === "--format" || arg === "-f") {
      args.format = argv[++i];
    } else if (arg === "--meaning") {
      args.meaning = argv[++i];
    } else if (arg === "--parse") {
      args.parse = argv[++i];
    } else if (arg === "--validate") {
      args.validate = argv[++i];
    } else if (arg === "--detect") {
      args.detect = argv[++i];
    } else if (arg === "--export") {
      args.export = argv[++i] || "json";
    }
  }
  return args;
}

function optionBuild(args: Record<string, string | boolean>): TGenerateOptions {
  const options: TGenerateOptions = {};

  if (typeof args.gender === "string") {
    options.gender = args.gender as EGender;
  }
  if (typeof args.region === "string") {
    options.region = args.region as ERegion;
  }
  if (typeof args.era === "string") {
    options.era = args.era as EEra;
  }
  if (typeof args.seed === "string") {
    options.seed = parseInt(args.seed, 10);
  }
  if (args.compound === true) {
    options.compoundName = true;
  }
  if (args.noMiddle === true) {
    options.withMiddleName = false;
  }
  if (typeof args.meaning === "string") {
    options.meaningCategory = args.meaning as EMeaningCategory;
  }
  if (typeof args.format === "string") {
    const formats = args.format.split(",").map((f) => f.trim()) as ENameFormat[];
    options.format = formats.length === 1 ? formats[0] : formats;
  }

  return options;
}

function outputTable(results: INameResult[]): string {
  return results
    .map((r) => {
      const padded = r.fullName.padEnd(25);
      return `  ${padded}(${r.gender}, ${r.region}, ${r.era})`;
    })
    .join("\n");
}

function main(): void {
  const args = argParse(process.argv.slice(2));

  if (args.help) {
    console.log(HELP);
    return;
  }

  if (args.version) {
    console.log(VERSION);
    return;
  }

  // Command: --parse
  if (typeof args.parse === "string") {
    const result = parseName(args.parse);
    if (args.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`  Surname:     ${result.surname || "(none)"}`);
      console.log(`  Middle name: ${result.middleName || "(none)"}`);
      console.log(`  Given name:  ${result.givenName || "(none)"}`);
    }
    return;
  }

  // Command: --validate
  if (typeof args.validate === "string") {
    const result = validateName(args.validate);
    if (args.json) {
      console.log(JSON.stringify(result));
    } else if (result.valid) {
      console.log(`  Valid: yes`);
    } else {
      console.log(`  Valid: no`);
      for (let i = 0; i < result.reasons.length; i += 1) {
        console.log(`  - ${result.reasons[i]}`);
      }
    }
    return;
  }

  // Command: --detect
  if (typeof args.detect === "string") {
    const result = detectGender(args.detect);
    if (args.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`  Gender:     ${result.gender}`);
      console.log(`  Confidence: ${result.confidence}`);
      if (result.signals.middleName) {
        console.log(`  Middle:     ${result.signals.middleName.value} -> ${result.signals.middleName.gender}`);
      }
      if (result.signals.givenName) {
        console.log(`  Given:      ${result.signals.givenName.value} -> ${result.signals.givenName.gender}`);
      }
    }
    return;
  }

  // Command: --export
  if (typeof args.export === "string") {
    const format = args.export.toLowerCase();
    const count = typeof args.count === "string" ? parseInt(args.count, 10) : 1;
    const options = optionBuild(args);
    const results = count === 1 ? [generate(options)] : generateMany(count, options);

    if (format === "csv") {
      const header = "surname,middleName,givenName,fullName,gender,region,era,romanizedFullName";
      const rows: string[] = [header];
      for (let i = 0; i < results.length; i += 1) {
        const r = results[i];
        const fields = [
          r.surname,
          r.middleName,
          r.givenName,
          r.fullName,
          r.gender,
          r.region,
          r.era,
          r.romanized.fullName,
        ];
        const escaped = fields.map((f) => (f.includes(",") || f.includes('"')) ? `"${f.replace(/"/g, '""')}"` : f);
        rows.push(escaped.join(","));
      }
      console.log(rows.join("\n"));
    } else {
      console.log(JSON.stringify(results, null, 2));
    }
    return;
  }

  // Default: generate names
  const count = typeof args.count === "string" ? parseInt(args.count, 10) : 1;
  const options = optionBuild(args);

  const results = count === 1 ? [generate(options)] : generateMany(count, options);

  if (args.json) {
    console.log(JSON.stringify(results));
  } else {
    console.log(outputTable(results));
  }
}

main();
