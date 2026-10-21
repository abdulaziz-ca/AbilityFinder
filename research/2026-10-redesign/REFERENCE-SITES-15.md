# 15 reference sites for the AbilityFinder redesign

**Brief.** AbilityFinder is a free Canadian tool for finding disability benefits: short questionnaire, results list, program guide pages. The owner wants about 15 sites with genuinely good, professional, modern design from any industry, to pick a base for the redesign. Preference: calm, trustworthy, information-heavy patterns (typography, layout, forms/step flows, cards/lists, restrained colour, spacing).

**Method and honesty note.** Each site was fetched on 2026-10-17 and returned live content. The fetch tool returns page text and markup only, not rendered pixels or CSS. So "observed" below means seen in markup, labels, alt text and structure. Colour, typeface, contrast, focus styles and motion are mostly "could not check" and where I describe them it is from general knowledge of the brand, marked (known). Open each live before deciding. Search tools returned only generic Awwwards listing pages, so picks come from widely praised product/brand sites, not a verified award list. Sites tried but dropped (403/blocked, not included): Lemonade, Calm, The Guardian.

---

### 1. Stripe — https://stripe.com
- Industry: fintech / developer SaaS
- Strong: clear h1-h4 hierarchy, large stat numerals ("99.999%") as anchors, bento-style card grid, case-study cards with metrics. Gradient/wave brand motif (known).
- Inspires: home page, results cards.
- Accessibility: auto-looping logo row and carousel (observed in markup; pause control not checked); many empty alt attributes; contrast and type size not checked.

### 2. Monzo — https://www.monzo.com
- Industry: consumer banking
- Strong: trust badges directly under hero (regulator/protection), alternating image/text sections, product cards with plain price labels, one primary button repeated consistently.
- Inspires: home page trust strip, guide page layout.
- Accessibility: skip link present (observed); dense small-print disclaimers; "Learn more" repeated without context; whole-card links; contrast not checked.

### 3. Wealthsimple — https://www.wealthsimple.com
- Industry: Canadian fintech
- Strong: short human headlines, one section = one idea, wordmark label above each heading, restrained primary/secondary buttons. Canadian audience match.
- Inspires: home page tone, copy style.
- Accessibility: file names suggest looping background video (pause control not checked); generic "Get started" labels; some empty alt; contrast not checked.

### 4. Headspace — https://www.headspace.com
- Industry: health / wellness
- Strong: friendly, calm brand; mega-menu grouping; FAQ accordion; email signup block; yellow accent (inferred from alt text).
- Inspires: home page warmth, FAQ on guide pages.
- Accessibility: hero carousel implied (pause not checked); yellow-on-light contrast risk; poor alt text such as "Frame 370079" (observed); deep mega-menu keyboard use not checked.

### 5. Linear — https://linear.app
- Industry: SaaS / product
- Strong: editorial figure captions ("Fig 0.1"), disciplined monochrome product UI, tidy list rows with chips, status and avatars, clean changelog cards (observed structure; palette known as dark and minimal).
- Inspires: results list rows (title, tag chips, status).
- Accessibility: status indicators may rely on colour or position; icon-only "+" controls may lack names; dark low-contrast greys are a known risk here, not checked.

### 6. Notion — https://www.notion.com
- Industry: SaaS / productivity
- Strong: Capture/Find/Automate three-part feature rhythm, use-case cards with small icons, testimonial cards, paired primary/secondary CTAs, mostly monochrome (inferred).
- Inspires: home page "how it works", use-case cards.
- Accessibility: stats band duplicated in markup; play control unlabelled; many empty alt; icon-only links; reduced-motion not checked.

### 7. GOV.UK Design System — https://design-system.service.gov.uk
- Industry: public sector (UK)
- Strong: the reference for accessible form patterns: single-column flow, skip link, one-question-per-page conventions, error summary and cookie banner with equal accept/reject (observed). Strong type scale and focus style (known).
- Inspires: questionnaire (best fit), guide pages.
- Accessibility: gold standard; I only observed an empty alt on the hero illustration. Visual style is plain, so borrow patterns not the look.

### 8. Wise — https://wise.com
- Industry: fintech
- Strong: transfer calculator in the hero is a live, labelled two-field form with a result summary (rate, fees, arrival date); audience cards; "Show all" expanders; green accent (inferred).
- Inspires: questionnaire (inline live-answer pattern), home hero.
- Accessibility: "[object Object]" alt text bug and "enen" language control (observed); skip link present; decorative flags have empty alt (fine); contrast not checked.

