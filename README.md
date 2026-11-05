# Aysnc skills

Aysnc Labs' engineering workflow for Claude Code, built on [Matt Pocock's skills](UPSTREAM.md).

```text
grill-with-docs → to-spec → to-tickets → implement-spec (AFK) → walkthrough → you merge
```

Every PR carries **Try it** steps, and `walkthrough` has an agent that wrote none of the code run `prove-it` on them in a real browser before you look. Each project has a **verification skill** (`.claude/skills/verify-<app>/`, from pstack's `create-verification-skill`): how to launch and drive the app, and a checked feature map from the user's side.

## Install

On a laptop:

```text
/plugin marketplace add Aysnc-Labs/skills
/plugin install aysnc@aysnc
```

Then turn on auto-update: `/plugin` → Marketplaces → `aysnc` → Enable auto-update. A repository that has run `/aysnc:setup` enables the plugin in its own `.claude/settings.json`.

In a Claude Code cloud session plugins are not installed; the project's `.sandbox/claude-cloud/setup-script.sh` copies the skills and agents into `~/.claude/`.

## Set up a project

```text
/aysnc:setup
```

It writes `docs/agents/` (issue tracker, triage labels, domain docs), the verify skill and its feature-map check, `CODING_STANDARDS.md`, `.claude/settings.json`, and the cloud scripts.

## Contributing

Read [AGENTS.md](AGENTS.md). Bump `version` in `.claude-plugin/marketplace.json` with every change, and run `node --test skills/setup/templates/scripts/check-feature-map.test.ts`.
