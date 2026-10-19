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
    '\n;globalThis.__STATUS = typeof BENEFIT_STATUS !== "undefined" ? BENEFIT_STATUS : {};' +
    '\n;globalThis.__GLOSS = typeof glossaryTermsFor === "function" ? glossaryTermsFor : () => [];' +
    '\n;globalThis.__BC_CITIES = typeof BC_CITIES !== "undefined" ? BC_CITIES : null;' +
    '\n;globalThis.__ON_CITIES = typeof ON_CITIES !== "undefined" ? ON_CITIES : null;' +
    '\n;globalThis.__SK_CITIES = typeof SK_CITIES !== "undefined" ? SK_CITIES : [];' +
    '\n;globalThis.__MB_CITIES = typeof MB_CITIES !== "undefined" ? MB_CITIES : [];' +
    '\n;globalThis.__NB_CITIES = typeof NB_CITIES !== "undefined" ? NB_CITIES : [];' +
    '\n;globalThis.__NS_CITIES = typeof NS_CITIES !== "undefined" ? NS_CITIES : [];' +
    '\n;globalThis.__PE_CITIES = typeof PE_CITIES !== "undefined" ? PE_CITIES : [];' +
    '\n;globalThis.__NL_CITIES = typeof NL_CITIES !== "undefined" ? NL_CITIES : [];' +
    '\n;globalThis.__QC_CITIES = typeof QC_CITIES !== "undefined" ? QC_CITIES : [];' +
    '\n;globalThis.__NOTICES = typeof PROVINCE_NOTICES !== "undefined" ? PROVINCE_NOTICES : {};' +
    '\n;globalThis.__SHARED_CITIES = typeof SHARED_CITIES !== "undefined" ? SHARED_CITIES : {};' +
    '\n;globalThis.__ON_REGIONS = typeof ON_REGIONS !== "undefined" ? ON_REGIONS : [];',
  ctx
);
const allBenefits = ctx.__B;
const benefitMeta = ctx.__M || {};
const STATUS = ctx.__STATUS || {};
const glossaryTermsFor = ctx.__GLOSS || (() => []);
if (!Array.isArray(allBenefits) || allBenefits.length === 0) {
  console.error("gen:guides — could not read BENEFITS from data.js");
  process.exit(1);
}

const appSource = fs.readFileSync(APP, "utf8");
// Evaluate the app's exact freshness helper: one decision for both surfaces.
const freshnessConstants = ["DATA_VERIFIED_MONTH", "STALE_MONTHS", "MONTHS_EN"]
  .map(name => appSource.match(new RegExp(`^const ${name} = .*;$`, "m"))?.[0]);
