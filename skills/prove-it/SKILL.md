---
name: prove-it
description: Verify a PR as its adversary: run its steps, then break what they missed.
disable-model-invocation: true
---

Deliver a verdict on whether the change works, as its **adversary**. The source (what the user named, else the current branch's PR) is the author's own exam: its verification steps and _Evidence_ claims. Passing it proves only the path the author thought of: run every step, then read the diff and break what it missed.

Every verdict rests on what you **witnessed** on the source's head commit: reading code finds the attacks, running them gives the verdict.

## Guardrails

- The project's rules on what an agent may touch outrank this skill: what they reserve for a human is BLOCKED.
- BLOCKED is the last resort: load and use every driver available (browser, simulator, device tools) before naming a blocker.
- Outward-facing actions (push, message, production, shared staging) wait for a yes.
- A FAIL is a finding: report it and leave the change's code untouched.

## Report

```markdown
Verified <source> @ <sha>
Author's steps: <n> pass, <n> fail, <n> blocked
Attacks: <n> pass, <n> fail, <n> blocked

| # | Step or attack | Verdict | Evidence |
```

Then each FAIL's expected, actual, and repro; what would unblock each BLOCKED; and every source claim nothing covered. Offer to post it as a PR comment.

Done when every step and claim in the source, and every behaviour the diff changes, appears in the table with witnessed evidence or a named blocker.
