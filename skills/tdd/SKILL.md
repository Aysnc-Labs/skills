---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

Call the Skill tool with `aysnc-skills:engineering` before you start.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

A seam the spec or ticket already names (a "Testing Decisions" section, a ticket's Verify line) is pre-agreed: write it down and start. Ask only about a seam nothing names. In an AFK run nobody answers, so pick the lowest test kind that proves the behaviour and the highest existing seam within it (see Test kinds), and record the choice in your Report.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), call the Skill tool with "codebase-design" for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Test kinds

Every test is one of three **kinds**, each run by its own command in the project's `AGENTS.md`:

- **`test`**: through a public interface, in process. The default.
- **`e2e`**: only what a real browser or the real framework runtime shows (rendering, routing, a request through the real server).
- **`check`**: the gate's own rules (a lint rule, a checker), proven by a fixture that breaks the rule on purpose.

**Lowest kind, then highest seam.** Kind and seam are two separate axes, chosen in that order. First the kind: the lowest that proves the behaviour, so `test` unless only a browser or the framework runtime can show it. Then the seam, within that kind: the highest public interface that shows the behaviour, so the test survives refactors beneath it. A `test` at a package's public entry is both at once: low on kind, high on seam.

**Speed is the reason.** Agents copy the nearest test. One `e2e` test where a `test` would do becomes the pattern every later agent follows, and the suite slows with each copy. Keep each test inside the project's speed budget when it sets one.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Hollow**: the test would still pass if every import returned `undefined`: it asserts only on mocks, or only that nothing threw. Assert on real output, or delete it.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage (see the `code-review` skill), not the red → green implementation cycle.
