/** @typedef {import("./index.js").Metadata} Metadata */

// Meta keys checked for each field, most specific first. A key matches a
// <meta> tag's `name` or `property` attribute, compared case-insensitively.
const META_KEYS = {
  url: ["og:url", "url"],
  siteName: ["og:site_name", "site_name"],
  title: ["og:title", "twitter:title"],
  description: ["og:description", "description", "twitter:description"],
  keywords: ["keywords"],
  author: ["author"],
};

function normalizeText(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

function splitKeywords(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const keywords = normalized
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return keywords.length > 0 ? [...new Set(keywords)] : null;
}

function emptyMetadata() {
  return {
    url: null,
    siteName: null,
    title: null,
    description: null,
    keywords: null,
    author: null,
  };
}

// DOMParser builds a detached, inert document: scripts never run and
// images never load, so untrusted HTML cannot execute while being read.
// Assigning to innerHTML of an element from the live document would let
// `<img src=x onerror=...>` fire in a browser.
function parseHtml(html, DOMParserImpl) {
  const Parser = DOMParserImpl ?? globalThis.DOMParser;
  if (typeof Parser !== "function") {
    throw new TypeError(
      "getMetadata needs a DOMParser: run it in a browser or pass one, e.g. getMetadata(html, { DOMParser: new JSDOM().window.DOMParser })",
    );
  }

  return new Parser().parseFromString(html, "text/html");
}

// First non-empty content for every name/property key, in document order.
function collectMetaContent(doc) {
  const contentByKey = new Map();

  Array.from(doc.getElementsByTagName("meta")).forEach((meta) => {
    const content = normalizeText(meta.getAttribute("content"));
    if (content === null) {
      return;
    }

    ["name", "property"].forEach((attribute) => {
      const key = normalizeText(meta.getAttribute(attribute))?.toLowerCase();
      if (key && !contentByKey.has(key)) {
        contentByKey.set(key, content);
      }
    });
  });

  return contentByKey;
}

function firstContent(contentByKey, keys) {
  const key = keys.find((candidate) => contentByKey.has(candidate));
  return key === undefined ? null : contentByKey.get(key);
}

/**
 * Reads page metadata from an HTML string.
 *
 * - url: `og:url`
 * - siteName: `og:site_name`
 * - title: the document `<title>`, falling back to `og:title`, then `twitter:title`
 * - description: `og:description`, then `description`, then `twitter:description`
 * - keywords: `keywords`, split on commas, trimmed and de-duplicated
 * - author: `author`
 *
 * Meta keys match either the `name` or the `property` attribute,
 * case-insensitively. Tags with missing or blank `content` are skipped, so a
 * later tag can still supply the value. Anything not found is `null`.
 *
 * @param {unknown} html The HTML document text to parse
 * @param {import("./index.js").GetMetadataOptions} [options] Pass a
 *   DOMParser implementation (jsdom, linkedom, happy-dom) outside the browser
 * @returns {Metadata} Metadata read from the document
 */
export default function getMetadata(html, { DOMParser: DOMParserImpl } = {}) {
  if (typeof html !== "string" || html.trim() === "") {
    return emptyMetadata();
  }

  const doc = parseHtml(html, DOMParserImpl);
  const contentByKey = collectMetaContent(doc);
  const read = (field) => firstContent(contentByKey, META_KEYS[field]);

  return {
    url: read("url"),
    siteName: read("siteName"),
    title: normalizeText(doc.title) ?? read("title"),
    description: read("description"),
    keywords: splitKeywords(read("keywords")),
    author: read("author"),
  };
}
