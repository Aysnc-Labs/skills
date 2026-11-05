// Run: node --test scripts/check-feature-map.test.ts
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { check } from './check-feature-map.ts';

const MAP = '.claude/skills/verify-notes/features';
const tracked = ['packages/core/src/index.ts'];

// create-verification-skill's worked example, next to the skill in the Aysnc skills repository.
// A project that copies this test has no example, so those cases skip and FIXTURE stands in.
const example = join(dirname(fileURLToPath(import.meta.url)), '../../../create-verification-skill/references/feature-map-example');

const FIXTURE: Record<string, string> = {
  'README.md': `# Notes verification map

## Features

- [Create a note](./create-note.md) covers creation.
`,
  'create-note.md': `# Create a note

Create note lets a user save a titled note.

## Sub-features

- \`create-save\` persists a title and body.

## How to get to it (user POV)

- Choose the \`New note\` button in the browser toolbar.

## Driving it with control-notes

Preconditions:

- Notes is healthy at \`http://127.0.0.1:4173\`.

- **Save note.** Choose \`Save note\`. A status named \`Note saved\` appears.

## Gotchas

- Titles are trimmed on save.
`,
};

function repo(edit?: (files: Record<string, string>) => void): string {
  const root = mkdtempSync(join(tmpdir(), 'feature-map-'));
  const dir = join(root, MAP);
  mkdirSync(dir, { recursive: true });
  const files = { ...FIXTURE };
  edit?.(files);
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
  return root;
}

test("create-verification-skill's own worked example passes", { skip: !existsSync(example) }, () => {
  const root = mkdtempSync(join(tmpdir(), 'feature-map-'));
  cpSync(example, join(root, MAP), { recursive: true });
  const { errors, summary } = check(root, tracked);
  assert.deepEqual(errors, []);
  assert.equal(summary, 'feature map: 2 features in 1 map(s), all listed and in shape');
  rmSync(root, { recursive: true });
});

test('the fixture has the worked example’s sections', { skip: !existsSync(example) }, () => {
  const sections = (t: string) => t.split('\n').filter((l) => l.startsWith('## ')).map((l) => l.replace(/ with .*/, ' with'));
  assert.deepEqual(sections(FIXTURE['create-note.md'] ?? ''), sections(readFileSync(join(example, 'create-note.md'), 'utf8')));
});

test('a complete map passes', () => {
  assert.deepEqual(check(repo(), tracked).errors, []);
});

test('no verify skill fails, naming the skill that makes one', () => {
  const root = mkdtempSync(join(tmpdir(), 'feature-map-'));
  assert.match(check(root, tracked).errors[0] ?? '', /run \/aysnc:create-verification-skill/);
});

test('a feature file missing from the index fails', () => {
  const { errors } = check(repo((f) => { f['search.md'] = f['create-note.md'] ?? ''; }), tracked);
  assert.deepEqual(errors, [`${MAP}/README.md: search.md is missing from "## Features"`]);
});

test('a repo path in a feature fails', () => {
  const { errors } = check(repo((f) => { f['create-note.md'] += '- Lives in `packages/core/src/index.ts`.\n'; }), tracked);
  assert.ok(errors.some((e) => e.endsWith('names the repo path packages/core/src/index.ts; say what the user touches instead')));
});

test('a renamed section fails', () => {
  const { errors } = check(repo((f) => { f['create-note.md'] = (f['create-note.md'] ?? '').replace('## Gotchas', '## Traps'); }), tracked);
  assert.ok(errors.some((e) => e.includes('sections must be exactly')));
});

test('Driving it without Preconditions fails', () => {
  const { errors } = check(repo((f) => { f['create-note.md'] = (f['create-note.md'] ?? '').replace('Preconditions:\n', ''); }), tracked);
  assert.ok(errors.some((e) => e.endsWith('must start with "Preconditions:"')));
});
