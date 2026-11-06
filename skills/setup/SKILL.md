---
name: setup
description: "Set a repository up for the Aysnc skills: issue tracker and triage docs, a checked code map, a verification skill with a checked feature map, coding standards, project Claude settings, and the Claude Code cloud scripts. Idempotent: re-run to repair drift."
disable-model-invocation: true
---

Adopt an existing repository so the other skills work in it, on a laptop and in a Claude Code cloud session. Every file below is one the skills read; the skills never guess where things live.

Explore before writing: `git remote -v`, `AGENTS.md` and `CLAUDE.md`, `docs/agents/`, `docs/code-map.md`, `GLOSSARY.md`, `docs/adr/`, `.claude/`, `.gitignore`, the package manifest and its check command, the git hooks and the CI workflows. Update what exists in place and keep the project's own additions. Present your findings and a draft of each file, lead each choice with the recommended answer, and write only after the user agrees.

Every file this skill writes must be tracked: `git check-ignore -v <file>` prints nothing. A `.gitignore` that ignores everything and re-includes entries (`/*` then `!/<entry>`) silently drops a new root file or folder; add its `!` line.

## 1. Agent docs

| File | Template |
|---|---|
| `docs/agents/issue-tracker.md` | [GitHub](templates/agents/issue-tracker-github.md), [GitLab](templates/agents/issue-tracker-gitlab.md) or [local markdown](templates/agents/issue-tracker-local.md); recommend the host `git remote` points at |
| `docs/agents/triage-labels.md` | [triage-labels.md](templates/agents/triage-labels.md); create the labels the tracker lacks |
| `docs/agents/domain.md` | [domain.md](templates/agents/domain.md); single context unless the repo is several bounded contexts |

## 2. Verification skill

Read `../create-verification-skill/SKILL.md` and follow it. It writes `.claude/skills/verify-<app>/`: how to launch, check, drive and clean up the app, and its feature map. `prove-it`, its `verifier`, `grill-with-docs` and `implement-spec` read it, and every agent working in the repo can load it by its description.

Its Launch section also covers a Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`): what step 5's hook already started, where its log is, and what differs from a laptop. Mark what you could not run here as unverified, as that skill's step 4 says for a stand-in.

Then guard the feature map:

1. Copy [check-feature-map.ts](templates/scripts/check-feature-map.ts) and [its test](templates/scripts/check-feature-map.test.ts) into the project's scripts folder. They need Node 22.18 or later (type stripping); check the pinned version. The check holds every `verify-*` skill's map to the feature entry contract, and fails on a feature file that names a repo path: the map names what users touch, and an agent finds code by searching.
2. Wire both into the project's one check command, its pre-push hook and CI, the way its other guards are wired. Register the verify skill's helper scripts as entry points with the project's dead-code checker (knip and the like), or it reports them as unused.

Done when the generated skill was proven end to end as `create-verification-skill` requires, and the check prints its summary line and its test passes through the project's check command.

## 3. Code map

`docs/code-map.md` says where each feature's code lives; agents start every task there instead of searching. The verify skill's feature map says what users see; the code map says where to look.

A **feature** is something a user, developer or operator can name and ask to change, with its own place in the code. A smaller part is a keyword of its parent.

1. Pick the **coverage roots**: the folders whose every child must belong to a feature (packages, apps, source folders; `files` for a folder of scripts). Show them with the draft.
2. Fan out read-only explorers in parallel, one per coverage root plus one for infrastructure (CI, root config, scripts). Each lists every child of its roots and returns candidate features in the [template](templates/code-map.md)'s entry shape. Merge them into one entry per feature under `## ` areas, and draw who calls whom.
3. Confirm the feature list with the user: names, grouping, and anything merged, split or left as a keyword. Then write the map.
4. Copy [check-code-map.ts](templates/scripts/check-code-map.ts) and [its test](templates/scripts/check-code-map.test.ts) beside `check-feature-map`, set `COVERAGE_ROOTS`, and wire both in the same way. A failure names the map line or the uncovered module: fix the map, not the script.

Done when every coverage-root child is claimed by a feature and the check prints its summary line through the project's check command.

## 4. Coding standards

Write `CODING_STANDARDS.md` from [the template](templates/CODING_STANDARDS.md). Fill "Enforced by tools" from the lint, type and check configuration, and "Review rules" only with judgment calls the project already holds (in `AGENTS.md`, docs, or review history), each with its source.

## 5. Claude settings

Merge [claude-settings.json](templates/claude-settings.json) into `.claude/settings.json`: add missing keys and entries, never drop or reorder the project's. A `!` rule exempts paths only from the rules before it in the same file, so keep each after the rule it carves out.

- `autoMemoryEnabled: false`: what agents learn goes in the repository (`docs/agents/`, the verify skill, `CODING_STANDARDS.md`, issue bodies), where every agent and person can read it, not in one machine's memory folder.
- `enabledPlugins` and `extraKnownMarketplaces` name the plugin, but download nothing: each person runs `claude plugin install aysnc@aysnc --scope project` once, with git credentials that reach `Aysnc-Labs/skills`.
- The `Read` denies cover Claude's file tools, not `cat` in a shell. The push denies match a command as written, so `git -C . push` slips past them. They catch accidents; the default branch's protection on the forge is what stops a push. Offer to add a branch protection rule or ruleset requiring a PR.
- Adjust `main` in the push denies to the default branch.

## 6. Cloud

Copy [setup-script.sh](templates/cloud/setup-script.sh) and [session-start.sh](templates/cloud/session-start.sh) to `.sandbox/claude-cloud/`, and fill the placeholders from the verify skill's Launch commands: the toolchain in the setup script, the fresh-clone steps in the hook. The setup script installs tools only; anything that reads the clone goes in the hook.

The environment itself is the user's to create on claude.ai/code. Hand them: the setup script to paste, the extra network hosts the script names, and access to `Aysnc-Labs/skills` and this repository.

## 7. AGENTS.md

Write `AGENTS.md` from [the template](templates/AGENTS.md) (into `CLAUDE.md` when only that exists), keeping the project's lines that fit it. It loads on every turn, so it holds the gate, commands and conventions nothing enforces, and pointers.

Propose a home for every other line: a code map entry (where code lives), a comment or check message where the agent edits (a gotcha or procedure), a `GLOSSARY.md` term, an ADR, a `CODING_STANDARDS.md` rule, a check (a mechanical rule, after which the line goes), or deletion (it restates code, config or a skill). Show the table and move only what the user agrees.

Done when every line of the old file is in the new one or has its agreed home.

## 8. Report

The files written and changed, the code map's and the feature map's summary lines, how the verify skill was proven and what stays unverified, and the cloud steps left to the user.
