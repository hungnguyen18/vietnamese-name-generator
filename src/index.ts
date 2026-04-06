export {
  generate,
  generateFullName,
  generateMany,
  generateManyFullNames,
} from "./generator";

export { romanize } from "./romanize";

export { formatName } from "./format";

export { parseName } from "./parse-name";

export { validateName } from "./validate-name";

export { detectGender } from "./detect-gender";

export { generateEmail, type IEmailResult, type TEmailOptions } from "./generate-email";

export { generateUsername, type IUsernameResult } from "./generate-username";

export { getSurnameInfo, type ISurnameInfo } from "./surname-info";

export { getRegionalVariant } from "./regional-variant";

export { fakerVi } from "./faker-adapter";

export { nameSimilarity, type ISimilarityResult } from "./name-similarity";

export { getMeaning, type INameMeaning } from "./get-meaning";

export {
  getStatistics,
  getTopSurnames,
  getGivenNameCount,
  getUniqueGivenNames,
  type IStatisticsResult,
  type IRankedName,
} from "./name-statistics";

export {
  normalize,
  accentInsensitiveMatch,
  accentInsensitiveEqual,
  VIETNAMESE_NAME_REGEX,
} from "./normalize";

export { salutation } from "./salutation";

export { addressCalculate, pronounPairGet } from "./address";

export { sortVietnamese, vietnameseNameComparator } from "./sort-vietnamese";

export {
  EElement,
  getElementInfo,
  getNameElement,
  getNamesByElement,
  getBirthYearElement,
} from "./five-elements";

export { getHanViet, type THanVietEntry } from "./get-han-viet";

export { generateNickname, type INicknameResult, type TNicknameCategory } from "./generate-nickname";

export { generatePetName, generateManyPetNames, type IPetNameResult, type IPetNameOptions, type TPetNameCategory } from "./generate-pet-name";

export {
  generateGenZNickname,
  type IGenZNicknameResult,
  type IGenZNicknameOptions,
} from "./generate-genz-nickname";
export type { TGenZNicknameStyle } from "./data/genz-nickname-patterns";

export {
  EGender,
  ERegion,
  EEra,
  EMeaningCategory,
  ENameFormat,
  EFormality,
  EHonorificCategory,
  EReligion,
  EFeudalRank,
  type TGenerateOptions,
  type TNameStyle,
  type INameResult,
  type INameParts,
  type IRomanizedName,
  type IParsedName,
  type IValidationResult,
  type IGenderResult,
  type TWeightedEntry,
  type TGivenNameEntry,
  type IPronounPair,
  type IAddressOptions,
  type IAddressResult,
  type ITitleEntry,
  type IKinshipTerm,
} from "./types";

// --- Default export: namespace object for `import vn from 'vietnamese-name-generator'` ---

import { generate, generateFullName, generateMany, generateManyFullNames } from "./generator";
import { romanize } from "./romanize";
import { formatName } from "./format";
import { parseName } from "./parse-name";
import { validateName } from "./validate-name";
import { detectGender } from "./detect-gender";
import { generateEmail } from "./generate-email";
import { generateUsername } from "./generate-username";
import { getSurnameInfo } from "./surname-info";
import { getRegionalVariant } from "./regional-variant";
import { fakerVi } from "./faker-adapter";
import { nameSimilarity } from "./name-similarity";
import { getMeaning } from "./get-meaning";
import { getStatistics, getTopSurnames, getGivenNameCount, getUniqueGivenNames } from "./name-statistics";
import { normalize, accentInsensitiveMatch, accentInsensitiveEqual, VIETNAMESE_NAME_REGEX } from "./normalize";
import { salutation } from "./salutation";
import { addressCalculate, pronounPairGet } from "./address";
import { sortVietnamese, vietnameseNameComparator } from "./sort-vietnamese";
import { EElement, getElementInfo, getNameElement, getNamesByElement, getBirthYearElement } from "./five-elements";
import { getHanViet } from "./get-han-viet";
import { generateNickname } from "./generate-nickname";
import { generatePetName, generateManyPetNames } from "./generate-pet-name";
import { generateGenZNickname } from "./generate-genz-nickname";
import { EGender, ERegion, EEra, EMeaningCategory, ENameFormat, EFormality, EHonorificCategory, EReligion, EFeudalRank } from "./types";

const VietnameseNameGenerator = {
  // Generation
  generate,
  generateFullName,
  generateMany,
  generateManyFullNames,
  generateEmail,
  generateUsername,
  generateNickname,
  generatePetName,
  generateManyPetNames,
  generateGenZNickname,

  // Parsing & Validation
  parseName,
  validateName,
  detectGender,

  // Address & Honorifics
  addressCalculate,
  pronounPairGet,

  // Formatting & i18n
  romanize,
  formatName,
  salutation,
  normalize,
  accentInsensitiveMatch,
  accentInsensitiveEqual,
  sortVietnamese,
  vietnameseNameComparator,
  VIETNAMESE_NAME_REGEX,

  // Cultural Data
  getHanViet,
  getElementInfo,
  getNameElement,
  getNamesByElement,
  getBirthYearElement,
  getMeaning,
  getSurnameInfo,
  getRegionalVariant,
  nameSimilarity,
  getStatistics,
  getTopSurnames,
  getGivenNameCount,
  getUniqueGivenNames,

  // Faker.js Compatible
  fakerVi,

  // Enums
  EGender,
  ERegion,
  EEra,
  EMeaningCategory,
  ENameFormat,
  EElement,
  EFormality,
  EHonorificCategory,
  EReligion,
  EFeudalRank,
} as const;

export default VietnameseNameGenerator;
