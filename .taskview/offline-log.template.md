# TaskView offline journal

Copy this file to `.taskview/offline-log.md`. Do not record secrets or sensitive user data.

## Entry LOCAL-YYYYMMDD-HHMMSS-NNN

- Timestamp (UTC):
- Agent: `agent:claude` or `agent:codex`
- TaskView task ID:
- Operation type: claim | milestone | blocker | review | verification | completion
- Last known remote status/version:
- Desired status:
- Summary:
- Detailed activity/evidence:
- Dependency or human gate:
- Sync state: pending
- Remote update ID after sync:

Use a unique stable entry ID. During sync, compare current remote state, apply at most once, and mark the remote update ID. Do not blindly replay stale transitions.
