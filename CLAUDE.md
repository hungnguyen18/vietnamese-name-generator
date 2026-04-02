# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A zero-dependency TypeScript library and CLI for Vietnamese name generation, parsing, validation, and cultural analysis. Published to npm as `vietnamese-name-generator`. Dual-format output (ESM + CJS) built with tsup.

## Commands

```bash
npm run build          # Build with tsup (outputs to dist/)
npm test               # Run all tests (vitest)
npm run test:watch     # Watch mode
npx vitest run tests/generator.test.ts   # Run a single test file
```

Build must succeed before tests — CLI tests import from `dist/`.

## Architecture

### Entry Points
- `src/index.ts` — Library public API (all exports)
- `src/cli.ts` — CLI entry point (`vietnamese-name-generator` bin), built as CJS

### Core Generation Pipeline
`generator.ts` is the central module. Generation flow:
1. Resolve options (gender/region/era defaults via RNG)
2. Pick surname (weighted by regional frequency) from `data/surname.ts`
3. Pick middle name (gender+region+era indexed) from `data/middle-name.ts`
4. Pick given name from `data/given-name-compact.ts` or compound names from `data/compound-given-name.ts`
5. Romanize, format, and return `INameResult`

Deterministic output is supported via seeded RNG (`mulberry32` in `random.ts`).

### Data Layer (`src/data/`)
Static indexed datasets — no external data sources at runtime:
- `surname.ts` — Region-weighted surname frequencies
- `given-name-compact.ts` — Given names indexed by `[gender][region][era]`
- `compound-given-name.ts` — Two-part given names indexed by `[gender][era]`
- `middle-name.ts` — Middle names indexed by `[gender][region][era]`
- `han-viet.ts` — Hán Việt (Sino-Vietnamese) character meanings
- `pet-name.ts` — Vietnamese pet name data

### Utility Modules (each a single-purpose file)
- `romanize.ts` — Vietnamese diacritics to ASCII
- `normalize.ts` — Accent-insensitive matching, Vietnamese text normalization
- `parse-name.ts` — Split full name into surname/middle/given
- `validate-name.ts` — Validate Vietnamese name structure
- `detect-gender.ts` — Gender inference from name signals
- `format.ts` — Format names (full, abbreviated, reversed, slug)
- `sort-vietnamese.ts` — Vietnamese-aware name sorting
- `salutation.ts` — Vietnamese honorific generation
- `five-elements.ts` — Ngũ Hành (Five Elements) system
- `get-han-viet.ts` — Hán Việt character lookup
- `generate-nickname.ts` — Protective nickname generation (tên xấu để nuôi)
- `generate-pet-name.ts` — Vietnamese pet name generation
- `faker-adapter.ts` — Adapter for faker.js-style usage
- `name-similarity.ts`, `get-meaning.ts`, `name-statistics.ts` — Analysis utilities

### Type Conventions
All types in `types.ts`. Enums prefixed with `E` (EGender, ERegion, EEra), interfaces with `I`, types with `T`.

## CI/CD

- `.github/workflows/ci.yml` — Build + test on push to `main`
- `.github/workflows/publish.yml` — npm publish on version tag push
- `.github/workflows/auto-release.yml` — GitHub release creation on tags

CI runs on `main` branch (not `master`).

## Key Patterns

- All randomness goes through `random.ts` helpers (`pickRandom`, `pickWeighted`, `mulberry32`)
- Test files mirror source files 1:1 in `tests/` directory
- No external runtime dependencies — everything is self-contained
- The library was previously at v0.8.0 with identity generation features (CCCD, phone, address) which were removed in v0.8.1 due to legal risk under Vietnamese data protection law
