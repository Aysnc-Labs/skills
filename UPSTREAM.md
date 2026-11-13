# Upstream

Where each skill comes from: ours, Matt Pocock's, or elsewhere.

## Ours

- `engineering`: the principles for every engineering task (simple, ergonomic, learnings in the project, never the memory folder; every implementation skill requires it), and proves work with the cheapest means at hand: the narrowest check first, everything local, CI only for CI work, `sbx` for Linux on a Mac (through `docker-sandbox`), `agent-browser` as the agents' browser (Claude in Chrome only when the user must act). Owns risk-based testing; `implement`, `implement-spec`, `tdd`, `diagnosing-bugs`, `prove-it` and `verifier` require it.
- `docker-sandbox`: how to work with Docker Sandboxes (`sbx`): clone mode by default, naming, cleanup, and what `--help` leaves out. `engineering` points to it for Linux on a Mac.
- `look-online`: answers a question from the web in chat, each claim in a sources table marked reliable or **weak**. `research` is the background, file-writing version.
- `clean-up`: inventories everything a chat created (worktrees, branches, databases, sandboxes, processes), confirms, removes it and returns to the starting state.
- `setup`: writes the docs the other skills read, a feature map (`docs/feature-map.md`) guarded by `check-feature-map`, an `AGENTS.md` Commands section with each command proven once, moves `AGENTS.md` sections to their homes, writes `docs/agents/verification.md` with the project's Access (how agents log in with nobody there), and writes project Claude settings and the cloud scripts (mise and `agent-browser`).
- `afk`: the stance for any run the user is away from: decide as staff engineer and product owner, keep the work moving, and record every call for review. `implement` and `implement-spec` call it.
- `prove-it`: brings the local stack up through the `AGENTS.md` Commands; a fresh `verifier` tests a PR on it in a real browser and tries to break it; an implementer subagent fixes what it proves with a red test; one `Verdict` comment. Depth is set by risk-based testing and the PR's Merge Danger. Its checklist file opens with the project's Access. In a cloud session, fixes go on the session's branch with a PR into the PR branch.
- `gardening`: a manual sweep across runs: repeated lessons filed as `needs-triage` issues, health checks, queue tidying, one report issue. Homes: `docs/feature-map.md` for a navigation gap, an `AGENTS.md` Commands command for a gap in running the app. Health checks run the feature map check, hold each test to the lowest test kind, and keep the `AGENTS.md` Commands section.
- `agents/`: `verifier` (for `prove-it`, running the app through the `AGENTS.md` Commands and driving each feature from its feature-map Entry) and `researcher` (for `grill-with-docs`, starting from feature-map entries), the two roles that need tool limits or a fixed findings shape. Implementers are general-purpose subagents.

## Matt Pocock's

`skills/` started as a copy of [mattpocock/skills](https://github.com/mattpocock/skills) at `v1.3.2` (commit `d1478fcb140db0b93c0c8df17bcfd311844749d0`), MIT licensed ([LICENSE-mattpocock](LICENSE-mattpocock)). Diff that tag against `skills/` to see every change since; the Changed table below summarises them.

### Taken

From `engineering/`: code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, implement-spec, improve-codebase-architecture, pr, prototype, research, retro, tdd, to-spec, to-tickets, triage, wayfinder, wizard. From `productivity/`: grilling, handoff, teach, wait-what, writing-for-agents. Flattened into `skills/<name>/`, without `agents/openai.yaml`.

Left out: `ask-matt` (Matt's own), `setup-matt-pocock-skills` (replaced by `setup`), `grill-me` (`grill-with-docs` is the one grill), and the `misc/`, `in-progress/` and `deprecated/` folders.

### Changed

| Skill | Change |
|---|---|
| all | `/setup-matt-pocock-skills` pointers name `/aysnc-skills:setup`. Skills that call `code-review`, `retro` or `prove-it` name them `aysnc-skills:…`, since Claude Code's built-in `code-review` shares the name. |
| `code-review` | A global ruleset in `rules/` beside the project's, its breaches hard findings. Long-standing docs name no specs or tickets. A check the change claims must be in the diff and fail without it. Each test at the lowest test kind that proves it. |
| `diagnosing-bugs` | Requires `engineering`. The browser loop uses `agent-browser`. Question the premise after two failed fixes that share an assumption. The failing test is the lowest test kind that reproduces the bug at a correct seam. A data-shaped bug adds a case to the `seed` command's data beside its regression test. |
| `domain-modeling` | A fourth ADR condition: only this project would decide it, since one skills change reaches every project. |
| `grill-with-docs` | Also follows `codebase-design`, gathers in the shape of `to-spec` and `to-tickets`, reads the glossary, ADRs and `docs/feature-map.md`, keeps a running record, and ends with one `researcher` per design area, so implementers build rather than explore. |
| `grilling` | `user-invocable: false`; a grill request points to `grill-with-docs`. |
| `implement` | Ask the open questions before building; AFK after the user's go, through `afk`. Test cadence points to `engineering`. |
| `implement-spec` | Every agent loads `engineering` for risk-based testing. AFK after one question round, through `afk`. Lanes (a worktree, test database and ports per ticket); the integration branch in its own worktree; risk-based testing, the full suite once at the end; the spec's named test kinds and seams are pre-agreed for `tdd`; implementers keep `docs/feature-map.md` current; a Report per ticket with `scripts/metrics.ts` output; the draft PR body updated at every merge; a scoped re-review of the fix pass; then `retro`, and `prove-it` by the user in a fresh session. No exploration step, no merger. |
| `pr` | For Human first (Needs decision, Check by eye, Not verified, Decisions for review, Before testing), Accepted risks, a Tickets table, Verification steps for every Report's Untested item, and Closes. Empty optional sections are left out. |
| `retro` | Reads the run's Reports, PR reviews and Verdict; four more categories; evidence per candidate; one `Retro` PR comment, posted without asking in an AFK run; a lesson every project needs goes to the shared skills. Homes: the feature map for navigation, `AGENTS.md` Commands for running the app. |
| `tdd` | Requires `engineering`. A seam the spec or ticket names is pre-agreed; in an AFK run the agent picks and records one. Test kinds (`test`, `e2e`, `check`): the lowest kind, then the highest seam. The hollow-test anti-pattern. |
| `to-spec` | A Research section. Testing decisions pick a test kind, then a seam. |
| `to-tickets` | Per-ticket Implementation notes (stamped with a commit), Test data and Verify sections, each test named by its test kind and seam. |
| `triage` | Explores from the feature map; reproduces a bug through the `AGENTS.md` Commands. |
| `wayfinder` | A ticket's branches (research findings, prototypes) are named `wayfinder/<map#>/<ticket#>-<slug>`. |
| `writing-for-agents` | **Intent**: write the outcome, the bar and why, and leave the method to the agent. An `AGENTS.md` Commands section is no environment cache. |

### Taking an upstream release

Diff upstream between `d1478fc` and the new release, apply it to the skills listed under Taken, re-apply each row under Changed by hand, then update the commit above.

## Elsewhere

- `pocock-this`: from [junaidbhura/skills](https://github.com/junaidbhura/skills).
- `in-your-own-words`: from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) at commit `2776ddd2355d6d6c8747d3964600f28daf62f049`, MIT licensed ([LICENSE-pstack](LICENSE-pstack)). Diff that commit against it to see every change.
