---
name: gardening
description: "Sweep the project's agent environment across runs: find lessons that repeat in Reports, retros and reviews, run the health checks, tidy the needs-triage queue, and file one gardening report."
disable-model-invocation: true
---

You are **gardening**: tending the environment agents work in, across every run since the last gardening, so it gets better instead of drifting. `retro` looks at one run while it is fresh; gardening looks across runs and at the system as a whole. You file and tidy issues, and move **global lessons** (ones every project needs) from project docs into the skills; you implement nothing else.

Call the Skill tool with `writing-for-agents` before writing any issue text.

## 1. Find the window

The last gardening report is the newest issue labelled `gardening` (`gh issue list --label gardening --state all --limit 1`). The window runs from its creation date to now; with no report yet, use the last 30 days.

Done when you have the window's start date.

## 2. Gather

Read, for the window, from GitHub so every developer's work counts:

- **Reports**: comments headed `Report` on tickets updated in the window. Collect each Report's Decisions, Untested behaviours, Struggles, Research gaps and metrics.
- **Verdicts**: the comment headed `Verdict` on PRs merged in the window. Collect each finding with its damage and status, each Suspicion, and each Struggle.
- **Retros**: comments headed `Retro` on PRs merged in the window.
- **Merged PRs**: every review comment and thread.
- **The queue**: open `needs-triage` issues.

Done when every Report-bearing ticket and merged PR in the window is read.

## 3. Find patterns across runs

Two filters decide what survives:

- **Evidence.** Every lesson cites its evidence with a link: a Report, a Verdict finding, a `Retro` comment, a review comment or a gate failure. A lesson without evidence is dropped.
- **Twice.** A lesson counts once it has **happened twice**: two Reports, two `Retro` comments, two PR reviews, or any two of these. Seen once, it waits for a later gardening.

Look for:

- the same Untested behaviour, Struggle or Research gap in two Reports, or the same Struggle in two Verdicts;
- the same damage in Verdict findings on two PRs: a class of defect the implementers keep shipping;
- the same candidate in two `Retro` comments;
- the same review finding on two PRs;
- metrics that keep getting worse: tool calls before the first edit, failed test runs, slow commands;
- skills that agents keep missing (`missingSkills` in the metrics).

Before proposing a lesson, search the tracker for it (`gh search issues --repo <repo> --include-prs "<phrase>"`): when an open issue already holds it, add the new evidence there rather than filing a second.

Route each surviving lesson to the strongest home it fits, in this order:

1. **Type**: make the wrong state unrepresentable.
2. **Lint rule or CI check** whose error message names the fix. A **mechanical** violation (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) always lands here or above: a custom rule in the repo's own linter, a pre-commit hook or a CI job, whichever its existing guardrail makes cheapest.
3. **Test** that pins the behaviour. Repeated Test data goes to a shared test fixture or helper.
4. **Judgement rule**, read at review: in `code-review`'s `rules/` for a global lesson, else in `CODING_STANDARDS.md`. Covers cross-file consistency, "matches the surrounding style", anything no check could ever substitute for.
5. **Skill prose**: for a global lesson, and for knowledge no project file can hold. Name the skill and its repository.

Lessons that are not mistakes have fixed homes: a navigation gap gets a `docs/feature-map.md` entry; a gap in running the app gets a fixed or new command in `AGENTS.md`'s Commands; a decision only this project would make gets an ADR in `docs/adr/` (a global one goes into the skills); a term gets an entry in `GLOSSARY.md`.

For a type, check or test, the acceptance criterion is "the new check fails on the real past mistake": name the commit, diff or PR it must fail on. When the check replaces a Review rule in `CODING_STANDARDS.md`, the acceptance criterion also moves that rule to its Enforced by tools table, naming the enforcer.

Done when every surviving lesson has its evidence links, its home and its acceptance criterion, or was added as evidence to the open issue that already holds it.

## 4. Run the health checks

Run each and record the real result:

1. The project's checks on the default branch: lint, typecheck, test suites, the feature map check, from `AGENTS.md` and `package.json`.
2. **Test suite**: the e2e test count and run time against the last gardening report. Propose deleting each test written above the lowest test kind that proves it, or that another test already covers.
3. `CODING_STANDARDS.md`: each Review rule that reviews flagged twice in the window is a candidate lint rule; each Enforced by tools row whose enforcer no longer exists is a finding.
4. `AGENTS.md`: lines that restate the environment, duplicate another doc, or no longer bear on the work. The Commands section, mapping roles to commands and naming where the app is served, stays.
5. **Project docs**: each ADR, `CODING_STANDARDS.md` rule, `AGENTS.md` line, runbook or other doc that holds a global lesson. Propose moving it into the skills (name the skill and section, or a `code-review` rule) and deleting it from the project. Also each runbook whose steps stay inside the repo: propose a command, a skill or the ticket, and its deletion.

A failing check is a finding with its output as evidence.

Done when all five checks have a recorded result.

## 5. Tidy the queue

For each open `needs-triage` issue: close it when a merged PR fixed it (cite the PR), merge duplicates into the oldest (link both), and flag any with no activity in 60 days for the user.

Done when every open `needs-triage` issue is marked keep, close, merge or flag.

## 6. Report

Show the user the candidates in order of severity (lesson, evidence, home, acceptance criterion), the health-check results, and the queue changes you propose. Ask which to accept.

On approval:

- file each accepted lesson as an issue per `docs/agents/issue-tracker.md` with the `needs-triage` label;
- apply the queue changes;
- apply each accepted project-doc move: the skills change on a branch in the skills repository, and the doc's deletion on a project branch, each with a draft PR;
- file one **gardening report** issue labelled `gardening`: the window, what was read, each check's result, and each issue filed, updated or closed, with links. Close the report once filed: it marks where the next gardening starts.

Done when every accepted change is filed or applied, and the closed gardening report links each one.
