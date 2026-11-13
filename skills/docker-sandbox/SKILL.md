---
name: docker-sandbox
description: "Load before any `sbx` command: Docker Sandboxes, Linux microVMs on a Mac or in Docker's cloud."
---

`sbx` runs each sandbox as a Linux microVM with its own Docker Engine. What follows is what `sbx --help` does not tell you. Checked against sbx 0.47.

## Create

- `sbx create --clone --name <task> shell .` is the default. `shell` is the agent-less sandbox. Name every sandbox for its task: the default name, `<agent>-<folder>`, collides across worktrees and parallel agents.
- `--clone` gives the sandbox a private clone of the repo's **commits**. Uncommitted and untracked work stays behind: commit first. The host checkout is mounted read-only at `/run/sandbox/source`, so nothing inside can touch it.
- Without `--clone`, `.` is bind-mounted read-write: every install and build inside writes Linux files into the host checkout, breaking the Mac's native modules and a running dev server.
- The clone sits at the same absolute path as on the host, so paths carry over unchanged.

## Run

- Run with `sbx exec <task> bash -lc '<command>'`. The `agent` user has `sudo`, for installing a toolchain.
- Git has no name or email inside: commit with `git -c user.name=<n> -c user.email=<e> commit`. In a clone, `origin` is the host checkout, so `git fetch origin` brings the host's latest commits.
- Local sandboxes run the host's architecture: ARM on Apple Silicon, where CI runners are x86. An x86-only failure may not reproduce, and `--platform` works only in the cloud.

## Network

Traffic goes through the host's proxy, under policies that differ per Mac: `sbx policy ls` shows what this one allows.

The host's SSH identity reaches the sandbox: whatever runs inside can push to GitHub as the user. Fence a sandbox running untrusted work with `sbx policy deny network --sandbox <task>`.

## Commits back

`create --clone` adds a `sandbox-<task>` remote to the host repo. `git fetch sandbox-<task>` brings the sandbox's branches over as `sandbox-<task>/<branch>`.

## Remove

`sbx rm --force <task>`: without `--force` it waits for a confirmation nobody gives. It also removes the `sandbox-<task>` remote and the branches fetched from it, so fetch or push what you want to keep first. `sbx ls` shows leftovers; `sbx stop` keeps a sandbox and its work.
