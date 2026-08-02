#!/usr/bin/env node

// Owner decision: every spec entry with status "Done" must have both the Done
// kanban statusId and complete=true. create_task cannot set complete, so creation
// is followed by update_task and a get_task verification before checkpoint flush.
// update_task responses are unreliable for dateComplete and may echo null after
// the server stamped it; only the subsequent get_task result is trusted.
// dateComplete is the TaskView import/recording timestamp, not the true historical
// closure date. The true closure date remains in the ticket note and is never
// overwritten to match dateComplete.
// TaskView API facts: list_tasks returns only top-level tasks and its default
// sortBy="date" can return an empty array for a populated goal. Marker resolution
// therefore pages separate incomplete and complete epic rosters with
// sortBy="priority", unions them by task id, re-reads every epic with get_task,
// and recursively scans the returned descendant notes client-side.
// No-delete rule: this script never removes tickets or calls a removal endpoint.

import {
  closeSync,
  fsyncSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SPEC_PATH = resolve(".taskview/board-spec.json");
const CHECKPOINT_PATH = resolve(".taskview/board-checkpoint.json");
const POLICY_PATH = resolve(".taskview/policy.json");
const PAGE_SIZE = 30;
const REQUEST_TIMEOUT_MS = 15_000;

function usage() {
  return `Usage: node scripts/taskview-sync-board.mjs --phase=<n> [options]
       node scripts/taskview-sync-board.mjs --fix-done [options]
       node scripts/taskview-sync-board.mjs --self-test=<fixture.json>
       node scripts/taskview-sync-board.mjs --self-test-tree=<fixture.json>
       node scripts/taskview-sync-board.mjs --self-test-roster=<fixture.json>

Options:
  --phase=<n>                 Ticket/dependency phase number
  --fix-done                  Repair complete flags for all Done spec entries; creates nothing
  --dry-run                   Preview only (default)
  --apply                     Mutate TaskView and persist checkpoint resolutions
  --batch-size=<n>            Maximum creations this run (default: 10)
  --goal=<n>                  TaskView goal id (default: policy project_id)
  --self-test=<path>          Test flat marker resolution without network access
  --self-test-tree=<path>     Test recursive marker resolution without network access
  --self-test-roster=<path>   Test exclusive completed roster union without network access`;
}

function positiveInteger(value, flag) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer.`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = {
    phase: null,
    fixDone: false,
    apply: false,
    batchSize: 10,
    goal: null,
    selfTest: null,
    selfTestTree: null,
    selfTestRoster: null,
  };
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--fix-done") options.fixDone = true;
    else if (arg === "--apply") options.apply = true;
    else if (arg === "--dry-run") options.apply = false;
    else if (arg.startsWith("--phase=")) {
      options.phase = positiveInteger(arg.slice(8), "--phase");
    } else if (arg.startsWith("--batch-size=")) {
      options.batchSize = positiveInteger(arg.slice(13), "--batch-size");
    } else if (arg.startsWith("--goal=")) {
      options.goal = positiveInteger(arg.slice(7), "--goal");
    } else if (arg.startsWith("--self-test=")) {
      const path = arg.slice(12);
      if (path === "") throw new Error("--self-test requires a fixture path.");
      options.selfTest = resolve(path);
    } else if (arg.startsWith("--self-test-tree=")) {
      const path = arg.slice(17);
      if (path === "") {
        throw new Error("--self-test-tree requires a fixture path.");
      }
      options.selfTestTree = resolve(path);
    } else if (arg.startsWith("--self-test-roster=")) {
      const path = arg.slice(19);
      if (path === "") {
        throw new Error("--self-test-roster requires a fixture path.");
      }
      options.selfTestRoster = resolve(path);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (
    !options.help &&
    options.selfTest === null &&
    options.selfTestTree === null &&
    options.selfTestRoster === null &&
    options.phase === null &&
    !options.fixDone
  ) {
    throw new Error("--phase=<n> or --fix-done is required.");
  }
  if (options.fixDone && options.phase !== null) {
    throw new Error("--fix-done cannot be combined with --phase.");
  }
  const selfTestModes = [
    options.selfTest,
    options.selfTestTree,
    options.selfTestRoster,
  ].filter((path) => path !== null);
  if (selfTestModes.length > 1) {
    throw new Error("Use only one self-test mode at a time.");
  }
  return options;
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read valid ${label} JSON at ${path}: ${error.message}`);
  }
}

