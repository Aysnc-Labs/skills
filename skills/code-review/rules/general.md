# General rules

## 1. Fix upstream

When the behaviour belongs to a shared package, fix it in the package.

**Breach:** project code that patches, wraps or copies a shared package, or edits its installed copy.

## 2. Reuse before you build

Use or extend the existing block, control or component.

**Breach:** a new one that does what an existing one does.

## 3. Global lessons live in the skills

A lesson every project needs goes into the skills; only a project-only decision becomes a project doc.

**Breach:** a project doc holding a global lesson. A link to a skills PR does not clear it.

## 4. No sediment, no cargo cult

Agents copy what they see, so every comment and doc line earns its place on its own. Edit the current fact or delete it.

**Breach:** evidence, history, one-off steps, a copy of what code or a command shows, or a repeat; flag any bad example it copied too.

## 5. Runbooks are rare

A runbook is only for a procedure that leaves the repo (an outside dashboard, a person, money).

**Breach:** a runbook for steps inside the repo, or holding more than one procedure.

## 6. Every branch has its seed case

When code behaves differently depending on the data, the change adds a seed case for each situation, so every fresh instance shows it. Only in projects that keep a seed.

**Breach:** a new branch on a content type, field, choice or status, or a fix for a bug the shape of data caused, with no seed case in the diff.

## 7. Long-standing docs name no specs or tickets

A spec or ticket is finished work; `AGENTS.md`, `CLAUDE.md`, READMEs, the code map, skills and code comments outlive it, and an agent that follows the reference reads stale context. Say the fact itself. The issue tracker doc, whose job is the tracker, is the exception.

**Breach:** a spec, ticket or plan-issue reference (a number, an `[NN-MM]` id, "lands in spec 3") in one of those files.
