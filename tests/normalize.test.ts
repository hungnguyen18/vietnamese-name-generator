import { describe, it, expect } from "vitest";
import {
  normalize,
  accentInsensitiveMatch,
  accentInsensitiveEqual,
  VIETNAMESE_NAME_REGEX,
} from "../src/normalize";

describe("normalize", () => {
  it("converts NFD to NFC", () => {
    const nfd = "Nguyễn".normalize("NFD");
    const nfc = "Nguyễn".normalize("NFC");
    expect(nfd).not.toBe(nfc);
    expect(normalize(nfd)).toBe(nfc);
  });

  it("preserves NFC input", () => {
    const nfc = "Nguyễn".normalize("NFC");
    expect(normalize(nfc)).toBe(nfc);
  });
});

describe("accentInsensitiveMatch", () => {
  it("matches ignoring diacritics", () => {
    expect(accentInsensitiveMatch("Nguyễn Văn An", "nguyen")).toBe(true);
  });

  it("returns false when query is not found", () => {
    expect(accentInsensitiveMatch("Nguyễn Văn An", "xyz")).toBe(false);
  });
});

describe("accentInsensitiveEqual", () => {
  it("returns true for accent-equivalent strings", () => {
    expect(accentInsensitiveEqual("Nguyễn", "Nguyen")).toBe(true);
  });

  it("returns false for different names", () => {
    expect(accentInsensitiveEqual("Nguyễn", "Trần")).toBe(false);
  });
});

describe("VIETNAMESE_NAME_REGEX", () => {
  it("validates Vietnamese name characters", () => {
    expect(VIETNAMESE_NAME_REGEX.test("Nguyễn Văn An")).toBe(true);
  });

  it("rejects special characters", () => {
    expect(VIETNAMESE_NAME_REGEX.test("Nguyen@Van")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(VIETNAMESE_NAME_REGEX.test("")).toBe(false);
  });
});
