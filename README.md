# Aysnc Skills

Aysnc Labs' Claude Code workflow, built on [Matt Pocock's skills](https://github.com/mattpocock/skills).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](https://docs.claude.com/en/docs/claude-code/plugins)

```text
grill-with-docs → to-spec → to-tickets → implement-spec → prove-it → you merge
```

- **`grill-with-docs`:** settle the design, writing the glossary and ADRs.
- **`to-spec`, `to-tickets`:** a spec and tracer-bullet tickets on your tracker.
- **`implement-spec`:** works the tickets AFK, one worktree per ticket, one draft PR.
- **`prove-it`:** a separate verifier agent tests the PR in a browser, fixes what it proves broken, and posts a Verdict.

## Installation

### 1. Install the plugin

In Claude Code:

```text
/plugin marketplace add Aysnc-Labs/skills
/plugin install aysnc-skills@aysnc
```

The first command adds the `aysnc` marketplace (this repository). The second installs the `aysnc-skills` plugin from it. Restart Claude Code, and the skills appear as `/aysnc-skills:<name>`.

### 2. Turn on auto-update

Claude Code auto-updates official marketplaces only. For this one, turn it on once:

`/plugin` → **Marketplaces** → `aysnc` → **Enable auto-update**

Claude Code then checks for a new version at startup. To update by hand instead:

```text
/plugin marketplace update aysnc
```

### 3. Run `/aysnc-skills:setup` in your repo

Run it once per repository. It:

- asks which issue tracker you use (GitHub, GitLab or local Markdown) and creates the triage labels it needs
- maps each feature's purpose, entry point and code in `docs/feature-map.md`, guarded by a check, and asks you to confirm the feature list
- writes a Commands section in `AGENTS.md` that runs, checks and seeds your app, each command proven once
- writes `CODING_STANDARDS.md` from your existing lint and type config
- adds `.claude/settings.json`, so the repository enables the plugin
- writes the scripts for Claude Code on the web
- tidies `AGENTS.md`, proposing a home for each line before moving anything

Re-run it any time to repair drift.

> **Teammates** still install the plugin once each: `claude plugin install aysnc-skills@aysnc --scope project`. The committed settings only enable it.

### 4. Start with a design conversation

```text
/aysnc-skills:grill-with-docs
```

## Everything in the box

All skills use the `aysnc-skills:` prefix, for example `/aysnc-skills:tdd`.

<details>
<summary><b>Plan</b> · grill-with-docs, grilling, to-spec, to-tickets, wayfinder, triage, research, look-online, prototype</summary>

| Skill | What it does |
|---|---|
| `grill-with-docs` | Interviews you until you share an understanding, writing the glossary and ADRs as it goes. |
| `grilling` | The interview loop that `grill-with-docs`, `triage` and `wayfinder` run. You start it through `grill-with-docs`. |
| `to-spec` | Turns the conversation into a spec on your tracker. |
| `to-tickets` | Breaks a spec into tracer-bullet tickets with blocking edges. |
| `wayfinder` | Maps work too big for one session as decision tickets, resolved one at a time. |
| `triage` | Moves issues and external PRs through triage and writes agent-ready briefs. |
| `research` | Digs into primary sources and saves the findings in your repo. |
| `look-online` | Answers a question from the web in chat, flagging every weak source. |
| `prototype` | Builds a throwaway prototype to settle a design question. |

</details>

<details>
<summary><b>Build</b> · implement-spec, implement, tdd, diagnosing-bugs, afk</summary>

| Skill | What it does |
|---|---|
| `implement-spec` | Builds a spec's tickets AFK: one lane per ticket, one integration branch, one draft PR. |
| `implement` | Builds a smaller piece of work. |
| `tdd` | Red, green, refactor, through public seams. |
| `diagnosing-bugs` | A diagnosis loop for hard bugs and performance regressions. |
| `afk` | How to act while you're away: decide like a staff engineer and product owner, and write down every call. |

</details>

<details>
<summary><b>Verify and ship</b> · prove-it, code-review, pr</summary>

| Skill | What it does |
|---|---|
| `prove-it` | Tests a PR like a careful human, fixes what breaks, and posts one Verdict. |
| `code-review` | Reviews against your standards *and* the original spec, in parallel. |
| `pr` | Writes PR bodies with For Human, Verification steps and a ticket table. |

</details>

<details>
<summary><b>Design</b> · codebase-design, improve-codebase-architecture, domain-modeling</summary>

| Skill | What it does |
|---|---|
| `codebase-design` | Shared vocabulary for deep modules and where seams go. |
| `improve-codebase-architecture` | Finds deepening opportunities and shows them in a visual report. |
| `domain-modeling` | Builds and sharpens the glossary and ADRs. |

</details>

<details>
<summary><b>Get better over time</b> · retro, gardening</summary>

| Skill | What it does |
|---|---|
| `retro` | A retrospective on a session, spec run or PR, as one comment. |
| `gardening` | Finds lessons that keep repeating across runs and files them, then tidies the queue. |

</details>

<details>
<summary><b>Utilities</b> · aysnc, setup, clean-up, handoff, wizard, teach, writing-for-agents, pocock-this, in-your-own-words, wait-what</summary>

| Skill | What it does |
|---|---|
| `aysnc` | Our working principles: simple, ergonomic, learnings in the project. A hook loads it in every session and subagent. |
| `setup` | Gets a repository ready for everything above. |
| `clean-up` | Removes everything a chat created (worktrees, branches, databases) after you confirm. |
| `handoff` | Compacts the conversation into a doc another agent can pick up. |
| `wizard` | Generates a bash wizard for the steps only a human can do. |
| `teach` | Teaches you a new concept, right in your workspace. |
| `writing-for-agents` | Guidance for writing skills, `AGENTS.md` and `CLAUDE.md`. |
| `pocock-this` | Rewrites a document the way Matt Pocock would. |
| `in-your-own-words` | Plays your goal back to you before any work starts. |
| `wait-what` | Re-explains the last message when it didn't land. |

</details>

<details>
<summary><b>Agents</b> · verifier, researcher</summary>

| Agent | Role |
|---|---|
| `verifier` | Tests a PR's changed surface in a real browser and tries to break it. Started by `prove-it`. |
| `researcher` | Answers design questions read-only, one per area. Started by `grill-with-docs`. |

</details>

## Credits

Built on [Matt Pocock's skills](https://github.com/mattpocock/skills), with `in-your-own-words` from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) and PR visuals adapted from Dex Horthy's [`show-me`](https://github.com/humanlayer/humanlayer). Every change we made to upstream is listed in [UPSTREAM.md](UPSTREAM.md).

## Contributing

Issues and pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md).

