# Research: consumer-product patterns for AbilityFinder (2026-10-22)

Method note: WebFetch returned thin pages for several sites (Wise, Todoist, Credit Karma were nav-only or empty). Where a pattern below is marked (general knowledge) it comes from my familiarity with the product, not from a page I could read today. Verified-by-fetch items cite the URL.

## Product-by-product

### Wealthsimple Tax (https://www.wealthsimple.com/en-ca/tax) - fetched
- Pattern: starts by importing data (CRA slips) instead of asking; prefilled fields; "what to gather" checklist lives in FAQ, not in-flow; expert review is an upsell.
- Translates: a "gather these first" checklist per program that you can tick off (AbilityFinder already has a shared document checklist - make it persistent per program and show "ready to apply: 4 of 6 docs"). A pre-submit "review your package" step (summary of what you will send, what is missing).
- Avoid: deadline/scarcity framing, tiered upsell, "over N million" social proof used as pressure, anything implying filing for them.

### TurboTax (general knowledge)
- Pattern: one question per screen, "why we ask" expandable under each question, running status ("what we found so far"), a final review that lists flagged items.
- Translates: "Why we ask" on every questionnaire question (probably partly there); a final "Items to double-check" screen before results.
- Avoid: upsell interruptions, accuracy guarantees AbilityFinder cannot back.

### Credit Karma / Borrowell (general knowledge; fetch returned empty)
- Pattern: monitor and alert on change, each alert explains what changed and what to do. Free, but monetised by product offers - the conflict AbilityFinder must not copy.
- Translates: "What changed" already exists. Extension: on return visit, diff of programs whose official data changed that match the saved answers; optional email-less alerts via the installed PWA or a feed.
- Avoid: sponsored product recommendations, urgency badges, collecting email to "unlock" results.

### Wise (https://wise.com/help/articles/2932689/where-is-my-transfer) - page only covered proof-of-payment; timeline pattern is general knowledge
- Pattern: a vertical status timeline with plain-language state and the date each step happened, an estimated "next" step, and "what we need from you" only when blocked.
- Translates: the existing per-program tracker (Not started -> ... -> Approved/Denied) becomes a timeline with dated entries, a typical-wait hint from the official source, and a single "Next action" line. Waiting state shows "check back by <date>" and an add-to-calendar.
- Avoid: invented processing-time promises; show only officially published service standards with source and date.

### Linear (https://linear.app/docs/search) - fetched
- Pattern: command menu; prefix to scope (i/p/u...), `/` for global search, exact-ID match, quotes for exact terms, results ordered by active first, filters via `@`.
- Translates: Cmd/Ctrl-K or `/` palette searching programs, guides, directories and actions ("open my tracker", "change province", "print plan"). Prefix scoping: `p` programs, `o` organizations, `g` grants. Ranking: matches for the user's province first. Palette must be a proper ARIA combobox and not trap keyboard users.
- Avoid: shortcut-only features; every action must also exist as a visible button.

### Todoist / Things (https://www.todoist.com/help/articles/introduction-to-reminders - nav only; rest general knowledge)
- Pattern: natural-language dates, recurring tasks, reminders tied to a date, a Today/Upcoming view.
- Translates: "Upcoming" view across all programs: annual renewals, DTC recertification, tax-filing dates, appeal deadlines (30 to 90 days, per-program), with .ics recurrence (RRULE) so the user's own calendar does the reminding. Already has .ics; add recurrence, VALARM lead times, and an "Upcoming" list.
- Avoid: overdue-red guilt styling; notifications by default.

### Apple Wallet / Google Keep (general knowledge)
- Pattern: add one item to the device in one tap; works offline; no account on the site's side.
- Translates: "Save this program card" as an .ics + a one-page printable/PDF + a Web Share API share of a text summary; an installed PWA home-screen icon. Wallet passes are not realistic (need signing certificates, and the data is personal) - skip.
- Avoid: pushing the user to a native-app store.

### Duolingo (https://blog.duolingo.com/how-duolingo-streak-builds-habit/) - fetched
- Pattern: streaks use loss aversion; "streak freeze" softens it; the post itself admits losing a streak can demotivate. Evidence is internal and correlational.
- Translates: nothing streak-based. Take only gentle, once-per-event nudges (one calm reminder when a dated step is due) and celebratory-but-quiet states (e.g. "Approved" message with next steps like "tell your other programs").
- Avoid: streaks, counters, guilt copy, daily pings, mascots begging. For people with fatigue, pain or cognitive disability, loss-aversion mechanics are harmful. State this as a design rule.

