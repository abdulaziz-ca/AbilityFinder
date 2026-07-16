# 📐 AbilityFinder: Development & Technical Guide (v2.1)

This document synthesizes ALL architectural concepts, deployment methods, and development constraints into a single source of truth. It replaces redundancy found across `HANDOFF.md`, `DEPLOY.md`, and parts of `AGENTS.md` to streamline context for future AI tooling.

---
## 💡 Core Architecture (The 'What')

*   **Deployment Model:** Cloudflare Worker with static assets (`public/`). The entire front-end is vanilla HTML/CSS/JS, ensuring maximum portability and zero build dependencies.
*   **State Management Philosophy:** **Client-side persistence only.** Zero user accounts or server-side state storage. All progress lives in the browser's IndexedDB. This remains our **highest technical constraint** due to privacy needs (Rule 3).
*   **Communication:** The Assistant (`/api/ask`) is isolated and runs via Workers AI, strictly grounded by `data.js` content to prevent model hallucination.

## 🛠 Development Workflow & Tools (The 'How')

### **Development Loop (Single-Source Workflow)**
1.  **Data Change:** Modify a benefit fact, an eligibility criterion, or a city name in `public/data.js`.
2.  **Rebuild Grounding:** Run `npm run gen:context` to update the AI grounding model (`src/benefits-context.js`).
3.  **Test & Style:** Run all integrated functional tests (`npm run test`) and validate UI changes against WCAG standards (Axe Audit process).
4.  **Local Deployment Check:** Use `npx wrangler dev` for local testing, always watching the live browser preview.
5.  **Production Push:** Use `git push` or `npx wrangler deploy` to update Cloudflare.

### **Tooling Stack:**
*   **Workers/Cloudflare:** Used as the hosting platform and the primary API gate (`src/index.js`).
*   **Language:** Vanilla JavaScript, HTML, CSS (with global tokens).
*   **Critical Tool Dependency:** `wrangler` CLI is required for local development and deployment.

## 🌐 Deployment Operations Guide (From DEPLOY.md)

This section covers *how* to get the app live, separate from *what* the app does.

1.  **Domain Setup:** Buy a domain via Cloudflare Registrar. Point the DNS record (`A`/`CNAME`) to your Workers' nameserver.
2.  **SSL/Headers:** `_headers` inside `public/` manages critical security measures like `X-Frame-Options: DENY`.
3.  **API Bindings:** The Worker needs explicit bindings for `env.AI` (Workers AI) and the feedback endpoint (`send_email` binding).

## 💾 Operational Updates & Maintenance Tasks

*   **Broken Link Monitor (Phase 5A):** Run periodically to check external links against the Free Plan quota limit. Failure detection is reliable via `GET /api/link-health`.
*   **Reminder System (Phase 5B):** **MANUAL TASK:** All reminder date calculations must be verified annually by reviewing the core logic in `app.js`'s `.ics` generator to update `DATA_VERIFIED` dates and re-running simulations for the next year.
*   **Feedback Inbox:** The physical activation of the feedback email (`feedback@abilityfinder.ca`) requires **DNS changes** (MX/SPF records) on the live domain, which must be performed manually via Cloudflare's DNS dashboard.

## 🛑 Deprecated or Read-Only Context Notes

The following notes are archived for historical record only:
*   **AISH Provider Details:** The detailed legal and financial history regarding AISH payments should now reside in a dedicated `history/` folder, kept separate from the operational codebase.
*   **Historical Eligibility Models:** All previous versions of eligibility rules (e.g., old CRA tax rule sets) are stored in archived files that guide developers but are not part of the run-time logic.

---
***End of Technical Guide Build***