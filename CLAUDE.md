# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A zero-runtime-dependency TypeScript library and CLI for Vietnamese name generation, parsing, validation, formatting, and cultural analysis. Published to npm as `vietnamese-name-generator`. Dual-format output (ESM + CJS) built with tsup. VitePress docs live under `docs/` and deploy to GitHub Pages via CI.

## Commands

```bash
npm run build          # Build with tsup (outputs to dist/)
npm test               # Run all tests (vitest)
npm run test:watch     # Watch mode (vitest)
npx vitest run tests/generator.test.ts   # Single test file

npm run docs:dev       # VitePress dev server
npm run docs:build     # Static site → docs/.vitepress/dist
npm run docs:preview   # Preview built docs

npm run crawl          # Maintainer: crawl/enrich name data (tsx scripts/crawl)
```

Build must succeed before tests — CLI tests import from `dist/`.

## Architecture

### Entry Points

- `src/index.ts` — Library public API (named exports + default namespace object for `import vn from 'vietnamese-name-generator'`)
- `src/cli.ts` — CLI (`vietnamese-name-generator` bin), built as CJS

### Core Generation Pipeline

`generator.ts` is the central module. Typical flow:

1. Resolve options (gender, region, era, middle name, compound preference, optional `meaningCategory`, optional `style` for GenZ cross-cultural names)
2. Pick surname (weighted by regional frequency) from `data/surname.ts`
3. Pick middle name from `data/middle-name.ts` (or GenZ middle index from `data/genz-names.ts` when `style` is set)
4. Pick given name from `data/given-name-compact.ts` and/or compound names from `data/compound-given-name.ts` (GenZ path uses `genz-names` data)
5. Romanize, format (`ENameFormat`), return `INameResult`

Deterministic output: `generate({ seed })` uses `xoroshiro128plus` from `random.ts`. Some other generators still use `mulberry32` for backward compatibility.

### Data Layer (`src/data/`)

Static indexed datasets — no external data sources at runtime:

- `surname.ts` — Region-weighted surname frequencies
- `given-name-compact.ts` — Given names indexed by `[gender][region][era]` (built from crawl pipeline / `scripts/compact-data.ts`)
- `compound-given-name.ts` — Two-part given names by `[gender][era]`
- `middle-name.ts` — Middle names by `[gender][region][era]`
- `genz-names.ts`, `genz-nickname-patterns.ts` — GenZ / cross-cultural name and nickname data
- `honorific-pronoun.ts`, `honorific-professional.ts` — Pronoun pairs and professional titles for address helpers
- `han-viet.ts` — Hán Việt (Sino-Vietnamese) readings/meanings
- `pet-name.ts` — Pet name data

### Utility Modules (single-purpose files)

- `romanize.ts`, `normalize.ts`, `parse-name.ts`, `validate-name.ts`, `detect-gender.ts`
- `format.ts` — Full name formats including slug
- `sort-vietnamese.ts` — Vietnamese-aware sorting
- `salutation.ts` — Legacy honorific strings (**deprecated**; prefer `address.ts`)
- `address.ts` — `addressCalculate`, `pronounPairGet` (formality, region, professional titles, xưng–hô)
- `five-elements.ts` — Ngũ Hành
- `get-han-viet.ts`, `get-meaning.ts`, `name-similarity.ts`, `name-statistics.ts`
- `surname-info.ts`, `regional-variant.ts`
- `generate-nickname.ts`, `generate-pet-name.ts`, `generate-genz-nickname.ts`
- `generate-email.ts`, `generate-username.ts` — Synthetic email/username from generated name parts (not real identity)
- `faker-adapter.ts` — Faker-style adapter

### Type Conventions

All types in `types.ts`. Enums prefixed with `E` (`EGender`, `ERegion`, `EEra`, `EFormality`, `EHonorificCategory`, etc.), interfaces with `I`, types with `T`.

## CI/CD

- `.github/workflows/ci.yml` — `npm ci` → build → test on push/PR to `main` (Node 20 and 22 matrix)
- `.github/workflows/docs.yml` — VitePress build + GitHub Pages deploy on push to `main` (and `workflow_dispatch`)
- `.github/workflows/publish.yml` — npm publish on version tag push
- `.github/workflows/auto-release.yml` — GitHub release on tags

CI targets the `main` branch (not `master`).

## Key Patterns

- Randomness: `pickRandom`, `pickWeighted` (alias-method weighted pick), `xoroshiro128plus`, `secureRandom`; `mulberry32` retained for legacy/determinism in some helpers
- Test files mirror source layout under `tests/`
- No runtime npm dependencies — only devDependencies for build, test, and docs
- Maintainer scripts: `scripts/crawl/` for data pipelines; `scripts/compact-data.ts` compacts given-name output into `given-name-compact.ts`
- v0.8.0 shipped identity-style generators (CCCD, phone, physical address) removed in v0.8.1 for legal risk under Vietnamese data protection law; current `address` APIs are **linguistic / honorific** (how to address someone), not government ID or real addresses
