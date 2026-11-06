---
name: prove-it
description: "Test a PR like a careful human tester on the local stack: try to break what changed, fix what breaks, and post one Verdict."
disable-model-invocation: true
---

You are testing a PR the way a careful human tester would, so nobody has to. CI already runs the lint, types, unit and e2e suites; this is the hands-on part those miss: clicking through the change in a real browser and trying to break it. It is the last check before a change can cost the business sales, trust or search ranking.

Speed matters too: the PR waits on you. Work as fast as **risk-based testing** allows: the PR's Merge Danger sets the depth.

The result comes from a **verifier** (`aysnc:verifier`) that did not write the code. Fixes come from an implementer subagent. No agent grades its own work. The verifier's rules (a gap is not a pass, evidence and damage for every finding) live in its agent file.

## Scope

Only what the PR changed: the **changed surface**, every page, admin screen and endpoint that renders, runs or returns code the diff changed.

## In a cloud session

- The GitHub MCP tools do what the steps' `gh` commands do.
- The session pushes only to its own branch. Start it from the PR's head, and wherever the steps commit or push to the PR branch, use it instead. Open one PR from it into the PR branch, and name that PR in the Verdict and For Human.

## Steps

1. **Pin the PR.** Read it with `gh pr view <n> --comments`: its branch, body and linked issues.
   - The local stack serves the main checkout. When `git status` there shows uncommitted changes, work in a fresh worktree of the PR branch instead, and leave the main checkout untouched.
   - Otherwise note the current branch, check out the PR branch and pull it, then bring the stack onto it with the project's verify skill (`.claude/skills/verify-<app>/`): its Launch and Doctor, plus installs and migrations.
   - Prove the stack serves the PR: request something only the PR's code produces. If it does not, restart the dev servers and check again; if it still does not, stop and tell the user.

2. **Checklist.** The project's `docs/agents/verification.md`. When it is missing, copy [verification.md](verification.md) there, commit it to the PR branch, and say so in For Human.

3. **Verification steps.** When the PR body has no Verification section, write one from the diff, the linked issues and the verify skill's feature files for the behaviour the diff touches, with the `pr` skill's Verification format: every behaviour the PR changed. Say in For Human that the verifier wrote it.

4. **Test.** Start one fresh verifier, briefed with pointers only: the PR URL, the local site URL, the verify skill's path, the checklist path and, after the first round, the last verified commit. Done when it has returned `PASS`, `ISSUES` or `BLOCKED` with its method and evidence; rerun it once if it returns without them.

5. **Fix.** You design each fix, as a staff engineer: the verifier proves damage, and its fix direction is one input. Brief the implementer with the smallest change that closes the damage it proved.

   When the verifier proves findings, start one implementer subagent briefed with this:

   ```text
   Fix these findings on <PR URL>: <the verifier's findings>, with its tests: <their paths>.
   Work in the main checkout on the PR branch, against the project's default test database.
   Each fix comes with a red test covering every site with the same defect, or a repro receipt where no test can show it. Commit with the project's convention, and push nothing.
   A finding whose fix needs a choice the `pr` skill's Needs decision describes stays unfixed: say what the choice is.
   Your final message lists each finding with its fix commit, or the choice it waits on.
   ```

   A finding left for a choice goes to For Human. Push its commits to the PR branch, then go back to step 4 with a fresh verifier that verifies what changed since the last verified commit, and its blast radius, and confirms each fix. The user stops the loop when they choose; it ends on its own when a round proves nothing the fixer can fix, or only `quality` and `UX` damage, which goes in the Verdict as notes. Then call the Skill tool with `aysnc:code-review` on the fix commits, and send what it finds through this step.

   A step the verifier marks `step wrong`: confirm it, then reword it in the PR body. When the right expectation is a choice, it is **Needs decision**.

6. **Post.** Write the PR's single `Verdict` comment: edit it when it exists (`gh api --method PATCH repos/<owner>/<repo>/issues/comments/<id> -F body=@<file>`), create it otherwise. The Verdict is the PR's whole testing record, which `gardening` reads after merge: keep every finding from earlier runs with its current status, and add the new ones. Rewrite only the For Human section of the PR body.

7. **Restore.** Run the verify skill's Cleanup, delete the data the run created, and check the user's original branch back out with the stack on it, or remove the worktree.

## Verdict

```markdown
## Verdict: PASS | PASS+NOTES | NEEDS DECISION | FAIL

<one line: why>

**Verified at:** <commit>

**Verification steps:** 46/48 passed · 2 blocked
**Break-it and checklist:** 3 findings

### Findings
1. **<what is wrong>** · <damage> · fixed in [<commit>](link) | open | needs decision · round <n>
   <where> → <evidence>

### Suspicions
- <unproven concern, and what would prove it>

### Not verified
- <what could not be checked, and why>

### Struggles
- <what slowed or blocked the verifier, and its cause in the environment>
```

`PASS` has no open findings. `PASS+NOTES` has only open findings with damage `quality` or `UX` that the user may accept. `NEEDS DECISION` has nothing open but decisions. Everything else is `FAIL`.
