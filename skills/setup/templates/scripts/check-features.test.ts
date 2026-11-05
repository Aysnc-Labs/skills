// Run: node --test scripts/check-features.test.ts
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { check, DIR } from './check-features.ts';

const tracked = ['packages/core/src/index.ts', 'docs/agents/run-the-app.md'];

const feature = (name: string) => `# ${name}

${name} lets a user do a thing.

## Parts

- \`open\`: opens it

## Reach it

- Choose the \`${name}\` button

## Try it

Start:

- The app is up.

1. **Open.** Choose \`${name}\` → a panel titled \`${name}\` appears.

## Traps

- None known yet.
`;

const readme = (...names: string[]) => `# Features

See [run-the-app.md](../agents/run-the-app.md).

## Features

${names.map((n) => `- [${n}](${n}.md): covers ${n}`).join('\n')}
`;

function repo(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'features-'));
  mkdirSync(join(root, DIR), { recursive: true });
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  writeFileSync(join(root, 'docs/agents/run-the-app.md'), '');
  for (const [name, text] of Object.entries(files)) writeFileSync(join(root, DIR, name), text);
  return root;
}

test('a complete folder passes', () => {
  const { errors, summary } = check(repo({ 'README.md': readme('search', 'save'), 'search.md': feature('search'), 'save.md': feature('save') }), tracked);
  assert.deepEqual(errors, []);
  assert.equal(summary, 'features: 2 files, all listed and in shape');
});

test('a feature file missing from the index fails', () => {
  const { errors } = check(repo({ 'README.md': readme('search'), 'search.md': feature('search'), 'save.md': feature('save') }), tracked);
  assert.deepEqual(errors, [`${DIR}/README.md: save.md is missing from "## Features"`]);
});

test('an indexed file that does not exist fails', () => {
  const { errors } = check(repo({ 'README.md': readme('search', 'gone'), 'search.md': feature('search') }), tracked);
  assert.ok(errors.some((e) => e.includes('link gone.md does not resolve')));
});

test('a repo path in a feature fails', () => {
  const text = feature('search').replace('- None known yet.', '- Lives in `packages/core/src/index.ts`.');
  const { errors } = check(repo({ 'README.md': readme('search'), 'search.md': text }), tracked);
  assert.ok(errors.some((e) => e.endsWith('names the repo path packages/core/src/index.ts; say what the user touches instead')));
});

test('a route or command in backticks is fine', () => {
  const text = feature('search').replace('- None known yet.', '- Open `/search?q=x` or run `pnpm search`.');
  assert.deepEqual(check(repo({ 'README.md': readme('search'), 'search.md': text }), tracked).errors, []);
});

test('sections out of order fail', () => {
  const text = feature('search').replace('## Parts', '## Traps0').replace('## Traps\n', '## Parts\n').replace('## Traps0', '## Traps');
  const { errors } = check(repo({ 'README.md': readme('search'), 'search.md': text }), tracked);
  assert.ok(errors.some((e) => e.includes('sections must be exactly')));
});

test('Try it without a step fails', () => {
  const text = feature('search').replace(/1\. \*\*Open\.\*\*.*\n/, '');
  const { errors } = check(repo({ 'README.md': readme('search'), 'search.md': text }), tracked);
  assert.ok(errors.some((e) => e.endsWith('"Try it" needs at least one numbered step')));
});
