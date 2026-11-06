---
name: grill-with-docs
description: Grill the user on a plan or design until you share an understanding, writing the glossary and ADRs as you go and gathering everything a spec and its tickets need.
disable-model-invocation: true
---

The spec and tickets that follow are the only thing the implementing agents read, so gather everything they will need while grilling. This is where the decisions happen: `implement-spec` builds what is settled here and asks the user only about gaps.

## Before the first question

1. Call the Skill tool for `grilling`, `domain-modeling` and `codebase-design`, and follow all three: decide where the seams and modules go while grilling, not later.
2. Read the `SKILL.md` of `to-spec` and `to-tickets`, in the folders beside this skill's own. The grilling feeds them, so gather in their shape from the start. Do not run them.
3. When the user points at an issue, pull request or link, read all of it: the body, every comment, and everything it links to, recursively, until a hop adds nothing.
4. Read `GLOSSARY.md`, the ADRs in `docs/adr/` for the area, `docs/code-map.md` for where each feature's code lives, and the feature map of the project's verify skill (`.claude/skills/verify-<app>/`) when it exists: the shortest path to what each feature does for its users.

## While grilling

Keep a running record in the conversation, so nothing has to be found again later:

- **Decisions**: each with its Why, and the alternatives turned down with their Why not.
- **Research**: every fact looked up, its source link, and what it established.
- **User context**: preferences, worries and constraints the user states that are not decisions.
- **Design**: the modules, their interfaces, and the seams the feature is tested at, in `codebase-design`'s vocabulary.
- **Code pointers**: the files, classes, routes and screens involved, each with the commit it was true at (`git rev-parse --short HEAD`).
- **Test data**: what the database or fixtures need to hold for the feature to be tested by hand and shown.
- **Open questions**: anything deliberately left undecided.

Facts are yours to find; decisions are the user's.

## Deep research, before the frontier closes

When the frontier looks empty, and before confirming anything, check the settled design against reality. Split it into **areas**: each feature the design touches, and each outside system or library whose behaviour it relies on. Spawn one `researcher` subagent per area, in parallel, with the Decisions and Design so far, the area's feature-map entry or documentation, and the questions to answer. Each checks the decisions against the code and primary sources, and returns its findings, the files and patterns the work will follow, the risks, and anything still undecided.

Add the findings to the Research and Code pointers records. A finding that contradicts a decision, or raises a question no one has answered, reopens the frontier: grill on it before going on.

Done when: every area is researched and no finding is left unanswered.

## When the frontier is empty

Confirm the shared understanding. Then tell the user they can run `/to-spec`, and `/to-tickets` once the spec is published, and that both build on this conversation. Never run them yourself: the user starts each one.
