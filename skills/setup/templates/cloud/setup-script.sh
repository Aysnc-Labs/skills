#!/bin/bash
# Setup script for a Claude Code cloud environment: paste this file's contents into the environment's
# "Setup script" field on claude.ai/code. It runs as root once per cached VM snapshot, so it installs
# tools only: nothing here may depend on the clone or leave a process running. The SessionStart hook
# (session-start.sh) prepares the clone itself.
#
# Network access: the default list, plus {{extra hosts, e.g. cdn.playwright.dev and
# playwright.download.prss.microsoft.com for Chromium}}.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

# The Aysnc skills: cloud sessions install no plugins, so they go where Claude Code reads user skills
# and agents. The repository is private, so the environment needs access to Aysnc-Labs/skills.
(
  skills=$(mktemp -d)
  git clone -q --depth 1 https://github.com/Aysnc-Labs/skills.git "$skills"
  mkdir -p "$HOME/.claude/skills" "$HOME/.claude/agents"
  for skill in "$skills"/skills/*/; do
    skill=${skill%/}
    rm -rf "$HOME/.claude/skills/${skill##*/}"
    cp -R "$skill" "$HOME/.claude/skills/"
  done
  cp "$skills"/agents/*.md "$HOME/.claude/agents/"
  rm -rf "$skills"
) || echo "The Aysnc skills did not install: check the environment can reach Aysnc-Labs/skills"

# {{language toolchain, e.g. corepack enable && corepack prepare pnpm@<version> --activate}}
# {{browser system libraries, e.g. npx -y playwright@1 install-deps chromium}}
