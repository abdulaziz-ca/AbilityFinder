# AbilityFinder — active roadmap

The core finder, guides, progress tracking, assistant, feedback, link monitoring,
calendar reminders, data-freshness warnings, accessibility controls, and local
IndexedDB recovery are live. Completed phase-by-phase history remains available in
git and is intentionally not repeated here.

## Product north star

Answer five questions accurately and with low cognitive load:

1. What can I get?
2. What may it be worth?
3. Am I likely eligible, and why?
4. What should I apply for first?
5. How do I apply?

The largest ongoing risk is **silent factual decay**, not a missing headline
feature.

## Priorities

### 1. Maintain data accuracy

- Review `/api/link-health` regularly and replace genuinely broken/soft-404 links
  using official destinations.
- Re-verify figures, eligibility rules, forms, phone numbers, processing times, and
  municipal details before their freshness dates age out.
- Update `BENEFIT_VERIFIED` only after an actual official-source review.
- Run `npm run gen:context` after catalog or practitioner-form changes.

### 2. Human accessibility and usability testing

Automated checks cover only part of accessibility. Arrange testing with disabled
users for:

- VoiceOver/NVDA and meaningful reading order.
- Keyboard-only completion of the full journey.
- 200–400% zoom and reflow.
- Reduced-motion behavior and scroll reveals.
- Cognitive load and plain-language comprehension.

Document findings as reproducible issues, not broad redesign requests.

### 3. Carefully expand verified coverage

- Re-check Camrose and other municipalities one program at a time.
- Keep local transit/recreation rules distinct; never clone another city's policy.
- Re-integrate other provinces from `public/data-provinces-later.js` only after a
  province-specific source audit and metadata pass.
- Keep French paused until there is capacity to translate and maintain the benefit
  catalog, not only the interface.

### 4. Improve discovery only when evidence supports it

Potential low-risk enhancements:

- Per-disability browse sorting/filtering backed by explicit benefit tags.
- Safe guide deep links containing only a guide ID, never user answers.
- Client-side export/import if users demonstrate a real need for cross-device
  transfer.

## Safety boundaries awaiting official evidence

Do not publish an exhaustive AISH/ADAP signer-profession list until Alberta provides
one. Existing CPP-D and parking-placard signer guidance may remain because those
lists have official support.

## Deliberately rejected

Do not "just add" these without revisiting the product's privacy/zero-spend model:

- **Accounts or server sync:** creates identifiable disability/income records. If
  needed, prefer local export/import.
- **Email/SMS reminders:** requires contact storage and SMS can cost money. The
  local `.ics` download provides reminders without a backend.
- **Community reviews or free-text timelines:** creates moderation, abuse, and PII
  risk.
- **Admin CMS:** `data.js` plus git already provides reviewable version history.
- **"Describe your disability and AI will choose" matcher:** invites sensitive free
  text and false certainty. The structured limitation-based wizard is safer.
- **Unverified automated government integration/form filling:** high factual and
  privacy risk.

## Definition of done for future changes

A change is not done until:

- Every new benefit fact is backed by a current official source.
- Generated grounding/link files are refreshed when applicable.
- Privacy copy matches any changed data flow.
- Unit and Playwright tests pass.
- Relevant routes/personas/themes are exercised without blank or hidden content.
- Cache versions are bumped for deployed assets.
- Worker changes pass a Wrangler dry run and production smoke test when deployed.
