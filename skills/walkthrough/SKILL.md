---
name: walkthrough
description: "Run prove-it on a PR in a fresh subagent, fix what it proves broken, and keep one Walkthrough comment on the PR."
disable-model-invocation: true
argument-hint: "<PR number or URL>"
---

A PR is done when someone other than its author has used it. You run that loop and own its record; you neither verify nor fix. Verification is the `prove-it` skill, run by a fresh subagent that wrote none of the code. Fixes come from a separate implementer subagent. No agent grades its own work.

The run is **AFK**: decide what the user would and record why. Only a choice between product behaviours, or anything outside the repository, waits for the user.

## 1. Pin the PR

`gh pr view <n> --json number,url,headRefName,headRefOid,body`. Bring the app up on the PR's head in a worktree, as the project's `docs/agents/run-the-app.md` says, on a laptop or in a cloud session.

Done when the running app serves something only the PR's head produces.

## 2. Steps

`prove-it` takes the PR's `## Try it` section as the author's steps. When it is missing or thin, write it with the `pr` skill's Try it rules, from the diff, the closed tickets' **Try it** sections and the `docs/feature-map.md` entries the diff touches. Put it in the PR body and list it under Calls made for you.

Done when every behaviour the diff changes has a step.

## 3. Prove

Start a fresh subagent that reads and follows `../prove-it/SKILL.md`. Brief it with pointers only: the PR URL, the head SHA, the app URL, `docs/agents/run-the-app.md`, and in later rounds the last proven SHA. Tell it it may not edit, commit, push or post: its report is its final message.

Done when its table covers every step and every behaviour the diff changes. Start one more fresh subagent if it does not.

## 4. Fix

For each FAIL, start one implementer subagent:

```text
Fix these failures on <PR URL>: <each FAIL's expected, actual and repro>.
Work in <worktree> on <branch>. Each fix lands with a test that fails without it, at the project's agreed seams; where no seam can show it, a repro command and its output.
A failure whose fix is a product choice stays unfixed: name the choice.
Commit, then push to the PR branch. Reply with each failure and its fix commit, or the choice it waits on.
```

Then return to step 3 with a fresh subagent, briefed with the last proven SHA, to confirm each fix and prove what changed since. Stop when a round has no FAIL a fix can close.

## 5. Post

Keep one comment on the PR headed `## Walkthrough`: edit it when it exists (`gh api --method PATCH repos/{owner}/{repo}/issues/comments/<id> -F body=@<file>`), create it otherwise. It holds the last round's `prove-it` report, each FAIL's fix commit or the choice it waits on, and the round count.

The API cannot attach images to a comment, so screenshots go on the repository's orphan `walkthroughs` branch under `<pr>/<sha>/` (create it with `git switch --orphan` in a scratch worktree the first time; never merge it), linked as `https://github.com/{owner}/{repo}/blob/walkthroughs/<path>?raw=1`.

## 6. Clean up

Stop what you started, remove the worktree and the data the run created. Done when `git worktree list` and the processes you started match how you found them.
