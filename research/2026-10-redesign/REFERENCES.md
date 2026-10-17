# AbilityFinder redesign: reference research (Oct 2026)

**Method and honesty note.** Each site below was fetched (WebFetch for page structure/copy; `curl` of the live HTML and linked CSS for fonts, hex colours, `prefers-reduced-motion` and skip-link presence). Contrast ratios were computed by me (WCAG formula) from hex values found in the CSS; the *role* of a colour (text vs. accent) is my inference from frequency, not verified in a rendered browser. I did not run screen readers, keyboard-tab each site, or view screenshots. "Published" means stated in the site's own documentation. Fetch limits: WebFetch returns text only, so layout notes come from page structure. Blocked or failed (403/404/timeouts) and therefore NOT cited: mind.org.uk, nami.org, disabilityrightsuk.org, canada.ca main pages (timeout), nhs.uk/service-manual (404, moved to service-manual.nhs.uk, confirmed only via search snippet), BenefitsCheckUp body (only a title came back), GOV.UK typography page (404).

## A. Public-service and benefits sites

### 1. GOV.UK Design System: https://design-system.service.gov.uk/ (and www.gov.uk)
- **Borrow:** The question-pages pattern (fetched): one question per page; label/legend is the page heading; "Continue" not "Next"; back link on every step; "I do not know" as a valid answer; hint text one short sentence; optional fields marked "(optional)" not with asterisks; test with no progress indicator first, avoid sliders. Directly maps to the AbilityFinder questionnaire.
- **Avoid:** Visually plain; strong brand look is hard to differentiate. Dense link lists on gov.uk home.
- **A11y:** Observed in gov.uk CSS: font "GDS Transport" (arial fallback), text #0b0c0c on white (19.6:1), links #1d70b8 (5.2:1), focus colour #ffdd00 (yellow, used 122 times), `prefers-reduced-motion` present, skip link present. Published: WCAG 2.2 AA, accessibility strategy and statement linked.

### 2. NHS service manual / design system: https://service-manual.nhs.uk/design-system
- **Borrow:** Health-trusted blue, tight component set derived from GOV.UK, explicit guidance for minimum button target size (from search result about the WCAG 2.2 update).
- **Avoid:** Frutiger is proprietary (not on Google Fonts); the system is utilitarian.
- **A11y:** Observed on www.nhs.uk: text #212b32, links/brand #005eb8 (6.4:1 on white), yellow focus #ffeb3b, skip link yes, no `prefers-reduced-motion` rule found in fetched CSS. Published (search snippet): must meet WCAG 2.2 AA, aim for AAA where possible, publish an accessibility statement. I could not load the manual pages themselves (the www.nhs.uk/service-manual URL 404'd).

### 3. Citizens Advice (UK): https://www.citizensadvice.org.uk/
- **Borrow:** Topic-led navigation (Benefits, Work, Debt and money, Housing), a "Popular content" list, friendly "you" tone, equal-weight Accept/Reject cookie buttons, search at the top.
- **Avoid:** Same topics repeated in header and body (clutter); long footer.
- **A11y:** Observed: Open Sans, text #161616, brand blue #004b88 (8.9:1 on white), amber #ffd250, teal #018176, skip links present, reduced-motion rule present. Published: accessibility statement linked.

### 4. Government of Canada Design System (GCDS): https://design-system.canada.ca/en/
- **Borrow:** Stepper, error summary, date input, fieldset, alert, cards; design tokens (colour, spacing, typography); bilingual-first thinking; relevant to a Canadian audience who know Canada.ca.
- **Avoid:** Home page gave no values (tokens live on sub-pages); heavy "government" feel.
- **A11y:** Observed in the colour-page CSS: #26374a (dark navy text/brand), #1354ec (link/action blue), #b3192e (error red), #595959 (muted grey), reduced-motion rule present. Published: accessibility testing is stated on the home page; no standard named there. I could not load www.canada.ca pages.