function flushCheckpoint(checkpoint) {
  writeFileSync(CHECKPOINT_PATH, `${JSON.stringify(checkpoint, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  const descriptor = openSync(CHECKPOINT_PATH, "r");
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function safeMessage(error, token) {
  const raw = error instanceof Error ? error.message : String(error);
  return token ? raw.split(token).join("[redacted]") : raw;
}

export function markerFor(key) {
  return `<!-- spec-key: ${key} -->`;
}

const taskId = (task) => task?.id ?? task?.taskId ?? task?.task_id ?? null;
const taskNotes = (task) => task?.notes ?? task?.note ?? "";
const taskStatusId = (task) =>
  task?.statusId ?? task?.status_id ?? task?.status?.id ?? null;
const taskComplete = (task) => task?.complete ?? task?.completed ?? null;
const taskDateComplete = (task) =>
  task?.dateComplete ?? task?.date_complete ?? null;
const MARKER_PATTERN = /^<!-- spec-key: ([^\r\n]+) -->\r?$/gm;

function indexTaskMarkers(index, task) {
  const notes = taskNotes(task);
  if (typeof notes !== "string") return;
  MARKER_PATTERN.lastIndex = 0;
  for (const match of notes.matchAll(MARKER_PATTERN)) {
    const key = match[1];
    const id = Number(taskId(task));
    if (!Number.isInteger(id)) {
      throw new Error(`Task containing ${markerFor(key)} has no usable numeric id.`);
    }
    const existingId = index.get(key);
    if (existingId !== undefined && existingId !== id) {
      throw new Error(
        `DUPLICATE spec-key ${key}: task ids #${existingId} and #${id}.`,
      );
    }
    index.set(key, id);
  }
}

export function buildMarkerIndex(tasks) {
  const index = new Map();
  for (const task of tasks) indexTaskMarkers(index, task);
  return index;
}

export function findByMarker(tasks, key) {
  return buildMarkerIndex(tasks).get(key) ?? null;
}

export async function fetchChildTags(client, childId) {
  // Parent get_task payloads report child tags as [], so always re-read the child.
  const child = await client.getTask(childId);
  return Array.isArray(child?.tags) ? child.tags : [];
}

async function fetchTopLevelRosterPass(client, showCompleted) {
  const tasks = [];
  for (let page = 0; ; page += 1) {
    const payload = await client.listTasks({
      page,
      pageSize: PAGE_SIZE,
      sortBy: "priority",
      showCompleted,
    });
    const pageTasks = extractTasks(payload);
    tasks.push(...pageTasks);
    if (pageTasks.length < PAGE_SIZE) return tasks;
  }
}

export async function discoverTopLevelRoster(client) {
  if (!client || typeof client.listTasks !== "function") {
    throw new Error("Roster discovery requires client.listTasks().");
  }

  const incompleteTasks = await fetchTopLevelRosterPass(client, false);
  const completeTasks = await fetchTopLevelRosterPass(client, true);
  const unionById = new Map();
  for (const rosterTask of [...incompleteTasks, ...completeTasks]) {
    const id = Number(taskId(rosterTask));
    if (!Number.isInteger(id)) {
      throw new Error("Top-level task roster contains a task without a numeric id.");
    }
    if (!unionById.has(id)) unionById.set(id, rosterTask);
  }

  const roster = {
    tasks: [...unionById.values()],
    incompleteCount: incompleteTasks.length,
    completeCount: completeTasks.length,
    unionCount: unionById.size,
  };
  console.log(`[roster] incomplete top-level tasks: ${roster.incompleteCount}`);
  console.log(`[roster] complete top-level tasks: ${roster.completeCount}`);
  console.log(`[roster] unioned top-level tasks: ${roster.unionCount}`);
  return roster;
}

export async function buildMarkerIndexDeep(client, { onRoster } = {}) {
  if (!client || typeof client.listTasks !== "function") {
    throw new Error("Marker indexing requires client.listTasks().");
  }
  if (typeof client.getTask !== "function") {
    throw new Error("Marker indexing requires client.getTask().");
  }

  const index = new Map();
  const visitedIds = new Set();
  const visitedObjects = new WeakSet();

  const walk = (task) => {
    if (!task || typeof task !== "object") return;
    const id = Number(taskId(task));
    if (Number.isInteger(id)) {
      if (visitedIds.has(id)) return;
      visitedIds.add(id);
    } else {
      if (visitedObjects.has(task)) return;
      visitedObjects.add(task);
    }

    indexTaskMarkers(index, task);
    const children = Array.isArray(task.subtasks) ? task.subtasks : [];
    for (const child of children) walk(child);
  };

  const roster = await discoverTopLevelRoster(client);
  if (typeof onRoster === "function") onRoster(roster);
  for (const rosterTask of roster.tasks) {
    const id = Number(taskId(rosterTask));
    const fullTask = await client.getTask(id);
    walk(fullTask);
  }
  return index;
}

function extractTasks(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.tasks)) return payload.tasks;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.tasks)) return payload.data.tasks;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

class TaskViewClient {
  constructor(baseUrl, token, goalId) {
    let parsed;
    try {
      parsed = new URL(baseUrl);
    } catch {
      throw new Error("TASKVIEW_API_URL must be a valid absolute URL.");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("TASKVIEW_API_URL must use http or https.");
    }
    parsed.username = "";
    parsed.password = "";
    this.baseUrl = parsed.toString().replace(/\/$/, "");
    this.token = token;
    this.goalId = goalId;
  }

