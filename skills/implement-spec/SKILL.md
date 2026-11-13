---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/aysnc-skills:setup`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The run is **AFK** from the user's go to the end: call the Skill tool with `aysnc-skills:afk` and hold to it. Every agent you brief does the same.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed. The frontier moves on merges into the integration branch, not on the tracker: a blocker closes only at the end of the run.

Start every subagent with a fresh context window.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, Reports and previous commits. Don't duplicate information already available via pointers.

The domain knowledge lives in skills: code written without them looks right and drifts. Every agent, you included, loads the skills the project's `AGENTS.md` names for its work, and every skill a ticket's Skills to load lists. When in doubt, load it.

**Implementer subagents** should be run in the background where possible for maximum concurrency, each in its own **lane**: a worktree, branch, test database and ports of its own (the project's `AGENTS.md` says how to isolate each), so parallel tickets never share state.

Every agent picks what to test, and when, by **risk-based testing**. The full test suite runs once, in step 5.

## Steps

1. Read the spec and tickets, each body and every comment, and follow their links one hop, to understand the task graph and what has changed since the tickets were written, and load the union of the tickets' **Skills to load**. Read `docs/feature-map.md` for what each feature does for its users and where it starts, and the spec's testing decisions: the test kinds and seams it names are pre-agreed for `tdd`. Foresee the AFK run: ask the user, in one round with your recommended answers, everything only they can give. Post the answers on the spec, and wait for their go.

   Done when every answer is on the spec and the user has said go.

2. Create the integration branch in its own worktree: the main checkout is the user's, outside a cloud sandbox. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge, marked as closing the spec and tickets. Its body, not its comments, is where the AFK user catches up: record each `afk` call there the moment you make it.

3. Brief each implementer with pointers: the ticket, the spec, its lane, the Reports of its merged blockers, any frontier sibling editing the same files, and the skills, AFK and testing paragraphs above. It reads its ticket, the body and every comment, loads its Skills to load, builds the ticket with `tdd`, updates `docs/feature-map.md` when it adds, removes, renames or moves a feature or changes a feature's purpose or entry point, merges the integration branch tip into its own branch before reporting done, and ends on a Report: Built, Tests, Decisions, Untested, Struggles, Research gaps.

   Done when every frontier ticket has an implementer in its own lane.

4. Once an implementer completes, merge its branch into the integration branch; a conflict goes back to that implementer. Kick off the tickets it unblocks, post its Report on its ticket with the output of [scripts/metrics.ts](scripts/metrics.ts) appended, update the draft PR's body with the `pr` skill, and remove its lane.

   Done when the PR's Tickets table shows the merge, For Human holds the Report's Decisions, and Verification holds a step for every item in its Untested.

5. Once all tickets are complete, run the full test suite on the integration branch, and call the Skill tool with `aysnc-skills:code-review` on it. Fix every failure and finding in a single implementer subagent: the **fix pass**, briefed like any implementer, which loads the Skills to load of every ticket the findings touch. Review only the fix pass's commits again, and send what that finds back to it.

   Done when the full test suite is green and a review of the fix pass's latest commits finds nothing.

6. If a draft PR exists, finish its body with the `pr` skill and leave it a draft. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

7. Clean up every worktree, leaving the integration branch as a local branch and the main checkout as you found it.

   Done when `git worktree list` shows only the main checkout.

8. Call the Skill tool with `aysnc-skills:retro` on the PR, or on this run when there is none. Then tell the user the PR is ready for `/aysnc-skills:prove-it`, in a fresh session.
