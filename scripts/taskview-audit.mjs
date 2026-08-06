#!/usr/bin/env node
/**
 * TaskView board audit for the Ability Finder board (goalId 3).
 *
 * Read-only. Verifies the board against .taskview/board-spec.json and
 * .taskview/board-checkpoint.json, plus GitHub reciprocity via the gh CLI.
 *
 *   TASKVIEW_TOKEN=... node scripts/taskview-audit.mjs
 *
 * Exit 0 = PASS, 1 = FAIL, 2 = missing token.
 *
 * Notes are stored as TaskView-safe HTML (<p>/<strong>/<br>) for every level,
 * with a visible `spec-key: KEY` line and the hidden `<!-- spec-key: KEY -->`
 * marker last. The hidden marker does not survive an edit made in the TaskView
 * UI, which is exactly why the visible fallback exists — both are checked.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const BASE = process.env.TASKVIEW_API_URL || 'http://localhost:1725'
const GOAL_ID = Number(process.env.TASKVIEW_GOAL_ID || 3)
const REPO = process.env.GITHUB_REPO || 'abdulaziz-ca/AbilityFinder'
const TOKEN = process.env.TASKVIEW_TOKEN
if (!TOKEN) { console.error('TASKVIEW_TOKEN is required'); process.exit(2) }

/** Kanban columns for goal 3. No HTTP route exposes these; ids are stable. */
const COLUMNS = {
  18: 'Backlog', 21: 'Ready', 19: 'In Progress', 22: 'Blocked',
  23: 'Review', 24: 'Verification', 20: 'Done', 25: 'Cancelled',
}
const DONE_COLUMN = 20

const safe = (e) => `${e?.name ?? 'Error'}` // never echo headers/tokens