  async request(method, pathname, { query, body } = {}) {
    const url = new URL(`${this.baseUrl}${pathname}`);
    for (const [name, value] of Object.entries(query ?? {})) {
      url.searchParams.set(name, String(value));
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error(`TaskView request timed out after ${REQUEST_TIMEOUT_MS} ms.`);
      }
      throw new Error("TaskView request failed before a response was received.");
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) {
      throw new Error(`TaskView request failed with HTTP ${response.status}.`);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    if (text.trim() === "") return null;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("TaskView returned a non-JSON response.");
    }
  }

  async listTasks({ page, pageSize, sortBy, showCompleted }) {
    return this.request("GET", "/api/tasks", {
      query: {
        goalId: this.goalId,
        page,
        pageSize,
        showCompleted,
        sortBy,
      },
    });
  }

  async createTask(entry, notes, parentId) {
    const payload = await this.request("POST", "/api/tasks", {
      body: {
        goalId: this.goalId,
        title: entry.title,
        notes,
        status: entry.status,
        priority: entry.priority,
        tags: entry.tags,
        ...(parentId === null ? {} : { parentId }),
      },
    });
    const created = payload?.task ?? payload?.data ?? payload;
    const id = taskId(created);
    if (id === null) throw new Error("TaskView create response did not contain a task id.");
    return id;
  }

  async getTask(id) {
    const payload = await this.request(
      "GET",
      `/api/tasks/${encodeURIComponent(id)}`,
    );
    return payload?.task ?? payload?.data ?? payload;
  }

  async markTaskComplete(id) {
    await this.request("PUT", `/api/tasks/${encodeURIComponent(id)}`, {
      body: { complete: true },
    });
  }

  async listDependencies(id) {
    const payload = await this.request(
      "GET",
      `/api/tasks/${encodeURIComponent(id)}/dependencies`,
    );
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.dependencies)) return payload.dependencies;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.dependencies)) return payload.data.dependencies;
    return [];
  }

  async addDependency(id, dependsOnTaskId) {
    await this.request("POST", `/api/tasks/${encodeURIComponent(id)}/dependencies`, {
      body: { dependsOnTaskId },
    });
  }
}

const relationId = (checkpoint, key) =>
  key ? checkpoint.keyToTaskId[key] ?? null : null;
const displayIds = (ids) =>
  ids.length > 0 ? ids.map((id) => `#${id}`).join(", ") : "None";

function doneStatusIdFromCheckpoint(checkpoint) {
  const matches = [];
  for (const phase of checkpoint.completed ?? []) {
    for (const column of phase?.columns?.final ?? []) {
      if (column?.name === "Done") matches.push(Number(column.id));
    }
  }
  const ids = [...new Set(matches.filter((id) => Number.isInteger(id)))];
  if (ids.length !== 1) {
    throw new Error(
      `Checkpoint must identify exactly one Done kanban column id; found ${ids.length}.`,
    );
  }
  return ids[0];
}

function observedDoneValues(task) {
  return {
    complete: taskComplete(task),
    statusId: taskStatusId(task),
    dateComplete: taskDateComplete(task),
  };
}

function assertDoneState(entry, id, task, doneStatusId) {
  const observed = observedDoneValues(task);
  if (
    observed.complete !== true ||
    Number(observed.statusId) !== doneStatusId
  ) {
    throw new Error(
      `${entry.key} task #${id} Done verification failed: ` +
        `observed complete=${JSON.stringify(observed.complete)}, ` +
        `statusId=${JSON.stringify(observed.statusId)}, ` +
        `dateComplete=${JSON.stringify(observed.dateComplete)}; ` +
        `expected complete=true and statusId=${doneStatusId}.`,
    );
  }
  return observed;
}

async function applyAndVerifyDone(
  entry,
  id,
  client,
  doneStatusId,
  checkpoint,
) {
  await client.markTaskComplete(id);
  const reread = await client.getTask(id);
  const observed = assertDoneState(entry, id, reread, doneStatusId);
  checkpoint.doneFlagVerification ??= {};
  checkpoint.doneFlagVerification[entry.key] = {
    taskId: id,
    applied: true,
    verified: true,
    observedDateComplete: observed.dateComplete,
  };
  flushCheckpoint(checkpoint);
  return observed;
}

