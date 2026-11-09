# Contributing

Thanks for helping improve Aysnc Skills. Bug reports, fixes and new skills are all welcome.

## Before you start

- **Small fixes** (typos, broken links, a wrong instruction): open a pull request directly.
- **New skills or changes to how the workflow behaves**: open an issue first, so we can agree on the shape before you write it.

## Develop locally

Load your checkout as the plugin, in place of the published one:

```text
/plugin uninstall aysnc-skills@aysnc
/plugin marketplace add /path/to/your/checkout
/plugin install aysnc-skills@aysnc
```

Then restart Claude Code. To go back, remove the local marketplace and add `Aysnc-Labs/skills` again.

## Writing skills

[AGENTS.md](AGENTS.md) holds the rules, for agents and humans alike. The most important ones:

- Write every skill and agent with the `writing-for-agents` skill.
- Keep project-specific knowledge out of skills. A skill names the project file to read (`AGENTS.md`, `docs/agents/`, its `docs/feature-map.md`) instead.
- Skills live in `skills/<name>/SKILL.md`, agents in `agents/<name>.md`. Both are found by folder, so nothing else needs to list them.

When you change a skill that came from upstream, add a row to the Changed table in [UPSTREAM.md](UPSTREAM.md). A new skill of our own goes under its Ours list.

## Before you open a pull request

1. Run the tests:

   ```sh
   node --test 'skills/**/*.test.ts'
   ```

2. Bump `version` in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). Installs update only when it changes. Follow semver:
   - **patch**: a fix or rewording that doesn't change behaviour
   - **minor**: a new skill, or new behaviour in an existing one
   - **major**: a renamed or removed skill, or a change that needs projects to re-run `setup`
3. Keep the skill tables in [README.md](README.md) current: add a new skill, remove a deleted one.

CI runs the tests on every pull request.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