async function api(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
  }).catch((e) => { throw new Error(`request failed (${safe(e)})`) })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`)
  const body = await res.json()
  return body.response ?? body
}

const checks = []
const record = (name, pass, observed, expected, violations = []) =>
  checks.push({ name, pass, observed, expected, violations })

// ---------------------------------------------------------------- load
const spec = JSON.parse(readFileSync('.taskview/board-spec.json', 'utf8'))
const checkpoint = JSON.parse(readFileSync('.taskview/board-checkpoint.json', 'utf8'))
const specByKey = new Map(spec.map((e) => [e.key, e]))
const keyToTaskId = checkpoint.keyToTaskId

/** Roster is the union of both showCompleted passes — the flag is exclusive. */
async function roster() {
  const seen = new Map()
  for (const showCompleted of [0, 1]) {
    const qs = new URLSearchParams({
      goalId: String(GOAL_ID), componentId: '-1401', page: '0',
      showCompleted: String(showCompleted), firstNew: '0', sortBy: 'date',
      searchText: '', filters: '{}', unlimited: 'true', ignoreCompleted: 'true',
    })
    for (const t of await api(`/module/tasks?${qs}`)) if (!seen.has(t.id)) seen.set(t.id, t)
  }
  return [...seen.values()]
}

/** Full tree by recursive traversal; children arrive embedded one level at a time. */
async function loadAll() {
  const byId = new Map()
  const walk = async (id) => {
    if (byId.has(id)) return
    const t = await api(`/module/tasks/${id}`)
    byId.set(id, t)
    for (const c of t.subtasks ?? []) await walk(c.id)
  }
  for (const top of await roster()) await walk(top.id)
  return byId
}

const tasks = await loadAll()
const tagsById = new Map((await api('/module/tags?organizationId=1')).map((t) => [t.id, t.name]))
const edges = await api(`/module/graph/${GOAL_ID}`)

const keyOf = (note) => note?.match(/<!-- spec-key: (AF-[A-Za-z0-9]+) -->/)?.[1] ?? null
const live = [...tasks.values()].map((t) => ({ ...t, key: keyOf(t.note) }))
const liveByKey = new Map(live.filter((t) => t.key).map((t) => [t.key, t]))

// ------------------------------------------------------------- 1 mappings
{
  const keys = live.map((t) => t.key).filter(Boolean)
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i)
  const missing = [...specByKey.keys()].filter((k) => !liveByKey.has(k))
  const extra = keys.filter((k) => !specByKey.has(k))
  const wrongId = [...liveByKey].filter(([k, t]) => keyToTaskId[k] !== t.id).map(([k]) => k)
  record('MAPPINGS', dupes.length === 0 && !missing.length && !extra.length && !wrongId.length,
    `${new Set(keys).size} unique keys, ${live.length} tickets`,
    `${specByKey.size} / ${specByKey.size}`,
    [...dupes.map((k) => ({ key: k, issue: 'duplicate' })),
     ...missing.map((k) => ({ key: k, issue: 'missing on board' })),
     ...extra.map((k) => ({ key: k, issue: 'not in spec' })),
     ...wrongId.map((k) => ({ key: k, issue: 'checkpoint id mismatch' }))])
}

// ------------------------------------------------------------ 2 hierarchy
{
  const counts = { epic: 0, story: 0, subtask: 0 }
  const bad = []
  for (const [key, t] of liveByKey) {
    const e = specByKey.get(key)
    if (!e) continue
    counts[e.level] = (counts[e.level] ?? 0) + 1
    const wantParent = e.parentKey ? liveByKey.get(e.parentKey)?.id ?? null : null
    if ((t.parentId ?? null) !== wantParent)
      bad.push({ key, taskId: t.id, parentId: t.parentId ?? null, expected: wantParent })
  }
  record('HIERARCHY', counts.epic === 15 && counts.story === 79 && counts.subtask === 9 && !bad.length,
    `${counts.epic} epics, ${counts.story} stories, ${counts.subtask} subtasks`,
    '15, 79, 9 with matching parentage', bad)
}

// ------------------------------------------------------------ 3 integrity
{
  const ids = new Set(live.map((t) => t.id))
  const orphans = live.filter((t) => t.parentId != null && !ids.has(t.parentId))
  const dangling = edges.filter((e) => !ids.has(e.fromTaskId) || !ids.has(e.toTaskId))
  record('INTEGRITY', !orphans.length && !dangling.length,
    `${orphans.length} orphan parents, ${dangling.length} dangling edges`, '0, 0',
    [...orphans.map((t) => ({ taskId: t.id, issue: 'orphan parent' })),
     ...dangling.map((e) => ({ edgeId: e.id, issue: 'endpoint missing' }))])
}

// --------------------------------------------------------- 4 done semantics
{
  const bad = []
  let checked = 0
  for (const [key, t] of liveByKey) {
    if (specByKey.get(key)?.status !== 'Done') continue
    checked++
    if (!t.complete || t.statusId !== DONE_COLUMN || !t.dateComplete)
      bad.push({ key, complete: t.complete, statusId: t.statusId, dateComplete: t.dateComplete })
  }
  record('DONE SEMANTICS', !bad.length, `${checked} checked, ${bad.length} violations`,
    `${checked} checked, 0 violations`, bad)
}

// ----------------------------------------------------------------- 5 edges
{
  const byId = new Map(live.map((t) => [t.id, t]))
  const isHierarchy = (e) =>
    byId.get(e.toTaskId)?.parentId === e.fromTaskId || byId.get(e.fromTaskId)?.parentId === e.toTaskId
  const hierarchy = edges.filter(isHierarchy)
  const explicit = edges.filter((e) => !isHierarchy(e))
  const wantExplicit = new Set()
  for (const e of spec) for (const dep of e.dependsOnKeys ?? [])
    wantExplicit.add(`${keyToTaskId[dep]}->${keyToTaskId[e.key]}`)
  const gotExplicit = new Set(explicit.map((e) => `${e.fromTaskId}->${e.toTaskId}`))
  const missing = [...wantExplicit].filter((x) => !gotExplicit.has(x))
  const extra = [...gotExplicit].filter((x) => !wantExplicit.has(x))
  record('EDGES', edges.length === 104 && hierarchy.length === 88 && explicit.length === 16
    && !missing.length && !extra.length,
    `${edges.length} total, ${hierarchy.length} parent/child, ${explicit.length} explicit`,
    '104, 88, 16 matching spec',
    [...missing.map((x) => ({ edge: x, issue: 'missing' })),
     ...extra.map((x) => ({ edge: x, issue: 'unexpected' }))])
}

// ---------------------------------------------------------------- 6 github
{
  const raw = execFileSync('gh', ['issue', 'list', '--repo', REPO, '--state', 'all',
    '--limit', '300', '--json', 'number,body'], { encoding: 'utf8' })
  const marked = new Map()
  for (const i of JSON.parse(raw)) {
    const k = i.body?.match(/<!-- taskview-spec-key: (AF-[A-Za-z0-9]+) -->/)?.[1]
    if (k) marked.set(k, i.number)
  }
  const eligible = new Set([...specByKey.values()]
    .filter((e) => e.level !== 'epic' && e.status !== 'Done').map((e) => e.key))
  const bad = []
  for (const [key, num] of marked) {
    if (!eligible.has(key)) bad.push({ key, issue: 'issue on an epic or Done ticket' })
    const note = liveByKey.get(key)?.note ?? ''
    if (!note.includes(`/issues/${num}`)) bad.push({ key, issue: `note missing issue #${num}` })
  }
  for (const key of eligible) if (!marked.has(key)) bad.push({ key, issue: 'eligible ticket has no issue' })
  record('GITHUB', marked.size === 58 && !bad.length,
    `${marked.size} marked issues, ${eligible.size} eligible`, '58, 58 reciprocal', bad)
}