function assembleNote(entry, spec, checkpoint) {
  const note = entry.note;
  const parentId = relationId(checkpoint, entry.parentKey);
  const childIds = spec
    .filter((candidate) => candidate.parentKey === entry.key)
    .map((candidate) => relationId(checkpoint, candidate.key))
    .filter((id) => id !== null);
  const blockerIds = (entry.dependsOnKeys ?? [])
    .map((key) => relationId(checkpoint, key))
    .filter((id) => id !== null);
  const priorityName = { 1: "Low", 2: "Medium", 3: "High" }[entry.priority];
  const doneWhen = (note.doneWhen ?? []).map((item) => `  - ${item}`).join("\n");
  const github = note.github || "issue TBD · branch TBD · PR TBD";
  return [
    "## Summary",
    note.summary,
    "",
    "## Context block — a fresh agent starts here",
    `- **Goal:** ${note.goal}`,
    `- **Why it matters:** ${note.whyItMatters}`,
    `- **Files to touch:** ${note.filesToTouch}`,
    `- **Read exactly this and nothing more:** ${note.readExactly}`,
    `- **Do NOT read:** ${note.doNotRead}`,
    `- **Constraints:** ${note.constraints}`,
    "- **Done when:**",
    doneWhen,
    `- **Priority: ${priorityName}** — ${note.priorityRationale}`,
    `- **Parent:** ${parentId === null ? "None" : `#${parentId}`} · **Children:** ${displayIds(childIds)} · **Blocked by:** ${displayIds(blockerIds)}`,
    `- **GitHub:** ${github}`,
    "",
    "## Detailed activity",
    note.detailedActivity || "",
    "",
    "## Handoff",
    note.handoff || "",
    "",
    markerFor(entry.key),
  ].join("\n");
}

function entriesForPhase(spec, phase) {
  if (phase === 2) return spec.filter((entry) => entry.level === "epic");
  if (phase === 3) return spec.filter((entry) => entry.level === "story");
  if (phase === 4) return spec.filter((entry) => entry.level === "subtask");
  return [];
}

function dependencyPairs(spec) {
  const byKey = new Map(spec.map((entry) => [entry.key, entry]));
  const pairs = [];
  for (const entry of spec) {
    for (const prerequisiteKey of entry.dependsOnKeys ?? []) {
      const prerequisite = byKey.get(prerequisiteKey);
      if (!prerequisite) {
        throw new Error(`${entry.key} depends on unknown spec key ${prerequisiteKey}.`);
      }
      const parentChild =
        entry.parentKey === prerequisiteKey || prerequisite.parentKey === entry.key;
      if (!parentChild) pairs.push({ entry, prerequisite });
    }
  }
  return pairs;
}

function resolveExisting(entry, markerIndex, checkpoint, apply, counters) {
  const checkpointId = checkpoint.keyToTaskId[entry.key];
  if (checkpointId !== undefined && checkpointId !== null) {
    counters.skipped += 1;
    console.log(`[skip] ${entry.key}: checkpoint id #${checkpointId}`);
    return checkpointId;
  }
  const foundId = markerIndex.get(entry.key) ?? null;
  if (foundId === null) return null;
  counters.resolvedByMarker += 1;
  console.log(`[marker] ${entry.key}: found existing task #${foundId}`);
  if (apply) {
    checkpoint.keyToTaskId[entry.key] = foundId;
    flushCheckpoint(checkpoint);
  }
  return foundId;
}

async function createOnce(entry, notes, parentId, client, token) {
  try {
    return await client.createTask(entry, notes, parentId);
  } catch (error) {
    throw new Error(
      `${entry.key} create was uncertain (${safeMessage(error, token)}). ` +
        "No retry was attempted; rerun so the full-goal marker scan can reconcile it.",
    );
  }
}

function dependencyTargetId(dependency) {
  return (
    dependency?.dependsOnTaskId ??
    dependency?.dependsOnId ??
    dependency?.dependencyTaskId ??
    dependency?.taskId ??
    dependency?.id ??
    null
  );
}

async function runTicketPhase(
  options,
  spec,
  checkpoint,
  client,
  token,
  markerIndex,
  doneStatusId,
) {
  const entries = entriesForPhase(spec, options.phase);
  const counters = { created: 0, resolvedByMarker: 0, skipped: 0 };
  const unresolved = new Set(entries.map((entry) => entry.key));
  const deferred = [];
  for (const entry of entries) {
    if (counters.created >= options.batchSize) break;
    const existingId = resolveExisting(
      entry,
      markerIndex,
      checkpoint,
      options.apply,
      counters,
    );
    if (existingId !== null) {
      unresolved.delete(entry.key);
      continue;
    }
    const parentId = relationId(checkpoint, entry.parentKey);
    if (entry.parentKey && parentId === null) {
      deferred.push(`${entry.key} (missing parent ${entry.parentKey})`);
      console.log(
        `[defer] ${entry.key}: parent ${entry.parentKey} is not resolved; no orphan created.`,
      );
      continue;
    }
    if (counters.created >= options.batchSize) continue;
    const notes = assembleNote(entry, spec, checkpoint);
    if (!options.apply) {
      console.log(`[dry-run] ${entry.key}: would create "${entry.title}".`);
      counters.created += 1;
      continue;
    }
    const id = await createOnce(entry, notes, parentId, client, token);
    markerIndex.set(entry.key, id);
    checkpoint.keyToTaskId[entry.key] = id;
    if (entry.status === "Done") {
      const observed = await applyAndVerifyDone(
        entry,
        id,
        client,
        doneStatusId,
        checkpoint,
      );
      console.log(
        `[create] ${entry.key}: created as #${id}, complete=true verified; ` +
          `dateComplete=${JSON.stringify(observed.dateComplete)}; checkpoint flushed.`,
      );
    } else {
      flushCheckpoint(checkpoint);
      console.log(
        `[create] ${entry.key}: created/resolved as #${id}; checkpoint flushed.`,
      );
    }
    counters.created += 1;
    unresolved.delete(entry.key);
  }
  return { ...counters, remaining: unresolved.size, deferred };
}

