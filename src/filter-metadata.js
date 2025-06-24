/** @typedef {import("./index.js").Metadata} Metadata */

// ASCII punctuation plus typographic quotes are dropped so "N.A.S.A." and
// "don’t" match "nasa" and "dont". Hyphen, underscore and the Unicode
// dashes split words instead, so "light-year" also finds "light".
const DROPPED_PUNCTUATION =
  /[.,/#!$%^&*;:{}=\\|`~()?"'[\]<>\u2018\u2019\u201C\u201D]/g;
const WORD_SEPARATORS = /[-_\u2010-\u2015]/g;

function normalizeSearchText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .replace(DROPPED_PUNCTUATION, "")
    .replace(WORD_SEPARATORS, " ")
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

/**
 * Returns the Metadata records that match a search query.
 *
 * The query is lower-cased, stripped of punctuation and split into words; a
 * record matches when any word appears inside any of its string fields or
 * its keywords. An array query treats each string entry as one phrase.
 * A blank query returns the input array unchanged; anything that is not an
 * array of records yields an empty array.
 *
 * @param {Metadata[]} metadata Records to search
 * @param {string | string[]} query Search text, or a list of phrases
 * @returns {Metadata[]} The matching records, in their original order
 */
export default function filterMetadata(metadata, query) {
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
      values.some((candidateValue) => candidateValue.includes(token)),
    );
  });
}