### 5. Ontario Design System: https://designsystem.ontario.ca/ (live product: https://www.ontario.ca/page/ontario-disability-support-program)
- **Borrow:** Closest jurisdictional comparison for ODSP/Ontario users; component catalogue with release notes. Strong text colour (#1a1a1a) and secondary #4d4d4d.
- **Avoid:** Raleway headings in blue/cyan (#009adb on white is only about 3:1 by my calculation, so don't copy it for text); long single-page ODSP guide with prose walls (the exact problem AbilityFinder should avoid).
- **A11y:** Observed: Open Sans body, Raleway headings, #00478f primary, no `prefers-reduced-motion` found. Published: not verified (landing page said nothing on accessibility).

### 6. U.S. Web Design System (USWDS): https://designsystem.digital.gov/
- **Borrow:** "Step indicator", "Complete a complex form" pattern, form templates; v3.14.0 current at fetch time; accessibility documentation page exists.
- **Avoid:** Details were only names on the home page; I did not read the component docs, so no deeper claims.
- **A11y:** Published: "accessible, mobile-friendly". Nothing observed first-hand.

### 7. GetCalFresh (Code for America): https://www.getcalfresh.org/
- **Borrow:** The gold standard for tone: short sentences, reassurance, human support (chat, text, phone), language switcher (4 languages) at the top, "Official State partner" trust badge, numbered FAQ steps. Warm green + cream palette.
- **Avoid:** Page now redirects applications to BenefitsCal; no visible progress indicator on the landing page; some jargon ("SAR 7"); some decorative images with empty alt (fine) but logos too.
- **A11y:** Observed: skip-to-content link, "TT Norms Pro Serif" and IBM Plex Sans, green #2f7d6b (4.9:1 on white, passes AA for text), highlight yellow #fff8d8, no reduced-motion rule found.

### 8. BenefitsCheckUp (NCOA): https://benefitscheckup.org/
- Only the page title ("Senior Benefits: Find Help Paying for Everyday Needs") came back, so I cannot report design details. Listed for completeness as the closest functional match (questionnaire then results) but **not evaluated**; review manually in a browser.

## B. Disability and health organisations

### 9. Scope (UK disability charity): https://www.scope.org.uk/
- **Borrow:** Distinctive confident colour: deep purple #340458 and vivid #7b05e2 with pale lavender tint #f4f0fa, signal yellow #fff31a, mint #12f9c1 used as accents. Shows disability charity can look modern, not clinical. Display font "Labil Grotesk" (commercial).
- **Avoid:** The bright mint/yellow on light backgrounds fails text contrast; keep as decoration only. Large saturated fills reduce calm.
- **A11y:** Observed: skip link present, grey text #595959 (7:1 on white), no reduced-motion rule found in fetched CSS (could be in unloaded files).

### 10. Macmillan Cancer Support: https://www.macmillan.org.uk/
- **Borrow:** Warm, accessible green (#008a26 bright, #006e1e dark variant, soft tint #f1f4f2 and #aaefc0) and a friendly geometric bold/regular type pairing (Cera Pro, commercial); strong support-line prominence.
- **Avoid:** Grey #767676/#747474 text sits right at 4.5:1 on white and below it on tinted backgrounds. Bright #008a26 on white is about 4.6:1, only just passing.
- **A11y:** Observed: skip link present, reduced-motion rule present.

### 11. Mencap: https://www.mencap.org.uk/
- **Borrow:** Strong magenta brand (#a8084d, 7:1 on white by my calculation) shows a learning-disability charity using confident colour; page is heavy (about 500 KB HTML).
- **Avoid:** Weight and possibly busy; I only fetched the HTML, did not review Easy Read pages. No fonts or reduced-motion found in fetched markup. Treat as colour reference only.
- **A11y:** Observed: skip link present. Published: not checked.

## C. Product sites (judged critically)

### 12. Linear: https://linear.app/
- **Borrow:** Restraint: near-black #08090a, many neutral greys, tiny accent use, "Fig 0.1" figure captions, changelog cards, generous space. Great at calm hierarchy.
- **Avoid:** Dark default theme, low-contrast mid-greys (#9c9da1 on #08090a is 7.4:1, fine, but its darker greys #2e2e32 are decorative), small dense type, pastel pink (#f79ce0) and light blue (#55cdff) accents.
- **A11y:** Observed: skip links (2), reduced-motion rule present. Unknown: focus styles.

### 13. Stripe: https://stripe.com/
- **Borrow:** Bento card grid, large stat blocks (could present "how many programs matched"), one saturated indigo (#635bff).
- **Avoid:** Gradient waves, auto-scrolling logo marquee and carousels (motion), brand purple #635bff has only 4.7:1 on white, so keep it for large text/buttons with white text and darken for small links. No skip link found in fetched HTML.
- **A11y:** Observed: reduced-motion rule appears 8 times (good practice); custom font sohne-var (commercial).

### 14. Notion: https://www.notion.com/
- **Borrow:** Friendly warm pastel tints (#fff5ed, #fff5e0, #fff5fc), serif accent (Lyon Text) beside a clean sans, soft illustration style.
- **Avoid:** Marketing density, many saturated accent colours (#ffb110 orange, #1aae39 green are not text-safe on white); no skip link in fetched HTML.
- **A11y:** Observed: reduced-motion present (2 rules).

### 15. Headspace: https://www.headspace.com/
- **Borrow:** Warm off-white #f9f4f2, dark warm text #44423f (9.2:1 on that background), soft intent tiles ("Stress", "Sleep"): good model for "pick your situation" cards on a calm site.
- **Avoid:** Hero carousel (alt text said "hero with carousel"), star decorations, bright yellow #ffce00; no skip link or reduced-motion rule found.
- **A11y:** Observed: font "Headspace Apercu" (commercial). Page hit 548 KB; WebFetch gave no colour data, so palette is from CSS counts only.

### 16. Oura: https://ouraring.com/
- **Borrow:** Warm stone neutral #ede9e4 / #ece9e5 with deep navy/purple #0b051d text and an editorial serif ("Editorial New") for headlines: premium yet soft.
- **Avoid:** Very heavy page (1.6 MB HTML), lifestyle imagery, and no skip link. Not much to take beyond the palette and serif/sans pairing.
- **A11y:** Observed: reduced-motion present once; `#08833d` green is 4.9:1 on white.

---

## Synthesis

### Design principles for AbilityFinder
1. **One question, one screen, one answer type.** (GOV.UK, GCDS stepper.) Label is the heading, "Continue" button, back link always, "Not sure" always allowed, no sliders, and test without a progress bar first; if shown, a plain "Step 3 of 8" text.
2. **Short line first, detail on demand.** (matches your existing readability rule.) Each result card: program name, one-sentence plain-language outcome, one "what you may get" figure, then an expander with the official wording. Never show a wall of prose (cf. Ontario.ca ODSP page).
3. **Calm contrast, not low contrast.** Body text at 7:1 or better (AAA), UI borders at 3:1 or better, never grey-on-tint under 4.5:1 (Macmillan, Linear lessons). Warm off-white background instead of stark white to cut glare, but keep dark ink.
4. **Big, forgiving targets and a visible focus ring.** Body 18-20 px, line length 60-70 characters, 48 px minimum targets (NHS target-size update), thick high-contrast focus ring (GOV.UK yellow-and-black approach). Users have tremor, pain or fatigue.
5. **Motion is opt-in.** No carousels, marquees, parallax or gradient waves (Stripe, Headspace anti-patterns). Respect `prefers-reduced-motion`, which only 4 of the 9 sites I checked styled. Allow the user to resize text to 200-400% without breaking.
6. **Warmth through language and layout, not decoration.** (GetCalFresh, Citizens Advice.) Second person, short sentences, human help contacts visible at every step, a language option, "Official/Free/No sign-up/Your answers stay on this device" trust cues if true.

### DIRECTION 1: "Quiet Paper"
- **Mood:** Trusted public-service clarity with a warm, printed-page feel; the safest, most readable option.
- **Typography:** Headings Atkinson Hyperlegible Next (designed for low vision; bold 700), body Atkinson Hyperlegible Next 400, 19-20 px/1.6. If only the original is wanted, use Atkinson Hyperlegible. Fallback system sans.
- **Palette (contrast on #FAF8F4 unless stated):** background #FAF8F4; surface #FFFFFF; text #1B1F23 (15.6:1, AAA); muted text #4B5563 (7.1:1, AAA); primary #0B5C75 (7.1:1; white on it 7.5:1, AAA); tint #E3F0F4 (primary on it 6.4:1); warning/accent text #8A3B12 (7.3:1); focus ring #FFD23F with #1B1F23 outline (11.5:1); border/input outline #6B7280 (4.6:1, passes the 3:1 non-text rule).
- **Components:** Full-width single-question cards with a back link above; large radio "tiles" with 2 px solid borders; result cards with left colour stripe + icon + text label (never colour only); sticky "Save/print my list" bar; official-wording `<details>` expander; simple "Step 3 of 8" text.
- **Inspired by:** GOV.UK, NHS, Citizens Advice, GetCalFresh.

### DIRECTION 2: "Calm Green"
- **Mood:** Gentle, reassuring, health-adjacent; human and soft, with rounded shapes. Best for tired or anxious users.
- **Typography:** Headings Fraunces (soft serif, weight 600, optical size on) for a warm voice; body Figtree or Source Sans 3 at 19 px/1.6. Pair serif only for headings above 28 px.
- **Palette:** background #F6F4EE; surface #FFFFFF; text #22302B (12.5:1, AAA); muted #4A5A53 (6.6:1, AA+); primary green #1F6B55 (5.8:1 on bg; white on it 6.4:1, AA); soft tint #E4EFE9 (text on it 11.7:1; primary on it 5.4:1); accent clay #9A4A12 for "important/deadline" text (5.7:1); border #6B7A72 (4.1:1 against bg, passes the 3:1 non-text rule but do not use for text); focus ring #22302B 3 px with #FFFFFF 2 px gap.
- **Components:** Situation tiles on the home page ("I'm caring for someone", "I'm over 65", "I'm working") as in Headspace; rounded 16 px cards; benefit amount shown as a large figure (Stripe stat block idea, without gradients); "Talk to a person" helper link; gentle illustrations kept off the text column.
- **Inspired by:** GetCalFresh, Macmillan, Headspace, Notion, Oura (serif/sans pairing).

### DIRECTION 3: "Clear Ink"
- **Mood:** Modern product polish: crisp white, one confident indigo, tight grid, calm and capable. The "fresh" option that still passes AAA.
- **Typography:** Headings and body Inter (variable, 400/600/700) or Public Sans (USWDS-adjacent; very legible), body 18 px/1.6, headings with tighter tracking at large sizes only; tabular numbers for dollar amounts.
- **Palette on #FFFFFF:** text #14122B (18.2:1, AAA); muted #4A4766 (8.8:1, AAA); primary indigo #3B2F8F (10.6:1; white on it 10.6:1, AAA); tint #F1EFFA (primary on it 9.3:1); alert text #B4350A (6.1:1); control border #767399 (4.5:1); focus ring 3 px #3B2F8F with 2 px white inner gap, plus a #FFD23F outer ring on dark surfaces.
- **Components:** Bento-style summary tiles on results ("12 programs match", "3 need action this month"), Linear-like changelog list for "updated" program guides with dates, left-rail filter on desktop that collapses to a single "Filter" button on phone, segmented control for "Show: simple / official wording", numbered stepper (GCDS/USWDS).
- **Inspired by:** Linear, Stripe, Scope, USWDS, GCDS.

### Recommendation
Prototype Direction 1 for the questionnaire and Direction 2 for the home page/situation tiles, then A/B whichever has fewer drop-offs; adopt Direction 3 only if the owner prioritises a "modern product" feel. Every font above is on Google Fonts (verify Atkinson Hyperlegible Next availability when installing; otherwise use Atkinson Hyperlegible). Fonts were chosen from knowledge, not fetched from Google Fonts in this session. Run all palettes through an automated checker and test with a real screen reader before shipping; computed ratios here are arithmetic only.