async function runFixDone(
  options,
  spec,
  checkpoint,
  client,
  markerIndex,
  doneStatusId,
) {
  const entries = spec.filter((entry) => entry.status === "Done");
  const resolved = entries.map((entry) => ({
    entry,
    id: markerIndex.get(entry.key) ?? null,
  }));
  const missing = resolved.filter(({ id }) => id === null);
  if (missing.length > 0) {
    throw new Error(
      `--fix-done could not resolve marker(s): ${missing
        .map(({ entry }) => entry.key)
        .join(", ")}. No tasks were changed.`,
    );
  }

  const repairs = [];
  let skipped = 0;
  for (const { entry, id } of resolved) {
    const task = await client.getTask(id);
    const observed = observedDoneValues(task);
    if (Number(observed.statusId) !== doneStatusId) {
      throw new Error(
        `${entry.key} task #${id} is not in the Done column: ` +
          `observed complete=${JSON.stringify(observed.complete)}, ` +
          `statusId=${JSON.stringify(observed.statusId)}, ` +
          `dateComplete=${JSON.stringify(observed.dateComplete)}; ` +
          `expected statusId=${doneStatusId}. No complete flags were changed.`,
      );
    }
    if (observed.complete === true) {
      skipped += 1;
      if (options.apply) {
        console.log(`[skip] ${entry.key}: task #${id} is already complete=true.`);
      }
      continue;
    }
    if (observed.complete !== false) {
      throw new Error(
        `${entry.key} task #${id} has an unusable complete value: ` +
          `${JSON.stringify(observed.complete)}. No complete flags were changed.`,
      );
    }
    repairs.push({ entry, id });
  }

  if (!options.apply) {
    for (const { entry, id } of repairs) {
      console.log(
        `[dry-run] ${entry.key}: would set complete=true on task #${id}.`,
      );
    }
    return { changed: 0, wouldChange: repairs.length, skipped };
  }

  let changed = 0;
  for (const { entry, id } of repairs) {
    checkpoint.keyToTaskId[entry.key] = id;
    const observed = await applyAndVerifyDone(
      entry,
      id,
      client,
      doneStatusId,
      checkpoint,
    );
    changed += 1;
    console.log(
      `[repair] ${entry.key}: task #${id} complete=true verified; ` +
        `dateComplete=${JSON.stringify(observed.dateComplete)}; checkpoint flushed.`,
    );
  }
  return { changed, wouldChange: 0, skipped };
}

async function runDependencyPhase(
  options,
  spec,
  checkpoint,
  client,
  markerIndex,
) {
  const pairs = dependencyPairs(spec);
  const counters = { created: 0, resolvedByMarker: 0, skipped: 0 };
  let remaining = 0;
  const deferred = [];
  for (let index = 0; index < pairs.length; index += 1) {
    if (counters.created >= options.batchSize) {
      remaining += pairs.length - index;
      break;
    }
    const { entry, prerequisite } = pairs[index];
    const entryId = await resolveExisting(
      entry,
      markerIndex,
      checkpoint,
      options.apply,
      counters,
    );
    const prerequisiteId = await resolveExisting(
      prerequisite,
      markerIndex,
      checkpoint,
      options.apply,
      counters,
    );
    if (entryId === null || prerequisiteId === null) {
      remaining += 1;
      deferred.push(`${entry.key} blocked by ${prerequisite.key} (ticket unresolved)`);
      console.log(
        `[defer] ${entry.key} <- ${prerequisite.key}: both ticket ids are required.`,
      );
      continue;
    }
    const dependencies = await client.listDependencies(entryId);
    if (
      dependencies.some(
        (dependency) =>
          String(dependencyTargetId(dependency)) === String(prerequisiteId),
      )
    ) {
      counters.skipped += 1;
      console.log(
        `[skip] ${entry.key} <- ${prerequisite.key}: dependency already exists.`,
      );
      continue;
    }
    if (counters.created >= options.batchSize) {
      remaining += 1;
      continue;
    }
    if (!options.apply) {
      counters.created += 1;
      remaining += 1;
      console.log(
        `[dry-run] ${entry.key} <- ${prerequisite.key}: would add dependency.`,
      );
      continue;
    }
    await client.addDependency(entryId, prerequisiteId);
    counters.created += 1;
    console.log(`[dependency] ${entry.key} <- ${prerequisite.key}: added.`);
  }
  return { ...counters, remaining, deferred };
}