### Excalidraw (https://plus.excalidraw.com/blog/end-to-end-encryption) - fetched
- Pattern: browser generates an AES-GCM key (Web Crypto), encrypts the document, uploads only ciphertext, puts the key in the URL fragment (`#key=...`) which is never sent to the server. Anyone with the full link can read it.
- Translates directly: "Share with my caseworker / family" link. Encrypt the saved plan client-side, store the blob in Cloudflare KV/R2 via the existing Worker with a TTL (e.g. 7 days), key in the fragment. Worker never sees plaintext or key.
- Caveats: the link is the secret (leaks via screenshots, messaging apps that preview URLs, browser history, and referrers - set `Referrer-Policy: no-referrer`, and make the viewer page not load third-party scripts). Use a random 96-bit IV per encryption rather than Excalidraw's fixed zero IV, a 256-bit key, and add an expiry plus a "revoke now" link.

### tldraw (general knowledge)
- Local-first documents in IndexedDB, share as a link/file; reinforces that "your data lives here, export is a file". Translates to a "Download my backup (.json)" and "Restore from backup" to move between devices without an account.

### Proton (https://proton.me/blog/what-is-end-to-end-encryption) - fetched
- Pattern: plain-language statement of what the provider can and cannot see (even titles/names are encrypted); password-protected links for outsiders.
- Translates: a "What we can see / cannot see" panel next to every sharing/backup feature; optional passphrase on share links as a second factor for sensitive sharing.
- Avoid: overstating ("military-grade", "100% secure"). The page itself does not state what metadata Proton sees - AbilityFinder should state it (IP seen by Cloudflare, blob size, timestamps).

### Notion (general knowledge)
- Palette plus "recently visited". Covered by Linear; add "Recent" entries from localStorage-only history.

## Concrete ideas

### 1. Encrypted "Share with my helper" link
- User sees: in results, "Share my plan" -> choose what to include (answers, matched programs, tracker, checklist) -> get a link valid 7 days, optional passphrase, "revoke" button. Helper opens a read-only page (print-friendly) and can "Copy into my AbilityFinder" if wanted.
- Why: caseworkers, parents, and support workers repeatedly need the same story told; avoids emailing screenshots of sensitive data.
- Source: Excalidraw (E2EE link), Proton (what-we-see panel). URLs above.
- Effort: M (Web Crypto, one Worker endpoint PUT/GET to KV with TTL, viewer page, rate limit).
- Risk: link leakage; server stores ciphertext only. Mitigate: fragment key, AES-GCM-256 random IV, TTL + revoke token, no-referrer, no third-party scripts on the viewer, explicit consent text, exclude free-text notes by default, do not log full URLs, cap blob size (e.g. 100 KB), say clearly that anyone with the link can read it.

