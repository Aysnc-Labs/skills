#!/bin/bash
# Setup script for a Claude Code cloud environment: paste this file's contents into the environment's
# "Setup script" field on claude.ai/code. It runs as root when the environment's cache is built (first
# session, a change to this script or the network list, or about every 7 days), after the repositories
# are cloned side by side into the folder it starts in, so it installs tools only: nothing here may
# leave a process running. The SessionStart hook (session-start.sh) prepares the clone itself.
#
# Network access: the default list, plus {{extra hosts, e.g. cdn.playwright.dev and
# playwright.download.prss.microsoft.com for Chromium}}. Repositories: {{this repository}} and
# Aysnc-Labs/skills.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
here=$PWD
repo=$here/{{this repository, as cloned: its folder name}}

# The Aysnc Skills plugin. Cloud sessions install no plugins, but a folder with .claude-plugin/plugin.json
# under ~/.claude/skills loads as one (aysnc-skills@skills-dir), prefix and agents included. A link, not a
# copy: the platform updates the checkout when it reuses a cached environment, and the link follows it.
if [ -f "$here/skills/.claude-plugin/plugin.json" ]; then
  mkdir -p "$HOME/.claude/skills"
  rm -rf "$HOME/.claude/skills/aysnc" "$HOME/.claude/skills/aysnc-skills"
  ln -s "$here/skills" "$HOME/.claude/skills/aysnc-skills"
else
  echo "The Aysnc Skills plugin did not install: add Aysnc-Labs/skills to the environment's repositories"
fi

# {{language toolchain, linked into ~/.local/bin, which comes before the image's own Node on PATH}}
# {{browser system libraries, e.g. npx -y playwright@1 install-deps chromium}}

# A session with several repositories loads no repository's hooks or permission rules, so this
# repository's go in the VM's user settings: its SessionStart hook pointed at this checkout, and its
# denies with ./ paths anchored by **, since a relative path here resolves against the folder above
# the clones.
REPO=$repo node - <<'EOF'
const fs = require('node:fs');
const { REPO, HOME } = process.env;
const project = JSON.parse(fs.readFileSync(`${REPO}/.claude/settings.json`, 'utf8'));
const file = `${HOME}/.claude/settings.json`;
const user = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
user.hooks ??= {};
for (const [event, entries] of Object.entries(project.hooks ?? {})) {
  const ours = JSON.parse(JSON.stringify(entries).replaceAll('$CLAUDE_PROJECT_DIR', REPO));
  user.hooks[event] = [...(user.hooks[event] ?? []).filter((h) => !JSON.stringify(h).includes(REPO)), ...ours];
}
const deny = (project.permissions?.deny ?? []).map((rule) => rule.replace(/^(\w+)\((!?)\.\//, '$1($2**/'));
user.permissions ??= {};
user.permissions.deny = [...new Set([...(user.permissions.deny ?? []), ...deny])];
fs.mkdirSync(`${HOME}/.claude`, { recursive: true });
fs.writeFileSync(file, `${JSON.stringify(user, null, 2)}\n`);
EOF
