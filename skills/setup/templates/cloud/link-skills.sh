#!/usr/bin/env bash
# Links the Aysnc skills and agents from an Aysnc-Labs/skills checkout into ~/.claude, where Claude Code
# reads user skills and agents (cloud sessions install no plugins). Links, not copies: the platform
# updates the checkout when it reuses a container, which never reruns the setup script, so a copy goes
# stale and a link does not. Skills and agents load at session start, so a new one shows up next session.
#
#   link-skills.sh <skills checkout>
#
# Touches only names the checkout has, plus links into it that it no longer has; the platform's own
# skills in ~/.claude/skills stay. In cloud, user skills have no plugin prefix: /prove-it, not
# /aysnc:prove-it.
set -euo pipefail
src=$(cd "${1:?usage: link-skills.sh <skills checkout>}" && pwd)
[ -d "$src/skills" ] || { echo "no skills/ in $src" >&2; exit 1; }
mkdir -p "$HOME/.claude/skills" "$HOME/.claude/agents"

for dir in "$src"/skills/*/; do
  dir=${dir%/}
  dest="$HOME/.claude/skills/${dir##*/}"
  [ "$(readlink "$dest" 2>/dev/null)" = "$dir" ] && continue
  rm -rf "$dest"
  ln -s "$dir" "$dest"
done
for file in "$src"/agents/*.md; do
  [ -e "$file" ] || continue
  ln -sfn "$file" "$HOME/.claude/agents/${file##*/}"
done

# Links left behind by a skill or agent the checkout dropped.
for link in "$HOME"/.claude/skills/* "$HOME"/.claude/agents/*; do
  [ -L "$link" ] || continue
  case "$(readlink "$link")" in "$src"/*) [ -e "$link" ] || rm -f "$link" ;; esac
done
