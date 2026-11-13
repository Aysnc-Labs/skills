#!/bin/bash
# Claude Code cloud setup script: paste into the environment's "Setup script" field on claude.ai/code.
# Runs as root when the environment's cache is built (first session, a change to this script or the
# network list, or about every 7 days). Installs tools only, and leaves no process running:
# session-start.sh prepares the clone.
# Network access: the default list (which has github.com), plus mise.run, mise-versions.jdx.dev and
# nodejs.org{{, extra hosts the toolchain needs}}. Repository: {{this repository}}.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
# The script starts in the folder the repository is cloned into, or in the clone itself.
repo=$PWD/{{this repository, as cloned: its folder name}}
[ -d "$repo" ] || repo=$PWD

# The Aysnc Skills plugin. Cloud sessions install no plugins, but a folder with .claude-plugin/plugin.json
# under ~/.claude/skills loads as one. session-start.sh refreshes it; the old aysnc link goes, so it loads once.
mkdir -p "$HOME/.claude/skills"
rm -rf "$HOME/.claude/skills/aysnc" "$HOME/.claude/skills/aysnc-skills"
git clone --quiet --depth 1 https://github.com/Aysnc-Labs/skills.git "$HOME/.claude/skills/aysnc-skills"

# The toolchain the repository's mise.toml pins, plus agent-browser, which drives the image's own Chrome.
curl -fsSL https://mise.run | sh
export PATH=$HOME/.local/bin:$PATH
cd "$repo"
mise trust --yes
mise install
mise use -g agent-browser

# On PATH through ~/.local/bin, ahead of the image's own Node. Exec scripts: mise's npm finds npm-cli.js by its own path.
for bin in node npm npx agent-browser; do
  path=$(mise which "$bin")
  printf '#!/bin/sh\nexec "%s" "$@"\n' "$path" >"$HOME/.local/bin/$bin"
  chmod +x "$HOME/.local/bin/$bin"
done