const freshnessFunction = appSource.match(/function verifiedFor\(b\) \{[\s\S]*?\n\}/)?.[0];
if (freshnessConstants.some(x => !x) || !freshnessFunction) throw new Error("Missing app freshness helper");
vm.runInContext(freshnessConstants.join("\n") + "\n" + freshnessFunction + "\nglobalThis.guideFreshness = verifiedFor;", ctx);
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
const skEnabledMatch = /^const SK_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!skEnabledMatch) {
  throw new Error("gen:guides — could not find literal const SK_ENABLED = true/false in public/app.js");
}
const skEnabled = skEnabledMatch[1] === "true";
const skCities = ctx.__SK_CITIES || [];
const sharedCities = ctx.__SHARED_CITIES || {};
// Shared border cities (Lloydminster) stay with their Alberta records.
const benefitIsSaskatchewan = (b) => b.level === "Saskatchewan" || (skCities.includes(b.level) && !sharedCities[b.level]);
const mbEnabledMatch = /^const MB_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!mbEnabledMatch) {
  throw new Error("gen:guides — could not find literal const MB_ENABLED = true/false in public/app.js");
}
const mbEnabled = mbEnabledMatch[1] === "true";
const mbCities = ctx.__MB_CITIES || [];
const benefitIsManitoba = (b) => b.level === "Manitoba" || mbCities.includes(b.level);
const nbEnabledMatch = /^const NB_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!nbEnabledMatch) {
  throw new Error("gen:guides — could not find literal const NB_ENABLED = true/false in public/app.js");
}
const nbEnabled = nbEnabledMatch[1] === "true";
const nbCities = ctx.__NB_CITIES || [];
const benefitIsNewBrunswick = (b) => b.level === "New Brunswick" || nbCities.includes(b.level);
const nsEnabledMatch = /^const NS_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!nsEnabledMatch) {
  throw new Error("gen:guides — could not find literal const NS_ENABLED = true/false in public/app.js");
}
const nsEnabled = nsEnabledMatch[1] === "true";
const nsCities = ctx.__NS_CITIES || [];
const benefitIsNovaScotia = (b) => b.level === "Nova Scotia" || nsCities.includes(b.level);
const peEnabledMatch = /^const PE_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!peEnabledMatch) {
  throw new Error("gen:guides — could not find literal const PE_ENABLED = true/false in public/app.js");
}
const peEnabled = peEnabledMatch[1] === "true";
const peCities = ctx.__PE_CITIES || [];
const benefitIsPrinceEdwardIsland = (b) => b.level === "Prince Edward Island" || peCities.includes(b.level);
const nlEnabledMatch = /^const NL_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!nlEnabledMatch) {
  throw new Error("gen:guides — could not find literal const NL_ENABLED = true/false in public/app.js");
}
const nlEnabled = nlEnabledMatch[1] === "true";
const nlCities = ctx.__NL_CITIES || [];
const benefitIsNewfoundlandandLabrador = (b) => b.level === "Newfoundland and Labrador" || nlCities.includes(b.level);
const qcEnabledMatch = /^const QC_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!qcEnabledMatch) {
  throw new Error("gen:guides — could not find literal const QC_ENABLED = true/false in public/app.js");
}
const qcEnabled = qcEnabledMatch[1] === "true";
const qcCities = ctx.__QC_CITIES || [];
const benefitIsQuebec = (b) => b.level === "Quebec" || qcCities.includes(b.level);
const benefitIsBritishColumbia = (b) =>
  b.level === "British Columbia" || b.level === "Metro Vancouver" || bcCities.includes(b.level);
const onRegions = ctx.__ON_REGIONS || [];
const benefitIsOntario = (b) =>
  b.level === "Ontario" || onCities.includes(b.level) || onRegions.includes(b.level);

/* Public-facing copy composes from the enabled provinces, so flipping a province flag
   updates the guides index without anyone remembering to hand-edit the description.
   With BC on and Ontario off this produces exactly the prior "Alberta and British
   Columbia" wording, so a dark rollout leaves the generated output byte-identical. */
const enabledProvinceNames = [
  "Alberta",
  ...(bcEnabled ? ["British Columbia"] : []),
  ...(onEnabled ? ["Ontario"] : []),
  ...(skEnabled ? ["Saskatchewan"] : []),
  ...(mbEnabled ? ["Manitoba"] : []),
  ...(nbEnabled ? ["New Brunswick"] : []),
  ...(nsEnabled ? ["Nova Scotia"] : []),
  ...(peEnabled ? ["Prince Edward Island"] : []),
  ...(nlEnabled ? ["Newfoundland and Labrador"] : []),
  ...(qcEnabled ? ["Quebec"] : []),
];
const provinceProse =
  enabledProvinceNames.length <= 1
    ? enabledProvinceNames[0] || ""
    : `${enabledProvinceNames.slice(0, -1).join(", ")} and ${enabledProvinceNames[enabledProvinceNames.length - 1]}`;
