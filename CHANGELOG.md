# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0] - 2026-04-06

### Added
- Vietnamese honorific & address system (`addressCalculate`, `pronounPairGet`)
  - Age-based pronoun pairs with 7 generational ranges
  - 30+ professional titles across 6 categories (academic, medical, legal, military, political, education)
  - Regional dialect variants (North/Central/South)
  - 5 formality levels (written-formal, spoken-formal, professional, casual, intimate)
  - Nâng principle for same-age addressing
- New enums: `EFormality`, `EHonorificCategory`, `EReligion`, `EFeudalRank`
- New types: `IPronounPair`, `IAddressOptions`, `IAddressResult`, `ITitleEntry`, `IKinshipTerm`
- JSDoc with `@param`, `@returns`, `@example` for all 40+ exported functions
- VitePress documentation site with GitHub Pages deployment
- CHANGELOG.md, CONTRIBUTING.md, GitHub issue templates
- 18 new npm keywords and 12 GitHub topics for discoverability
- Bundle size, TypeScript, and zero-dependencies badges

### Deprecated
- `salutation()` — use `addressCalculate()` instead

## [0.12.0] - 2026-04-03

### Added
- Cross-cultural GenZ name generation via `style` option in `generate()` (japanese, korean, western, hybrid)
- GenZ nickname generator (`generateGenZNickname`) with 6 cultural styles (social-handle, jp-suffix, kr-suffix, cute, meme, english-viet)
- `TNameStyle` type and `secure` option in `TGenerateOptions`

### Changed
- Improved random: xoroshiro128+ PRNG, Alias Method O(1) weighted selection, Fisher-Yates shuffle
- Optimized bundle: 1.8MB -> 492KB (73% reduction)

### Deprecated
- `generateGenZName()` — use `generate({ style })` instead

### Removed
- Dead code cleanup: removed `generateGenZName` implementation

## [0.11.1] - 2026-04-02

### Fixed
- Username/email non-ASCII character handling
- Data test timeout issues

## [0.11.0] - 2026-04-01

### Added
- GenZ/Gen Alpha name generation with short, compound, and international styles
- Default export for namespace-style import (`import vn from 'vietnamese-name-generator'`)

## [0.10.0] - 2026-03-30

### Added
- Vietnamese pet name generator with 150+ names across 7 categories
- Cultural depth: Five Elements (Ngũ Hành), Hán Việt character lookup, protective nicknames

## [0.9.0] - 2026-03-28

### Added
- i18n utilities: `normalize`, `salutation`, `sortVietnamese`, `vietnameseNameComparator`
- `getMeaning` for name meaning/category lookup
- Name statistics API (`getStatistics`, `getTopSurnames`)
- CLI batch export (CSV/JSON)
- `fakerVi` adapter for faker.js-compatible usage
- `nameSimilarity` for diacritics/variant-tolerant name comparison

## [0.8.1] - 2026-03-26

### Removed
- CCCD (citizen ID), phone number, address, and `generatePerson` generators — removed due to legal risk under Vietnamese data protection law

## [0.8.0] - 2026-03-25

### Added
- Vietnamese identity generation: CCCD, phone, address, `generatePerson`

## [0.7.0] - 2026-03-23

### Added
- `generateEmail`, `generateUsername` from generated names
- `getSurnameInfo` with frequency, rank, regional data
- `getRegionalVariant` for Hoàng↔Huỳnh, Vũ↔Võ conversion

## [0.6.0] - 2026-03-21

### Added
- `parseName` — split full name into surname/middle/given
- `validateName` — validate Vietnamese name structure
- `detectGender` — infer gender from name signals
- CLI commands for parse, validate, and detect gender

## [0.5.0] - 2026-03-19

### Added
- CLI tool with all generation options and JSON/table output

## [0.4.0] - 2026-03-17

### Added
- `formatName` with full/abbreviated/reversed/slug formats
- `romanize` function for Vietnamese diacritics removal
- Formatted field in `INameResult`

## [0.3.0] - 2026-03-15

### Added
- Deterministic output via seed option (`mulberry32` PRNG)

## [0.2.0] - 2026-03-13

### Changed
- Optimized data: compact pipe-delimited format (5.6MB -> 870KB)
- Optimized bundle: disable sourcemaps, minify output (5.6MB -> 1.4MB)

## [0.1.2] - 2026-03-11

### Added
- CI workflows (build + test on push, npm publish on tag, auto-release)

## [0.1.1] - 2026-03-10

### Added
- Crawl pipeline: 6 web sources, merge, deduplicate, tag, validate
- Data integrity tests: UTF-8, regional variants, coverage

## [0.1.0] - 2026-03-08

### Added
- Initial release
- Core generator: `generate`, `generateFullName` with gender/region/era options
- Batch generation: `generateMany`, `generateManyFullNames` with uniqueness guarantee
- Census-weighted surname distribution
- Types and enums: `EGender`, `ERegion`, `EEra`, `EMeaningCategory`

[Unreleased]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.13.0...HEAD
[0.13.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/hungnguyen18/vietnamese-name-generator/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hungnguyen18/vietnamese-name-generator/releases/tag/v0.1.0
