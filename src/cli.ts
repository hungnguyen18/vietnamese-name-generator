#!/usr/bin/env node

import { generate, generateMany } from "./generator";
import { EGender, ERegion, EEra, EMeaningCategory, ENameFormat } from "./types";
import type { TGenerateOptions, INameResult } from "./types";

const VERSION = "0.2.0";

const HELP = `Usage: vietnamese-name-generator [options]

Generate realistic Vietnamese names.

Options:
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
  --json                   Output as JSON
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
