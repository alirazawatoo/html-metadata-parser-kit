export interface Metadata {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
}

/** Anything constructible that parses an HTML string into a Document. */
export type DOMParserConstructor = new () => {
  parseFromString(source: string, type: "text/html"): Document;
};

export interface GetMetadataOptions {
  /**
   * DOMParser to use instead of `globalThis.DOMParser`, e.g.
   * `new JSDOM().window.DOMParser` in Node.
   */
  DOMParser?: DOMParserConstructor | null;
}

/**
 * Reads url, siteName, title, description, keywords and author from an HTML
 * string. Missing or blank values are `null`; non-string or blank input
 * returns all-null metadata without parsing.
 *
 * @throws {TypeError} when the input needs parsing and no DOMParser exists.
 */
export function getMetadata(
  html: unknown,
  options?: GetMetadataOptions,
): Metadata;

/**
 * Returns the records in which any query word appears in any string field
 * or keyword. A blank query returns `metadata` itself; a non-array
 * `metadata` returns `[]`.
 */
export function filterMetadata<T extends Partial<Metadata>>(
  metadata: readonly T[],
  query?: string | readonly string[] | null,
): T[];