### 9. Oscar Health — https://www.hioscar.com
- Industry: health insurance
- Strong: plain-language hero ("made for real life"), four-up stats row, numbered feature list, photo-led cards, language switcher and visible phone number.
- Inspires: home page, trust and help/contact area.
- Accessibility: carousels ("Card 1 of 4") need controls; many empty/missing alt; exit interstitial modal; contrast not checked.

### 10. Mercury — https://www.mercury.com
- Industry: business banking
- Strong: restrained, mostly neutral palette (inferred), large stat row, rounded pill buttons, portrait testimonials, email-capture hero with clear opt-out checkbox.
- Inspires: home page hero with single input, results cards.
- Accessibility: hero appears to use looping video (not checked); duplicate responsive links; new-tab links are labelled (good); contrast not checked.

### 11. Figma — https://www.figma.com
- Industry: design SaaS
- Strong: template category tiles with thumbnails and labels, mega-menu with descriptions and "New/Beta" badges, single big testimonial stat ("95%").
- Inspires: browsing/category tiles for guide index.
- Accessibility: skip link present; looping logo rows and "Slide 1 of 10" carousel; many nav thumbnails with empty alt; contrast not checked. Vivid multi-colour palette (inferred) is less calm than AbilityFinder needs.

### 12. Airbnb — https://www.airbnb.com
- Industry: travel marketplace
- Strong: scannable listing cards (image, badge, place, dates, total price, rating); totals instead of per-night prices make comparison easy; search bar with Where/When/Who; "See all" per row.
- Inspires: results cards, search/filter bar.
- Accessibility: skip link and text ratings (observed); icon-only links and carousel arrows may lack names; repeated "Show more"; contrast not checked.

### 13. Canada.ca — https://www.canada.ca/en.html
- Industry: public sector (Canada)
- Strong: familiarity and trust for the exact audience: language toggle, search first, "Most requested" list, service tiles, 16 themes; built on WET framework (inferred from paths). Clear heading tiers.
- Inspires: guide pages, bilingual/EN-FR affordances, "most requested" on home.
- Accessibility: skip links and visible language switch (observed); empty alt on feature images to verify; visually dated and dense, so borrow structure only; contrast not checked.

### 14. Aeon — https://aeon.co
- Industry: editorial / publishing
- Strong: card pattern of small lowercase category tag, title, standfirst, author; long-read focus; featured hero then grid; newsletter with Daily/Weekly toggle. Serif-led reading (known).
- Inspires: guide pages (long-form reading typography), card metadata.
- Accessibility: descriptive alt text on most images and labelled social links (observed); "MENU/" slash separators read awkwardly; whole-card links; dark/greyscale contrast not checked.

### 15. Betterment — https://www.betterment.com
- Industry: fintech / investing
- Strong: navy/blue/gold palette (inferred from asset names), three side-by-side product cards with "Most popular/New" pills, three-column trust icon grid, FAQ accordion, "Stay in browser" alternative to app modal.
- Inspires: results cards, trust section, FAQ.
- Accessibility: skip links to main, footer and nav (observed); duplicated stats block; gold-on-light and small captions are contrast risks (not checked); hero carousel pause not checked.

---

## Comparison

| Name | Industry | Strongest trait | Best fit in AbilityFinder |
|---|---|---|---|
| Stripe | Fintech/dev | Typographic hierarchy, stat numerals | Home |
| Monzo | Banking | Trust badges under the hero | Home |
| Wealthsimple | Canadian fintech | Short human copy, one idea per section | Home |
| Headspace | Wellness | Warm, calm tone, FAQ accordion | Home / guide pages |
| Linear | SaaS | Disciplined list rows with chips | Results |
| Notion | SaaS | Three-step feature rhythm, use-case cards | Home ("how it works") |
| GOV.UK Design System | Public sector (UK) | Accessible form and question patterns | Questionnaire |
| Wise | Fintech | Live inline calculator form | Questionnaire / home hero |
| Oscar Health | Health insurance | Plain-language trust and help | Home / contact |
| Mercury | Business banking | Restrained palette, single-input hero | Home / results |
| Figma | Design SaaS | Category tiles with thumbnails | Guide index |
| Airbnb | Marketplace | Scannable comparison cards, search bar | Results |
| Canada.ca | Public sector (Canada) | Familiar trusted structure, bilingual | Guide pages |
| Aeon | Editorial | Reading typography and card metadata | Guide pages |
| Betterment | Fintech | Product cards with pills, trust grid, FAQ | Results / trust |
