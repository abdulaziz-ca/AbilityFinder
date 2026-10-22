# AbilityFinder — brief for the feature research (2026-10-22)

AbilityFinder (https://abilityfinder.ca) is a free, independent, privacy-first disability-benefits finder for Canada.
No accounts. Answers are stored only in the visitor's browser (IndexedDB). Cookieless Cloudflare Web Analytics counts visits.
Hosted on Cloudflare (static site + a small Worker for feedback email and an optional AI assistant). Vanilla JS, no framework.

## What it already has
- **Questionnaire** (~12–15 questions: who it's for, disability types, age, documentation, functional needs, province, city,
  citizenship, Disability Tax Credit status, benefits already received, situation, income). Progress rail, edit any answer.
- **Results**: programs grouped "Matches your answers" / "More to check" (with the specific requirements still to confirm),
  "Other programs if your situation changes", "You already get", "Does not match"; overview tiles; per-program progress
  tracker (Not started → Saved → Submitted → Waiting → Approved/Denied); a "what if my situation changes" scenario panel;
  a shared document checklist; matched charitable grants; supports/strategies; "real people who can help" directory;
  print/PDF action plan; "dates to know" with add-to-calendar (.ics); "what changed since you last looked" panel.
- **Catalog**: 463 programs (16 federal, ~270 provincial across all 10 provinces, ~176 municipal in 46 cities); browse with
  search and filters; every program links to its official source; verification dates.
- **Guides**: an in-app guide and a static SEO page per program (462): what it is, eligibility, amount/tiers, how to apply
  steps, documents, tips, common denial reasons, appeals, FAQ, practitioner finder (Google Maps search) for medical forms,
  "works well with" related programs.
- **Directories**: charitable grants & funds (with audience filter), organizations that help (67), each with verified dates.
- **Tools**: Disability Tax Credit prep helper (printable), optional AI assistant (Cloudflare Workers AI; explains forms,
  cannot judge eligibility), feedback form, read-aloud (TTS), accessibility menu (text size, spacing, contrast, link
  highlighting, reading guide, reduce motion), English/French (Quebec records in French), dark/light theme.
- **For professionals** page with an embeddable snippet; partner overview one-pager; impact & coverage page; data updates log.
- **Honesty rules**: never says "you qualify"; the program decides; no dollar estimates presented as entitlements.

## Constraints to respect in proposals
- Privacy-first: no accounts required; nothing about a person's answers leaves the device unless they explicitly choose.
- Small team (one owner + AI agents), static hosting on Cloudflare, low running cost.
- Accuracy and honesty over growth hacks; accessibility (WCAG 2.2 AA) is a must.
