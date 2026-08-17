/**
 * Shared wizard helpers for the e2e suite.
 *
 * WHY THIS FILE EXISTS: settleWizardCard was copied into four spec files -
 * bc-live, persistence, wizard-accessibility and reminder-calendar - three of them
 * byte-identical and the fourth differing only by its indentation inside a describe
 * block. A codex review of #62 found an unbounded call in "three helpers" and missed
 * the fourth, which is exactly the failure mode this project keeps hitting: a shared
 * thing living at four sites, and a fix landing at three of them. One definition
 * cannot drift from itself.
 */
// Every Playwright call here carries an explicit timeout, and that is the point of the
// rewrite rather than a detail of it.
//
// The 90s test budget is the only bound an un-timed Playwright call has. Under the
// browser/CDP wedge this ticket documents, a protocol round-trip can stop answering, so
// an un-timed call does not fail - it silently consumes the whole test budget and then
// surfaces as the unexplained 90s timeout the ticket is named after. The previous version
// began with a bare `await card.count()` for exactly this reason and had no bound at all.
//
// Bounds, all sequential rather than overlapping: existence 10s, then the animation
// evaluate 15s, whose in-page race resolves at 5000ms. So this helper is bounded at ~25s
// end to end, and unlike the old comment's "80s" claim for pick(), that figure covers
// every call it makes rather than only the ones that happened to carry a timeout.
const EXISTENCE_TIMEOUT_MS = 10000;
const EVALUATE_TIMEOUT_MS = 15000;
const ANIMATION_RACE_MS = 5000;

async function settleWizardCard(page) {
  const card = page.locator(".wizard-card");

  // WHY not `await card.count()`: count() takes no timeout and inherits the 90s budget.
  // waitFor({ state: "attached" }) does take one, and "no card present" is a legitimate
  // state here rather than a failure - several callers run before the wizard exists - so
  // a timeout means "no card", and we return exactly as the old count() check did.
  const present = await card
    .first()
    .waitFor({ state: "attached", timeout: EXISTENCE_TIMEOUT_MS })
    .then(() => true)
    .catch(() => false);
  if (!present) return;

  const result = await card
    .evaluate(
      async (el, raceMs) => {
        const finiteOf = () =>
          el.getAnimations().filter((animation) => {
            const timing = animation.effect && animation.effect.getComputedTiming();
            return !timing || timing.iterations !== Infinity;
          });
        const settled = await Promise.race([
          Promise.all(finiteOf().map((animation) => animation.finished.catch(() => {}))).then(() => true),
          new Promise((resolve) => setTimeout(() => resolve(false), raceMs)),
        ]);
        return {
          settled,
          still: finiteOf()
            .filter((animation) => animation.playState === "running")
            .map((animation) => animation.animationName || animation.constructor.name),
        };
      },
      ANIMATION_RACE_MS,
      { timeout: EVALUATE_TIMEOUT_MS },
    )
    .catch((error) => ({ settled: false, still: [], evaluateError: String((error && error.message) || error) }));

  if (!result.settled) {
    throw new Error(
      `settleWizardCard: the wizard card was still animating after ${ANIMATION_RACE_MS}ms` +
        (result.still && result.still.length ? ` — still running: [${result.still.join(", ")}]` : "") +
        (result.evaluateError ? ` — evaluate failed: ${result.evaluateError}` : "") +
        ". A click dispatched now can land at stale coordinates and hit nothing, which surfaces " +
        "later as an unexplained 90s timeout rather than as this message.",
    );
  }
}

module.exports = { settleWizardCard, EXISTENCE_TIMEOUT_MS, EVALUATE_TIMEOUT_MS, ANIMATION_RACE_MS };
