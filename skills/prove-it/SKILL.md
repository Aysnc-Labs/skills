---
name: prove-it
description: "Test a PR like a careful human tester on the local stack: try to break what changed, fix what breaks, and post one Verdict."
disable-model-invocation: true
---

Test a PR as a careful human tester would, so nobody has to. CI runs the lint, type, unit and e2e suites; you do the hands-on part they miss: drive the change in a real browser and try to break it. This is the last check before a change costs the business sales, trust or search ranking.

The PR waits on you: go as fast as **risk-based testing** allows, with the PR's Merge Danger setting the depth.

The result comes from a **verifier** (`aysnc-skills:verifier`) that did not write the code. Fixes come from an implementer subagent. No agent grades its own work. The verifier's rules (a gap is not a pass, evidence and damage for every finding) live in its agent file.

## Scope

Only what the PR changed: the **changed surface**, every page, admin screen and endpoint that renders, runs or returns code the diff changed.

## In a cloud session

- The GitHub MCP tools do what the steps' `gh` commands do.
- The session pushes only to its own branch. Start it from the PR's head, and wherever the steps commit or push to the PR branch, use it instead. Open one PR from it into the PR branch, and name that PR in the Verdict and For Human.

## Steps

1. **Pin the PR.** Read it with `gh pr view <n> --comments`: its branch, body and linked issues.
   - The local stack serves the main checkout. When `git status` there shows uncommitted changes, work in a fresh worktree of the PR branch instead, and leave the main checkout untouched.
   - Otherwise note the current branch, check out the PR branch and pull it, then bring the stack onto it with the Commands in the project's `AGENTS.md`: installs and migrations, then each app's `dev`. Note every process you start.
   - Run each app's `status`: it must say the app is up, ready and served from this checkout. Then prove the stack serves the PR: request something only the PR's code produces. If either fails, restart the dev servers and check again; if it still fails, stop and tell the user.

   Done when `status` passes for each app and a request only the PR's code can answer comes back from the local stack.

2. **Checklist.** The project's `docs/agents/verification.md`. When it is missing, copy [verification.md](verification.md) there, commit it to the PR branch, and say so in For Human.

   Done when the checklist exists at that path on the PR branch.

3. **Verification steps.** When the PR body has no Verification section, write one from the diff, the linked issues and the `docs/feature-map.md` entries whose Paths the diff touches, each driven from its Entry line, with the `pr` skill's Verification format: every behaviour the PR changed. Say in For Human that you wrote it.

   Done when the PR body's Verification section covers every behaviour the diff changed.

4. **Test.** Start one fresh verifier, briefed with pointers only: the PR URL, the local site URL, the checklist path, the screenshot folder (`${TMPDIR:-/tmp}/prove-it/<PR number>/round-<n>/`) and, after the first round, the last verified commit. Done when it has returned `PASS`, `ISSUES` or `BLOCKED` with its method and evidence; rerun it once if it returns without them.

5. **Fix.** You design each fix, as a staff engineer: the verifier proves damage, and its fix direction is one input. Brief the implementer with the simplest design that closes the damage at its cause, in proportion to what the damage costs.

   When the verifier proves findings, start one implementer subagent briefed with this:

   ```text
   Fix these findings on <PR URL>: <the verifier's findings>, with its tests: <their paths>.
   Work in the main checkout on the PR branch, against the project's default test database.
   Each fix comes with a red test covering every site with the same defect, or a repro receipt where no test can show it. Commit with the project's convention, and push nothing.
   A finding whose fix needs a choice the `pr` skill's Needs decision describes stays unfixed: say what the choice is.
   Your final message lists each finding with its fix commit, or the choice it waits on.
   ```

   A finding left for a choice goes to For Human. Push its commits to the PR branch, then go back to step 4 with a fresh verifier that verifies what changed since the last verified commit, and its blast radius, and confirms each fix. The user stops the loop when they choose; it ends on its own when a round proves nothing the fixer can fix, or only `quality` and `UX` damage, which goes in the Verdict as notes. Then call the Skill tool with `aysnc-skills:code-review` on the fix commits, and send what it finds through this step.

   A step the verifier marks `step wrong`: confirm it, then reword it in the PR body. When the right expectation is a choice, it is **Needs decision**.

   Done when every finding has a fix commit confirmed by a later verifier, sits in For Human waiting on its choice, or is a `quality` or `UX` note, and `code-review` has run on every fix commit.

6. **Post.** Write the PR's single `Verdict` comment: edit it when it exists (`gh api --method PATCH repos/<owner>/<repo>/issues/comments/<id> -F body=@<file>`), create it otherwise. The Verdict is the PR's whole testing record, which `gardening` reads after merge: keep every finding from earlier runs with its current status, and add the new ones. Rewrite only the For Human section of the PR body.

   Done when the Verdict and For Human reflect the last round.

7. **Restore.** Stop the processes the run started, delete the data the run created, and check the user's original branch back out with the stack on it, or remove the worktree. The user's local data stays: cleanup deletes record by record, never with `db:reset`.

   Done when `git status` in the main checkout matches how you found it, every process the run started is stopped, and no run data remains but the screenshots.

8. **Show.** End the run on the **Wrap-up** below, with every screenshot from every round.

   Done when every screenshot path the verifiers reported is in the Wrap-up.

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

## Wrap-up

Your last message. Badge: `✅ PASS`, `📝 PASS+NOTES`, `🤔 NEEDS DECISION` or `❌ FAIL`. Status: 🔧 fixed, 🤔 needs a decision, 📝 note. Leave out an empty section.

Each screenshot is a markdown link to its absolute path: terminals open links on click and render no images. With the `SendUserFile` tool (a cloud session), send the screenshots first, in Wrap-up order, with `display: "render"`, and write `📸 <n>` in place of each link.

```markdown
## 🧪 prove-it · [PR #<n>](<PR URL>) · <badge>

> <one line: why>

| | |
|---|---|
| **Verified at** | `<short commit>` |
| **Rounds** | <n> |
| **Steps** | ✅ <n> passed · ❌ <n> failed · ⛔ <n> blocked |
| **Findings** | 🔧 <n> fixed · 🤔 <n> need a decision · 📝 <n> notes |

### 📸 Findings

1. <status> **<what is or was wrong>** · <damage> · round <n> · [<caption>](<path>)

### 🎨 Visual changes

- **<step>** · [<caption>](<path>)

### 👤 Needs you

- <each decision, one line> | Nothing: ready to merge.

[Verdict](<comment URL>) · [PR](<PR URL>)
```
