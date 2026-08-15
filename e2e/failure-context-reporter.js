const os = require("os");

// CI run 30574672375 left its trace behind an authenticated download, so the
// public annotation itself has to carry enough context to diagnose the next
// occurrence. This failure family is a browser/CDP connection wedge, not a
// page-logic failure: unrelated browser operations all stop answering, including
// browserContext.close(). Contention at roughly 1.6x did not reproduce the wedge;
// the wedge has been observed at roughly 10x load with swap near exhaustion. The
// causal variable — CPU, memory, swap, or their combination — is not yet identified,
// which is why this reporter records free memory, load average, and RSS together
// rather than any single metric. Keeping that evidence in one plain line also makes
// it survive the same wedged browser process that can prevent richer artifacts from
// completing.
class FailureContextReporter {
  constructor() {
    this.startedAt = Date.now();
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.minFreeMb = Infinity;
  }

  onBegin() {
    try {
      this.startedAt = Date.now();
      this.total = 0;
      this.passed = 0;
      this.failed = 0;
      this.minFreeMb = Infinity;
    } catch (_) {}
  }

  onTestEnd(test, result) {
    try {
      const freeMb = os.freemem() / 1024 / 1024;
      const totalMb = os.totalmem() / 1024 / 1024;
      const rssMb = process.memoryUsage().rss / 1024 / 1024;
      const load = os.loadavg().map((value) => value.toFixed(2)).join(",");
      this.minFreeMb = Math.min(this.minFreeMb, freeMb);
      this.total += 1;

      if (result.status === "passed") {
        this.passed += 1;
        return;
      }

      this.failed += 1;
      const project = (test.parent.project() || {}).name || "unknown";
      const location = test.location || {};
      const file = location.file || "unknown";
      const line = location.line || 0;
      const title = String(test.title || "unknown").replace(/\s+/g, " ");
      const error = result.error || (result.errors && result.errors[0]);
      const errorLine = String((error && (error.message || error.value)) || "unknown")
        .split(/\r?\n/, 1)[0]
        .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
        .replace(/\s+/g, " ");
      const elapsedMs = Date.now() - this.startedAt;
      console.log(
        `FAILCTX project=${JSON.stringify(project)} test=${JSON.stringify(`${file}:${line}`)} ` +
          `title=${JSON.stringify(title)} durationMs=${result.duration} status=${result.status} ` +
          `error=${JSON.stringify(errorLine)} freeMemMb=${freeMb.toFixed(1)} ` +
          `totalMemMb=${totalMb.toFixed(1)} loadavg=[${load}] rssMb=${rssMb.toFixed(1)} ` +
          `elapsedMs=${elapsedMs}`,
      );
    } catch (_) {}
  }

  onEnd() {
    try {
      const wallMs = Date.now() - this.startedAt;
      const minFree = Number.isFinite(this.minFreeMb) ? this.minFreeMb.toFixed(1) : "n/a";
      console.log(
        `FAILCTX-SUMMARY total=${this.total} passed=${this.passed} failed=${this.failed} ` +
          `wallMs=${wallMs} minFreeMemMb=${minFree}`,
      );
    } catch (_) {}
  }
}

module.exports = FailureContextReporter;
