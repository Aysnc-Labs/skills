---
name: implement-tickets
description: "Implement a set of tickets that belong to no spec, AFK, on one integration branch and one draft PR."
disable-model-invocation: true
---

You have been provided a set of **loose tickets**: tickets that belong to no spec.

The goal is [implement-spec](../implement-spec/SKILL.md)'s: every ticket implemented on one integration branch, behind one draft PR. Read it first: its rules and steps all hold. The steps below give loose tickets what a spec run starts with, then hand over.

## Steps

1. **Gather.** A ticket stays in the run when it is `ready-for-agent` and no spec's sub-issue. Tell the user why each other ticket left.

   Done when every ticket is in the run or out with its reason.

2. **Notes.** Loose tickets skipped `to-tickets`, which writes the research implementers build from: an implementer that explores spends its context before its first edit. A ticket is **researched** when it holds every section of `to-tickets`' issue template, with paths that still exist. For each ticket that isn't, start a **notes subagent** in the background, briefed with the ticket and the run's other tickets. It reproduces a bug before describing it, then rewrites the ticket's description in the template's shape, stamping Implementation notes with `git rev-parse --short HEAD` and keeping the reporter's text verbatim under `## Original report`. What to build, Acceptance criteria and Verify are the user's to decide, so it marks each of those it writes **proposed**. It replies with each proposed section, each decision the code could not settle, and each ticket whose change must land before this one's.

   Done when every ticket is researched, and every gap left is a proposed section or an open decision.

3. **Graph.** Loose tickets arrive with no task graph. Set a native blocking edge wherever one ticket's change must land before another's. An edge means order: tickets that only share files stay parallel, because `implement-spec`'s brief names each frontier sibling editing the same files.

   Done when every edge a notes subagent reported is set, or rejected with its reason.

4. **Implement.** Run `implement-spec` from the top. There is no spec: wherever it names one, the tickets are the whole record. Four substitutions:

   - Its question round also asks every proposed section, every open decision, and the **lane cap**: the most lanes running at once (recommend 3).
   - Where it posts answers on the spec, write each into the description of the ticket it concerns, replacing the proposed section it settles until none is left, and put a run-wide answer in every brief.
   - Run at most the lane cap of lanes; when one frees, start the next frontier ticket. A spec's graph gates its frontier; loose tickets mostly sit on the frontier together, and each lane is a whole local stack.
   - The draft PR closes the tickets alone: its Closes section is the Tickets list, with no Spec line.

   Done when `implement-spec` ends.
