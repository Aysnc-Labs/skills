---
name: setup
description: "Set a repository up for the Aysnc skills: tracker and triage docs, a checked feature map, the commands that run and check the app, coding standards, Claude settings and the cloud scripts. Re-run to repair drift."
disable-model-invocation: true
---

Adopt an existing repository so the other skills work in it, on a laptop and in a Claude Code cloud session. Every file below is one the skills read: none of them guesses where things live.

Explore first: `git remote -v`, `AGENTS.md` and `CLAUDE.md`, `docs/agents/`, `docs/feature-map.md` (or an old `docs/code-map.md`), `GLOSSARY.md`, `docs/adr/`, `.claude/`, `.gitignore`, the package manifest and its check command, the git hooks and the CI workflows. Update what exists in place and keep the project's own additions. Show your findings and a draft of each file, lead each choice with your recommendation, and write only after the user agrees.

Every file you write must be tracked: `git check-ignore -v <file>` prints nothing. A **whitelist** `.gitignore` (`/*`, then `!/<entry>`) silently drops a new root file or folder: add its `!` line.

## 1. Agent docs

| File | Template |
|---|---|
| `docs/agents/issue-tracker.md` | [GitHub](templates/agents/issue-tracker-github.md), [GitLab](templates/agents/issue-tracker-gitlab.md) or [local markdown](templates/agents/issue-tracker-local.md); recommend the host `git remote` points at |
| `docs/agents/triage-labels.md` | [triage-labels.md](templates/agents/triage-labels.md); create the labels the tracker lacks |
| `docs/agents/domain.md` | [domain.md](templates/agents/domain.md); single context unless the repo is several bounded contexts |

Done when all three files are written and the tracker holds every label `triage-labels.md` names.

## 2. Feature map

`docs/feature-map.md` says what each feature does, where a user enters it and where its code lives: agents start every task there instead of searching.

A **feature** is anything a user starts from: an import, a config key, a command or a URL. Code with no entry point of its own belongs to the feature it serves.

1. Pick the **coverage roots**: the folders whose every child must belong to a feature (packages, apps, source folders; `files` for a folder of scripts). Show them with the draft.
2. Fan out read-only explorers in parallel, one per coverage root plus one for infrastructure (CI, root config, scripts). Each lists every child of its roots and returns candidate features in the [template](templates/feature-map.md)'s entry shape. Merge them into one entry per feature under `## ` areas, and draw who calls whom.
3. Confirm the feature list with the user: names, grouping, and anything merged into the feature it serves or split. Then write the map (`git mv` an old `docs/code-map.md` to it first, so history follows).
4. Copy [check-feature-map.ts](templates/scripts/check-feature-map.ts) and [its test](templates/scripts/check-feature-map.test.ts) into the project's scripts folder and set `COVERAGE_ROOTS`. They need Node 22.18 or later (type stripping): check the pinned version. Wire both into the project's one check command, its pre-push hook and CI, the way its other guards are wired, and register them as entry points with the project's dead-code checker (knip and the like) so it counts them as used. A failure names the map line, the feature or the uncovered module: fix the map, and keep the script as shipped.

Done when every coverage-root child is claimed by a feature, every entry holds one Purpose, Entry and Paths line, and the check prints its summary line and its test passes through the project's check command.

## 3. Commands

Agents run, reset and check the app through commands, which step 7 lists in `AGENTS.md`'s Commands for every skill to read. Each role gets one:

| Role | Scope | Does |
|---|---|---|
| `dev` | each app | serves the app and prints where (URL, port or socket) |
| `status` | each app | says whether the app is up, ready to use, and served from this checkout |
| `db:reset` | each app | leaves its database empty and migrated |
| `seed` | each app | loads the data a person needs to use the app |
| `test` | repo | runs the `test` kind: in-process tests through a public interface |
| `e2e` | repo | runs the `e2e` kind |
| `check` | repo | the one gate: lint, types, `test`, the map check; pre-push and CI run it |

