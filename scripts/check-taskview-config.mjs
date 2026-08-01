#!/usr/bin/env node

// Validates a TaskView agent policy file against the contract documented in
// TASKVIEW-WORKFLOW.md.
//
// Two kinds of rule are enforced, and the distinction matters:
//
//   * Universal contract  - values that must be identical for every project
//     using this workflow (lifecycle stages, agent identity tags, review rules,
//     human-only gates, auto-next, capture state, offline log path). These are
//     asserted by exact value.
//
//   * Project-specific    - values that legitimately differ per project
//     (name, id, org slug, route segment, URLs). These are checked for
//     presence, type and format only, never for a hard-coded value, so this
//     script keeps working when the workflow is reused on a new project.
//
// Usage:
//   node scripts/check-taskview-config.mjs [policy-path]
//   TASKVIEW_POLICY=/path/to/policy.json node scripts/check-taskview-config.mjs
//
// With no argument the script searches for .taskview/policy.json in the current
// directory and then each parent directory. Exits 0 when valid, 1 otherwise.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const POLICY_RELATIVE_PATH = join(".taskview", "policy.json");

// --- Universal contract ------------------------------------------------------

// TASKVIEW-WORKFLOW.md: "Project board lifecycle, in order: Backlog -> Ready ->
// In Progress -> Blocked -> Review -> Verification -> Done. Cancelled is a
// terminal alternative, not a success state."
const LIFECYCLE_ORDER = [
  "Backlog",
  "Ready",
  "In Progress",
  "Blocked",
  "Review",
  "Verification",
  "Done",
];
// A terminal alternative, not a success state. Its position is deliberately not
// constrained: the workflow describes it as an alternative outcome rather than
// a stage, so a board may place it anywhere.
const TERMINAL_STATUS = "Cancelled";

// The built-in untriaged capture area. Explicitly NOT a project board status.
const CAPTURE_STATE = "Inbox";

// "Identify the acting agent with exactly one identity tag: agent:claude or
// agent:codex."
const REQUIRED_AGENT_TAGS = ["agent:claude", "agent:codex"];

// "A substantial task follows Review -> Verification -> Done."
const REQUIRED_REVIEW_SEQUENCE = ["Review", "Verification", "Done"];

// The reviewer inspection list under "Review, verification, and approval".
const REQUIRED_CHALLENGE_AREAS = [
  "requirements",
  "diff",
  "tests",
  "security",
  "accessibility",
  "privacy",
  "regression_risk",
];

// The bullets under "Human-only gates". The doc's single "deleting a TaskView
// project or task" bullet is represented as two keys in the policy file.
const REQUIRED_HUMAN_GATES = [
  "delete_project",
  "delete_task",
  "workflow_changes",
  "major_cancellations",
  "production_deploy",
  "security_sensitive_approvals",
  "unclear_product_requirements",
];

// --- Helpers -----------------------------------------------------------------

const show = (value) => JSON.stringify(value);

function requireExact(errors, actual, expected, path) {
  if (actual !== expected) {
    errors.push(`${path} must be ${show(expected)}; received ${show(actual)}`);
  }
}

function requireNonEmptyString(errors, value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string; received ${show(value)}`);
    return false;
  }
  return true;
}

function requireInteger(errors, value, path, { positive = false } = {}) {
  if (!Number.isInteger(value)) {
    errors.push(`${path} must be an integer; received ${show(value)}`);
    return false;
  }
  if (positive && value <= 0) {
    errors.push(`${path} must be a positive integer; received ${show(value)}`);
    return false;
  }
  return true;
}

// Returns the parsed URL, or null. Only http/https are accepted: `new URL()`
// happily parses javascript:, data: and mailto:, which are never valid here.
function requireUrl(errors, value, path) {
  if (!requireNonEmptyString(errors, value, path)) return null;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    errors.push(`${path} must be a valid absolute URL; received ${show(value)}`);
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    errors.push(
      `${path} must use http or https; received scheme ${show(parsed.protocol)}`,
    );
    return null;
  }
  return parsed;
}

function requirePlainObject(errors, value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${path} must be an object; received ${show(value)}`);
    return false;
  }
  return true;
}

function requireExactArray(errors, actual, expected, path) {
  if (!Array.isArray(actual)) {
    errors.push(`${path} must be an array; received ${show(actual)}`);
    return;
  }
  if (
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    errors.push(
      `${path} must equal ${show(expected)} in that order; received ${show(actual)}`,
    );
  }
}

// Set equality, order-independent. Used where the doc says "exactly" but does
// not impose an order.
function requireExactSet(errors, actual, expected, path) {
  if (!Array.isArray(actual)) {
    errors.push(`${path} must be an array; received ${show(actual)}`);
    return;
  }
  reportDuplicates(errors, actual, path);
  const missing = expected.filter((v) => !actual.includes(v));
  const unexpected = actual.filter((v) => !expected.includes(v));
  if (missing.length > 0) {
    errors.push(`${path} is missing ${show(missing)}; received ${show(actual)}`);
  }
  if (unexpected.length > 0) {
    errors.push(
      `${path} contains unexpected ${show(unexpected)}; only ${show(expected)} are allowed`,
    );
  }
}

