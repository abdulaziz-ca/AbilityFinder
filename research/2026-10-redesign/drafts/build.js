// Builds three static design drafts (one per direction) from one template, so the
// directions are compared on identical content. Not part of the live site.
// Usage: node build.js   -> writes quiet-paper.html, calm-green.html, clear-ink.html, index.html
const fs = require("fs");
const path = require("path");

const DIRECTIONS = {
  "quiet-paper": {
    name: "Quiet Paper",
    tagline: "Public-service clarity with a warm, printed-page feel.",
    fonts: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&display=swap",
    vars: {
      "--font-head": "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
      "--font-body": "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif",
      "--head-weight": "700", "--bg": "#FAF8F4", "--surface": "#FFFFFF", "--text": "#1B1F23", "--muted": "#4B5563",
      "--primary": "#0B5C75", "--on-primary": "#FFFFFF", "--tint": "#E3F0F4", "--accent": "#8A3B12",
      "--border": "#6B7280", "--hair": "#D9D4CA", "--focus": "#FFD23F", "--radius": "6px", "--radius-lg": "8px",
      "--shadow": "none", "--ready": "#0B5C75", "--check": "#8A3B12", "--later": "#4B5563",
    },
    hero: "plain",
  },
  "calm-green": {
    name: "Calm Green",
    tagline: "Gentle and reassuring, with rounded shapes and a warm serif voice.",
    fonts: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Figtree:wght@400;600;700&display=swap",
    vars: {
      "--font-head": "'Fraunces', Georgia, serif", "--font-body": "'Figtree', system-ui, sans-serif",
      "--head-weight": "600", "--bg": "#F6F4EE", "--surface": "#FFFFFF", "--text": "#22302B", "--muted": "#4A5A53",
      "--primary": "#1F6B55", "--on-primary": "#FFFFFF", "--tint": "#E4EFE9", "--accent": "#9A4A12",
      "--border": "#6B7A72", "--hair": "#DCD8CC", "--focus": "#22302B", "--radius": "14px", "--radius-lg": "20px",
      "--shadow": "0 1px 2px rgba(34,48,43,.06), 0 8px 24px rgba(34,48,43,.06)", "--ready": "#1F6B55", "--check": "#9A4A12", "--later": "#4A5A53",
    },
    hero: "tiles",
  },
  "clear-ink": {
    name: "Clear Ink",
    tagline: "Modern product polish: crisp white, one confident indigo, a tight grid.",
    fonts: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    vars: {
      "--font-head": "'Inter', system-ui, sans-serif", "--font-body": "'Inter', system-ui, sans-serif",
      "--head-weight": "700", "--bg": "#FFFFFF", "--surface": "#FFFFFF", "--text": "#14122B", "--muted": "#4A4766",
      "--primary": "#3B2F8F", "--on-primary": "#FFFFFF", "--tint": "#F1EFFA", "--accent": "#B4350A",
      "--border": "#767399", "--hair": "#E4E2EE", "--focus": "#3B2F8F", "--radius": "10px", "--radius-lg": "14px",
      "--shadow": "0 1px 3px rgba(20,18,43,.08)", "--ready": "#3B2F8F", "--check": "#B4350A", "--later": "#4A4766",
    },
    hero: "bento",
  },
};

