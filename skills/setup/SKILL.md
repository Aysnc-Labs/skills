---
name: setup
description: "Set a repository up for the Aysnc skills: issue tracker and triage docs, run-the-app doc, coding standards, a checked feature map, project Claude settings, and the Claude Code cloud scripts. Idempotent: re-run to repair drift."
disable-model-invocation: true
---

Adopt an existing repository so the other skills work in it, on a laptop and in a Claude Code cloud session. Every file below is one the skills read; the skills never guess where things live.

Explore before writing: `git remote -v`, `AGENTS.md` and `CLAUDE.md`, `docs/agents/`, `GLOSSARY.md`, `docs/adr/`, `.claude/`, `.gitignore`, the package manifest and its check command, the git hooks and the CI workflows. Update what exists in place and keep the project's own additions. Present your findings and a draft of each file, lead each choice with the recommended answer, and write only after the user agrees.

Every file this skill writes must be tracked: `git check-ignore -v <file>` prints nothing. A `.gitignore` that ignores everything and re-includes entries (`/*` then `!/<entry>`) silently drops a new root file or folder; add its `!` line.

## 1. Agent docs

| File | Template |
|---|---|
| `docs/agents/issue-tracker.md` | [GitHub](templates/agents/issue-tracker-github.md), [GitLab](templates/agents/issue-tracker-gitlab.md) or [local markdown](templates/agents/issue-tracker-local.md); recommend the host `git remote` points at |
| `docs/agents/triage-labels.md` | [triage-labels.md](templates/agents/triage-labels.md); create the labels the tracker lacks |
| `docs/agents/domain.md` | [domain.md](templates/agents/domain.md); single context unless the repo is several bounded contexts |
| `docs/agents/run-the-app.md` | [run-the-app.md](templates/agents/run-the-app.md) |

Write `run-the-app.md` by doing it: bring the app up from a clean clone with the commands you write down, prove it serves the branch, drive one page in a browser, and tear it down. Done when each section's commands ran as written and you say which ones you could not run here (the cloud section, on a laptop).

## 2. Coding standards

Write `CODING_STANDARDS.md` from [the template](templates/CODING_STANDARDS.md). Fill "Enforced by tools" from the lint, type and check configuration, and "Review rules" only with judgment calls the project already holds (in `AGENTS.md`, docs, or review history), each with its source.

## 3. Feature map

A **feature** is something a user, editor or developer can name and ask to change, with its own place in the code.

1. Explore the code by area, in parallel read-only subagents when it is large, and draft entries in [the template's](templates/feature-map.md) shape: What, Paths, Seams, Try it. Set the `Coverage:` line to the folders every one of which a feature must claim (each package, each app, each route group).
2. Confirm the feature list with the user: names, grouping, what was merged or split. Then write `docs/feature-map.md`.
3. Copy [check-feature-map.ts](templates/scripts/check-feature-map.ts) and [its test](templates/scripts/check-feature-map.test.ts) into the project's scripts folder. They need Node 22.18 or later (type stripping); check the pinned version.
4. Wire both into the project's one check command, its pre-push hook and CI, the way its other guards are wired.

Done when the check prints its summary line, and its test passes, through the project's check command.

## 4. Claude settings

Merge [claude-settings.json](templates/claude-settings.json) into `.claude/settings.json`: add missing keys and entries, never drop or reorder the project's. A `!` rule exempts paths only from the rules before it in the same file, so keep each after the rule it carves out.

- `autoMemoryEnabled: false`: what agents learn goes in the repository (`docs/agents/`, the feature map, `CODING_STANDARDS.md`, issue bodies), where every agent and person can read it, not in one machine's memory folder.
- `enabledPlugins` and `extraKnownMarketplaces` name the plugin, but download nothing: each person runs `claude plugin install aysnc@aysnc --scope project` once, with git credentials that reach `Aysnc-Labs/skills`.
- The `Read` denies cover Claude's file tools, not `cat` in a shell. The push denies match a command as written, so `git -C . push` slips past them. They catch accidents; the default branch's protection on the forge is what stops a push. Offer to add a branch protection rule or ruleset requiring a PR.
- Adjust `main` in the push denies to the default branch.

## 5. Cloud

Copy [setup-script.sh](templates/cloud/setup-script.sh) and [session-start.sh](templates/cloud/session-start.sh) to `.sandbox/claude-cloud/`, and fill the placeholders from step 1's commands: the toolchain in the setup script, the fresh-clone steps in the hook. The setup script installs tools only; anything that reads the clone goes in the hook.

The environment itself is the user's to create on claude.ai/code. Hand them: the setup script to paste, the extra network hosts the script names, and access to `Aysnc-Labs/skills` and this repository.

## 6. Pointers

Add or update one `## Agent skills` block in `AGENTS.md` (or `CLAUDE.md` when only that exists): one line per `docs/agents/` file, the feature map, and `CODING_STANDARDS.md`, each saying when to read it. `AGENTS.md` holds pointers and commands; a rule a tool enforces does not belong in it.

## 7. Report

The files written and changed, the feature count and the check's summary line, what you ran to prove `run-the-app.md` and what you could not, and the cloud steps left to the user.
