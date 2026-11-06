---
name: retro
description: "Conduct a retrospective on a coding session, a spec run or a PR. Use when implement-spec finishes, or when the user asks for a retro."
---

The user, or `implement-spec` at the end of a run, has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs. A retro looks at this one run; `gardening` looks across runs.

Every candidate cites its **evidence**: a Report, a Verdict finding, a review comment, a transcript excerpt or a gate failure, with its link. A candidate without evidence is dropped.

## Steps

1. Read the primary sources for the session the user specifies. For an `implement-spec` run: the PR, its review comments and its `Verdict` comment, and the comments headed `Report` on its tickets, with their metrics. Open transcript excerpts only for the metrics outliers: most tool calls before the first edit, failed test runs, repeated or slow commands, skills missing. Otherwise this may mean searching through session logs on this machine. If the user doesn't specify a session, default to the current one.

2. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should the **reviewer agent** be given a new rule to enforce? Should an existing rule be removed or clarified? Classify the violation first: a **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check, full stop: a custom rule in the repo's own linter, a new pre-commit hook, or a new CI job, whichever the repo's language and existing guardrail make cheapest. Default to building the check over writing the rule. Reserve `CODING_STANDARDS.md` for genuine **judgement calls** (cross-file consistency, "matches the surrounding style," anything no guardrail could ever substitute for). _Use when_ the reviewer agent failed to catch a mistake.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ the AGENTS.md file is particularly large - in the repo OR the user's global scope.
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLI's, MCP's) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.
- **Test data**: data agents created for their tests. _Use when_ a shared fixture or helper could provide it.
- **E2E coverage**: behaviour no automated test covers. _Use when_ a Report lists an Untested behaviour, or review or a Verdict found a bug a test at the ticket's seam would have caught.
- **Research gaps**: Implementation notes that were stale or missing. _Use when_ a Report's Research gaps is not `none`.
- **Struggles**: what agents said took longest or was unclear. _Use when_ it matches a metrics outlier.

3. Order the candidates by severity, each with its evidence and proposed home. A **global lesson**, one every project needs, has its home in the shared skills, never a project doc. When a candidate's home is skill prose, call the Skill tool with `writing-for-agents` before drafting it.

4. Show them to the user and post the ones they accept; in an AFK run, post every one, since nothing here changes the code and `gardening` acts only on a lesson seen twice. Post them as the PR's single comment headed `Retro` (edit it when it exists), each with its evidence and proposed home. `gardening` reads these comments to find lessons that repeat across runs. File no issues and implement nothing.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent has the least context pressure - it receives a diff, so no exploration needed. It often does not need to write code or debug.

This means that the review agent should be responsible for imposing coding standards, not the implementation agent.

### Files

You have access to several files in the repo:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used incredibly sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md`: this file is read during review, not implementation. Add **navigation pointers** to docs folders if the standards file gets more than 1,000 lines long.
- `docs/code-map.md`: where each feature's code lives; the home for navigation lessons.
- The verify skill's feature map (`.claude/skills/verify-<app>/features/`): what each feature does for its users and how to drive it; the home for lessons about driving the app.
- `GLOSSARY.md` and `docs/adr/`: the domain terms and the decisions, kept by the `domain-modeling` skill.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Follow the advice in the `writing-for-agents` skill.
