---
name: clean-up
description: Remove everything this chat created and restore the machine to how the chat found it.
disable-model-invocation: true
---

Erase this chat's **footprint**: everything it created or changed, in the main thread and every subagent. Leave the machine as the chat found it.

## 1. Inventory

Walk the whole conversation and list the footprint: worktrees, branches (local and remote), databases and seed data, containers, processes and ports, scratch files, installed packages, changed config. A created thing is removed; a changed thing is reverted to its original. Anything that predates the chat stays. Note the branch and working-tree state the chat started on.

Done when every item is listed, checked to still exist, with how to remove or revert it.

## 2. Confirm

Show the footprint, flagging what removal loses: unpushed commits, uncommitted changes, data with no other copy. Outward-facing items (a remote branch, a PR, an issue, a deployment) each get their own row.

```markdown
| Item | Created or changed by | Remove or revert with | Loses |
| ---- | --------------------- | --------------------- | ----- |
```

Done when the user has approved rows by name or all at once; each outward-facing row needs its own yes.

## 3. Remove

Remove the approved rows, tearing down through the project's `AGENTS.md` Commands where they exist. Then return to the starting branch and state.

Done when a fresh look confirms every approved row gone, and the report lists anything left with why.
