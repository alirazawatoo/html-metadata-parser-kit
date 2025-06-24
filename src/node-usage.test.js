// @vitest-environment node
import { JSDOM } from "jsdom";
import { describe, expect, test } from "vitest";
import { filterMetadata, getMetadata } from "./index.js";

describe("index.js in plain Node", () => {
  test("Has no global DOMParser to fall back on", () => {
    expect(globalThis.DOMParser).toBeUndefined();
    expect(() => getMetadata("<title>x</title>")).toThrow(TypeError);
  });
  test("Works with an injected jsdom DOMParser", () => {
    const { DOMParser } = new JSDOM().window;
    const html =
      '<title>Node page</title><meta name="keywords" content="node, jsdom">';
    const metadata = getMetadata(html, { DOMParser });

    expect(metadata).toMatchObject({
      title: "Node page",
      keywords: ["node", "jsdom"],
    });
    expect(filterMetadata([metadata], "jsdom")).toEqual([metadata]);
  });
});
