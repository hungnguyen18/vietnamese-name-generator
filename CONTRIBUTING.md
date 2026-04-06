# Contributing to vietnamese-name-generator

Thank you for your interest in contributing! This project aims to be the most comprehensive Vietnamese name toolkit for JavaScript/TypeScript.

## Getting Started

```bash
git clone https://github.com/hungnguyen18/vietnamese-name-generator.git
cd vietnamese-name-generator
npm install
npm run build
npm test
```

Build must succeed before tests — CLI tests import from `dist/`.

## Development Commands

```bash
npm run build          # Build with tsup (outputs to dist/)
npm test               # Run all tests (vitest)
npm run test:watch     # Watch mode
npx vitest run tests/generator.test.ts   # Run a single test file
```

## Project Structure

```
src/
├── index.ts              # Public API (all exports)
├── cli.ts                # CLI entry point
├── generator.ts          # Core name generation pipeline
├── address.ts            # Vietnamese honorific & address system
├── types.ts              # All types, enums, interfaces
├── data/                 # Static datasets (no external sources)
│   ├── surname.ts        # Region-weighted surname frequencies
│   ├── given-name-compact.ts
│   ├── compound-given-name.ts
│   ├── middle-name.ts
│   ├── han-viet.ts       # Sino-Vietnamese character meanings
│   ├── honorific-pronoun.ts
│   └── honorific-professional.ts
└── [utility modules]     # One file per function (romanize, parse, validate, etc.)

tests/                    # Mirror of src/ — one test file per source file
```

## Coding Conventions

### Naming (Category FIRST)

```typescript
// Correct
class ServicePayment {}
function permissionCreate() {}
type TUserStatus = ...
interface IPaymentData { ... }
enum EUserRole { ... }

// Wrong
class PaymentService {}
function createPermission() {}
```

### Style

- Single quotes, semicolons mandatory
- Max line length: 120 chars
- Imports sorted alphabetically
- Prefer `for (let i = 0; i < arr.length; i += 1)` over `for...of` / `.forEach()`
- All types in `types.ts` — enums `E` prefix, interfaces `I` prefix, types `T` prefix

### Data Layer

- Static datasets use compact pipe-delimited format for bundle size
- All randomness goes through `random.ts` helpers (`pickRandom`, `pickWeighted`, `mulberry32`)
- No external runtime dependencies — everything is self-contained

## Making Changes

1. **Fork** the repository
2. **Create a branch**: `feature/your_feature_name`, `bug/fix_description`, or `misc/change_name`
3. **Write tests** — test files mirror source files 1:1 in `tests/`
4. **Run the full suite**: `npm run build && npm test`
5. **Commit** with a message starting with: Add / Remove / Improve / Refactor / Fix / Update
6. **Open a PR** against `main`

## What to Contribute

### Good First Issues

- Add missing Hán Việt character entries to `src/data/han-viet.ts`
- Add pet name entries to `src/data/pet-name.ts`
- Improve gender detection accuracy for edge cases
- Add more professional title entries

### Feature Ideas

- Family kinship terms (maternal/paternal sides)
- Royal/feudal titles for historical fiction
- More regional dialect variants
- Additional GenZ nickname patterns

## Questions?

Open an [issue](https://github.com/hungnguyen18/vietnamese-name-generator/issues) — we're happy to help!
