# Run the app

How an agent, or you, brings {{Project}} up to try a change: on a laptop, and in a Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`). The `walkthrough` and `prove-it` skills read this file, so every command here must work as written.

## Bring it up

{{The commands from a fresh clone to a usable app, in order. Name the port, and the log line or URL that proves it is ready, not just running.}}

## Prove it is the PR's code

{{One check that only the branch under test passes: a string the diff adds, a route it creates, a build ID.}}

## Data

{{Where test data comes from, how to reset it, and which accounts exist.}}

## Drive it

{{The browser to use (Claude in Chrome on a laptop, Playwright in the cloud), the URLs worth knowing, and the commands that show what a browser cannot.}}

## Tear it down

{{How to stop only what you started. Kill by PID or port you recorded, never by process name.}}

## Cloud

{{What differs in a cloud session: what the SessionStart hook already started, where its log is, and what never runs there.}}