// A repeated entry is always a mistake, even where extras are otherwise allowed:
// it makes "which one wins" ambiguous.
function reportDuplicates(errors, values, path) {
  const seen = new Set();
  const dupes = new Set();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  if (dupes.size > 0) {
    errors.push(`${path} contains duplicate entries ${show([...dupes])}`);
  }
}

// Superset check: every required entry must be present; extras are permitted.
function requireContainsAll(errors, actual, required, path) {
  if (!Array.isArray(actual)) {
    errors.push(`${path} must be an array; received ${show(actual)}`);
    return false;
  }
  reportDuplicates(errors, actual, path);
  requireAllNonEmptyStrings(errors, actual, path);
  const missing = required.filter((v) => !actual.includes(v));
  if (missing.length > 0) {
    errors.push(`${path} is missing required ${show(missing)}`);
    return false;
  }
  return true;
}

// Extras are allowed, but an extra entry still has to be a usable name. A null
// or blank column would render as an unnamed, unusable board column.
function requireAllNonEmptyStrings(errors, values, path) {
  const bad = values.filter(
    (v) => typeof v !== "string" || v.trim() === "",
  );
  if (bad.length > 0) {
    errors.push(
      `${path} entries must all be non-empty strings; found ${show(bad)}`,
    );
  }
}

// --- Validation --------------------------------------------------------------

function validatePolicy(policy) {
  const errors = [];

  if (!requirePlainObject(errors, policy, "policy")) return errors;

  // Schema version - universal.
  requireExact(errors, policy.version, 1, "version");

  // Project-specific: presence, type and format only. Deliberately NOT pinned
  // to any one project's values, so a new project's policy still validates.
  requireNonEmptyString(errors, policy.project_name, "project_name");
  requireInteger(errors, policy.project_id, "project_id", { positive: true });
  requireNonEmptyString(errors, policy.organization_slug, "organization_slug");
  requireInteger(errors, policy.kanban_route_segment, "kanban_route_segment");
  const projectUrl = requireUrl(errors, policy.project_url, "project_url");
  const localUrl = requireUrl(errors, policy.local_url, "local_url");
  requireUrl(errors, policy.api_url, "api_url");

  // The board link must live on the same origin as the UI. Without this, a
  // policy can keep local_url on localhost while pointing project_url at an
  // unrelated host, sending anyone who follows a ticket link off-site.
  if (projectUrl && localUrl && projectUrl.origin !== localUrl.origin) {
    errors.push(
      `project_url must be on the same origin as local_url; received ${show(projectUrl.origin)} vs ${show(localUrl.origin)}`,
    );
  }

  // Self-consistency: the project URL must actually address this project.
  // Compared as exact path segments, not substrings - a substring match happily
  // accepts an unrelated URL that merely contains the right text, and misses a
  // route segment that no longer matches kanban_route_segment.
  if (
    projectUrl &&
    typeof policy.organization_slug === "string" &&
    Number.isInteger(policy.project_id)
  ) {
    // The whole path is compared, in order. Presence alone is not enough:
    // /2/org-slug/-1401 (reordered) and /decoy/org-slug/2/-1401 (extra prefix)
    // both contain the right values while addressing the wrong thing.
    const segments = projectUrl.pathname.split("/").filter(Boolean);
    const expected = [
      String(policy.organization_slug),
      String(policy.project_id),
    ];
    if (Number.isInteger(policy.kanban_route_segment)) {
      expected.push(String(policy.kanban_route_segment));
    }
    const matches =
      segments.length === expected.length &&
      segments.every((s, i) => s === expected[i]);
    if (!matches) {
      errors.push(
        `project_url path must be exactly /${expected.join("/")} (organization_slug/project_id/kanban_route_segment); received /${segments.join("/")}`,
      );
    }
  }

  // Universal contract.
  requireExact(errors, policy.capture_state, CAPTURE_STATE, "capture_state");

  // All lifecycle stages plus Cancelled must be present. Extra columns are
  // allowed (TaskView permits them), but the documented stages must appear in
  // the documented relative order.
  const requiredStatuses = [...LIFECYCLE_ORDER, TERMINAL_STATUS];
  // TASKVIEW-WORKFLOW.md: the built-in Inbox "is the untriaged capture area
  // only; it is separate from the project board and is not a project status."
  if (
    Array.isArray(policy.project_statuses) &&
    policy.project_statuses.includes(CAPTURE_STATE)
  ) {
    errors.push(
      `project_statuses must not include ${show(CAPTURE_STATE)}; it is the untriaged capture area, not a project board status`,
    );
  }
  if (
    requireContainsAll(
      errors,
      policy.project_statuses,
      requiredStatuses,
      "project_statuses",
    )
  ) {
    const positions = LIFECYCLE_ORDER.map((s) => policy.project_statuses.indexOf(s));
    const ordered = positions.every((p, i) => i === 0 || positions[i - 1] < p);
    if (!ordered) {
      errors.push(
        `project_statuses must list ${show(LIFECYCLE_ORDER)} in that relative order; received ${show(policy.project_statuses)}`,
      );
    }
  }

  requireExactSet(errors, policy.agent_tags, REQUIRED_AGENT_TAGS, "agent_tags");

  if (requirePlainObject(errors, policy.review, "review")) {
    requireExact(
      errors,
      policy.review.substantial_work_requires_other_agent,
      true,
      "review.substantial_work_requires_other_agent",
    );
    requireExact(
      errors,
      policy.review.self_approval_allowed,
      false,
      "review.self_approval_allowed",
    );
    requireExactArray(
      errors,
      policy.review.sequence,
      REQUIRED_REVIEW_SEQUENCE,
      "review.sequence",
    );
    requireContainsAll(
      errors,
      policy.review.challenge_areas,
      REQUIRED_CHALLENGE_AREAS,
      "review.challenge_areas",
    );
  }

  if (requirePlainObject(errors, policy.human_gates, "human_gates")) {
    for (const gate of REQUIRED_HUMAN_GATES) {
      requireExact(errors, policy.human_gates[gate], true, `human_gates.${gate}`);
    }
    // Additional gates are allowed, but must be explicit booleans so a gate is
    // never left in an ambiguous state - and a gate that is present may not be
    // switched off. TASKVIEW-WORKFLOW.md: the defaults "may be configured later
    // by an explicit human-approved policy change; agents must not relax them
    // themselves." Optional here means "may be absent", never "may be false".
    for (const [key, value] of Object.entries(policy.human_gates)) {
      if (REQUIRED_HUMAN_GATES.includes(key)) continue;
      if (typeof value !== "boolean") {
        errors.push(
          `human_gates.${key} must be a boolean; received ${show(value)}`,
        );
      } else if (value === false) {
        errors.push(
          `human_gates.${key} is present but disabled; a declared gate must be true (remove the key instead of setting it false)`,
        );
      }
    }
  }

  requireExact(errors, policy.auto_next, false, "auto_next");
  requireExact(
    errors,
    policy.offline_log,
    ".taskview/offline-log.md",
    "offline_log",
  );

  return errors;
}

