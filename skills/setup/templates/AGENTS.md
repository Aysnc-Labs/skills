<!-- Loads into every agent's context on every turn: only what no file, check or command already says. Delete this comment. -->

## Commands

- `<check command>`: the one gate, run on pre-push and in CI. Green locally means green in CI.
- `<test command>`: runs <the suites it runs>.
- `<e2e command>`: runs <the suites it runs, and against what>.

### <app>

<!-- One block per app. Leave out a role the app has no use for. Delete this comment. -->

- `<dev command>`: serves <app> at <URL>.
- `<status command>`: says whether <app> is up, ready, and served from this checkout.
- `<db:reset command>`: empties <app>'s database and migrates it.
- `<seed command>`: loads <the data it seeds>.

## Conventions

- <a convention no tool enforces, in one line>

## Agent skills

- Each feature's purpose, entry point and code: `docs/feature-map.md`. Start every task there.
- Issue tracker: <host and repo>, via <CLI>. Where the plan and its decisions live: `docs/agents/issue-tracker.md`. Labels: `docs/agents/triage-labels.md`.
- Domain: `GLOSSARY.md` and `docs/adr/`, read as `docs/agents/domain.md` says.
- Review rules: `CODING_STANDARDS.md`.
- Logging in or verifying the app: `docs/agents/verification.md`.
