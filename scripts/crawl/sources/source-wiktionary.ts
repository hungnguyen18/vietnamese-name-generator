import type { IRawNameEntry, ISourceResult } from "../types";

const SOURCE_NAME = "wiktionary";

interface IWiktionaryCategory {
  title: string;
  gender: "male" | "female" | "unisex";
}

const LIST_CATEGORY: IWiktionaryCategory[] = [
  { title: "Category:Vietnamese_male_given_names", gender: "male" },
  { title: "Category:Vietnamese_female_given_names", gender: "female" },
  { title: "Category:Vietnamese_unisex_given_names", gender: "unisex" },
];

async function categoryMembersFetch(categoryTitle: string): Promise<string[]> {
  const names: string[] = [];
  let cmcontinue: string | undefined;

  do {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmlimit: "500",
      cmtype: "page",
      format: "json",
      origin: "*",
    });
    if (cmcontinue) {
      params.set("cmcontinue", cmcontinue);
    }

    const response = await fetch(
      `https://en.wiktionary.org/w/api.php?${params}`,
    );
    if (!response.ok) {
      throw new Error(`Wiktionary API error: ${response.status}`);
    }

    const data = await response.json();
    const members = data?.query?.categorymembers ?? [];

    for (let i = 0; i < members.length; i += 1) {
      const title = members[i].title;
      if (!title.startsWith("Category:") && !title.startsWith("Appendix:")) {
        names.push(title);
      }
    }

    cmcontinue = data?.continue?.cmcontinue;
  } while (cmcontinue);

  return names;
}

export async function sourceWiktionaryCrawl(): Promise<ISourceResult> {
  const errors: string[] = [];
  const entries: IRawNameEntry[] = [];

  for (let i = 0; i < LIST_CATEGORY.length; i += 1) {
    const cat = LIST_CATEGORY[i];
    try {
      const names = await categoryMembersFetch(cat.title);
      for (let j = 0; j < names.length; j += 1) {
        entries.push({
          value: names[j],
          type: "givenName",
          gender: cat.gender,
          source: SOURCE_NAME,
        });
      }
    } catch (err) {
      errors.push(
        `${SOURCE_NAME} ${cat.title}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return { sourceName: SOURCE_NAME, entries, errors };
}