function runSelfTest(fixturePath) {
  let fixture;
  try {
    fixture = readJson(fixturePath, "self-test fixture");
  } catch (error) {
    console.error(`FAIL fixture: ${error.message}`);
    console.log("SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }
  const tasks = Array.isArray(fixture.tasks) ? fixture.tasks : [];
  const expected =
    fixture.expect && typeof fixture.expect === "object" ? fixture.expect : {};
  const mustNotMatch = Array.isArray(fixture.mustNotMatch)
    ? fixture.mustNotMatch
    : [];
  let index;
  try {
    index = buildMarkerIndex(tasks);
  } catch (error) {
    console.error(`FAIL index: ${error.message}`);
    console.log("SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }

  let passed = 0;
  let total = 0;
  for (const [key, expectedId] of Object.entries(expected)) {
    total += 1;
    const actualId = index.get(key) ?? null;
    if (actualId === expectedId) {
      passed += 1;
      console.log(`PASS expect ${key}: #${actualId}`);
    } else {
      console.log(`FAIL expect ${key}: expected #${expectedId}, got ${actualId === null ? "null" : `#${actualId}`}`);
    }
  }
  for (const key of mustNotMatch) {
    total += 1;
    const actualId = index.get(key) ?? null;
    if (actualId === null) {
      passed += 1;
      console.log(`PASS mustNotMatch ${key}: null`);
    } else {
      console.log(`FAIL mustNotMatch ${key}: expected null, got #${actualId}`);
    }
  }
  const success = passed === total;
  console.log(
    `SELF-TEST ${success ? "PASS" : "FAIL"}: ${passed}/${total} assertions passed.`,
  );
  if (!success) process.exitCode = 1;
}

async function runSelfTestTree(fixturePath) {
  let fixture;
  try {
    fixture = readJson(fixturePath, "tree self-test fixture");
  } catch (error) {
    console.error(`FAIL fixture: ${error.message}`);
    console.log("TREE SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }

  const topLevel = Array.isArray(fixture.topLevel) ? fixture.topLevel : [];
  const tasks =
    fixture.tasks && typeof fixture.tasks === "object" ? fixture.tasks : {};
  const expected =
    fixture.expect && typeof fixture.expect === "object" ? fixture.expect : {};
  const mustNotMatch = Array.isArray(fixture.mustNotMatch)
    ? fixture.mustNotMatch
    : [];
  let checkpointReads = 0;
  const checkpoint = {
    keyToTaskId: new Proxy(
      {},
      {
        get() {
          checkpointReads += 1;
          return null;
        },
      },
    ),
  };
  const client = {
    async listTasks({ page, pageSize, sortBy, showCompleted }) {
      if (
        pageSize !== PAGE_SIZE ||
        sortBy !== "priority" ||
        typeof showCompleted !== "boolean"
      ) {
        throw new Error(
          "Tree self-test observed listTasks without pageSize=30, priority, and an explicit completion slice.",
        );
      }
      const slice = topLevel.filter(
        (task) => taskComplete(task) === showCompleted,
      );
      return slice.slice(page * pageSize, (page + 1) * pageSize);
    },
    async getTask(id) {
      const task = tasks[String(id)];
      if (!task) throw new Error(`Tree fixture has no getTask payload for #${id}.`);
      return task;
    },
  };

  let index;
  try {
    index = await buildMarkerIndexDeep(client);
  } catch (error) {
    console.error(`FAIL index: ${error.message}`);
    console.log("TREE SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }

  let passed = 0;
  let total = 0;
  for (const [key, expectedId] of Object.entries(expected)) {
    total += 1;
    const actualId = index.get(key) ?? null;
    if (actualId === expectedId) {
      passed += 1;
      console.log(`PASS expect ${key}: #${actualId}`);
    } else {
      console.log(
        `FAIL expect ${key}: expected #${expectedId}, got ${actualId === null ? "null" : `#${actualId}`}`,
      );
    }
  }
  for (const key of mustNotMatch) {
    total += 1;
    const actualId = index.get(key) ?? null;
    if (actualId === null) {
      passed += 1;
      console.log(`PASS mustNotMatch ${key}: null`);
    } else {
      console.log(`FAIL mustNotMatch ${key}: expected null, got #${actualId}`);
    }
  }

  total += 1;
  void checkpoint;
  if (checkpointReads === 0) {
    passed += 1;
    console.log("PASS checkpoint keyToTaskId: not consulted");
  } else {
    console.log(
      `FAIL checkpoint keyToTaskId: consulted ${checkpointReads} time(s)`,
    );
  }

  const success = passed === total;
  console.log(
    `TREE SELF-TEST ${success ? "PASS" : "FAIL"}: ${passed}/${total} assertions passed.`,
  );
  if (!success) process.exitCode = 1;
}

async function runSelfTestRoster(fixturePath) {
  let fixture;
  try {
    fixture = readJson(fixturePath, "roster self-test fixture");
  } catch (error) {
    console.error(`FAIL fixture: ${error.message}`);
    console.log("ROSTER SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }

  const byCompleted = fixture.topLevelByCompleted;
  const incompleteTopLevel = Array.isArray(byCompleted?.false)
    ? byCompleted.false
    : [];
  const completeTopLevel = Array.isArray(byCompleted?.true)
    ? byCompleted.true
    : [];
  const tasks =
    fixture.tasks && typeof fixture.tasks === "object" ? fixture.tasks : {};
  const expected =
    fixture.expect && typeof fixture.expect === "object" ? fixture.expect : {};
  const mustNotMatch = Array.isArray(fixture.mustNotMatch)
    ? fixture.mustNotMatch
    : [];

  let checkpointReads = 0;
  const checkpoint = {
    keyToTaskId: new Proxy(
      {},
      {
        get() {
          checkpointReads += 1;
          return null;
        },
      },
    ),
  };
  const client = {
    async listTasks({ page, pageSize, sortBy, showCompleted }) {
      if (
        pageSize !== PAGE_SIZE ||
        sortBy !== "priority" ||
        typeof showCompleted !== "boolean"
      ) {
        throw new Error(
          "Roster self-test observed listTasks without pageSize=30, priority, and an explicit completion slice.",
        );
      }
      if (page !== 0) return [];
      return showCompleted ? completeTopLevel : incompleteTopLevel;
    },
    async getTask(id) {
      const task = tasks[String(id)];
      if (!task) throw new Error(`Roster fixture has no getTask payload for #${id}.`);
      return task;
    },
  };

  let index;
  let roster;
  try {
    index = await buildMarkerIndexDeep(client, {
      onRoster(discovered) {
        roster = discovered;
      },
    });
  } catch (error) {
    console.error(`FAIL index: ${error.message}`);
    console.log("ROSTER SELF-TEST FAIL: 0/0 assertions passed.");
    process.exitCode = 1;
    return;
  }

  let passed = 0;
  let total = 0;
  const assert = (label, condition, detail) => {
    total += 1;
    if (condition) {
      passed += 1;
      console.log(`PASS ${label}: ${detail}`);
    } else {
      console.log(`FAIL ${label}: ${detail}`);
    }
  };

  assert(
    "incomplete pass count",
    roster?.incompleteCount === incompleteTopLevel.length,
    `${roster?.incompleteCount ?? "missing"} (expected ${incompleteTopLevel.length})`,
  );
  assert(
    "complete pass count",
    roster?.completeCount === completeTopLevel.length,
    `${roster?.completeCount ?? "missing"} (expected ${completeTopLevel.length})`,
  );
  const expectedUnionCount = new Set(
    [...incompleteTopLevel, ...completeTopLevel].map((task) => Number(taskId(task))),
  ).size;
  assert(
    "unioned top-level count",
    roster?.unionCount === expectedUnionCount,
    `${roster?.unionCount ?? "missing"} (expected ${expectedUnionCount})`,
  );
  assert(
    "union exceeds each exclusive pass",
    roster.unionCount > roster.incompleteCount &&
      roster.unionCount > roster.completeCount,
    `${roster.unionCount} > ${roster.incompleteCount} and ${roster.completeCount}`,
  );

  let completeTopLevelMarkers;
  try {
    completeTopLevelMarkers = buildMarkerIndex(completeTopLevel);
  } catch (error) {
    completeTopLevelMarkers = new Map();
    console.log(`FAIL complete top-level marker setup: ${error.message}`);
  }
  const firstCompleteMarker = completeTopLevelMarkers.entries().next().value ?? null;
  const completeTopLevelKey = firstCompleteMarker?.[0] ?? null;
  const completeTopLevelId = firstCompleteMarker?.[1] ?? null;
  assert(
    "complete top-level task indexed by key",
    completeTopLevelKey !== null &&
      index.get(completeTopLevelKey) === completeTopLevelId,
    completeTopLevelKey === null
      ? "fixture supplied no complete top-level marker"
      : `${completeTopLevelKey} -> #${index.get(completeTopLevelKey) ?? "null"}`,
  );

  const completeChildren = completeTopLevel.flatMap((topLevelTask) => {
    const fullTask = tasks[String(taskId(topLevelTask))];
    return Array.isArray(fullTask?.subtasks) ? fullTask.subtasks : [];
  });
  let completeChildMarkers;
  try {
    completeChildMarkers = buildMarkerIndex(completeChildren);
  } catch (error) {
    completeChildMarkers = new Map();
    console.log(`FAIL complete child marker setup: ${error.message}`);
  }
  const completeChildrenIndexed = [...completeChildMarkers].every(
    ([key, id]) => index.get(key) === id,
  );
  assert(
    "children of complete top-level tasks indexed",
    completeChildren.length === 18 &&
      completeChildMarkers.size === 18 &&
      completeChildrenIndexed,
    `${completeChildMarkers.size}/${completeChildren.length} indexed (expected 18/18)`,
  );

  for (const [key, expectedId] of Object.entries(expected)) {
    const actualId = index.get(key) ?? null;
    assert(
      `expect ${key}`,
      actualId === expectedId,
      `expected #${expectedId}, got ${actualId === null ? "null" : `#${actualId}`}`,
    );
  }
  for (const key of mustNotMatch) {
    const actualId = index.get(key) ?? null;
    assert(
      `mustNotMatch ${key}`,
      actualId === null,
      `expected null, got ${actualId === null ? "null" : `#${actualId}`}`,
    );
  }

  void checkpoint;
  assert(
    "checkpoint keyToTaskId not consulted",
    checkpointReads === 0,
    checkpointReads === 0 ? "0 reads" : `${checkpointReads} read(s)`,
  );

  let spec;
  try {
    spec = readJson(SPEC_PATH, "board spec");
  } catch (error) {
    spec = null;
    console.log(`FAIL simulated resume setup: ${error.message}`);
  }
  const wouldCreate = Array.isArray(spec)
    ? spec.reduce(
        (count, entry) => count + (index.get(entry?.key) === undefined ? 1 : 0),
        0,
      )
    : null;
  assert(
    "simulated resume creates exactly zero tasks",
    wouldCreate === 0,
    wouldCreate === null ? "board spec unavailable" : `would create ${wouldCreate}`,
  );

  const success = passed === total;
  console.log(
    `ROSTER SELF-TEST ${success ? "PASS" : "FAIL"}: ${passed}/${total} assertions passed.`,
  );
  if (!success) process.exitCode = 1;
}

function printSummary(options, goalId, summary) {
  console.log("\nSummary");
  console.log(`  created: ${summary.created}`);
  console.log(`  resolved-by-marker: ${summary.resolvedByMarker}`);
  console.log(`  skipped: ${summary.skipped}`);
  console.log(`  remaining: ${summary.remaining}`);
  if (summary.deferred.length > 0) {
    console.log("  deferred:");
    for (const item of summary.deferred) console.log(`    - ${item}`);
  }
  const mode = options.apply ? "--apply" : "--dry-run";
  console.log(
    `Resume: node scripts/taskview-sync-board.mjs --phase=${options.phase} ${mode} --batch-size=${options.batchSize} --goal=${goalId}`,
  );
}

function printFixDoneSummary(options, goalId, summary) {
  console.log("\nDone repair summary");
  console.log(`  changed: ${summary.changed}`);
  console.log(`  would-change: ${summary.wouldChange}`);
  console.log(`  already-complete: ${summary.skipped}`);
  const mode = options.apply ? "--apply" : "--dry-run";
  console.log(
    `Resume: node scripts/taskview-sync-board.mjs --fix-done ${mode} --goal=${goalId}`,
  );
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error(usage());
    process.exitCode = 2;
    return;
  }
  if (options.help) {
    console.log(usage());
    return;
  }
  if (options.selfTest !== null) {
    runSelfTest(options.selfTest);
    return;
  }
  if (options.selfTestTree !== null) {
    await runSelfTestTree(options.selfTestTree);
    return;
  }
  if (options.selfTestRoster !== null) {
    await runSelfTestRoster(options.selfTestRoster);
    return;
  }
  const token = process.env.TASKVIEW_TOKEN;
  if (!token || token.trim() === "") {
    console.error(
      "TASKVIEW_TOKEN is required. Set it in the environment and run the command again.",
    );
    process.exitCode = 1;
    return;
  }
  try {
    const policy = readJson(POLICY_PATH, "policy");
    const spec = readJson(SPEC_PATH, "board spec");
    const checkpoint = readJson(CHECKPOINT_PATH, "board checkpoint");
    const goalId =
      options.goal ?? positiveInteger(policy.project_id, "policy project_id");
    if (!Array.isArray(spec)) throw new Error("Board spec must be a JSON array.");
    if (!checkpoint.keyToTaskId || typeof checkpoint.keyToTaskId !== "object") {
      throw new Error("Checkpoint keyToTaskId must be an object.");
    }
    const apiUrl = process.env.TASKVIEW_API_URL || "http://localhost:1725";
    const client = new TaskViewClient(apiUrl, token, goalId);
    const markerIndex = await buildMarkerIndexDeep(client);
    const doneStatusId = doneStatusIdFromCheckpoint(checkpoint);
    if (options.fixDone) {
      console.log(
        `TaskView Done repair: goal ${goalId}, ${options.apply ? "APPLY" : "DRY RUN"}.`,
      );
      const summary = await runFixDone(
        options,
        spec,
        checkpoint,
        client,
        markerIndex,
        doneStatusId,
      );
      printFixDoneSummary(options, goalId, summary);
      return;
    }
    console.log(
      `TaskView board sync: phase ${options.phase}, goal ${goalId}, ${options.apply ? "APPLY" : "DRY RUN"}, batch size ${options.batchSize}.`,
    );
    const summary =
      options.phase === 5
        ? await runDependencyPhase(
            options,
            spec,
            checkpoint,
            client,
            markerIndex,
          )
        : await runTicketPhase(
            options,
            spec,
            checkpoint,
            client,
            token,
            markerIndex,
            doneStatusId,
          );
    printSummary(options, goalId, summary);
  } catch (error) {
    console.error(`TaskView sync failed: ${safeMessage(error, token)}`);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await main();
}
