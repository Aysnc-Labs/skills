#!/usr/bin/env bash
# SessionStart hook for Claude Code cloud sessions. Does nothing on a laptop. It runs on every start and
# resume, including in a container the platform reused from an earlier session, where the setup script
# does not run again. So it:
#   - links the Aysnc skills and agents from the Aysnc-Labs/skills checkout next to this one;
#   - repairs pnpm when its self-managed copy was left as an uninstalled placeholder;
#   - prepares this clone in the background, so the session starts at once. A cloud VM keeps files but
#     not processes, so a resume after it finished only restarts services.
#
# Two settings files can run it: this repo's .claude/settings.json, when the session's project directory
# is this checkout, and the user settings the setup script writes, when the session has several
# repositories and its project directory is the folder that holds them (which loads no repo's settings).
[ "${CLAUDE_CODE_REMOTE:-}" = true ] || exit 0
repo=$(cd "$(dirname "$0")/../.." && pwd) || exit 0
cd "$repo" || exit 0

state=/tmp/project-up
mkdir -p "$state"
log=$state/up.log done=$state/up.done failed=$state/up.failed pid=$state/up.pid

# Both settings files may run this at once; the second leaves it to the first.
exec 9>"$state/lock"
flock -n 9 || exit 0

[ -d ../skills/skills ] && bash .sandbox/claude-cloud/link-skills.sh ../skills >/dev/null 2>&1

# {{drop this loop when the project does not use pnpm}}
# pnpm 10+ installs the packageManager version itself, without running the install step that puts its
# native binary in place, which leaves a shell placeholder that fails with "Exec format error".
for dir in "$HOME"/.local/share/pnpm/.tools/pnpm/*/node_modules/pnpm; do
  [ -f "$dir/install.js" ] && [ "$(head -c 4 "$dir/pnpm" 2>/dev/null)" != $'\x7fELF' ] && (cd "$dir" && node install.js) >/dev/null 2>&1
done

if [ -f "$done" ]; then
  # {{restart long-running services here, if the project has any}}
  exit 0
fi

# A resume while the first run is still going leaves it be.
if ! { [ -f "$pid" ] && kill -0 "$(cat "$pid")" 2>/dev/null; }; then
  rm -f "$failed"
  setsid nohup bash -c "{ {{fresh-clone commands, e.g. pnpm install --frozen-lockfile && pnpm build}}; } && touch $done || touch $failed" >"$log" 2>&1 </dev/null 9>&- &
  echo $! >"$pid"
fi

echo "Preparing $repo in the background, logging to $log. Ready when $done exists, failed when $failed does (the log says where). Wait for one before running tests or the app. Aysnc skills are user skills here: /prove-it, not /aysnc:prove-it."
