# Skill mechanics

The skill branch of [`pocock-this`](SKILL.md): what changes when the target is a skill.

## Invocation

- **Model-invoked**: keeps a `description`, so the agent and other skills can fire it. The description is an always-loaded pointer: permanent context load bought for discoverability. Write it with the pointer rules in `SKILL.md`.
- **User-invoked**: `disable-model-invocation: true`. Zero context load; the human is the index. The description becomes a one-line human summary, triggers stripped.

Pick model-invoked only when the agent, or another skill, must reach it unprompted.

## Splitting

Every split spends load: context for a new description, cognitive for a new name to remember. Split only when the cut earns it:

- **By sequence**: where visible later steps tempt the agent to rush the current one. The cut must cross a real context boundary.
- **By invocation**: split off a model-invoked skill only for a distinct trigger word you actually use, or when another skill must reach it.

## Composition

- A **wrapper** ("Call the Skill tool with 'grilling'.") gives a user-invoked name to a model-invoked primitive.
- Reference two user-invoked skills both need lives in neither: put it in a plain file both point at.
- A **router skill** is one user-invoked skill naming the others and when to reach for each, once there are too many to remember.
