---
name: pocock-this
description: Rewrite the thing I'm working on as if Matt Pocock wrote it.
argument-hint: "Optional: the file or passage to rewrite"
disable-model-invocation: true
---

Rewrite the **target** as Matt Pocock would: same intent, his levers, his voice. The goal is a _predictable process_ (the agent takes the same path every run), not identical output.

## 1. Pin the target

The argument if given, else the document this conversation is building (a skill, `CLAUDE.md`, `AGENTS.md`, a prompt, a doc). Two equally live candidates: ask which.

Read it in full, plus every file it points at. If it is a skill, also read [SKILL-MECHANICS.md](SKILL-MECHANICS.md).

Done when you can name the target and have read everything it reaches.

## 2. Rewrite

Work sentence by sentence, every lever on every sentence. If no sentence fails a lever, leave the target untouched and say so: a converged document is a valid result.

### Prune

- **No-op**: a sentence the model already obeys by default. The test: name the failure it prevents. Can't? Delete the whole sentence; trimming words leaves the no-op standing. A word too weak to beat the default (_be thorough_) is a no-op too: swap in a stronger one (_relentless_).
- **Cache**: a restatement of the environment (`package.json` scripts, config, directory layout, `--help`). Replace it with a pointer. Keep only what looking can't find: the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- **Single source of truth**: each meaning lives in one place. Where another skill already owns a behaviour, "Call the Skill tool with ..." replaces the restatement.
- **Sediment**: stale layers that settled because removing felt risky. Check each line against the current environment; stale ones go.

### Leading words

A **leading word** is a pretrained concept the agent thinks with: _tight_, _red_, _tracer bullet_, _seam_, _frontier_, _fog of war_. Hunt every triad spelled out and every sentence gesturing at one idea, and collapse each into its word; repeat the word as a token after, never the sentence. Name the source when one exists (Ousterhout, Feathers, DDD). Reach for an existing word before coining one: a coined word recruits no priors, so you pay for it in definition.

### Completion criteria

End every step on a **completion criterion**: "Done when ...". Make it _checkable_ (done is distinguishable from not-done) and _exhaustive_ ("every modified model accounted for", not "produce a change list"). A vague bound invites **premature completion**: sharpen the bound first. Split the sequence across a real context boundary (a handoff, a subagent) only when the bound is irreducibly fuzzy _and_ the rush is observed.

### Hierarchy

Content is **steps** (ordered actions) or **reference** (consulted on demand). Rank it: in-file steps, then in-file reference, then disclosed reference (a sibling file behind a pointer). Disclose by branch: inline what every branch needs, push behind a pointer what only some reach. Co-locate a concept's definition, rules, and caveats under one heading. **Sprawl** (too long even when every line is live) is cured on the ladder: disclose, and split by branch.

### Pointers

A **context pointer** (a skill description, an `AGENTS.md` line naming a doc) states what the material is and lists the branches that should reach it. Its wording, not its target, decides reach. Front-load the leading word, give one trigger per branch with synonyms collapsed, and cut identity the body already carries.

### Voice

- Imperative, second person; short declaratives joined by colons.
- **Bold** a term once, where it is defined; reuse it bare after.
- _Italics_ for the stressed word.
- British spelling (_behaviour_, _minimise_).
- Positive phrasing: state the target behaviour, so the banned one is never spoken. A prohibition drags the forbidden behaviour into context; keep one only as a hard guardrail, paired with its positive target.
- Fenced templates wherever output shape matters.

Done when every surviving sentence changes behaviour versus the default, every behaviour of the original survives or its removal is reported, and the rewrite is shorter than the original or you can say why it isn't.

## 3. Land it

Write the rewrite over the target in place, or reply with it if the target lives only in chat. Then report:

```markdown
| Change    | Before                  | After                   |
| --------- | ----------------------- | ----------------------- |
| Cut       | <sentence or behaviour> | -                       |
| Collapsed | <phrase>                | <leading word>          |
| Sharpened | <vague wording>         | <checkable wording>     |
| Disclosed | <material>              | <file it moved to>      |
```

Done when the target is written, or declared converged, and every change appears in the table.
