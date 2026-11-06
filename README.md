# Aysnc skills

Aysnc Labs' engineering workflow for Claude Code, built on [Matt Pocock's skills](UPSTREAM.md).

```text
grill-with-docs → to-spec → to-tickets → implement-spec (AFK) → prove-it → you merge
```

Every PR carries **Verification** steps and a **For Human** section that says in one line whether you are needed. `prove-it` has an agent that wrote none of the code run those steps in a real browser and try to break the change, fixes what it proves, and posts one Verdict. `implement-tickets` does the same for tickets outside a spec; `retro` and `gardening` turn what runs teach into checks and rules. Each project has a **verification skill** (`.claude/skills/verify-<app>/`, from pstack's `create-verification-skill`): how to launch and drive the app, and a checked feature map from the user's side.

## Install

On a laptop:

```text
/plugin marketplace add Aysnc-Labs/skills
/plugin install aysnc@aysnc
```

Then turn on auto-update: `/plugin` → Marketplaces → `aysnc` → Enable auto-update. A repository that has run `/aysnc:setup` enables the plugin in its own `.claude/settings.json`.

In a Claude Code cloud session plugins are not installed. The project's `.sandbox/claude-cloud/` scripts (from `/aysnc:setup`) link the skills and agents from the environment's `Aysnc-Labs/skills` checkout into `~/.claude/`, as user skills: type `/prove-it 123`, not `/aysnc:prove-it 123`.

## Set up a project

```text
/aysnc:setup
```

It writes `docs/agents/` (issue tracker, triage labels, domain docs), the code map and its check, the verify skill and its feature-map check, `CODING_STANDARDS.md`, `.claude/settings.json`, and the cloud scripts.

## Contributing

Read [AGENTS.md](AGENTS.md). Bump `version` in `.claude-plugin/marketplace.json` with every change, and run `node --test skills/setup/templates/scripts/check-feature-map.test.ts skills/implement-spec/scripts/metrics.test.ts skills/setup/templates/scripts/check-code-map.test.ts`.
