# Feature map

Start here to find where a feature lives and how a person sees it work. The code is the truth; this map says where to look and how to try it. `node scripts/check-feature-map.ts` checks it on every push.

Coverage: {{coverage globs, e.g. `packages/*`, `apps/*`}}

<!--
One `### ` entry per feature: something a user, editor or developer can name and ask to change. A smaller part is a word in its parent's "What", not its own entry.
- What: one line, in GLOSSARY.md's words.
- Paths: entry points in backticks (a package, a route folder), not every file. Every folder the Coverage line matches must appear under some feature.
- Seams: where its tests live, by the project's seam names.
- Try it: numbered steps a person follows to see it work: start state → action → what they see. PRs copy these into Manual testing; `prove-it` runs them.
Location and use only: rules belong in CODING_STANDARDS.md or code, decisions in docs/adr/, status in the tracker.
-->

## {{Area}}

### {{Feature}}

What: {{one line}}
Paths: `{{path}}`
Seams: {{seam names}}
Try it:
1. {{start state}} → {{action}} → {{what you see}}
