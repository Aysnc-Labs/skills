---
name: writing-for-humans
description: Writing documents people read. Use when creating or editing a README, a CONTRIBUTING.md, or any other doc for humans.
---

The sibling of `aysnc-skills:writing-for-agents`, for documents a person reads. Write for the **cold reader**: they skim, and decide in seconds whether the document answers their question.

## Register

- **Plain**: say what the thing is and what it does, and let the reader decide whether they want it: describe, never sell.
- **The agent**: call the actor "the agent". Name a product (Claude Code, mise) only where the product itself is the subject.
- **The reader's role**: in every step, say what the reader does and what the tool does. Hiding the reader's part overstates the tool.
- **Checked**: read the code, skill or `--help` behind every claim before you write it.
- **One home**: each rule or fact lives in one document; others link to it. A list that mirrors a folder, a CLI's `--help` or a manifest is a **cache** that goes stale: link to the source, or keep a short curated list that names where the full one lives.

Then apply every rule in [UNSLOP.md](UNSLOP.md) to the draft. Its rule numbers are stable, so cite them when you explain an edit.

## Documents

- A README: read [README-GUIDE.md](README-GUIDE.md) first. It holds the Aysnc template.
- A CONTRIBUTING.md, or the contribution rules in an `AGENTS.md`: read [CONTRIBUTING-GUIDE.md](CONTRIBUTING-GUIDE.md) first.

## Done

The document is done when:

- every command in it has run in this repository and done what the document says
- every link and image resolves
- every UNSLOP rule holds, checked line by line
- it renders as intended: `jq -Rs '{text: ., mode: "markdown", context: "<owner>/<repo>"}' <file> | gh api -X POST /markdown --input -`, then read the HTML
- every claim you could not check is reported to the user
