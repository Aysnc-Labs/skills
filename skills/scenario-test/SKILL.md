---
name: scenario-test
description: "Scenario test a domain term or a design: walk concrete stories through it to find where it breaks. Use when the user says scenario test, or a term or design needs stress-testing."
---

A **scenario** is a concrete story of someone using the target. Walk it until it holds or breaks. (Cem Kaner.)

## 1. Hear the life history

Ask the user _open_, with no recommendation: "Take me through an order from checkout to the customer's door." Their world is the truth; the glossary, ADRs and code show only what exists today.

Done when you hold their story and every gap between it and the glossary or code is listed.

## 2. Find scenarios

Try every lens:

- **Life history**: every stage and path (paid, packed, shipped, cancelled, returned).
- **Users**: each kind, and what they want.
- **Disfavoured users**: who abuses it, and how.
- **Events**: each one, then _twice_ and two _at once_.
- **Special events**: rare but predictable: year-end, migration, empty state.
- **Neighbours**: where the term stops (Refund against Return, store credit, chargeback).

Exaggerate the strongest into _soap operas_ (Hans Buwalda). Keep each _credible_ and _easy to evaluate_.

Done when every lens has a scenario or a reason it has none, and the user has given the list their go.

## 3. Walk them

Name where each step lands. A step beyond the design is **outside**: name its owner.

Done when every scenario holds, breaks at a named step, or is outside.

## 4. Record each break

- Term: through `domain-modeling`.
- Rule the build must honour: a **spec case** for `to-spec`.

Done when every break is recorded, or left with the user's agreement.

## 5. Report

```markdown
| Scenario | Lens | Result | Recorded in |
| -------- | ---- | ------ | ----------- |
| <one line> | <lens> | holds / breaks at <step> / outside: <owner> | <glossary, ADR, spec case> |
```
