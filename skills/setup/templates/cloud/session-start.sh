#!/usr/bin/env bash
# SessionStart hook (.claude/settings.json) for Claude Code cloud sessions. Prepares a fresh clone in
# the background so the session starts at once, and only restarts services on a resume, since a cloud
# VM keeps files but not processes. Does nothing on a laptop.
#
# With several repositories the setup script registers it in the VM's user settings, where
# $CLAUDE_PROJECT_DIR is the folder above the clones, so it finds its own checkout instead.
[ "${CLAUDE_CODE_REMOTE:-}" = true ] || exit 0
cd "$(dirname "$0")/../.." || exit 0

state=/tmp/project-up
mkdir -p "$state"
log=$state/up.log done=$state/up.done failed=$state/up.failed pid=$state/up.pid

if [ -f "$done" ]; then
  # {{restart long-running services here, if the project has any}}
  exit 0
fi

# A resume while the first run is still going leaves it be.
if ! { [ -f "$pid" ] && kill -0 "$(cat "$pid")" 2>/dev/null; }; then
  rm -f "$failed"
  setsid nohup bash -c "{ {{fresh-clone commands, e.g. pnpm install --frozen-lockfile && pnpm build}}; } && touch $done || touch $failed" >"$log" 2>&1 </dev/null &
  echo $! >"$pid"
fi

echo "Preparing this clone in the background, logging to $log. Ready when $done exists, failed when $failed does (the log says where). Wait for one before running tests or the app."
