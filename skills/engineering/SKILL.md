---
name: engineering
description: "Load before every engineering task, in every session and subagent: building, fixing, reviewing, testing or verifying code, or discussing a design, plan or tradeoff."
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

## Cheapest proof

Prove every change with the **cheapest proof** that settles it: a slow proof where a fast one would do stalls the loop. Climb the ladder one rung at a time, and only when the rung below cannot settle the question.

1. Typecheck and lint the files you changed.
2. Run the one test file or test name that covers the change.
3. Run the tests the change can affect.
4. Run the full suite once, when the work is done.
5. Drive the running app in a browser, where only a browser shows it.

Every rung runs on the machine you are on.

Done when every change is proven at the lowest rung that settles it, and the full suite has run green once.

**Risk-based testing** sets how deep each rung goes: deep where a failure's **damage** would be high (security, legal, revenue, data, SEO) or the change is a one-way door with a wide blast radius; a skim where it would be low. Test kinds and seams live in `aysnc-skills:tdd`.

## CI

CI is for CI work: a change to the workflows or the pipeline. Any other failing job is a command to run here: read its log (`gh run view <id> --log-failed`) and its workflow, run its steps, and prove the fix the same way. Push only finished work: a temporary branch, an extra push or a workflow dispatch spends CI on what your machine can check.

## Linux

On a Mac, run Linux work (a CI job's steps, a Linux-only tool, a clean install) in an `sbx` sandbox, through `aysnc-skills:docker-sandbox`. Every Aysnc Mac has `sbx`. A Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`) is already Linux.

## Browser

`agent-browser` is the browser for agents; in the cloud, the project's setup script installs it. Pass `--session <task>` on every command, so parallel agents keep their browsers apart.

Claude in Chrome is for an attended local session where the user must act: their own login, 2FA, a captcha. With nobody there, log in through the project's **Access**: the `## Access` section of `docs/agents/verification.md`. A step Access does not cover is a gap in the project: report it.

## Footprint

Remove the sandboxes, browser sessions, servers and branches you create, as you go: leave no **footprint**.
