#!/usr/bin/env node
/** Generate static, indexable benefit guide pages from public/data.js. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "public", "data.js");
const INDEX = path.join(ROOT, "public", "index.html");
const APP = path.join(ROOT, "public", "app.js");
const OUT_DIR = path.join(ROOT, "public", "guides");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

// Reuse gen-benefits-context.js's loading technique: data.js is a classic
// browser script, so evaluate it in an isolated VM and expose BENEFITS.
const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(DATA, "utf8") +
    '\n;globalThis.__B = typeof BENEFITS !== "undefined" ? BENEFITS : null;' +
    '\n;globalThis.__M = typeof BENEFIT_META !== "undefined" ? BENEFIT_META : null;' +
    '\n;globalThis.__BC_CITIES = typeof BC_CITIES !== "undefined" ? BC_CITIES : null;' +
    '\n;globalThis.__ON_CITIES = typeof ON_CITIES !== "undefined" ? ON_CITIES : null;',
  ctx
);
const allBenefits = ctx.__B;
const benefitMeta = ctx.__M || {};
if (!Array.isArray(allBenefits) || allBenefits.length === 0) {
  console.error("gen:guides — could not read BENEFITS from data.js");
  process.exit(1);
}

const appSource = fs.readFileSync(APP, "utf8");
const bcEnabledMatch = /^const BC_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!bcEnabledMatch) {
  throw new Error("gen:guides — could not find literal const BC_ENABLED = true/false in public/app.js");
}
const bcEnabled = bcEnabledMatch[1] === "true";
const bcCities = ctx.__BC_CITIES;
if (!Array.isArray(bcCities)) {
  throw new Error("gen:guides — could not read BC_CITIES from data.js");
}
const onEnabledMatch = /^const ON_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!onEnabledMatch) {
  throw new Error("gen:guides — could not find literal const ON_ENABLED = true/false in public/app.js");
}
const onEnabled = onEnabledMatch[1] === "true";
const onCities = ctx.__ON_CITIES;
if (!Array.isArray(onCities)) {
  throw new Error("gen:guides — could not read ON_CITIES from data.js");
}
const benefitIsBritishColumbia = (b) =>
  b.level === "British Columbia" || b.level === "Metro Vancouver" || bcCities.includes(b.level);
const benefitIsOntario = (b) => b.level === "Ontario" || onCities.includes(b.level);

/* Public-facing copy composes from the enabled provinces, so flipping a province flag
   updates the guides index without anyone remembering to hand-edit the description.
   With BC on and Ontario off this produces exactly the prior "Alberta and British
   Columbia" wording, so a dark rollout leaves the generated output byte-identical. */
const enabledProvinceNames = [
  "Alberta",
  ...(bcEnabled ? ["British Columbia"] : []),
  ...(onEnabled ? ["Ontario"] : []),
];
const provinceProse =
  enabledProvinceNames.length <= 1
    ? enabledProvinceNames[0] || ""
    : `${enabledProvinceNames.slice(0, -1).join(", ")} and ${enabledProvinceNames[enabledProvinceNames.length - 1]}`;
let benefits = allBenefits;
if (!bcEnabled) benefits = benefits.filter((b) => !benefitIsBritishColumbia(b));
if (!onEnabled) benefits = benefits.filter((b) => !benefitIsOntario(b));
console.log(
  `BC_ENABLED=${bcEnabled} ON_ENABLED=${onEnabled} — excluded ${allBenefits.length - benefits.length} dark-province entries; generating ${benefits.length} entries.`
);

