import type { INameParts } from "./types";
import { ENameFormat } from "./types";
import { romanize } from "./romanize";

function abbreviateParts(parts: string[]): string {
  return parts
    .map((p) => p.split(" ").map((w) => w.charAt(0).toUpperCase()).join("."))
    .join(".");
}

/**
 * Format a Vietnamese name into the specified display format.
 *
 * Supports full name, abbreviated (initials + given name), reversed (Western order),
 * and URL-safe slug formats.
 *
 * @param parts - The name parts including surname, middle name, given name, and romanized forms
 * @param format - The desired output format (Full, Abbreviated, Reversed, or Slug)
 * @returns The formatted name string
 * @example
 * ```typescript
 * const parts = { surname: 'Nguyễn', middleName: 'Thị', givenName: 'Mai', fullName: 'Nguyễn Thị Mai', romanized: { surname: 'Nguyen', middleName: 'Thi', givenName: 'Mai', fullName: 'Nguyen Thi Mai' } };
 * formatName(parts, ENameFormat.Abbreviated); // 'N.T. Mai'
 * formatName(parts, ENameFormat.Slug);        // 'nguyen-thi-mai'
 * ```
 */
export function formatName(parts: INameParts, format: ENameFormat): string {
  switch (format) {
    case ENameFormat.Full:
      return parts.fullName;

    case ENameFormat.Abbreviated: {
      const abbrevParts: string[] = [parts.surname];
      if (parts.middleName) {
        abbrevParts.push(parts.middleName);
      }
      const prefix = abbreviateParts(abbrevParts);
      return `${prefix}. ${parts.givenName}`;
    }

    case ENameFormat.Reversed: {
      const reversedParts = [parts.givenName, parts.surname];
      if (parts.middleName) {
        reversedParts.push(parts.middleName);
      }
      return reversedParts.join(" ");
    }

    case ENameFormat.Slug: {
      const romanizedFull = parts.romanized?.fullName ?? romanize(parts.fullName);
      return romanizedFull
        .toLowerCase()
        .replace(/\s+/g, "-");
    }
  }
}
