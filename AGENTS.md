# Aysnc skills

One Claude Code plugin (`aysnc-skills`), published through the marketplace in `.claude-plugin/marketplace.json`, which holds its version. Skills are `skills/<name>/SKILL.md`; subagents are `agents/<name>.md`. Both are found by folder, so nothing lists them.

- Write every skill and agent with the `writing-for-agents` skill.
- Upstream skills: record every change in `UPSTREAM.md`'s Changed table, briefly. Our own skills go under its Ours list.
- Write each skill in our own words. Prefer Matt's vocabulary (frontier, seam, tracer bullet, AFK) where a term exists.
- Project-specific knowledge belongs in the project (its `AGENTS.md`, `docs/agents/`, its `docs/feature-map.md`), never in a skill. A skill names the file to read.
- Bump the version in `.claude-plugin/marketplace.json` with every change: installs update only when it moves.
- Test: `node --test 'skills/**/*.test.ts'`.
