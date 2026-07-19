#!/usr/bin/env node
/** Generate static, indexable benefit guide pages from public/data.js. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "public", "data.js");
const INDEX = path.join(ROOT, "public", "index.html");
const OUT_DIR = path.join(ROOT, "public", "guides");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

// Reuse gen-benefits-context.js's loading technique: data.js is a classic
// browser script, so evaluate it in an isolated VM and expose BENEFITS.
const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(DATA, "utf8") +
    '\n;globalThis.__B = typeof BENEFITS !== "undefined" ? BENEFITS : null;',
  ctx
);
const benefits = ctx.__B;
if (!Array.isArray(benefits) || benefits.length === 0) {
  console.error("gen:guides — could not read BENEFITS from data.js");
  process.exit(1);
}

const indexHtml = fs.readFileSync(INDEX, "utf8");
const styleMatch = /<link\s+rel="stylesheet"\s+href="([^"]*styles\.css(?:\?v=[^"]+)?)"\s*\/>/.exec(indexHtml);
if (!styleMatch) {
  console.error("gen:guides — could not find the styles.css link in public/index.html");
  process.exit(1);
}
const styleHref = styleMatch[1].replace(/^\/?/, "/");

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const esc = (value) => clean(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const slugify = (id) => clean(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const description = (text, max = 155) => {
  const s = clean(text);
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  const boundary = cut.lastIndexOf(" ");
  return `${cut.slice(0, boundary > 80 ? boundary : max).replace(/[\s,;:–—-]+$/, "")}…`;
};
const officialLinks = (b) => {
  const links = [];
  const add = (url, label) => {
    if (typeof url !== "string" || !/^https?:\/\//.test(url) || links.some((x) => x.url === url)) return;
    links.push({ url, label });
  };
  add(b.applyUrl, clean(b.applyText) || "Apply or learn more");
  add(b.source, "Official government source");
  return links;
};
const list = (title, items, ordered = false) => {
  if (!Array.isArray(items) || !items.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `<section class="guide-block">
<h2 class="guide-h">${esc(title)}</h2>
<${tag} class="guide-list">
${items.map((x) => `  <li>${esc(x)}</li>`).join("\n")}
</${tag}>
</section>`;
};

function head({ title, desc, canonical }) {
  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:site_name" content="AbilityFinder" />
    <link rel="stylesheet" href="${esc(styleHref)}" />
    <style>
      .guide-link, .guide-link:visited {
        color: var(--accent-hi);
        text-decoration: underline;
        text-decoration-color: var(--accent-line);
        text-underline-offset: 0.16em;
      }
      .guide-link:hover {
        color: var(--accent);
        text-decoration-color: currentColor;
        text-decoration-thickness: 2px;
      }
      .guide-link:focus-visible {
        color: var(--accent-hi);
        outline: 2px solid var(--accent);
        outline-offset: 3px;
        border-radius: 4px;
        text-decoration-color: currentColor;
      }
    </style>
  </head>`;
}
function header() {
  return `    <header class="nav">
      <div class="nav-inner">
        <a class="brand" href="https://abilityfinder.ca/" aria-label="AbilityFinder home"><span class="brand-name">AbilityFinder</span></a>
        <span class="nav-tag">Alberta</span>
      </div>
    </header>`;
}
function footer() {
  return `      <footer class="site-footer">
        <div class="sf-brand">AbilityFinder</div>
        <div class="sf-links">
          <a href="https://abilityfinder.ca/">Privacy &amp; disclaimer</a>
          <span class="sf-note">AbilityFinder is independent and not affiliated with any government. Always confirm details with the official source.</span>
        </div>
      </footer>`;
}

function benefitPage(b) {
  const slug = slugify(b.id);
  const canonical = `https://abilityfinder.ca/guides/${slug}`;
  const desc = description(b.summary);
  const detail = b.detail || {};
  const links = officialLinks(b);
  return `<!DOCTYPE html>
<html lang="en">
${head({ title: `${b.name} — AbilityFinder`, desc, canonical })}
  <body>
${header()}
    <div class="wrap">
      <main class="detail">
        <header class="detail-hero">
          <p class="eyebrow">${esc(b.level)} · ${esc(b.category)}</p>
          <h1 class="detail-title">${esc(b.name)}</h1>
          <p class="detail-lede">${esc(b.summary)}</p>
        </header>
        <div class="detail-body">
          <div class="detail-main">
            ${detail.about ? `<section class="guide-block"><h2 class="guide-h">What it is</h2><p class="detail-about">${esc(detail.about)}</p></section>` : ""}
            ${b.note ? `<section class="guide-block"><h2 class="guide-h">Who it is for</h2><p class="detail-about">${esc(b.note)}</p></section>` : ""}
            ${b.amount ? `<section class="guide-block"><h2 class="guide-h">Amount or value</h2><p class="detail-amount">${esc(b.amount)}</p></section>` : ""}
            ${list("How to apply", detail.steps, true)}
            ${list("What you may need", detail.documents)}
            ${list("Practical tips", detail.tips)}
            ${detail.time ? `<section class="guide-block"><h2 class="guide-h">Timing</h2><p class="detail-about">${esc(detail.time)}</p></section>` : ""}
            ${detail.phone ? `<section class="guide-block"><h2 class="guide-h">Phone</h2><p class="detail-about">${esc(detail.phone)}</p></section>` : ""}
          </div>
          <aside class="detail-side card">
            <h2 class="guide-h">Official information</h2>
            <ul class="guide-list">
${links.map((x) => `              <li><a class="guide-link" href="${esc(x.url)}">${esc(x.label)}</a></li>`).join("\n")}
            </ul>
            <p class="detail-foot">Benefit rules and amounts can change. Confirm the current details before applying.</p>
            <p><a class="btn btn-primary" href="https://abilityfinder.ca/">Answer a few questions to see every benefit you may qualify for</a></p>
          </aside>
        </div>
      </main>
${footer()}
    </div>
  </body>
</html>
`;
}

const skippedIds = [];
const publishableBenefits = benefits.filter((b) => {
  if (officialLinks(b).length) return true;
  skippedIds.push(b.id);
  return false;
});

const groups = new Map([["Federal", []], ["Provincial", []], ["Municipal", []]]);
for (const b of publishableBenefits) {
  const group = b.level === "Federal" ? "Federal" : b.level === "Alberta" ? "Provincial" : "Municipal";
  groups.get(group).push(b);
}
const guideIndex = `<!DOCTYPE html>
<html lang="en">
${head({
  title: "Disability benefit program guides — AbilityFinder",
  desc: "Plain-language guides to federal, Alberta, and municipal disability benefits, with eligibility, value, application steps, and official sources.",
  canonical: "https://abilityfinder.ca/guides/",
})}
  <body>
${header()}
    <div class="wrap">
      <main class="browse">
        <header class="browse-head">
          <p class="eyebrow">Alberta + federal benefits</p>
          <h1>Program guides</h1>
          <p>Browse plain-language guides to every benefit in the AbilityFinder catalog.</p>
          <p><a class="btn btn-primary" href="https://abilityfinder.ca/">Answer a few questions to see every benefit you may qualify for</a></p>
        </header>
${[...groups].map(([name, items]) => `        <section class="section">
          <h2 class="section-title">${name}</h2>
          <ul class="guide-list">
${items.map((b) => `            <li><a class="guide-link" href="/guides/${slugify(b.id)}">${esc(b.name)}</a> — ${esc(b.summary)}</li>`).join("\n")}
          </ul>
        </section>`).join("\n")}
      </main>
${footer()}
    </div>
  </body>
</html>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
const outputFiles = new Set(["index.html", ...publishableBenefits.map((b) => `${slugify(b.id)}.html`)]);
for (const file of fs.readdirSync(OUT_DIR)) {
  if (file.endsWith(".html") && !outputFiles.has(file)) fs.unlinkSync(path.join(OUT_DIR, file));
}
for (const b of publishableBenefits) fs.writeFileSync(path.join(OUT_DIR, `${slugify(b.id)}.html`), benefitPage(b));
fs.writeFileSync(path.join(OUT_DIR, "index.html"), guideIndex);

const oldSitemap = fs.existsSync(SITEMAP) ? fs.readFileSync(SITEMAP, "utf8") : "";
const preserved = [...oldSitemap.matchAll(/  <url>\n[\s\S]*?  <\/url>/g)]
  .map((m) => m[0])
  .filter((block) => !/<loc>https:\/\/abilityfinder\.ca\/guides(?:\/|<)/.test(block));
const guideUrls = ["https://abilityfinder.ca/guides/", ...publishableBenefits.map((b) => `https://abilityfinder.ca/guides/${slugify(b.id)}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${preserved.join("\n")}
${guideUrls.map((url) => `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${url.endsWith("/guides/") ? "0.8" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(SITEMAP, sitemap);
console.log(`gen:guides — wrote ${publishableBenefits.length} benefit pages + public/guides/index.html and public/sitemap.xml`);
if (skippedIds.length) console.warn(`gen:guides — skipped entries with no static official source URL: ${skippedIds.join(", ")}`);
