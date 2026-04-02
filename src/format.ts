import type { INameParts } from "./types";
import { ENameFormat } from "./types";

function abbreviateParts(parts: string[]): string {
  return parts
    .map((p) => p.split(" ").map((w) => w.charAt(0).toUpperCase()).join("."))
    .join(".");
}

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
      return parts.romanized.fullName
        .toLowerCase()
        .replace(/\s+/g, "-");
    }
  }
}
