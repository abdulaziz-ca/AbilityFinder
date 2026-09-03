"use strict";
// Readiness helper for the AbilityFinder SPA (ticket #200).
//
// public/app.js does all of its wiring inside a DOMContentLoaded handler that
// `await`s loadState() first. The `load` event — page.goto()'s default wait —
// does NOT wait for that pending promise, so a test can act on the page before
// the app's listeners exist (measured 42% unwired on webkit). A click dispatched
// into that window is silently lost.
//
// The init handler calls history.replaceState({...}) as its last step, AFTER
// wireAccessibility(). So a non-null history.state is a tamper-free proof that
// wiring is complete. test/app-init-order.test.js guards that ordering, so this
// signal can never silently stop meaning "wired".
async function waitForAppReady(page) {
  await page.waitForFunction(() => history.state !== null);
}

// Navigate, then wait until the SPA is fully wired. Use this instead of
// page.goto() in any test that interacts with app-wired UI right after navigating.
async function gotoReady(page, path = "/") {
  await page.goto(path);
  await waitForAppReady(page);
}

module.exports = { waitForAppReady, gotoReady };
