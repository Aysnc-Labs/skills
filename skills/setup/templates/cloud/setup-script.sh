#!/bin/bash
# Setup script for a Claude Code cloud environment: paste this file's contents into the environment's
# "Setup script" field on claude.ai/code. It runs as root when a session's container is built fresh,
# after the repositories are cloned, so it installs tools only: nothing here may leave a process
# running. The SessionStart hook (session-start.sh) prepares the clone itself.
#
# Network access: the default list, plus {{extra hosts, e.g. cdn.playwright.dev and
# playwright.download.prss.microsoft.com for Chromium}}.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

# The Aysnc skills: cloud sessions install no plugins, so they go where Claude Code reads user skills
# and agents. The environment has Aysnc-Labs/skills as a repository, so the session clones it next to
# this one before the script runs (the script starts in the folder that holds both). A token does not
# reach a private repository from here, so cloning it is only the fallback.
(
  src=skills
  if [ ! -d "$src/skills" ]; then
    src=$(mktemp -d)
    git clone -q --depth 1 https://github.com/Aysnc-Labs/skills.git "$src"
  fi
  mkdir -p "$HOME/.claude/skills" "$HOME/.claude/agents"
  for skill in "$src"/skills/*/; do
    skill=${skill%/}
    rm -rf "$HOME/.claude/skills/${skill##*/}"
    cp -R "$skill" "$HOME/.claude/skills/"
  done
  if [ -d "$src/agents" ]; then cp "$src"/agents/*.md "$HOME/.claude/agents/"; fi
) || echo "The Aysnc skills did not install: add Aysnc-Labs/skills to the environment's repositories"

# {{language toolchain, e.g. corepack enable && corepack prepare pnpm@<version> --activate}}
# {{browser system libraries, e.g. npx -y playwright@1 install-deps chromium}}
