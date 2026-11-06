import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { findAgentTranscript, measure } from './metrics.ts';

const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second)).toISOString();
const use = (second: number, id: string, name: string, input: Record<string, unknown>) => ({
	type: 'assistant',
	timestamp: at(second),
	message: { id: `msg-${id}`, content: [{ type: 'tool_use', id, name, input }], usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 100, cache_creation_input_tokens: 20 } },
});
const result = (second: number, id: string, content: string, isError = false) => ({
	type: 'user',
	timestamp: at(second),
	message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: isError }] },
});

const transcript = [
	use(0, 's1', 'Skill', { skill: 'acme-skills:acme' }),
	result(1, 's1', 'Launching skill'),
	use(2, 'r1', 'Read', { file_path: 'a.ts' }),
	result(3, 'r1', 'contents'),
	use(4, 'b1', 'Bash', { command: 'pnpm test' }),
	result(34, 'b1', 'Tests failed\nexit code 1', true),
	use(35, 'e1', 'Edit', { file_path: 'a.ts' }),
	result(36, 'e1', 'ok'),
	use(37, 'b2', 'Bash', { command: 'pnpm test' }),
	result(47, 'b2', 'all passed'),
];

test('measures time, tool use, commands and failed test runs', () => {
	const metrics = measure(transcript);
	assert.equal(metrics.wallSeconds, 47);
	assert.equal(metrics.toolCalls, 5);
	assert.deepEqual(metrics.toolCounts, { Skill: 1, Read: 1, Bash: 2, Edit: 1 });
	assert.equal(metrics.toolCallsBeforeFirstEdit, 3);
	assert.equal(metrics.toolErrors, 1);
	assert.equal(metrics.failedTestRuns, 1);
	assert.deepEqual(metrics.slowestCommands[0], { command: 'pnpm test', seconds: 30 });
});

test('reports manifest skills the agent never loaded, matching short names', () => {
	const metrics = measure(transcript, ['acme', 'aysnc-skills:tdd']);
	assert.deepEqual(metrics.skillsLoaded, ['acme-skills:acme']);
	assert.deepEqual(metrics.missingSkills, ['aysnc-skills:tdd']);
});

test('counts tokens once per assistant message', () => {
	const duplicated = [...transcript, use(0, 's1', 'Skill', { skill: 'acme-skills:acme' })];
	assert.deepEqual(measure(duplicated).tokens, { input: 50, output: 25, cacheRead: 500, cacheCreate: 100 });
});

test('flags a command repeated three times or more', () => {
	const repeated = [0, 2, 4].flatMap((second, index) => [use(second, `x${index}`, 'Bash', { command: 'pnpm lint' }), result(second + 1, `x${index}`, 'ok')]);
	assert.deepEqual(measure(repeated).repeatedCommands, [{ command: 'pnpm lint', times: 3 }]);
});

test('counts only test-runner invocations as failed test runs', () => {
	const failing = (commands: string[]) => commands.flatMap((command, i) => [use(i * 2, `c${i}`, 'Bash', { command }), result(i * 2 + 1, `c${i}`, 'exit code 1', true)]);
	const runners = ['pnpm --dir cms test:php', 'npx vitest run a.test.ts', 'vendor/bin/phpunit', 'node --test x.test.ts', 'pnpm exec playwright test', 'pnpm --dir frontend test --run'];
	const others = ['test -f a.test.ts', 'cat src/a.test.ts', 'ls tests', 'grep -r "jest" .'];
	assert.equal(measure(failing(runners)).failedTestRuns, runners.length);
	assert.equal(measure(failing(others)).failedTestRuns, 0);
});

test('a Read of a SKILL.md loads that skill', () => {
	const lines = [use(0, 'r1', 'Read', { file_path: '/x/skills/tdd/SKILL.md' }), use(1, 'r2', 'Read', { file_path: '/x/skills/acme-testing/tests.md' })];
	assert.deepEqual(measure(lines, ['aysnc-skills:tdd', 'acme-testing']).missingSkills, ['acme-testing']);
});

test('finds an agent transcript past stray files', () => {
	const root = mkdtempSync(join(tmpdir(), 'metrics-'));
	writeFileSync(join(root, '.DS_Store'), '');
	mkdirSync(join(root, 'proj', 'sess', 'subagents'), { recursive: true });
	writeFileSync(join(root, 'proj', 'session.jsonl'), '');
	writeFileSync(join(root, 'proj', 'sess', 'subagents', 'agent-abc.jsonl'), '');
	assert.equal(findAgentTranscript('abc', root), join(root, 'proj', 'sess', 'subagents', 'agent-abc.jsonl'));
	assert.throws(() => findAgentTranscript('nope', root));
});