let benefits = allBenefits;
if (!bcEnabled) benefits = benefits.filter((b) => !benefitIsBritishColumbia(b));
if (!onEnabled) benefits = benefits.filter((b) => !benefitIsOntario(b));
if (!skEnabled) benefits = benefits.filter((b) => !benefitIsSaskatchewan(b));
if (!mbEnabled) benefits = benefits.filter((b) => !benefitIsManitoba(b));
if (!nbEnabled) benefits = benefits.filter((b) => !benefitIsNewBrunswick(b));
if (!nsEnabled) benefits = benefits.filter((b) => !benefitIsNovaScotia(b));
if (!peEnabled) benefits = benefits.filter((b) => !benefitIsPrinceEdwardIsland(b));
if (!nlEnabled) benefits = benefits.filter((b) => !benefitIsNewfoundlandandLabrador(b));
if (!qcEnabled) benefits = benefits.filter((b) => !benefitIsQuebec(b));
console.log(
  `BC_ENABLED=${bcEnabled} ON_ENABLED=${onEnabled} SK_ENABLED=${skEnabled} MB_ENABLED=${mbEnabled} NB_ENABLED=${nbEnabled} NS_ENABLED=${nsEnabled} PE_ENABLED=${peEnabled} NL_ENABLED=${nlEnabled} QC_ENABLED=${qcEnabled} — excluded ${allBenefits.length - benefits.length} dark-province entries; generating ${benefits.length} entries.`
);