// ------------------------------------------------------- 7 field integrity
{
  const SECTIONS = ['<p><strong>SUMMARY</strong></p>', '<strong>GOAL</strong>',
    '<strong>CONSTRAINTS</strong>', '<strong>DONE WHEN</strong>', '<strong>PRIORITY</strong>',
    '<strong>DETAILED ACTIVITY</strong>', '<strong>HANDOFF</strong>']
  const bad = []
  for (const [key, t] of liveByKey) {
    const e = specByKey.get(key)
    if (!e) continue
    if (t.priorityId !== e.priority) bad.push({ key, field: 'priority', observed: t.priorityId, expected: e.priority })
    if (COLUMNS[t.statusId] !== e.status) bad.push({ key, field: 'status', observed: COLUMNS[t.statusId], expected: e.status })
    const names = (t.tags ?? []).map((id) => tagsById.get(id)).filter(Boolean).sort()
    const want = [...(e.tags ?? [])].sort()
    if (names.join(',') !== want.join(',')) bad.push({ key, field: 'tags', observed: names, expected: want })
    const missing = SECTIONS.filter((s) => !t.note.includes(s))
    if (missing.length) bad.push({ key, field: 'note-sections', missing })
    if (!t.note.includes(`<p>spec-key: ${key}</p>`)) bad.push({ key, field: 'visible-spec-key' })
    if (!t.note.trimEnd().endsWith(`<!-- spec-key: ${key} -->`)) bad.push({ key, field: 'trailing-marker' })
    if (/(^|>)##\s/.test(t.note)) bad.push({ key, field: 'markdown-heading-leftover' })
  }
  record('FIELD INTEGRITY', !bad.length, `${liveByKey.size} checked, ${bad.length} violations`,
    `${liveByKey.size} checked, 0 violations`, bad)
}

// --------------------------------------------------- 8 recorded corrections
{
  const bad = []
  const s1401 = specByKey.get('AF-S1401')?.note?.constraints ?? ''
  if (!s1401.includes('gh CLI 2.97.0 is installed')) bad.push({ id: 'P8-01', issue: 'spec missing corrected gh text' })
  if (/gh CLI is not installed/.test(s1401)) bad.push({ id: 'P8-01', issue: 'stale gh claim still present' })
  const s1403 = specByKey.get('AF-S1403')?.note?.doneWhen ?? []
  if (s1403.length !== 6) bad.push({ id: 'P8-02', issue: `doneWhen has ${s1403.length}, expected 6` })
  if (!s1403.some((d) => d.includes('PRODUCT-LIMIT-01'))) bad.push({ id: 'P8-02', issue: 'PRODUCT-LIMIT-01 missing' })
  if (!s1403.some((d) => d.includes('UNVERIFIED'))) bad.push({ id: 'P8-02', issue: 'UNVERIFIED criterion missing' })
  for (const [key, phrase] of [['AF-S1401', 'gh CLI 2.97.0 is installed'], ['AF-S1403', 'PRODUCT-LIMIT-01']])
    if (!liveByKey.get(key)?.note.includes(phrase)) bad.push({ id: key, issue: 'live note missing corrected text' })
  record('CORRECTIONS APPLIED', !bad.length, `${bad.length} violations`, '0 violations', bad)
}

// ---------------------------------------------------------------- report
let failed = 0
for (const c of checks) {
  if (!c.pass) failed++
  console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.name}: observed ${c.observed}; expected ${c.expected}`)
  if (!c.pass) for (const v of c.violations.slice(0, 10)) console.log(`      ${JSON.stringify(v)}`)
}
console.log('\nFINAL COUNTS')
console.log(`  tickets ${live.length} · edges ${edges.length} · spec ${spec.length}`)
console.log(`\nAUDIT RESULT: ${failed ? `FAIL (${failed} checks failed)` : 'PASS'}`)
process.exit(failed ? 1 : 0)
