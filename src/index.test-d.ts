import {
  filterMetadata,
  getMetadata,
  type Metadata,
  type GetMetadataOptions,
} from "./index.js";

const options: GetMetadataOptions = { DOMParser };
const metadata: Metadata = getMetadata("<title>x</title>", options);
const keywords: string[] | null = metadata.keywords;

const records: Metadata[] = [metadata];
const byText: Metadata[] = filterMetadata(records, "query");
const byPhrases: Metadata[] = filterMetadata(records, ["one", "two"]);

const partial = filterMetadata([{ title: "only a title" }], "title");
const title: string | null | undefined = partial[0]?.title;

// @ts-expect-error keywords are strings, not a joined string
const wrong: string = metadata.keywords;

// @ts-expect-error the query is text, not a number
filterMetadata(records, 42);

export { keywords, byText, byPhrases, title, wrong };
