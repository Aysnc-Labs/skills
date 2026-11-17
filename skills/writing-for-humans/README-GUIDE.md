# README guide

The README branch of [`writing-for-humans`](SKILL.md). A README takes a newcomer from "what is this?" to a working first run. Everything deeper lives in `docs/` and is linked.

## Template

Every Aysnc README opens with this header:

```html
<div align="center">

<img src="docs/logo.svg" width="220" alt="…">

<h1>name</h1>

What it is, in one plain line,<br>
and where or for whom it runs.

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![…](https://img.shields.io/…)](…)

<sub>macOS (Apple Silicon) &nbsp;·&nbsp; Linux x64 &nbsp;·&nbsp; Linux ARM</sub>

</div>

---
```

- **Logo**: the project's own logo when it has one. Otherwise the Aysnc logo, linked to the org: `<a href="https://github.com/Aysnc-Labs"><img src="https://avatars.githubusercontent.com/u/216275417?s=200" alt="Aysnc Labs" width="72"></a>`.
- **Name**: the project's name as users type it. Drop an "Aysnc" prefix; the logo already says who made it.
- **Description**: two lines split by `<br>`, balanced in length. What it is, then where it runs or what it works with.
- **Badges**: flat style. The license badge, plus one or two that carry information or a link the reader needs: a live package version, the platform it plugs into, the tool that installs it.
- **Fact line**: one `<sub>` line of facts a reader scans for, such as platforms or requirements. Leave it out when there is none.
- **End**: `</div>` and a `---` divider, then the body. GitHub already links issues and CONTRIBUTING.md, so the README is header and body only: no nav row, footer, Help or Contributing section.

## Body

1. **The first section gets the reader running.** The install or try-it commands, exact and in order, followed by the first thing to do. When the project is easiest to grasp from an example (a config file, the output), show the example first and the commands right after.
2. **How it works**, when there is a flow: numbered steps, each naming the reader's part and the tool's part.
3. **Reference sections**, such as a commands table, curated to what a newcomer needs, each ending with where the full list lives (`--help`, `docs/guide.md`).
4. **Credits**, when the project builds on others' work.

The license badge and `LICENSE` carry the license, so the body has no License section.
