// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

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

  return keywords.length > 0 ? keywords : null;
}

function getMeta(doc, metaName, toArray = false) {
  const metas = doc.getElementsByTagName("meta");
  for (let i = 0; i < metas.length; i += 1) {
    if (
      metas[i].name === metaName ||
      metas[i].getAttribute("property") === metaName ||
      metas[i].getAttribute("property") === `og:${metaName}`
    ) {
      const content = metas[i].getAttribute("content");
      return toArray ? splitKeywords(content) : normalizeText(content);
    }
  }

  return null;
}

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  const doc = document.createElement("html");
  doc.innerHTML = typeof html === "string" ? html : "";
  const title = normalizeText(doc.getElementsByTagName("title")?.item(0)?.text);

  return {
    url: getMeta(doc, "url"),
    siteName: getMeta(doc, "site_name"),
    title,
    description: getMeta(doc, "description"),
    keywords: getMeta(doc, "keywords", true),
    author: getMeta(doc, "author"),
  };
}
