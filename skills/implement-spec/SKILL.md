---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/aysnc:setup`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

The run is **AFK** once the user says go: nobody answers questions. Agents make the calls the user would, and record each with its reason in the PR's Calls made for you. Only an irreversible action, a product choice between behaviours, or work outside the repository waits for the user: park it there and keep the rest of the frontier moving.

Start every subagent with a fresh context window.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets, bodies and comments, to understand the task graph. Read the feature map of the project's verify skill (`.claude/skills/verify-<app>/`) for what each feature does for its users, and the spec's testing decisions: the seams it names are pre-agreed for `tdd`. Then ask the user, in one round with your recommended answers, everything only they can give, post the answers on the spec, and wait for their go.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket, at the seams step 1 found;
   - updates the verify skill's feature file of every feature whose behaviour it adds or changes, and adds a file for a new one, with Driving steps it has seen pass;
   - merges the integration branch tip into its own branch before reporting done

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, call the Skill tool with `code-review` on the integration branch. Fix all issues raised by the code review in a single **implementer subagent**.

8. If a draft PR exists, write its body with the `pr` skill, its Try it built from the tickets' **Try it** steps and its Not tried from what each implementer reported it could not check, and mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

   With a PR, then run the `walkthrough` skill on it in a fresh subagent: an agent that wrote none of the code. Read `../walkthrough/SKILL.md` and brief it with the PR URL. Start it once the PR's checks are green; a red check goes to a fresh implementer subagent with the failing step's log. Done when the PR carries a `Walkthrough` comment. The user merges.

9. Clean up all **implementer subagent** worktrees.