const ICON = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function css(d) {
  const v = Object.entries(d.vars).map(([k, x]) => `  ${k}: ${x};`).join("\n");
  return `
:root {
${v}
}
* { box-sizing: border-box; }
html { font-size: 100%; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 1.1875rem; line-height: 1.6; }
h1, h2, h3 { font-family: var(--font-head); font-weight: var(--head-weight); line-height: 1.2; margin: 0 0 .5em; }
h1 { font-size: clamp(1.9rem, 4vw, 2.75rem); letter-spacing: ${d.hero === "bento" ? "-0.02em" : "0"}; }
h2 { font-size: clamp(1.4rem, 3vw, 1.85rem); }
h3 { font-size: 1.25rem; }
p { margin: 0 0 1em; max-width: 65ch; }
a { color: var(--primary); text-decoration: underline; text-underline-offset: .18em; text-decoration-thickness: 1.5px; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; ${d.vars["--focus"] === "#FFD23F" ? "box-shadow: 0 0 0 6px #1B1F23;" : "box-shadow: 0 0 0 5px #fff;"} }
.wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.skip { position: absolute; left: -9999px; } .skip:focus { left: 16px; top: 12px; background: var(--surface); padding: 10px 14px; z-index: 9; }
/* draft chrome */
.draft-bar { background: var(--text); color: var(--bg); font-size: .95rem; }
.draft-bar .wrap { display: flex; gap: 16px; align-items: center; justify-content: space-between; padding-top: 10px; padding-bottom: 10px; flex-wrap: wrap; }
.draft-bar a { color: var(--bg); }
.screen-label { display: inline-block; font-size: .85rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 56px 0 14px; border-top: 1px solid var(--hair); padding-top: 18px; width: 100%; }
/* header */
.site-header { background: var(--surface); border-bottom: 1px solid var(--hair); }
.site-header .wrap { display: flex; align-items: center; justify-content: space-between; min-height: 72px; gap: 16px; }
.brand { font-family: var(--font-head); font-weight: var(--head-weight); font-size: 1.3rem; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 10px; }
.brand-mark { width: 34px; height: 34px; border-radius: ${d.hero === "tiles" ? "50%" : "8px"}; background: var(--primary); display: grid; place-items: center; color: var(--on-primary); font-size: 1rem; }
.nav { display: flex; gap: 6px; align-items: center; }
.nav a { padding: 10px 14px; min-height: 48px; display: inline-flex; align-items: center; border-radius: var(--radius); text-decoration: none; color: var(--text); font-weight: 600; }
.nav a:hover { background: var(--tint); }
/* buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 12px 24px; border-radius: var(--radius); border: 2px solid var(--primary); background: var(--primary); color: var(--on-primary); font: 700 1.1rem var(--font-body); text-decoration: none; cursor: pointer; }
.btn svg { width: 22px; height: 22px; }
.btn-secondary { background: transparent; color: var(--primary); }
.cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
/* landing */
.hero { padding: 56px 0 40px; }
.hero p.lede { font-size: 1.3rem; color: var(--muted); }
.trust { display: flex; flex-wrap: wrap; gap: 10px 22px; padding: 0; margin: 22px 0 0; list-style: none; color: var(--muted); font-size: 1rem; }
.trust li { display: flex; gap: 8px; align-items: center; } .trust svg { width: 20px; height: 20px; color: var(--primary); }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 30px; }
.tile { background: var(--surface); border: 2px solid var(--hair); border-radius: var(--radius-lg); padding: 18px 20px; min-height: 96px; text-decoration: none; color: var(--text); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 4px; }
.tile:hover { border-color: var(--primary); }
.tile b { font-size: 1.12rem; } .tile span { color: var(--muted); font-size: 1rem; }
.bento { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; margin-top: 30px; }
.bento > div { background: var(--tint); border-radius: var(--radius-lg); padding: 22px; }
.bento .big { font-size: 2.6rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--primary); line-height: 1; }
.before { background: var(--surface); border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 22px 24px; margin-top: 30px; box-shadow: var(--shadow); }
.before ul { margin: 8px 0 0; padding-left: 1.2em; }
/* question */
.question { max-width: 680px; padding: 32px 0; }
.back { display: inline-flex; gap: 8px; align-items: center; min-height: 48px; color: var(--primary); font-weight: 600; }
.back svg { width: 20px; height: 20px; }
.stepnum { color: var(--muted); font-size: 1rem; margin: 10px 0 4px; }
fieldset { border: 0; padding: 0; margin: 0; }
legend h1 { margin-bottom: .3em; }
.hint { color: var(--muted); margin-bottom: 18px; }
.option { display: flex; gap: 14px; align-items: center; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius); padding: 16px 18px; min-height: 60px; margin-bottom: 10px; cursor: pointer; font-size: 1.12rem; }
.option input { width: 26px; height: 26px; accent-color: var(--primary); margin: 0; flex: none; }
.option.selected { border-color: var(--primary); background: var(--tint); box-shadow: inset 0 0 0 1px var(--primary); }
.not-sure { margin-top: 6px; }
/* results */
.results-head p { color: var(--muted); }
.summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 18px 0 28px; }
.summary-row > div { background: var(--surface); border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 16px 18px; box-shadow: var(--shadow); }
.summary-row b { display: block; font-size: 1.8rem; font-family: var(--font-head); color: var(--primary); font-variant-numeric: tabular-nums; }
.group-title { display: flex; gap: 10px; align-items: center; margin: 30px 0 12px; }
.badge { display: inline-flex; align-items: center; gap: 6px; font-size: .9rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1.5px solid currentColor; }
.badge svg { width: 16px; height: 16px; }
.badge.ready { color: var(--ready); } .badge.check { color: var(--check); } .badge.later { color: var(--later); }
.card { background: var(--surface); border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 20px 22px; margin-bottom: 14px; box-shadow: var(--shadow); ${d.hero === "plain" ? "border-left: 6px solid var(--ready);" : ""} }
.card.check { ${d.hero === "plain" ? "border-left-color: var(--check);" : ""} }
.card-top { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.card h3 { margin-bottom: .25em; } .card .where { color: var(--muted); font-size: 1rem; margin: 0; }
.amount { font-family: var(--font-head); font-weight: 700; color: var(--primary); font-size: 1.2rem; font-variant-numeric: tabular-nums; }
.checklist { list-style: none; padding: 0; margin: 14px 0; }
.checklist li { display: flex; gap: 10px; align-items: flex-start; padding: 6px 0; }
.checklist svg { width: 22px; height: 22px; flex: none; margin-top: 3px; }
.checklist .ok svg { color: var(--ready); } .checklist .todo svg { color: var(--check); }
.card-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
details.official { margin-top: 10px; border-top: 1px solid var(--hair); padding-top: 10px; }
details.official summary { cursor: pointer; min-height: 44px; display: flex; align-items: center; font-weight: 600; color: var(--primary); }
.rows { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--hair); }
.rows li { padding: 14px 2px; border-bottom: 1px solid var(--hair); }
.later-box { border: 2px dashed var(--hair); border-radius: var(--radius-lg); padding: 16px 20px; }
/* guide */
.guide { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 32px; padding: 24px 0 60px; }
.status-pill { display: inline-block; background: var(--tint); color: var(--primary); font-weight: 700; padding: 6px 12px; border-radius: var(--radius); margin-bottom: 14px; }
.side { background: var(--surface); border: 1px solid var(--hair); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow); align-self: start; position: sticky; top: 16px; }
.side dl { margin: 12px 0 0; } .side dt { color: var(--muted); font-size: .95rem; } .side dd { margin: 0 0 12px; font-weight: 600; }
.steps { counter-reset: s; list-style: none; padding: 0; }
.steps li { counter-increment: s; display: flex; gap: 14px; padding: 10px 0; }
.steps li::before { content: counter(s); flex: none; width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: var(--on-primary); display: grid; place-items: center; font-weight: 700; }
footer.site-footer { border-top: 1px solid var(--hair); padding: 28px 0 60px; color: var(--muted); font-size: 1rem; margin-top: 40px; }
@media (max-width: 760px) {
  .nav a:not(.keep) { display: none; }
  .bento, .summary-row { grid-template-columns: 1fr; }
  .guide { grid-template-columns: 1fr; }
  .side { position: static; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;
}

function page(key, d) {
  const heroBlock = {
    plain: `<ul class="trust" aria-label="About this tool">
        <li>${ICON.check}Free</li><li>${ICON.check}No sign-up</li><li>${ICON.check}Your answers stay on this device</li><li>${ICON.check}Links to official sources</li></ul>
      <div class="before"><h2>Before you start</h2><p>It takes a few minutes. Have a rough idea of your household income. You can skip any question you are not sure about.</p></div>`,
    tiles: `<ul class="trust" aria-label="About this tool"><li>${ICON.check}Free and private</li><li>${ICON.check}Takes a few minutes</li><li>${ICON.check}Official sources</li></ul>
      <h2 style="margin-top:34px">Start from where you are</h2>
      <div class="tiles">
        <a class="tile" href="#question"><b>I was recently diagnosed</b><span>See supports you can apply for now</span></a>
        <a class="tile" href="#question"><b>I care for someone</b><span>Help for parents and caregivers</span></a>
        <a class="tile" href="#question"><b>I'm turning 18</b><span>What changes when you become an adult</span></a>
        <a class="tile" href="#question"><b>I can't work right now</b><span>Income support and how to apply</span></a>
      </div>`,
    bento: `<ul class="trust" aria-label="About this tool"><li>${ICON.check}Free</li><li>${ICON.check}No account</li><li>${ICON.check}Answers stay on your device</li></ul>
      <div class="bento" aria-label="What AbilityFinder covers">
        <div><span class="big">183</span><p style="margin:.4em 0 0">programs checked against official pages in Alberta, B.C., Ontario and federally</p></div>
        <div><span class="big">3</span><p style="margin:.4em 0 0">provinces, plus federal programs</p></div>
        <div><span class="big">0</span><p style="margin:.4em 0 0">accounts or ads</p></div>
      </div>`,
  }[d.hero];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Draft: ${d.name} · AbilityFinder redesign</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${d.fonts}" rel="stylesheet">
<style>${css(d)}</style>
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
<div class="draft-bar"><div class="wrap"><span><b>Design draft:</b> ${d.name}. ${d.tagline} Static mock-up, not the live site.</span><a href="index.html">All drafts</a></div></div>
<header class="site-header"><div class="wrap">
  <a class="brand" href="#"><span class="brand-mark" aria-hidden="true">A</span>AbilityFinder</a>
  <nav class="nav" aria-label="Main"><a href="#">Browse programs</a><a href="#">Help</a><a class="keep" href="#">Menu</a></nav>
</div></header>
<main id="main" class="wrap">

<span class="screen-label">Screen 1 · Home</span>
<section class="hero">
  <h1>Find disability benefits you may qualify for</h1>
  <p class="lede">Answer a few short questions. We show programs that may fit, what you need to check, and how to apply.</p>
  <p class="cta-row"><a class="btn" href="#question">Start the questions ${ICON.arrow}</a><a class="btn btn-secondary" href="#">Browse all programs</a></p>
  ${heroBlock}
</section>

<span class="screen-label" id="question">Screen 2 · One question per page</span>
<section class="question">
  <a class="back" href="#">${ICON.back}Back</a>
  <p class="stepnum">Question 3</p>
  <form onsubmit="return false">
  <fieldset>
    <legend><h1>Where do you live?</h1></legend>
    <p class="hint">This decides which provincial and city programs we show.</p>
    <label class="option"><input type="radio" name="p"> Alberta</label>
    <label class="option selected"><input type="radio" name="p" checked> British Columbia</label>
    <label class="option"><input type="radio" name="p"> Ontario</label>
    <label class="option"><input type="radio" name="p"> Another province or territory</label>
  </fieldset>
  <p class="not-sure"><a href="#">I'm not sure — skip this question</a></p>
  <p><button class="btn" type="button">Continue</button></p>
  </form>
</section>

<span class="screen-label">Screen 3 · Results</span>
<section class="results">
  <div class="results-head">
    <h1>Programs based on your answers</h1>
    <p>We did not ask about every requirement. Each program decides if you qualify.</p>
  </div>
  <div class="summary-row" aria-label="Summary">
    <div><b>2</b>match your answers</div>
    <div><b>5</b>have one thing to check</div>
    <div><b>3</b>are for later</div>
  </div>
  <div class="group-title"><h2>Programs to check</h2></div>
  <article class="card">
    <div class="card-top"><div><h3>Disability Tax Credit</h3><p class="where">Federal · Tax credit</p></div><span class="badge ready">${ICON.check}Matches your answers</span></div>
    <p>Lowers the income tax you or a supporting family member owe. It also opens the door to other programs.</p>
    <ul class="checklist">
      <li class="ok">${ICON.check}<span>You live in Canada</span></li>
      <li class="todo">${ICON.info}<span><b>To check:</b> a medical practitioner certifies the impairment (Form T2201)</span></li>
    </ul>
    <div class="card-actions"><a class="btn" href="#guide">Read the guide</a><a class="btn btn-secondary" href="#">Save to my list</a></div>
    <details class="official"><summary>Official wording</summary><p>You must have a severe and prolonged impairment in physical or mental functions, certified by a medical practitioner.</p></details>
  </article>
  <article class="card check">
    <div class="card-top"><div><h3>BC Bus Pass</h3><p class="where">British Columbia · Transit</p></div><span class="badge check">${ICON.info}One thing to check</span></div>
    <p class="amount">No cost with disability assistance</p>
    <ul class="checklist"><li class="todo">${ICON.info}<span><b>To check:</b> you get disability assistance or a listed senior benefit</span></li></ul>
    <div class="card-actions"><a class="btn btn-secondary" href="#guide">Read the guide</a></div>
  </article>
  <div class="group-title"><h2>Other programs to check</h2></div>
  <ul class="rows">
    <li><b>If you have a TransLink HandyCard:</b> HandyDART — <a href="#">Read the guide</a></li>
    <li><b>If you own a vehicle:</b> Fuel Tax Refund for Persons with Disabilities — <a href="#">Read the guide</a></li>
  </ul>
  <div class="group-title"><h2>Not for your situation now</h2></div>
  <div class="later-box"><p style="margin:0"><span class="badge later">${ICON.clock}Needed first</span> &nbsp;Disability Tax Credit approval — <a href="#">see how to apply</a>. Three programs open up after that.</p></div>
</section>

<span class="screen-label" id="guide">Screen 4 · Program guide</span>
<section class="guide">
  <div>
    <a class="back" href="#">${ICON.back}Back to results</a>
    <h1>BC Bus Pass</h1>
    <span class="status-pill">One thing to check</span>
    <p>A bus pass for people on B.C. disability assistance and low-income seniors. It works on BC Transit buses across the province.</p>
    <h2>What you must meet</h2>
    <ul class="checklist"><li class="ok">${ICON.check}<span>You live in British Columbia</span></li><li class="todo">${ICON.info}<span>You get disability assistance, or you are a low-income senior with the Guaranteed Income Supplement</span></li></ul>
    <h2>How to apply</h2>
    <ol class="steps"><li>Call the Ministry or use My Self Serve</li><li>Ask for the BC Bus Pass</li><li>Your pass comes by mail</li></ol>
    <details class="official"><summary>Abbreviations on this page</summary><p><b>GIS</b> — Guaranteed Income Supplement<br><b>PWD</b> — Persons with Disabilities designation</p></details>
  </div>
  <aside class="side" aria-label="At a glance">
    <a class="btn" href="#" style="width:100%">Open the official page ${ICON.arrow}</a>
    <dl><dt>How long</dt><dd>About 2 weeks</dd><dt>Cost</dt><dd>No cost with disability assistance</dd><dt>Checked</dt><dd>October 2026</dd></dl>
  </aside>
</section>
</main>
<footer class="site-footer"><div class="wrap">AbilityFinder is independent and free. Each program decides if you qualify. · <a href="#">What we don't cover yet</a> · <a href="#">Privacy</a></div></footer>
</body>
</html>`;
}

const out = __dirname;
for (const [key, d] of Object.entries(DIRECTIONS)) fs.writeFileSync(path.join(out, `${key}.html`), page(key, d));
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AbilityFinder redesign drafts</title>
<style>body{font:1.15rem/1.6 system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#1b1f23;background:#fafafa}a{color:#0b5c75}li{margin:10px 0}</style></head><body>
<h1>AbilityFinder redesign drafts</h1><p>Three directions on identical content (home, one question, results, guide). Static mock-ups for review; the live site is unchanged. Research: <code>../REFERENCES.md</code>, <code>../A11Y-PATTERNS.md</code>.</p><ul>
${Object.entries(DIRECTIONS).map(([k, d]) => `<li><a href="${k}.html"><b>${d.name}</b></a> — ${d.tagline}</li>`).join("")}</ul></body></html>`);
console.log("built", Object.keys(DIRECTIONS).join(", "));