const indexHtml = fs.readFileSync(INDEX, "utf8");
const styleMatch = /<link\s+rel="stylesheet"\s+href="([^"]*styles\.css(?:\?v=[^"]+)?)"\s*\/>/.exec(indexHtml);
if (!styleMatch) {
  console.error("gen:guides — could not find the styles.css link in public/index.html");
  process.exit(1);
}
const styleHref = styleMatch[1].replace(/^\/?/, "/");

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const cleanGeneratedWhitespace = (value) => value.replace(/[ \t]+$/gm, "");
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
    const staticUrl = typeof url === "function" ? url.staticUrl : url;
    if (typeof staticUrl !== "string" || !/^https?:\/\//.test(staticUrl) || links.some((x) => x.url === staticUrl)) return;
    links.push({ url: staticUrl, label });
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
    <!-- template r2 -->
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
        <div class="nav-right">
          <span class="nav-tag">Alberta + BC</span>
          <a class="guide-link" href="https://abilityfinder.ca/">Find benefits</a>
          <a class="guide-link" href="https://abilityfinder.ca/guides/">Program guides</a>
        </div>
      </div>
    </header>`;
}
function footer() {
  return `      <footer class="site-footer">
        <div class="sf-brand">AbilityFinder</div>
        <div class="sf-links">
          <a href="https://abilityfinder.ca/?view=privacy">Privacy &amp; disclaimer</a>
          <span class="sf-note">AbilityFinder is independent and not affiliated with any government. Always confirm details with the official source.</span>
        </div>
      </footer>`;
}

function benefitPage(b) {
  const slug = slugify(b.id);
  const canonical = `https://abilityfinder.ca/guides/${slug}`;
  const desc = description(b.summary);
  const detail = b.detail || {};
  const meta = benefitMeta[b.id] || {};
  const difficulty = meta.difficulty <= 2 ? "Easy" : meta.difficulty === 3 ? "Medium" : meta.difficulty ? "Hard" : "";
  const steps = Array.isArray(detail.steps) && detail.steps.length ? detail.steps : [
    "Open the official program page and review the current eligibility rules, dates and application method.",
    "Gather the documents named on the official application page; requirements can change.",
    "Apply through the official link below, then keep a copy or confirmation number for follow-up.",
  ];
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
            ${detail.aboutList && detail.aboutList.items && detail.aboutList.items.length
              ? `<section class="guide-block"><h2 class="guide-h">What it is</h2>${detail.aboutList.lead ? `<p class="detail-about">${esc(detail.aboutList.lead)}</p>` : ""}<ul class="eligibility-list">${detail.aboutList.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></section>`
              : detail.about ? `<section class="guide-block"><h2 class="guide-h">What it is</h2><p class="detail-about">${esc(detail.about)}</p></section>` : ""}
            ${b.note ? `<section class="guide-block"><h2 class="guide-h">Good to know</h2><p class="detail-about">${esc(b.note)}</p></section>` : ""}
            ${b.eligibility && b.eligibility.items && b.eligibility.items.length
              ? `<section class="guide-block"><h2 class="guide-h">What you must meet</h2><p class="eligibility-lead">${b.eligibility.mode === "any" ? "You qualify if any of these apply:" : "You must meet all of these:"}</p><ul class="eligibility-list">${b.eligibility.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>${b.eligibility.note ? `<p class="detail-about eligibility-note">${esc(b.eligibility.note)}</p>` : ""}</section>`
              : b.requiresNote ? `<section class="guide-block"><h2 class="guide-h">What you must meet</h2><p class="detail-about">${esc(b.requiresNote)}</p></section>` : ""}
            ${b.amount ? `<section class="guide-block"><h2 class="guide-h">Amount or value</h2><p class="detail-amount">${esc(b.amount)}</p></section>` : ""}
            ${b.amountTiers && b.amountTiers.rows && b.amountTiers.rows.length ? `<section class="guide-block"><h2 class="guide-h">${esc(b.amountTiers.caption || "How the amount is worked out")}</h2><div class="tier-scroll"><table class="amount-tiers"><thead><tr>${b.amountTiers.headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.amountTiers.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>` : ""}
            ${difficulty || meta.effort || meta.wait ? `<section class="guide-block"><h2 class="guide-h">At a glance</h2><dl class="guide-list">${difficulty ? `<div><dt>Difficulty</dt><dd>${esc(difficulty)}</dd></div>` : ""}${meta.effort ? `<div><dt>Application</dt><dd>${esc(meta.effort)}</dd></div>` : ""}${meta.wait ? `<div><dt>Decision timing</dt><dd>${esc(meta.wait)}</dd></div>` : ""}</dl></section>` : ""}
            ${detail.coversList && detail.coversList.items && detail.coversList.items.length ? `<section class="guide-block"><h2 class="guide-h">What it covers</h2>${detail.coversList.lead ? `<p class="eligibility-lead">${esc(detail.coversList.lead)}</p>` : ""}<ul class="eligibility-list">${detail.coversList.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></section>` : ""}
            ${list("How to apply", steps, true)}
            ${list("What you may need", detail.documents)}
            ${list("Practical tips", detail.tips)}
            ${detail.time ? `<section class="guide-block"><h2 class="guide-h">Timing</h2><p class="detail-about">${esc(detail.time)}</p></section>` : ""}
            ${detail.phone ? `<section class="guide-block"><h2 class="guide-h">Phone</h2><p class="detail-about">${esc(detail.phone)}</p></section>` : ""}
          </div>
          <aside class="detail-side">
            <div class="side-card">
            <span class="side-status maybe">Confirm before applying</span>
            <div class="side-next"><h2>Your next step</h2><p>Open the official program page, check the current rules, and use its application route.</p></div>
            <ul class="guide-list">
${links.map((x) => `              <li><a class="guide-link" href="${esc(x.url)}">${esc(x.label)}</a></li>`).join("\n")}
            </ul>
            <p class="detail-foot">Benefit rules and amounts can change. Confirm the current details before applying.</p>
            <p><a class="btn btn-primary" href="https://abilityfinder.ca/">Answer a few questions to see benefits you may qualify for</a></p>
            </div>
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
  const group = b.level === "Federal"
    ? "Federal"
    : ["Alberta", "British Columbia", "Ontario"].includes(b.level)
      ? "Provincial"
      : "Municipal";
  groups.get(group).push(b);
}
const guideIndex = `<!DOCTYPE html>
<html lang="en">
${head({
  title: "Disability benefit program guides — AbilityFinder",
  desc: `Plain-language guides to disability benefits for ${provinceProse}, plus Canada-wide federal programs and selected municipal programs, with eligibility, value, application steps, and official sources.`,
  canonical: "https://abilityfinder.ca/guides/",
})}
  <body>
${header()}
    <div class="wrap">
      <main class="browse">
        <header class="browse-head">
          <p class="eyebrow">Alberta, BC + federal benefits</p>
          <h1>Program guides</h1>
          <p>Browse plain-language guides to the programs in the AbilityFinder catalog.</p>
          <p><a class="btn btn-primary" href="https://abilityfinder.ca/">Answer a few questions to see benefits you may qualify for</a></p>
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
for (const b of publishableBenefits) {
  fs.writeFileSync(path.join(OUT_DIR, `${slugify(b.id)}.html`), cleanGeneratedWhitespace(benefitPage(b)));
}
fs.writeFileSync(path.join(OUT_DIR, "index.html"), cleanGeneratedWhitespace(guideIndex));

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