// --- Policy file resolution --------------------------------------------------

// Returns { path } on success, or { searched } listing every location tried.
function resolvePolicyPath(explicitPath) {
  if (explicitPath) {
    const path = resolve(explicitPath);
    return existsSync(path) ? { path } : { searched: [path] };
  }

  if (process.env.TASKVIEW_POLICY) {
    const path = resolve(process.env.TASKVIEW_POLICY);
    return existsSync(path) ? { path } : { searched: [path] };
  }

  const searched = [];
  let dir = process.cwd();
  for (;;) {
    const candidate = join(dir, POLICY_RELATIVE_PATH);
    searched.push(candidate);
    if (existsSync(candidate)) return { path: candidate };
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return { searched };
}

const USAGE = `Usage: node scripts/check-taskview-config.mjs [policy-path]

With no argument, looks for TASKVIEW_POLICY, then ${POLICY_RELATIVE_PATH}
in the current directory and each parent directory.`;

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    return;
  }

  if (args.length > 1) {
    console.error(`Expected at most one policy path; received ${args.length}.`);
    console.error(USAGE);
    process.exitCode = 2;
    return;
  }

  const resolved = resolvePolicyPath(args[0]);
  if (!resolved.path) {
    console.error("TaskView policy check failed: no policy file found.");
    console.error("Looked in:");
    for (const candidate of resolved.searched) console.error(`- ${candidate}`);
    console.error(
      "\nPass an explicit path or set TASKVIEW_POLICY if the policy lives outside this repository.",
    );
    process.exitCode = 1;
    return;
  }

  const policyPath = resolved.path;
  let source;
  try {
    source = await readFile(policyPath, "utf8");
  } catch (error) {
    console.error(
      `TaskView policy check failed: cannot read ${policyPath}: ${error.message}`,
    );
    process.exitCode = 1;
    return;
  }

  let policy;
  try {
    policy = JSON.parse(source);
  } catch (error) {
    console.error(
      `TaskView policy check failed: ${policyPath} is not valid JSON: ${error.message}`,
    );
    process.exitCode = 1;
    return;
  }

  const errors = validatePolicy(policy);
  if (errors.length > 0) {
    console.error(`TaskView policy check failed for ${policyPath}:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`TaskView policy check passed: ${policyPath}`);
}

await main();
