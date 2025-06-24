/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter metas[i].getAttribute("property") === metaNamewith the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  function normalizeSearchText(value) {
    if (typeof value !== "string") {
      return "";
    }

    return value
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\\|`~()?"'[\]<>]/g, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractQueryTokens(value) {
    if (typeof value === "string") {
      const normalized = normalizeSearchText(value);
      return normalized === "" ? [] : normalized.split(" ");
    }

    if (Array.isArray(value)) {
      return value
        .filter((entry) => typeof entry === "string")
        .map((entry) => normalizeSearchText(entry))
        .filter(Boolean);
    }

    return [];
  }

  function normalizeMetadataValue(key, value) {
    if (key === "keywords" && Array.isArray(value)) {
      return normalizeSearchText(value.join(" "));
    }

    return normalizeSearchText(value);
  }

  if (!Array.isArray(metadata)) {
    return [];
  }

  const tokens = extractQueryTokens(query);
  if (tokens.length === 0) {
    return metadata;
  }

  return metadata.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const values = Object.keys(item)
      .map((key) => normalizeMetadataValue(key, item[key]))
      .filter(Boolean);

    return tokens.some((token) =>
      values.some((candidateValue) => candidateValue.includes(token))
    );
  });
}
