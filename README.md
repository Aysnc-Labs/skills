<div align="center">

<a href="https://github.com/Aysnc-Labs"><img src="https://avatars.githubusercontent.com/u/216275417?s=200" alt="Aysnc Labs" width="72"></a>

<h1>Skills</h1>

Aysnc Labs' workflow for Claude Code. It takes a feature<br>
from a design conversation to a tested pull request.

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](https://docs.claude.com/en/docs/claude-code/plugins)

<sub>A Claude Code plugin</sub>

</div>

---

## How it works

1. **`grill-with-docs`:** The agent interviews you until you agree on the design, and writes a glossary and architecture decision records (ADRs).
2. **`to-spec`:** The agent writes up what you agreed as a spec on your issue tracker.
3. **`to-tickets`:** The agent splits the spec into tracer-bullet tickets.
4. **`implement-spec`:** The agent builds the tickets while you are away from the keyboard (AFK), one worktree per ticket, into one draft pull request. The pull request lists what needs your input.
5. **`prove-it`:** A verifier agent that did not write the code tests the pull request in a browser, fixes what it proves broken, and posts a Verdict.
6. You review and merge.

Agents write what they learn into your repository, and later runs read it.

## Installation

### 1. Install the plugin

In Claude Code:

```text
/plugin marketplace add Aysnc-Labs/skills
/plugin install aysnc-skills@aysnc
```

Restart Claude Code. The skills appear as `/aysnc-skills:<name>`.

### 2. Turn on auto-update

Claude Code auto-updates official marketplaces only. To update this one automatically, run `/plugin`, open **Marketplaces**, select `aysnc`, and choose **Enable auto-update**.

To update by hand instead, run `/plugin marketplace update aysnc`.

### 3. Run `/aysnc-skills:setup` in your repository

Run it once per repository. Run it again whenever the files it wrote fall out of date. It:

- asks whether you track issues in GitHub, GitLab or local Markdown, and creates the triage labels it needs
- maps each feature's purpose, entry point and code in `docs/feature-map.md`, and adds a check that keeps the map current
- writes a Commands section in `AGENTS.md` that runs, checks and seeds your app, and runs each command once to prove it works
- writes `CODING_STANDARDS.md` from your existing lint and type config
- adds `.claude/settings.json`, which enables the plugin for the repository
- writes the setup scripts for Claude Code on the web
- tidies `AGENTS.md`, and proposes a new home for each line before moving it

Each teammate still installs the plugin once with `claude plugin install aysnc-skills@aysnc --scope project`. The committed settings only enable it.

### 4. Start with a design conversation

```text
/aysnc-skills:grill-with-docs
```

## Credits

Built on [Matt Pocock's skills](https://github.com/mattpocock/skills). The `in-your-own-words` skill comes from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack), and the pull request visuals are adapted from Dex Horthy's [`show-me`](https://github.com/humanlayer/humanlayer). [UPSTREAM.md](UPSTREAM.md) lists every change we made to upstream skills.
