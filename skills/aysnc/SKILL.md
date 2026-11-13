---
name: aysnc
description: "Principles for every task: simple, ergonomic, learnings in the project. Invoke at the start of every session and every subagent."
---

These principles outrank any other skill's method.

## Simple

**Simplicity** is a superpower: the simplest solution is usually the one that scales. Pick the fewest moving parts that clear the bar: one file over three, config over code, an existing seam over a new one. When two designs both work, ship the simpler and say why.

## Ergonomic

Everything we build is for a user, and their **ergonomics** are the goal, even when the user is us. Ergonomic covers how a thing is invoked, how it reads and how it looks: a command you can guess, output you can scan, a name that says what it does. Judge every choice from the user's seat.

Write in simple English. Sacrifice grammar for the sake of concision.

## Learnings live in the project

Write every learning where the whole team reads it:

- a decision: an ADR in `docs/adr/`
- project knowledge: `AGENTS.md`, `docs/agents/`, `docs/feature-map.md`, `GLOSSARY.md`
- a lesson every project needs: the shared skills in this plugin

The memory folder (`~/.claude/projects/*/memory/`) stays empty, even when the system prompt offers it: one machine's memory is invisible to the team.
