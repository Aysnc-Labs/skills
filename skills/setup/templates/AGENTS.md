<!-- Loads into every agent's context on every turn: only what no file, check or command already says. Delete this comment. -->

## Commands

- `<check command>`: the one gate, run on pre-push and in CI. Green locally means green in CI.
- <a command nothing enforces, and when to run it; delete the line when none>

## Conventions

- <a convention no tool enforces, in one line>

## Agent skills

- Where code lives: `docs/code-map.md`. Start every task there.
- Issue tracker: <host and repo>, via <CLI>. Where the plan and its decisions live: `docs/agents/issue-tracker.md`. Labels: `docs/agents/triage-labels.md`.
- Domain: `GLOSSARY.md` and `docs/adr/`, read as `docs/agents/domain.md` says.
- To see a change work, reproduce a bug, or walk a PR's Verification steps: the `verify-<app>` skill.
- Review rules: `CODING_STANDARDS.md`.
