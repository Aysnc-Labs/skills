#!/bin/bash
# Setup script for a Claude Code cloud environment: paste this file's contents into the environment's
# "Setup script" field on claude.ai/code. It runs as root when the environment's cache is built (first
# session, a change to this script or the network list, or about every 7 days), after the repository is
# cloned, so it installs tools only: nothing here may leave a process running. The SessionStart hook
# (session-start.sh) prepares the clone itself.
#
# Network access: the default list (which has github.com), plus {{extra hosts, e.g. cdn.playwright.dev
# and playwright.download.prss.microsoft.com for Chromium}}. Repository: {{this repository}}.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
# The script starts in the folder the repository is cloned into, or in the clone itself.
repo=$PWD/{{this repository, as cloned: its folder name}}
[ -d "$repo" ] || repo=$PWD

# The Aysnc Skills plugin. Cloud sessions install no plugins, but a folder with .claude-plugin/plugin.json
# under ~/.claude/skills loads as one (aysnc-skills@skills-dir), prefix and agents included. The
# repository is public, so a plain clone reaches it; the SessionStart hook refreshes it, since a reused
# cache can be days old. The old aysnc link goes too, so the plugin loads once.
mkdir -p "$HOME/.claude/skills"
rm -rf "$HOME/.claude/skills/aysnc" "$HOME/.claude/skills/aysnc-skills"
git clone --quiet --depth 1 https://github.com/Aysnc-Labs/skills.git "$HOME/.claude/skills/aysnc-skills"

# {{language toolchain, linked into ~/.local/bin, which comes before the image's own Node on PATH}}
# {{browser system libraries, e.g. npx -y playwright@1 install-deps chromium}}
