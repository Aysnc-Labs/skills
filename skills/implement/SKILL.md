---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Before building, ask the user every open question the spec or tickets leave, one round, each with your recommended answer. Once they say go, the run is AFK: call the Skill tool with `aysnc-skills:afk` and hold to it.

Call the Skill tool with "tdd" where possible, at pre-agreed seams.

Call the Skill tool with `aysnc-skills:engineering` before you build, and prove your work its way.

Once done, call the Skill tool with "code-review" to review the work (`aysnc-skills:code-review` in Claude Code, whose built-in `code-review` shares the name).

Commit your work to the current branch.