### 2. Application inbox with "Next action" and dated timeline
- User sees: one "My applications" page listing tracked programs, each with a single next action ("Get the doctor to sign section C", "Wait: check by Nov 14"), a dated timeline of status changes, and a notes field.
- Why: turns a result list into a to-do loop; main reason to return.
- Source: Wise status timeline (general knowledge), Todoist Upcoming view.
- Effort: M (extend existing tracker data model in IndexedDB; next-action text generated per status from the program's existing steps/documents).
- Risk: implying outcomes or processing times. Mitigate: only officially published wait times with source and date; wording "typically, per <source>".

### 3. Renewals and deadlines calendar feed
- User sees: "Upcoming" list (renewals, DTC recertification, tax season, appeal windows) and "Add all to calendar" with recurrence and lead-time alarms (14 days and 2 days).
- Why: missed renewals cause benefit loss; calendars already work for people and need no push permission.
- Source: Todoist reminders / recurring dates; general RFC 5545.
- Effort: S (extend current .ics export with RRULE and VALARM; reuse "dates to know" data).
- Risk: wrong dates. Mitigate: show source and verified date next to each, "confirm with the program" label; ICS contains program name only, not personal answers.

### 4. Command palette (Cmd/Ctrl-K and `/`)
- User sees: a search overlay across programs, guides, organizations, grants, and actions; prefix scoping; recent items; province-first ranking; mobile gets a visible search button.
- Why: 463 programs plus guides - fastest route for repeat users and professionals.
- Source: Linear https://linear.app/docs/search
- Effort: S-M (prebuilt search index JSON, small fuzzy matcher, ARIA combobox, focus management).
- Risk: accessibility regressions, hidden-only shortcuts. Mitigate: visible button, screen-reader testing, shortcut can be disabled in the accessibility menu.

### 5. Installable PWA with offline guides
- User sees: "Install" button (Chromium) or iOS "Add to Home Screen" instructions (localized in EN/FR); once installed, the questionnaire, saved results, trackers, and any guide they have opened work offline.
- Why: low-connectivity users, appointments in clinics/offices with no signal, one-tap return.
- Source: web.dev https://web.dev/learn/pwa/installation (notes iOS has no install prompt; Safari macOS no install).
- Effort: M (manifest, icons, service worker with versioned cache, "last updated" shown offline, stale-data banner).
- Risk: stale benefit amounts shown offline. Mitigate: show "data as of <date>" on every offline page, cache-bust on update, never cache the AI assistant or feedback calls.

### 6. Backup and move-to-another-device file
- User sees: "Save a backup file" and "Restore from file" (optional passphrase-encrypted); QR code for moving between phone and laptop is a later option.
- Why: browser-only storage is fragile (cleared data, new phone). Fixes the main cost of no accounts.
- Source: tldraw/Excalidraw local-first export; Proton passphrase pattern.
- Effort: S.
- Risk: file left on shared computers. Mitigate: passphrase option, warning text, no auto-download.

### 7. "Why we ask" and "Review before results" steps
- User sees: expandable one-line reason under every question, and a final screen listing answers that drive the most matches plus any skipped ones ("You skipped income - this affects 12 programs").
- Why: reduces abandonment and wrong answers; builds trust for sensitive questions.
- Source: TurboTax interview (general knowledge), Wealthsimple Tax.
- Effort: S (copy plus one screen; measure which questions affect matches from the rule engine).
- Risk: coaxing disclosure. Mitigate: every question stays skippable; reasons plain and honest.

### 8. Per-program "ready-to-apply" pack
- User sees: for each program, a checklist with tick-offs (documents, forms, practitioner sign-off), a progress bar ("3 of 6"), and one printable/PDF "application pack" cover sheet (name-free by default).
- Why: the real friction is paperwork; shared checklist exists but is not per program with persistence.
- Source: Wealthsimple Tax prep checklist.
- Effort: M.
- Risk: missing/wrong document lists. Mitigate: link to official forms, show verification date, feedback "this was wrong" button.

### 9. Gentle "what changed for you" return summary
- User sees: on return, a calm one-line banner: "2 programs updated since Oct 3 - see what changed", no counters, no badges that persist; dismiss remembers state.
- Why: the sticky reason to return without pressure; extends the existing panel to be tied to tracked programs first.
- Source: Credit Karma alert-on-change idea; Duolingo cautions (what to avoid).
- Effort: S (diff data-updates log against stored last-visit time and tracked IDs).
- Risk: noise. Mitigate: only materially changed fields (amount, eligibility, deadline), link to source.

### 10. "What we can and cannot see" privacy card
- User sees: short card on share/backup/AI features stating exactly what leaves the device, what Cloudflare sees (IP, timing, size), and how to delete.
- Why: trust for a sensitive population; differentiates from ad-funded tools.
- Source: Proton https://proton.me/blog/what-is-end-to-end-encryption.
- Effort: S.
- Risk: overpromising. Mitigate: have it reviewed against the Worker's real logging config.

## Explicit "do not copy" list
Streaks and loss-aversion (Duolingo), sponsored offers beside results (Credit Karma), deadline/scarcity banners and tier upsells (Wealthsimple), account walls for saving, default push notifications, email capture to unlock, fixed IV or reused keys in encryption, any claim that the site "knows" or "guarantees" eligibility.

## Suggested order
Quick wins (S): 3, 6, 7, 9, 10. Then 4, 2, 8. Larger: 5 and 1 (1 first if caseworker demand is confirmed with partners).
