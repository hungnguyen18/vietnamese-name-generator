import { describe, it, expect } from "vitest";
import { romanize } from "../src/romanize";

describe("romanize", () => {
  it("removes diacritics from Vietnamese text", () => {
    expect(romanize("Nguyễn")).toBe("Nguyen");
    expect(romanize("Văn")).toBe("Van");
    expect(romanize("Trần")).toBe("Tran");
    expect(romanize("Phạm")).toBe("Pham");
  });

  it("handles Đ/đ special case", () => {
    expect(romanize("Đặng")).toBe("Dang");
    expect(romanize("Đỗ")).toBe("Do");
    expect(romanize("đường")).toBe("duong");
  });

  it("handles full names", () => {
    expect(romanize("Nguyễn Văn An")).toBe("Nguyen Van An");
    expect(romanize("Trần Thị Mai")).toBe("Tran Thi Mai");
    expect(romanize("Đặng Minh Đức")).toBe("Dang Minh Duc");
  });

  it("preserves ASCII text unchanged", () => {
    expect(romanize("Nguyen Van An")).toBe("Nguyen Van An");
    expect(romanize("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(romanize("")).toBe("");
  });

  it("handles all Vietnamese vowel marks", () => {
    expect(romanize("ắằẳẵặ")).toBe("aaaaa");
    expect(romanize("ấầẩẫậ")).toBe("aaaaa");
    expect(romanize("éèẻẽẹ")).toBe("eeeee");
    expect(romanize("ếềểễệ")).toBe("eeeee");
    expect(romanize("ốồổỗộ")).toBe("ooooo");
    expect(romanize("ớờởỡợ")).toBe("ooooo");
    expect(romanize("úùủũụ")).toBe("uuuuu");
    expect(romanize("ứừửữự")).toBe("uuuuu");
    expect(romanize("íìỉĩị")).toBe("iiiii");
    expect(romanize("ýỳỷỹỵ")).toBe("yyyyy");
  });

  it("handles ơ and ư base characters", () => {
    expect(romanize("ơ")).toBe("o");
    expect(romanize("ư")).toBe("u");
    expect(romanize("Ơ")).toBe("O");
    expect(romanize("Ư")).toBe("U");
  });
});

import { generate } from "../src/generator";

describe("generate romanized field", () => {
  it("result contains romanized object", () => {
    const result = generate({ seed: 42 });
    expect(result.romanized).toBeDefined();
    expect(result.romanized.surname).toBeDefined();
    expect(result.romanized.middleName).toBeDefined();
    expect(result.romanized.givenName).toBeDefined();
    expect(result.romanized.fullName).toBeDefined();
  });

  it("romanized fullName matches romanize(fullName)", () => {
    const result = generate({ seed: 42 });
    expect(result.romanized.fullName).toBe(romanize(result.fullName));
  });

  it("romanized parts are ASCII-only", () => {
    for (let i = 0; i < 50; i += 1) {
      const result = generate({ seed: i });
      expect(result.romanized.fullName).toMatch(/^[a-zA-Z\s]+$/);
    }
  });

  it("romanized with no middle name", () => {
    const result = generate({ seed: 42, withMiddleName: false });
    expect(result.romanized.middleName).toBe("");
    expect(result.romanized.fullName).toBe(
      `${result.romanized.surname} ${result.romanized.givenName}`,
    );
  });
});
