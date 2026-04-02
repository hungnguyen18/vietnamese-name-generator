import { describe, it, expect } from "vitest";
import { formatName } from "../src/format";
import { ENameFormat } from "../src/types";
import type { INameParts } from "../src/types";

const MOCK_RESULT: INameParts = {
  surname: "Nguyễn",
  middleName: "Văn",
  givenName: "An",
  fullName: "Nguyễn Văn An",
  romanized: {
    surname: "Nguyen",
    middleName: "Van",
    givenName: "An",
    fullName: "Nguyen Van An",
  },
};

const NO_MIDDLE: INameParts = {
  ...MOCK_RESULT,
  middleName: "",
  fullName: "Nguyễn An",
  romanized: {
    surname: "Nguyen",
    middleName: "",
    givenName: "An",
    fullName: "Nguyen An",
  },
};

const COMPOUND_SURNAME: INameParts = {
  ...MOCK_RESULT,
  surname: "Tôn Thất",
  fullName: "Tôn Thất Văn An",
  romanized: {
    ...MOCK_RESULT.romanized,
    surname: "Ton That",
    fullName: "Ton That Van An",
  },
};

const COMPOUND_GIVEN: INameParts = {
  ...MOCK_RESULT,
  givenName: "Bảo Long",
  fullName: "Nguyễn Văn Bảo Long",
  romanized: {
    ...MOCK_RESULT.romanized,
    givenName: "Bao Long",
    fullName: "Nguyen Van Bao Long",
  },
};

describe("formatName", () => {
  it("full format returns fullName", () => {
    expect(formatName(MOCK_RESULT, ENameFormat.Full)).toBe("Nguyễn Văn An");
  });

  it("abbreviated format", () => {
    expect(formatName(MOCK_RESULT, ENameFormat.Abbreviated)).toBe("N.V. An");
  });

  it("abbreviated without middle name", () => {
    expect(formatName(NO_MIDDLE, ENameFormat.Abbreviated)).toBe("N. An");
  });

  it("abbreviated with compound surname", () => {
    expect(formatName(COMPOUND_SURNAME, ENameFormat.Abbreviated)).toBe("T.T.V. An");
  });

  it("abbreviated with compound given name", () => {
    expect(formatName(COMPOUND_GIVEN, ENameFormat.Abbreviated)).toBe("N.V. Bảo Long");
  });

  it("reversed format", () => {
    expect(formatName(MOCK_RESULT, ENameFormat.Reversed)).toBe("An Nguyễn Văn");
  });

  it("reversed without middle name", () => {
    expect(formatName(NO_MIDDLE, ENameFormat.Reversed)).toBe("An Nguyễn");
  });

  it("reversed with compound given name", () => {
    expect(formatName(COMPOUND_GIVEN, ENameFormat.Reversed)).toBe("Bảo Long Nguyễn Văn");
  });

  it("slug format", () => {
    expect(formatName(MOCK_RESULT, ENameFormat.Slug)).toBe("nguyen-van-an");
  });

  it("slug without middle name", () => {
    expect(formatName(NO_MIDDLE, ENameFormat.Slug)).toBe("nguyen-an");
  });

  it("slug with compound surname", () => {
    expect(formatName(COMPOUND_SURNAME, ENameFormat.Slug)).toBe("ton-that-van-an");
  });
});

import { generate } from "../src/generator";

describe("generate formatted field", () => {
  it("default: formatted contains full", () => {
    const result = generate({ seed: 42 });
    expect(result.formatted).toBeDefined();
    expect(result.formatted.full).toBe(result.fullName);
  });

  it("single format option", () => {
    const result = generate({ seed: 42, format: ENameFormat.Slug });
    expect(result.formatted.slug).toBeDefined();
    expect(result.formatted.slug).toMatch(/^[a-z-]+$/);
  });

  it("array of formats", () => {
    const result = generate({
      seed: 42,
      format: [ENameFormat.Full, ENameFormat.Slug, ENameFormat.Abbreviated],
    });
    expect(result.formatted.full).toBeDefined();
    expect(result.formatted.slug).toBeDefined();
    expect(result.formatted.abbreviated).toBeDefined();
    expect(Object.keys(result.formatted)).toHaveLength(3);
  });

  it("all four formats", () => {
    const result = generate({
      seed: 42,
      format: [ENameFormat.Full, ENameFormat.Abbreviated, ENameFormat.Reversed, ENameFormat.Slug],
    });
    expect(Object.keys(result.formatted)).toHaveLength(4);
  });
});
