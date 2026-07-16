# 📜 AbilityFinder Project: Consolidated Knowledge Base & History

***
**Purpose:** This single document consolidates architectural, operational, and development knowledge from all core documentation files (`HANDOFF.md`, `DEPLOY.md`, etc.). It serves as the definitive, historical reference point for what has been built and *why* certain design decisions were made (critical for auditing). **It is not a functional guide; it is an archive.**
***

## 🎯 EXECUTIVE SUMMARY (Current State)
The product resides at `https://abilityfinder.ca` and is functionally complete (v2.1). The core value proposition remains: providing plain-English, accurate guidance to locate disability benefits for Alberta residents (`data.js`). All foundational systems are designed with the paramount constraints of **Zero Spend**, **Privacy First** (no PII/PHI stored), and **Accuracy Over Completeness**.

## 🧠 Core Architecture & Principles
*   **Platform:** Cloudflare Worker with static assets (`public/` directory). No build step is needed for the core site logic.
*   **Key Constraint - Privacy:** Absolutely no user data (disability, income) is stored on a server or handled by an account structure. All state relies solely on **IndexedDB**. This decision guides all future development: any new feature that requires PII/PHI and state tracking must revisit this constraint first.
*   **Technical Debt Solved:** The mandatory migration from `localStorage` to IndexedDB is complete (See reference in `AGENTS.md`).

## 🧭 What Needs To Be Remembered (The "Why")
This section captures the critical, non-obvious business and technical decisions made during development that must never be forgotten:

*   **Eligibility Nuance:** Benefits are determined by **limitation, not diagnosis**. The language must always reflect this.
*   **Severity of Error:** A blank page is the absolute worst failure mode; every view must implement `renderSafely()`.
*   **Model Hallucination Risk:** AI assistant answers *must* be strictly grounded in `data.js` data structures, as ungrounded LLMs are known to invent benefits/amounts.

## 💼 Product Lifecycle & Milestones (History / ROADMAP)
(A summarized timeline of achievements is embedded within the dedicated Roadmap file.) The system has successfully completed:
1.  **Phase 1:** Establishing comprehensive value models and priority rankings.
2.  **Phase 2:** Introducing granular eligibility checks ("Eligible" vs. "Likely Eligible") based on clear, simple criteria.
3.  **Phase 3:** Organizing findings into practical themes (Money / Health / Work).
4.  **Phase 4:** Integrating the AI Assistant and operationalizing link-checking (`/api/link-health`).
5.  **Phase 5:** Implementing critical fail-safes: **Broken Link Monitor**, Calendar Reminders, Data Freshness Dates, and user confirmation.

## 📐 Operational Guides (Operational Discipline)
The following processes are necessary for ongoing maintenance but must be maintained outside the core codebase:
*   **Monitoring Watchdog:** Schedule a recurring job to check `/api/link-health` (See relevant `cronjob` documentation).
*   **User Feedback:** Ensure the email routing is correctly configured via DNS records at the Cloudflare level.

## 🚧 Obsolete / Archived Concepts
The following features were debated and intentionally rejected or superseded:
*   Accounts/Sync, Email Reminders, Community Reviews, Admin CMS. These are explicitly excluded to maintain privacy compliance (PII).
*   Previous iteration architecture details regarding `localStorage` usage are replaced by the robust IndexedDB pattern.

---
**End of Knowledge Base.** This document serves as a comprehensive snapshot for auditing and reference; please use it in conjunction with the actively maintained files: `✨_PROJECT_SUMMARY.md`, `BUILDING_GUIDE.md`, and the codebase itself.