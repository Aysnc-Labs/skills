# Upstream

`skills/` started as a copy of [mattpocock/skills](https://github.com/mattpocock/skills) at `v1.3.2` (commit `d1478fcb140db0b93c0c8df17bcfd311844749d0`), MIT licensed ([LICENSE-mattpocock](LICENSE-mattpocock)). The first commit in this repository is that copy, verbatim, so `git diff <first commit> -- skills/` shows every change since.

## Taken

From `engineering/`: code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, implement-spec, improve-codebase-architecture, pr, prototype, research, retro, tdd, to-spec, to-tickets, triage, wayfinder, wizard. From `productivity/`: grilling, handoff, teach, wait-what, writing-for-agents. Flattened into `skills/<name>/`, without `agents/openai.yaml`.

Left out: `ask-matt` (Matt's own), `setup-matt-pocock-skills` (replaced by `setup`), `grill-me` (`grill-with-docs` is the one grill), and the `misc/`, `in-progress/` and `deprecated/` folders.

## Changed

| Skill | Change |
|---|---|
| all | `/setup-matt-pocock-skills` pointers name `/aysnc:setup`. Skills that call `code-review`, `retro` or `prove-it` name them `aysnc:…`, since Claude Code's built-in `code-review` shares the name. |
| `code-review` | A global ruleset in `rules/` beside the project's, its breaches hard findings. Long-standing docs name no specs or tickets. A check the change claims must be in the diff and fail without it. |
| `diagnosing-bugs` | Question the premise after two failed fixes that share an assumption. A data-shaped bug adds a seed case beside its regression test. |
| `domain-modeling` | A fourth ADR condition: only this project would decide it, since one skills change reaches every project. |
| `grill-with-docs` | Also follows `codebase-design`, gathers in the shape of `to-spec` and `to-tickets`, reads the glossary, ADRs and the verify skill's feature map, keeps a running record, and ends with one `researcher` per design area, so implementers build rather than explore. |
| `grilling` | `user-invocable: false`; a grill request points to `grill-with-docs`. |
| `implement` | Ask the open questions before building; AFK after the user's go, through `afk`. |
| `implement-spec` | AFK after one question round, through `afk`. Lanes (a worktree, test database and ports per ticket); risk-based testing, the full suite once at the end; the spec's named seams are pre-agreed for `tdd`; implementers keep the verify skill's feature map current; a Report per ticket with `scripts/metrics.ts` output; the draft PR body updated at every merge; a scoped re-review of the fix pass; then `retro`, and `prove-it` by the user in a fresh session. No exploration step, no merger. |
| `pr` | For Human first (Needs decision, Check by eye, Not verified, Decisions for review, Before testing), Accepted risks, a Tickets table, Verification steps for every Report's Untested item, and Closes. Empty optional sections are left out. |
| `retro` | Reads the run's Reports, PR reviews and Verdict; four more categories; evidence per candidate; one `Retro` PR comment, posted without asking in an AFK run; a lesson every project needs goes to the shared skills. |
| `tdd` | A seam the spec, ticket or `AGENTS.md` names is pre-agreed; in an AFK run the agent picks and records one. The hollow-test anti-pattern. |
| `to-spec` | A Research section. |
| `to-tickets` | Per-ticket Implementation notes (stamped with a commit), Test data and Verify sections. |
| `writing-for-agents` | **Intent**: write the outcome, the bar and why, and leave the method to the agent. |

## Ours

- `setup`: writes the docs the other skills read, a code map (`docs/code-map.md`, where each feature's code lives) guarded by `check-code-map`, runs `create-verification-skill`, guards its feature map with `check-feature-map`, moves `AGENTS.md` sections to their homes, and writes project Claude settings and the cloud scripts.
- `afk`: the stance for any run the user is away from: decide as staff engineer and product owner, keep the work moving, and record every call for review. `implement` and `implement-spec` call it.
- `prove-it`: a fresh `verifier` tests a PR on the local stack in a real browser and tries to break it; an implementer subagent fixes what it proves with a red test; one `Verdict` comment. Depth is set by risk-based testing and the PR's Merge Danger In a cloud session, fixes go on the session's branch with a PR into the PR branch.
- `implement-tickets`: runs `implement-spec` on `ready-for-agent` tickets that belong to no spec, after a notes subagent writes each unresearched ticket into the `to-tickets` shape.
- `gardening`: a manual sweep across runs: repeated lessons filed as `needs-triage` issues, health checks, queue tidying, one report issue.
- `agents/`: `verifier` (for `prove-it`) and `researcher` (for `grill-with-docs`), the two roles that need tool limits or a fixed findings shape. Implementers are general-purpose subagents.

From [junaidbhura/skills](https://github.com/junaidbhura/skills): `pocock-this` and `in-your-own-words`.

## pstack

`create-verification-skill` (with its `references/feature-map-example/`) and `maintain-verification-skill` are copied from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) at commit `2776ddd2355d6d6c8747d3964600f28daf62f049`, MIT licensed ([LICENSE-pstack](LICENSE-pstack)). The commit that added them is a verbatim copy.

| Skill | Change |
|---|---|
| both | `.cursor/skills/` reads `.claude/skills/`; `/create-verification-skill` and `/maintain-verification-skill` read `/aysnc:…`. |

## Taking an upstream release

Diff upstream between `d1478fc` and the new release, apply it to the skills listed under Taken, re-apply each row under Changed by hand, then update the commit above.
