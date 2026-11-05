# Features

What {{Project}} does, from the point of view of the people who use it, and how to see each feature work. PRs build their **Try it** steps from these files, and `prove-it` drives them. `node scripts/check-features.ts` checks their shape on every push.

Only what a user touches and sees belongs here: where they start, what they do, what they see. Where the code lives is a search away and goes stale here; rules belong in `CODING_STANDARDS.md`, decisions in `docs/adr/`.

## Before any feature

- Bring the app up as [run-the-app.md](../agents/run-the-app.md) says, and prove it serves the branch under test.
- {{The state every feature starts from: seed data, accounts, an empty data folder.}}

## Driving

- Find things the way a user does: by role and visible name (`button "Save"`), by route, by command. Never by CSS class or position.
- Copy commands and names exactly as written.
- Put back any data a step changes; keep the screenshots and output.

## Proof

- Capture the action and the state it leads to, not only the last screen.
- A change to stored data is proven by reading it back from a second place: reload, another page, the API.
- A path you could not reach is reported with what you tried and what was missing, never as passed through another path.

## Features

<!-- One line per file in this folder, in reading order: [Name](file.md) and what it covers. The check fails on a file missing from this list, and on a link to a file that does not exist. -->

- [{{Feature}}]({{feature}}.md): {{what it covers}}
