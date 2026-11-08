---
name: grill-with-docs
description: Grill the user on a plan or design until you share an understanding, writing the glossary and ADRs as you go and gathering everything a spec and its tickets need.
disable-model-invocation: true
---

The spec and tickets that follow are all the implementing agents read: gather everything they need now. Decisions happen here; `implement-spec` builds what is settled and asks the user only about gaps.

## Before the first question

1. Call the Skill tool for `grilling`, `domain-modeling` and `codebase-design`, and follow all three: place the seams and modules while grilling, not later.
2. Read the `SKILL.md` of `to-spec` and `to-tickets`, in the folders beside this skill's own, and gather in their shape from the start.
3. Read every issue, pull request or link the user points at in full: the body, every comment, and everything it links to, recursively, until a hop adds nothing.
4. Read `GLOSSARY.md`, the area's ADRs in `docs/adr/`, and `docs/feature-map.md` (each feature's purpose, entry point and paths): the shortest path to what each feature does for its users and where its code lives.

Done when every source above is read.

## While grilling

Keep a running record in the conversation, so nothing has to be found again:

- **Decisions**: each with its Why, and the alternatives turned down with their Why not.
- **Research**: every fact looked up, its source link, and what it established.
- **User context**: preferences, worries and constraints the user states that are not decisions.
- **Design**: the modules, their interfaces, and the seams the feature is tested at, in `codebase-design`'s vocabulary.
- **Code pointers**: the files, classes, routes and screens involved, each with the commit it was true at (`git rev-parse --short HEAD`).
- **Test data**: what the database or fixtures must hold for the feature to be tested by hand and shown.
- **Open questions**: anything deliberately left undecided.

Facts are yours to find; decisions are the user's.

## Deep research, before the frontier closes

When the frontier looks empty, check the settled design against reality before confirming anything. Split it into **areas**: each feature the design touches, and each outside system or library whose behaviour it relies on. Spawn one `researcher` subagent per area, in parallel, with the Decisions and Design so far, the area's feature-map entry or documentation, and the questions to answer.

Add the findings to the Research and Code pointers records. A finding that contradicts a decision, or raises an unanswered question, reopens the frontier: grill on it before going on.

Done when every area is researched and no finding is left unanswered.

## When the frontier is empty

Confirm the shared understanding. Then tell the user to run `/to-spec`, and `/to-tickets` once the spec is published: both build on this conversation, and the user starts each one.
