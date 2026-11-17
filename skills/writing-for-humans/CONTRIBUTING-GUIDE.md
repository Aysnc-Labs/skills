# CONTRIBUTING guide

The CONTRIBUTING branch of [`writing-for-humans`](SKILL.md). A CONTRIBUTING.md takes a contributor, human or agent, from a fresh clone to a mergeable pull request. Both read it, so every step is a command with its pass condition.

## One home

CONTRIBUTING.md owns the contribution rules. `AGENTS.md` keeps what is agent-specific, plus a pointer that names when to go: "Before changing X, read CONTRIBUTING.md and follow it." Agents load `AGENTS.md` every session and read CONTRIBUTING.md only when a line sends them there.

Contribution rules already in `AGENTS.md` move into CONTRIBUTING.md, leaving the pointer.

## Sections

- **Before you start**: what goes straight to a pull request, and what needs an issue first.
- **Develop locally**: setup from a fresh clone, as commands.
- **Rules**: the project's conventions a contributor cannot learn from its config.
- **Before you open a pull request**: a numbered checklist ("Run `pnpm check`. It must pass."), plus versioning or changelog steps.
- **AI-assisted work**: a human owns every change. They verify it before asking for review and answer for it in review. Where the project uses sign-offs, only a human signs off.
- **License**: what contributors agree to.

Keep it short. An agent that imports it pays for every line in every session.
