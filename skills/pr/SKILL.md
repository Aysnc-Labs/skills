---
name: pr
description: "Use when writing a PR body."
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

Use this template for writing the PR body. Order matters: a reviewer reads what changes and tries it before reading any proof.

```markdown
<one or two sentences: who notices this change, and what they notice>

## What changes

<diagram, diff-sketch, or tree>

## Try it

1. <start state> → <action> → <what you see>

## Proof

| Check | Before | After |
|---|---|---|
| <behaviour> | <screenshot / failing run> | <screenshot / passing run> |

## Risk

**Undo:** <easy: revert the PR | hard: what a revert leaves behind>
**Reaches:** <who or what this can break, beyond the diff>

## Calls made for you

- <a call an agent made where you would normally decide, and why>

Closes #<n>, closes #<n>
```

## Sections

Skip all preambles and keep prose brief. Use the user's domain language from `GLOSSARY.md`.

### What changes

Pick the smallest view that makes the key point clear.

- Show logic or an algorithm as pseudocode:

```text
on(save)
  if content is unchanged
    return cached result
  write new content
  return fresh result
```

- Show runtime control flow as a call tree:

```text
submitForm
  createSession
    persistPrompt
    launchAgent
  navigateToSession
```

- Show UI structure as a component tree, including state and module boundaries that matter:

```text
<SessionPage> (apps/example/src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
    <RunSkillButton> (packages/ui)
```

- Show file responsibility or a broad refactor as a shallow file tree:

```text
src/
├── commands/       # parses user actions
├── sessions/       # owns session state
└── transport/      # sends API requests
```

- Show component interaction, control flow, or data flow with Mermaid:

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Daemon
    User->>UI: choose command
    UI->>Daemon: send expanded prompt
    Daemon-->>UI: stream result
```

- Use `diff` when the point is what changes and the surrounding shape already exists. Match the diff shape to the topic.

For a component change:

```diff
 <SessionPage>
   useSessionEvents()
   <SessionToolbar>
+    <RunSkillButton />
   <SessionTimeline>
+    <SkillResultCard />
```

For a file-layout change:

```diff
 src/
 ├── commands/
+│   └── show-me.ts       # expands the slash command
 ├── sessions/
-└── transport.ts
+└── transport/
+    ├── client.ts
+    └── stream.ts
```

For a call-tree or call-stack change:

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
-  navigateToSession
+  navigateToSession
+    subscribeToEvents
```

For a state or control-flow change:

```diff
 on(save)
-  write content
+  if content is unchanged
+    return cached result
+  write new content
+  invalidate cache
```

- Show the whole block when most of it is new, when omitted context would hide ownership or order, or when the user needs a copyable target shape:

```ts
function expandSkill(command: string): string {
  const skillName = command.slice(1);
  return `use the ${skillName} skill`;
}
```

#### Guidance

Place each visual next to the short text it supports. Keep only the calls, files, props, states, and boundaries needed to answer the user's current question or the options to resolve the current discussion point.

You may use one of these, you may use several, it is unlikely you will use all of them. Use your judgement and don't overwhelm the user.

### Proof

Concrete evidence that the change works: one row per behaviour, before and after.

Screenshots are S-tier - when the environment is set up for it and the change is visual.

Execution-based evidence is A-tier. Test results, console output. Show the exact test that now fails and passes, using pseudocode.

### Risk

**Undo** says what reverting costs. Most PRs are undone by reverting them; say "easy". A data migration, a published version, a sent message or a deleted record survive a revert; say what stays behind.

**Reaches** names what can break outside the diff: consumers of a changed export, pages sharing a changed component, layout at other widths, a changed default. Name the worst one first.

### Try it

The script a person, or the `prove-it` skill, follows to see the change work. Write it for someone who has never seen the diff.

- One numbered step per behaviour the PR changes: a start state, one action, and what they should see. "Open `/` in the playground → read the heading → it says `Oz playground`", not "check the homepage works".
- Start from the project's `docs/agents/run-the-app.md` (how to bring the app up) and reuse the **Try it** steps of every `docs/feature-map.md` entry and closed ticket the diff touches.
- Cover what users see first, then what only the diff's edges reach: the empty state, the error, the second click.
- A change no person can observe (a type, a guard, a build rule) gets one step that runs the command which shows it, and its expected output.

Done when every behaviour in What changes has a step whose expected result could fail.

### Calls made for you

Calls an agent made where the user would normally decide, each with its reason, so the user reviews them in one place. Omit the section when there are none.
