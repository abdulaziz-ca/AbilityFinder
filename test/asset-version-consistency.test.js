"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const indexHtml = fs.readFileSync(path.join(PUBLIC, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(PUBLIC, "styles.css"), "utf8");

function versionsIn(source) {
  return [...source.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
}

function versionedUrlsIn(source) {
  return [...source.matchAll(/[^"'()\s<>]+\?v=(\d+)/g)].map((match) => ({
    url: match[0],
    version: match[1],
  }));
}

function attributesIn(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)]
      .map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? ""])
  );
}

test("asset versions and font preloads stay consistent", () => {
  const indexVersions = versionsIn(indexHtml);
  const distinctIndexVersions = [...new Set(indexVersions)];

  assert.equal(
    distinctIndexVersions.length,
    1,
    `public/index.html must use exactly one asset version; found: ${JSON.stringify(distinctIndexVersions)}`
  );
  const canonicalVersion = distinctIndexVersions[0];

  const cssVersionedUrls = versionedUrlsIn(stylesCss);
  assert.equal(
    cssVersionedUrls.length,
    versionsIn(stylesCss).length,
    "every version marker in public/styles.css must belong to a URL"
  );
  for (const { url, version } of cssVersionedUrls) {
    assert.equal(
      version,
      canonicalVersion,
      `${url} uses v${version}, but public/index.html uses v${canonicalVersion}; ` +
        "a mismatch causes the browser to download the font twice and wastes the preload"
    );
  }

  const fontPreloadHrefs = [...indexHtml.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => attributesIn(match[0]))
    .filter((attributes) => attributes.rel?.split(/\s+/).includes("preload") && attributes.as === "font")
    .map((attributes) => attributes.href);

  assert.ok(fontPreloadHrefs.length > 0, "public/index.html must preload at least one font");
  for (const href of fontPreloadHrefs) {
    assert.ok(href, "every font preload must have an href");
    assert.ok(
      stylesCss.includes(href),
      `font preload ${href} is missing from public/styles.css; a preload must exactly match its CSS URL`
    );
  }

  const cssFontUrls = [...stylesCss.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)]
    .map((match) => match[1])
    .filter((url) => /\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(url));
  const referencedFonts = new Set([...fontPreloadHrefs, ...cssFontUrls]);
  for (const fontUrl of referencedFonts) {
    const relativePath = fontUrl.split("?", 1)[0];
    const fontPath = path.resolve(PUBLIC, relativePath);
    assert.equal(
      fontPath.startsWith(`${PUBLIC}${path.sep}`),
      true,
      `font URL ${fontUrl} must resolve under public/`
    );
    assert.equal(
      fs.existsSync(fontPath),
      true,
      `referenced font file ${relativePath} does not exist under public/`
    );
  }
});
