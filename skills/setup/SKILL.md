---
name: setup
description: "Set a repository up for the Aysnc skills: tracker and triage docs, a checked code map, a verification skill with a checked feature map, coding standards, Claude settings and the cloud scripts. Re-run to repair drift."
disable-model-invocation: true
---

Adopt an existing repository so the other skills work in it, on a laptop and in a Claude Code cloud session. Every file below is one the skills read: none of them guesses where things live.

Explore first: `git remote -v`, `AGENTS.md` and `CLAUDE.md`, `docs/agents/`, `docs/code-map.md`, `GLOSSARY.md`, `docs/adr/`, `.claude/`, `.gitignore`, the package manifest and its check command, the git hooks and the CI workflows. Update what exists in place and keep the project's own additions. Show your findings and a draft of each file, lead each choice with your recommendation, and write only after the user agrees.

Every file you write must be tracked: `git check-ignore -v <file>` prints nothing. A **whitelist** `.gitignore` (`/*`, then `!/<entry>`) silently drops a new root file or folder: add its `!` line.

## 1. Agent docs

| File | Template |
|---|---|
| `docs/agents/issue-tracker.md` | [GitHub](templates/agents/issue-tracker-github.md), [GitLab](templates/agents/issue-tracker-gitlab.md) or [local markdown](templates/agents/issue-tracker-local.md); recommend the host `git remote` points at |
| `docs/agents/triage-labels.md` | [triage-labels.md](templates/agents/triage-labels.md); create the labels the tracker lacks |
| `docs/agents/domain.md` | [domain.md](templates/agents/domain.md); single context unless the repo is several bounded contexts |

Done when all three files are written and the tracker holds every label `triage-labels.md` names.

## 2. Verification skill

Read `../create-verification-skill/SKILL.md` and follow it. It writes `.claude/skills/verify-<app>/`: how to launch, check, drive and clean up the app, plus its feature map. `prove-it`, `grill-with-docs`, `implement-spec` and any agent in the repo lean on it.

Its Launch section also covers a Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`): what step 5's hook already started, where its log is, and what differs from a laptop. Mark what you could not run here as unverified, as that skill's step 4 says for a stand-in.

Then guard the feature map:

1. Copy [check-feature-map.ts](templates/scripts/check-feature-map.ts) and [its test](templates/scripts/check-feature-map.test.ts) into the project's scripts folder. They need Node 22.18 or later (type stripping): check the pinned version. The check holds every `verify-*` map to the feature entry contract and fails on a feature file that names a repo path: the map names what users touch, and an agent finds code by searching.
2. Wire both into the project's one check command, its pre-push hook and CI, the way its other guards are wired. Register the verify skill's helper scripts as entry points with the project's dead-code checker (knip and the like), or it reports them as unused.

Done when the generated skill is proven end to end as `create-verification-skill` requires, and the check prints its summary line and its test passes through the project's check command.

## 3. Code map

`docs/code-map.md` says where each feature's code lives: agents start every task there instead of searching. The feature map says what users see; the code map says where to look.

A **feature** is something a user, developer or operator can name and ask to change, with its own place in the code. A smaller part is a keyword of its parent.

1. Pick the **coverage roots**: the folders whose every child must belong to a feature (packages, apps, source folders; `files` for a folder of scripts). Show them with the draft.
2. Fan out read-only explorers in parallel, one per coverage root plus one for infrastructure (CI, root config, scripts). Each lists every child of its roots and returns candidate features in the [template](templates/code-map.md)'s entry shape. Merge them into one entry per feature under `## ` areas, and draw who calls whom.
3. Confirm the feature list with the user: names, grouping, and anything merged, split or left as a keyword. Then write the map.
4. Copy [check-code-map.ts](templates/scripts/check-code-map.ts) and [its test](templates/scripts/check-code-map.test.ts) beside `check-feature-map`, set `COVERAGE_ROOTS`, and wire both the same way. A failure names the map line or the uncovered module: fix the map, never the script.

Done when every coverage-root child is claimed by a feature and the check prints its summary line through the project's check command.

## 4. Coding standards

Write `CODING_STANDARDS.md` from [the template](templates/CODING_STANDARDS.md). Fill "Enforced by tools" from the lint, type and check configuration, and "Review rules" only with judgement calls the project already holds (in `AGENTS.md`, docs or review history).

Done when every review rule cites its source and every enforced row names its enforcer's file.

## 5. Claude settings

Merge [claude-settings.json](templates/claude-settings.json) into `.claude/settings.json`: add missing keys and entries, keep every project key in its order. A `!` rule exempts paths only from the rules before it in the same file: keep each after the rule it carves out.

- `autoMemoryEnabled: false`: what agents learn goes in the repository (`docs/agents/`, the verify skill, `CODING_STANDARDS.md`, issue bodies), where every agent and person reads it, not in one machine's memory folder.
- `enabledPlugins` and `extraKnownMarketplaces` name the plugin but download nothing: each person runs `claude plugin install aysnc-skills@aysnc --scope project` once.
- The `Read` denies cover Claude's file tools, not `cat` in a shell. The push denies match a command as written, so `git -C . push` slips past: they catch accidents. Branch protection on the forge is what stops a push: offer a rule or ruleset requiring a PR.
- Set `main` in the push denies to the default branch.

Done when `.claude/settings.json` holds every template key and entry and every project entry it held before.

## 6. Cloud

Copy [setup-script.sh](templates/cloud/setup-script.sh) and [session-start.sh](templates/cloud/session-start.sh) to `.sandbox/claude-cloud/`, and fill the placeholders from the verify skill's Launch commands: the toolchain in the setup script, the fresh-clone steps in the hook. The setup script installs tools only; anything that reads the clone goes in the hook.

The environment is the user's to create on claude.ai/code. Hand them the setup script to paste, the extra network hosts it names, and the two repositories to add: this one and `Aysnc-Labs/skills`.

Done when neither script has a `{{` placeholder left.

## 7. AGENTS.md

Write `AGENTS.md` from [the template](templates/AGENTS.md) (into `CLAUDE.md` when only that exists), keeping the project's lines that fit it. It loads on every turn, so it holds only the gate, commands and conventions nothing enforces, and pointers.

Propose a home for every other line: a code map entry (where code lives), a comment or check message where the agent edits (a gotcha or procedure), a `GLOSSARY.md` term, an ADR, a `CODING_STANDARDS.md` rule, a check (a mechanical rule; the line then goes), or deletion (it restates code, config or a skill). Show the table and move only what the user agrees.

Done when every line of the old file is in the new one or has its agreed home.

## 8. Report

```markdown
- Written: <files>
- Changed: <files>
- Code map: <check summary line>
- Feature map: <check summary line>
- Verify skill: proven by <how>; unverified: <what, or none>
- Left to you: <cloud steps>
```