const indexHtml = fs.readFileSync(INDEX, "utf8");
const styleMatch = /<link\s+rel="stylesheet"\s+href="([^"]*styles\.css(?:\?v=[^"]+)?)"\s*\/>/.exec(indexHtml);
if (!styleMatch) {
  console.error("gen:guides — could not find the styles.css link in public/index.html");
  process.exit(1);
}
const styleHref = styleMatch[1].replace(/^\/?/, "/");
// Same ?v=N as the stylesheet, so every guide asset moves with one bump.
const assetQuery = (/\?v=[^"]+$/.exec(styleHref) || [""])[0];
// Short scope label for the header tag, e.g. "Alberta + BC + Ontario".
// Same short form as the app header (_SCOPE_ABBR): ten full province names overflow the nav.
const scopeTag = ["Alberta", ...(bcEnabled ? ["BC"] : []), ...(onEnabled ? ["ON"] : []), ...(skEnabled ? ["SK"] : []), ...(mbEnabled ? ["MB"] : []), ...(nbEnabled ? ["NB"] : []), ...(nsEnabled ? ["NS"] : []), ...(peEnabled ? ["PEI"] : []), ...(nlEnabled ? ["NL"] : []), ...(qcEnabled ? ["QC"] : [])].join(" + ")

// Non-breaking spaces stay: French typography uses them before ":" and "$".
const clean = (value) => String(value ?? "").replace(/[^\S\u00a0\u202f]+/g, " ").trim();
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
  add(b.applyUrl, clean(b.applyText) || (() => { try { return `Open the official page on ${new URL(b.applyUrl).hostname.replace(/^www2?\./, "")}`; } catch { return "Apply or learn more"; } })());
  add(b.source, labelsFor(b).official);
  return links;
};
/* Guide labels. Québec records (b.lang === "fr") keep the official French wording,
   so their static page is French throughout: page language, headings, navigation
   and footer. Every other page uses the English labels, unchanged. */
const GUIDE_LABELS = {
  en: {
    level: (x) => x, category: (x) => x, verified: (x) => x,
    html: "en", home: "AbilityFinder home", find: "Find benefits", guides: "Program guides",
    privacy: "Privacy &amp; disclaimer",
    independent: "AbilityFinder is independent and not affiliated with any government. Always confirm details with the official source.",
    whatItIs: "What it is", goodToKnow: "Good to know", mustMeet: "What you must meet",
    mustAny: "The program requires at least one of these:", mustAll: "You must meet all of these:",
    amount: "Amount or value", tiers: "How the amount is worked out", glance: "At a glance",
    difficulty: "Difficulty", application: "Application", howLong: "How long", covers: "What it covers",
    how: "How to apply", need: "What you may need", tips: "Practical tips", timing: "Timing",
    abbr: "Abbreviations on this page", phone: "Phone", confirm: "Confirm before applying",
    nextH: "Your next step", nextP: "Open the official program page, check the current rules, and use its application route.",
    foot: "Benefit rules and amounts can change. Confirm the current details before applying.",
    cta: "Answer a few questions to see benefits you may qualify for",
    official: "Official government source", easy: "Easy", medium: "Medium", hard: "Hard",
    steps: [
      "Open the official program page and review the current eligibility rules, dates and application method.",
      "Gather the documents named on the official application page; requirements can change.",
      "Apply through the official link below, then keep a copy or confirmation number for follow-up.",
    ],
  },
  fr: {
    level: (x) => (x === "Quebec" ? "Québec" : x),
    category: (x) => ({ "Income support": "Soutien du revenu", "Health": "Santé", "Health (for children)": "Santé (enfants)", "Home support": "Soutien à domicile", "Home": "Domicile", "Housing": "Logement", "Money": "Aide financière", "Money (for parents)": "Aide financière (parents)", "Money & taxes": "Argent et impôts", "Education": "Éducation", "Employment": "Emploi", "Daily living supports": "Soutien à la vie quotidienne", "Community supports": "Soutien communautaire" })[x] || x,
    verified: (x) => {
      const months = { January: "janvier", February: "février", March: "mars", April: "avril", May: "mai", June: "juin", July: "juillet", August: "août", September: "septembre", October: "octobre", November: "novembre", December: "décembre" };
      const m = /^(Info verified|Part of the) (\w+) (\d{4})(?: catalogue review)?$/.exec(x);
      if (!m) return x;
      const when = `${months[m[2]] || m[2]} ${m[3]}`;
      return m[1] === "Info verified" ? `Information vérifiée en ${when}` : `Revue du catalogue de ${when}`;
    },
    html: "fr-CA", home: "Accueil AbilityFinder", find: "Trouver des prestations", guides: "Guides des programmes",
    privacy: "Confidentialité et avis",
    independent: "AbilityFinder est indépendant et n’est affilié à aucun gouvernement. Confirmez toujours les détails auprès de la source officielle.",
    whatItIs: "En quoi consiste le programme", goodToKnow: "Bon à savoir", mustMeet: "Conditions à remplir",
    mustAny: "Le programme exige au moins une de ces conditions :", mustAll: "Vous devez remplir toutes ces conditions :",
    amount: "Montant ou valeur", tiers: "Calcul du montant", glance: "En bref",
    difficulty: "Difficulté", application: "Demande", howLong: "Délai", covers: "Ce qui est couvert",
    how: "Comment faire une demande", need: "Ce dont vous pourriez avoir besoin", tips: "Conseils pratiques", timing: "Délais",
    abbr: "Sigles sur cette page", phone: "Téléphone", confirm: "À confirmer avant de faire une demande",
    nextH: "Prochaine étape", nextP: "Ouvrez la page officielle du programme, vérifiez les règles en vigueur et suivez sa démarche de demande.",
    foot: "Les règles et les montants peuvent changer. Confirmez les détails à jour avant de faire une demande.",
    cta: "Répondez à quelques questions pour voir les prestations auxquelles vous pourriez avoir droit",
    official: "Source gouvernementale officielle", easy: "Facile", medium: "Moyenne", hard: "Difficile",
    steps: [
      "Ouvrez la page officielle du programme et lisez les règles d’admissibilité, les dates et la façon de faire une demande.",
      "Réunissez les documents demandés sur la page officielle; les exigences peuvent changer.",
      "Faites votre demande au moyen du lien officiel ci-dessous, puis gardez une copie ou un numéro de confirmation.",
    ],
  },
};
const labelsFor = (b) => GUIDE_LABELS[b && b.lang === "fr" ? "fr" : "en"];

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
    <script src="/dbManager.js${esc(assetQuery)}"></script>
    <script src="/guide-prefs.js${esc(assetQuery)}"></script>
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
function header(L = GUIDE_LABELS.en) {
  return `    <header class="nav">
      <div class="nav-inner">
        <a class="brand" href="https://abilityfinder.ca/" aria-label="${L.home}"><span class="brand-name">AbilityFinder</span></a>
        <div class="nav-right">
          <span class="nav-tag">${scopeTag}</span>
          <a class="guide-link" href="https://abilityfinder.ca/">${L.find}</a>
          <a class="guide-link" href="https://abilityfinder.ca/guides/">${L.guides}</a>
        </div>
      </div>
    </header>`;
}
function footer(L = GUIDE_LABELS.en) {
  return `      <footer class="site-footer">
        <div class="sf-brand">AbilityFinder</div>
        <div class="sf-links">
          <a class="guide-link" href="https://abilityfinder.ca/?view=privacy">${L.privacy}</a>
          <span class="sf-note">${L.independent}</span>
        </div>
      </footer>`;
}

function benefitPage(b) {
  const slug = slugify(b.id);
  const canonical = `https://abilityfinder.ca/guides/${slug}`;
  const desc = description(b.summary);
  const detail = b.detail || {};
  const meta = benefitMeta[b.id] || {};
  const L = labelsFor(b);
  const difficulty = meta.difficulty <= 2 ? L.easy : meta.difficulty === 3 ? L.medium : meta.difficulty ? L.hard : "";
  const steps = Array.isArray(detail.steps) && detail.steps.length ? detail.steps : L.steps;
  const links = officialLinks(b);
  return `<!DOCTYPE html>
<html lang="${L.html}">
${head({ title: `${b.name} — AbilityFinder`, desc, canonical })}
  <body>
${header(L)}
    <div class="wrap">
      <main class="detail">
        <header class="detail-hero">
          <p class="eyebrow">${esc(L.level(b.level))} · ${esc(L.category(b.category))}</p>
          <h1 class="detail-title">${esc(b.name)}</h1>
          ${STATUS[b.id] ? `<p class="status-badge status-${esc(STATUS[b.id].kind)}">${esc(STATUS[b.id].text)}</p>` : ""}
          <p class="detail-lede">${esc(b.summary)}</p>
        </header>
        ${(() => { const N = ctx.__NOTICES || {}; const n = benefitIsManitoba(b) ? N.MB : benefitIsQuebec(b) && N.QC ? (N.QC.fr || N.QC) : null; return n ? `<div class="callout province-notice" role="note"><div><b>${esc(n.title)}</b><p>${esc(n.lede)}</p><ul>${n.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></div></div>` : ""; })()}
        <div class="detail-body">
          <div class="detail-main">
            ${detail.aboutList && detail.aboutList.items && detail.aboutList.items.length
              ? `<section class="guide-block"><h2 class="guide-h">${L.whatItIs}</h2>${detail.aboutList.lead ? `<p class="detail-about">${esc(detail.aboutList.lead)}</p>` : ""}<ul class="eligibility-list">${detail.aboutList.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></section>`
              : detail.about ? `<section class="guide-block"><h2 class="guide-h">${L.whatItIs}</h2><p class="detail-about">${esc(detail.about)}</p></section>` : ""}
            ${b.note ? `<section class="guide-block"><h2 class="guide-h">${L.goodToKnow}</h2><p class="detail-about">${esc(b.note)}</p></section>` : ""}
            ${b.eligibility && b.eligibility.items && b.eligibility.items.length
              ? `<section class="guide-block"><h2 class="guide-h">${L.mustMeet}</h2><p class="eligibility-lead">${b.eligibility.mode === "any" ? L.mustAny : L.mustAll}</p><ul class="eligibility-list">${b.eligibility.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>${b.eligibility.note ? (b.eligibility.note.items ? `<p class="eligibility-lead">${esc(b.eligibility.note.lead)}</p><ul class="eligibility-list">${b.eligibility.note.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul><p class="detail-about eligibility-note">${esc(b.eligibility.note.after)}</p>` : `<p class="detail-about eligibility-note">${esc(b.eligibility.note)}</p>`) : ""}</section>`
              : b.requiresNote ? `<section class="guide-block"><h2 class="guide-h">${L.mustMeet}</h2><p class="detail-about">${esc(b.requiresNote)}</p></section>` : ""}
            ${b.amount ? `<section class="guide-block"><h2 class="guide-h">${L.amount}</h2><p class="detail-amount">${esc(b.amount)}</p></section>` : ""}
            ${b.amountTiers && b.amountTiers.rows && b.amountTiers.rows.length ? `<section class="guide-block"><h2 class="guide-h">${esc(b.amountTiers.caption || L.tiers)}</h2><div class="tier-scroll"><table class="amount-tiers"><thead><tr>${b.amountTiers.headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.amountTiers.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>` : ""}
            ${difficulty || meta.effort || (meta.wait && !detail.time) ? `<section class="guide-block"><h2 class="guide-h">${L.glance}</h2><dl class="guide-list">${difficulty ? `<div><dt>${L.difficulty}</dt><dd>${esc(difficulty)}</dd></div>` : ""}${meta.effort ? `<div><dt>${L.application}</dt><dd>${esc(meta.effort)}</dd></div>` : ""}${meta.wait && !detail.time ? `<div><dt>${L.howLong}</dt><dd>${esc(meta.wait)}</dd></div>` : ""}</dl></section>` : ""}
            ${detail.coversList && detail.coversList.items && detail.coversList.items.length ? `<section class="guide-block"><h2 class="guide-h">${L.covers}</h2>${detail.coversList.lead ? `<p class="eligibility-lead">${esc(detail.coversList.lead)}</p>` : ""}<ul class="eligibility-list">${detail.coversList.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul></section>` : ""}
            ${list(L.how, steps, true)}
            ${list(L.need, detail.documents)}
            ${list(L.tips, detail.tips)}
            ${detail.time ? `<section class="guide-block"><h2 class="guide-h">${L.timing}</h2><p class="detail-about">${esc(detail.time)}</p></section>` : ""}
            ${(() => { const terms = glossaryTermsFor(b); return terms.length ? `<section class="guide-block"><h2 class="guide-h">${L.abbr}</h2><dl class="guide-list">${terms.map(([a, e]) => `<div><dt><abbr title="${esc(e)}">${esc(a)}</abbr></dt><dd>${esc(e)}</dd></div>`).join("")}</dl></section>` : ""; })()}
            ${detail.phone ? `<section class="guide-block"><h2 class="guide-h">${L.phone}</h2><p class="detail-about">${esc(detail.phone)}</p></section>` : ""}
          </div>
          <aside class="detail-side">
            <div class="side-card">
            <span class="side-status maybe">${L.confirm}</span>
            <div class="side-next"><h2>${L.nextH}</h2><p>${L.nextP}</p></div>
            <ul class="guide-list">
${links.map((x) => `              <li><a class="guide-link" href="${esc(x.url)}">${esc(x.label)}</a></li>`).join("\n")}
            </ul>
            <p class="side-foot"><span class="verified">${esc(L.verified(ctx.guideFreshness(b).wording))}</span></p>
            <p class="detail-foot">${L.foot}</p>
            <p><a class="btn btn-primary" href="https://abilityfinder.ca/">${L.cta}</a></p>
            </div>
          </aside>
        </div>
      </main>
${footer(L)}
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
          <p class="eyebrow">${provinceProse} + federal benefits</p>
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
