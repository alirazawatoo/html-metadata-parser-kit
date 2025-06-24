# HTML Metadata Parser Kit

Two dependency-free JavaScript utilities for extracting common page metadata from HTML and filtering metadata records with normalized search terms. The repository originated as a coding exercise; this copy retains that scope.

## Extract metadata

```js
const metadata = getMetadata(`
  <head>
    <title>Example Article</title>
    <meta property="og:url" content="https://example.com/article">
    <meta name="description" content="A compact example">
    <meta name="keywords" content="html, metadata">
  </head>
`)
```

The result contains `url`, `siteName`, `title`, `description`, `keywords`, and `author`. Missing or blank values become `null`; comma-separated keywords become a trimmed array.

## Filter records

```js
filterMetadata(records, "example metadata")
```

Search is case-insensitive, removes common punctuation, normalizes hyphens and underscores, and matches when any query token occurs in any record field. An empty query returns the original array.

## Setup and verification

```bash
npm install
npm test
```

Jest tests cover extraction and filtering behavior. Parsing uses a browser DOM element rather than a full HTML parser and is intended for controlled HTML strings, not hostile or malformed documents.
