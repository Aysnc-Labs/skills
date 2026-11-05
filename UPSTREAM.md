# Upstream

`skills/` started as a copy of [mattpocock/skills](https://github.com/mattpocock/skills) at `v1.3.2` (commit `d1478fcb140db0b93c0c8df17bcfd311844749d0`), MIT licensed ([LICENSE-mattpocock](LICENSE-mattpocock)). The first commit in this repository is that copy, verbatim, so `git diff <first commit> -- skills/` shows every change since.

## Taken

From `engineering/`: code-review, codebase-design, diagnosing-bugs, domain-modeling, grill-with-docs, implement, implement-spec, improve-codebase-architecture, pr, prototype, research, tdd, to-spec, to-tickets, triage, wayfinder, wizard. From `productivity/`: grilling, handoff, teach, wait-what, writing-for-agents. Flattened into `skills/<name>/`, without `agents/openai.yaml`.

Left out: `ask-matt` (Matt's own), `setup-matt-pocock-skills` (replaced by `setup`), `grill-me` (`grilling` and `grill-with-docs` cover it), `retro` (not yet), and the `misc/`, `in-progress/` and `deprecated/` folders.

## Changed

| Skill | Change |
|---|---|
| all | `/setup-matt-pocock-skills` pointers name `/aysnc:setup`. |
| `implement-spec` | AFK after one question round; the spec's named seams are pre-agreed for `tdd`; implementers keep `docs/feature-map.md` current; the PR's Try it comes from the tickets' Try it; a `walkthrough` runs once checks are green. The user merges. |
| `pr` | After Merge Danger: Try it (a Start line, then steps `prove-it` runs), Not tried (where a verifier looks first), Calls made for you, and a Closes line. |
| `tdd` | A seam the spec, ticket or `AGENTS.md` names is pre-agreed; in an AFK run the agent picks and records one. |
| `to-tickets` | A Try it section per ticket. |

## Ours

- `setup`: writes the docs the other skills read, the feature map and its check, project Claude settings, and the cloud scripts.
- `walkthrough`: runs `prove-it` on a PR in a fresh subagent, sends each FAIL to an implementer, and keeps one Walkthrough comment.

From [junaidbhura/skills](https://github.com/junaidbhura/skills): `prove-it`, `pocock-this` and `in-your-own-words`.

## Taking an upstream release

Diff upstream between `d1478fc` and the new release, apply it to the skills listed under Taken, re-apply each row under Changed by hand, then update the commit above.
