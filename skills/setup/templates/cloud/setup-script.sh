#!/bin/bash
# Setup script for a Claude Code cloud environment: paste this file's contents into the
# environment's "Setup script" field on claude.ai/code. It runs as root when a session's container is
# built fresh, after the repositories are cloned, so it installs tools only: nothing here may leave a
# process running. A session the platform starts in a reused container skips it ("resume-cached" in
# /tmp/env-manager.log), so anything that must hold every session lives in the SessionStart hook
# (session-start.sh), which this script registers.
#
# Network access: the default list, plus {{extra hosts, e.g. cdn.playwright.dev and
# playwright.download.prss.microsoft.com for Chromium}}. The environment's repositories are
# {{owner/repo}} and Aysnc-Labs/skills, which the session clones side by side into the folder this
# script starts in.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
here=$PWD

# {{language toolchain, e.g. Node at package.json#engines and pnpm at package.json#packageManager.
# The image's own Node and pnpm sit in /opt/node22/bin, earlier on PATH than /usr/bin and later than
# ~/.local/bin, so link what you install into ~/.local/bin: an image pnpm 10 left first on PATH downloads
# the pinned pnpm itself and leaves it broken.}}
# {{browser system libraries, e.g. npx -y playwright@1 install-deps chromium}}

# The Aysnc skills and agents, linked from the Aysnc-Labs/skills checkout (the hook relinks them each
# session). A token does not reach the private repository from here, so it must be one of the
# environment's repositories.
if [ -d "$here/skills/skills" ] && [ -f "$here/{{repo}}/.sandbox/claude-cloud/link-skills.sh" ]; then
  bash "$here/{{repo}}/.sandbox/claude-cloud/link-skills.sh" "$here/skills"
else
  echo "The Aysnc skills did not install: add Aysnc-Labs/skills to the environment's repositories"
fi

# A session with several repositories has the folder that holds them as its project directory, so it
# loads no repository's .claude/settings.json: no SessionStart hook, no deny rules. User settings load
# whatever the project directory, so the hook and the push rules go there too.
if [ -f "$here/{{repo}}/.sandbox/claude-cloud/session-start.sh" ]; then
  HOOK="bash '$here/{{repo}}/.sandbox/claude-cloud/session-start.sh'" node - <<'EOF'
const fs = require('node:fs');
const file = `${process.env.HOME}/.claude/settings.json`;
const settings = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const hook = { matcher: 'startup|resume', hooks: [{ type: 'command', command: process.env.HOOK, timeout: 120 }] };
settings.hooks ??= {};
settings.hooks.SessionStart = (settings.hooks.SessionStart ?? []).filter((h) => !JSON.stringify(h).includes('session-start.sh'));
settings.hooks.SessionStart.push(hook);
const deny = ['git push --force*', 'git push * --force*', 'git push -f*', 'git push * -f*', 'git push * main', 'git push * *:main*'];
settings.permissions ??= {};
settings.permissions.deny = [...new Set([...(settings.permissions.deny ?? []), ...deny.map((d) => `Bash(${d})`)])];
fs.mkdirSync(`${process.env.HOME}/.claude`, { recursive: true });
fs.writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`);
EOF
fi
