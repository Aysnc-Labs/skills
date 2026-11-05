// Run: node --test scripts/check-feature-map.test.ts
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { check, MAP } from './check-feature-map.ts';

const tracked = ['packages/core/src/index.ts', 'packages/ui/src/index.ts', 'GLOSSARY.md', MAP];

function repo(map: string): string {
  const root = mkdtempSync(join(tmpdir(), 'feature-map-'));
  mkdirSync(join(root, 'docs'));
  writeFileSync(join(root, MAP), map);
  return root;
}

const entry = (name: string, path: string) => `### ${name}

What: ${name} does a thing.
Paths: \`${path}\`
Try it:
1. Open it → click it → it works
`;

const good = `# Feature map

Words: [GLOSSARY.md](../GLOSSARY.md)

Coverage: \`packages/*\`

## Area

${entry('Core', 'packages/core')}
${entry('UI', 'packages/ui/src')}`;

test('a complete map passes and counts features and covered folders', () => {
  const { errors, summary } = check(repo(good), tracked);
  assert.deepEqual(errors, []);
  assert.equal(summary, 'feature map: 2 features, 2 covered folders');
});

test('a folder under Coverage that no feature lists fails, naming the folder', () => {
  const { errors } = check(repo(good.replace(entry('UI', 'packages/ui/src'), '')), tracked);
  assert.deepEqual(errors, [`${MAP}: packages/ui (Coverage packages/*) is listed by no feature`]);
});

test('an untracked path fails', () => {
  const { errors } = check(repo(good.replace('`packages/core`', '`packages/gone`')), tracked);
  assert.ok(errors.some((e) => e.includes('path packages/gone is not tracked by git')));
});

test('an entry without Try it steps fails', () => {
  const { errors } = check(repo(good.replace('1. Open it → click it → it works\n', '')), tracked);
  assert.ok(errors.some((e) => e.endsWith('Core: missing "Try it:" with at least one numbered step')));
});

test('a dead relative link fails', () => {
  const { errors } = check(repo(good.replace('../GLOSSARY.md', '../NOPE.md')), tracked);
  assert.ok(errors.some((e) => e.includes('link ../NOPE.md does not resolve')));
});

test('a missing map fails', () => {
  const root = mkdtempSync(join(tmpdir(), 'feature-map-'));
  assert.deepEqual(check(root, []).errors, [`${MAP} is missing`]);
});