1. Find each role's command in the manifest (package scripts, Makefile, justfile). Where none fits, write one there; past one line, as a script in the project's scripts folder. Leave out a role the app has no use for (no database, no `db:reset`), and say why in the draft.
2. Make `status` tell this checkout's instance from another's: a second clone or worktree can serve the same app. Have it compare something only this checkout holds, such as the server process's working directory or a marker `dev` writes into the checkout. Ready means usable: a page renders or a query answers, beyond a port accepting connections.
3. Prove each command once from a fresh clone in a temporary folder, in the order a newcomer runs them: install, `db:reset`, `seed`, `dev`, `status`, `test`, `e2e`, `check`. The clone lacks your untracked files (`.env`, build output), which is the point: a command that needs one creates it or names it. Stop what you started. A command never run is a draft: fix it until it runs.
4. On a stand-in for the real target (a laptop standing in for a cloud session, a container without the real database), list what stays unverified.

Done when every role has a command that ran from a fresh clone, is left out with its reason, or is listed as unverified.

## 4. Coding standards

Write `CODING_STANDARDS.md` from [the template](templates/CODING_STANDARDS.md). Fill "Enforced by tools" from the lint, type and check configuration, and "Review rules" only with judgement calls the project already holds (in `AGENTS.md`, docs or review history).

Done when every review rule cites its source and every enforced row names its enforcer's file.

## 5. Claude settings

Merge [claude-settings.json](templates/claude-settings.json) into `.claude/settings.json`: add missing keys and entries, keep every project key in its order. A `!` rule exempts paths only from the rules before it in the same file: keep each after the rule it carves out.

- `autoMemoryEnabled: false`: what agents learn goes in the repository (`docs/agents/`, `docs/feature-map.md`, `CODING_STANDARDS.md`, issue bodies), where every agent and person reads it, not in one machine's memory folder.
- `enabledPlugins` and `extraKnownMarketplaces` name the plugin but download nothing: each person runs `claude plugin install aysnc-skills@aysnc --scope project` once.
- The `Read` denies cover Claude's file tools, not `cat` in a shell. The push denies match a command as written, so `git -C . push` slips past: they catch accidents. Branch protection on the forge is what stops a push: offer a rule or ruleset requiring a PR.
- Set `main` in the push denies to the default branch.

Done when `.claude/settings.json` holds every template key and entry and every project entry it held before.

## 6. Cloud

Copy [setup-script.sh](templates/cloud/setup-script.sh) and [session-start.sh](templates/cloud/session-start.sh) to `.sandbox/claude-cloud/`, and fill the placeholders from step 3's commands: the toolchain in the setup script, the fresh-clone steps and the services to restart in the hook. The setup script installs tools only; anything that reads the clone goes in the hook. Write what a cloud session does differently from a laptop in the hook's comments.

The environment is the user's to create on claude.ai/code. Hand them the setup script to paste and the extra network hosts it names.

Done when neither script has a `{{` placeholder left.

## 7. AGENTS.md

Write `AGENTS.md` from [the template](templates/AGENTS.md) (into `CLAUDE.md` when only that exists), keeping the project's lines that fit it. It loads on every turn, so it holds only the gate, commands and conventions nothing enforces, and pointers.

Propose a home for every other line: a feature map entry (where code lives), a command (a way to run, reset or check the app), a comment or check message where the agent edits (a gotcha or procedure), a `GLOSSARY.md` term, an ADR, a `CODING_STANDARDS.md` rule, a check (a mechanical rule; the line then goes), or deletion (it restates code, config or a skill). Show the table and move only what the user agrees.

Done when every line of the old file is in the new one or has its agreed home.

## 8. Report

```markdown
- Written: <files>
- Changed: <files>
- Feature map: <check summary line>
- Commands: proven by <how>; unverified: <what, or none>
- Left to you: <cloud steps>
```
