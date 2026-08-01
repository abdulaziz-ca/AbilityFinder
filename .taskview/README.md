# AbilityFinder TaskView configuration

`policy.json` contains nonsecret shared defaults for the **AbilityFinder** project in organization `org-fbbce12c`. The project ID is `2`, and the project board is `http://localhost:8888/org-fbbce12c/2/-1401`. The project currently has no TaskView task lists; `-1401` is the Kanban route segment, not a list ID.

TaskView API/MCP tokens are global user/client secrets, not project files. Store them only in the MCP client's secret configuration. Never put tokens in this directory, repository files, ticket notes, or command lines.

Copy `offline-log.template.md` to the ignored `.taskview/offline-log.md` only when TaskView is unavailable. Follow `../TASKVIEW-WORKFLOW.md` when reconciling it.
