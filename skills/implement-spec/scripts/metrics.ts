#!/usr/bin/env node
// Measures an agent run from its Claude Code transcripts: time, tool use, the slowest commands,
// failed test runs, skills loaded (by the Skill tool or by reading a SKILL.md) against a manifest,
// and tokens. Prints one JSON object. A signal for retro and gardening, never a gate.
//
//   node metrics.ts <transcript.jsonl>... [--manifest skill-a,skill-b]
//   node metrics.ts --agent <agentId> [--manifest ...]   finds ~/.claude/projects/*/*/subagents/agent-<id>.jsonl

import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Block = { type?: string; id?: string; name?: string; input?: Record<string, unknown>; tool_use_id?: string; is_error?: boolean; content?: unknown };
type Line = { type?: string; timestamp?: string; message?: { id?: string; content?: unknown; usage?: Record<string, number> } };

export type Metrics = {
	wallSeconds: number;
	toolCalls: number;
	toolCounts: Record<string, number>;
	toolCallsBeforeFirstEdit: number | null;
	toolErrors: number;
	slowestCommands: { command: string; seconds: number }[];
	failedTestRuns: number;
	repeatedCommands: { command: string; times: number }[];
	skillsLoaded: string[];
	missingSkills: string[];
	tokens: { input: number; output: number; cacheRead: number; cacheCreate: number };
};

// A test-runner invocation, not the word "test": `test -f x`, `cat a.test.ts` and `grep jest` don't count.
const TEST_COMMAND = /(?:^|[\s;&|(/])(?:(?:pnpm|npm|yarn|bun|composer|mise)\b[^;&|\n]*?\s(?:run\s+)?test(?::[\w:-]+)?|jest|vitest|phpunit|playwright\s+test|node\s+--test)(?=$|[\s;&|)])/;
// A skill read as a file loads it as surely as the Skill tool does.
const SKILL_FILE = /([^/\\]+)[/\\]SKILL\.md$/;
const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);

/** A skill counts as loaded under its full name or its short name, so `tdd` matches `aysnc-skills:tdd`. */
function shortName(skill: string): string {
	return skill.split(':').pop() ?? skill;
}

function resultText(block: Block): string {
	if (typeof block.content === 'string') {
		return block.content;
	}
	if (Array.isArray(block.content)) {
		return block.content.map((part) => (typeof part === 'object' && part && 'text' in part ? String(part.text) : '')).join('\n');
	}
	return '';
}

export function measure(lines: Line[], manifest: string[] = []): Metrics {
	const events = lines.filter((line) => line.timestamp).sort((a, b) => Date.parse(a.timestamp!) - Date.parse(b.timestamp!));
	const uses = new Map<string, { name: string; input: Record<string, unknown>; at: number }>();
	const toolCounts: Record<string, number> = {};
	const commandTimes: { command: string; seconds: number }[] = [];
	const commandCounts = new Map<string, number>();
	const skills = new Set<string>();
	const usageById = new Map<string, Record<string, number>>();
	let toolCalls = 0;
	let firstEdit: number | null = null;
	let toolErrors = 0;
	let failedTestRuns = 0;

	for (const event of events) {
		const at = Date.parse(event.timestamp!);
		const message = event.message;
		if (message?.id && message.usage) {
			usageById.set(message.id, message.usage);
		}
		const blocks = Array.isArray(message?.content) ? (message!.content as Block[]) : [];
		for (const block of blocks) {
			if (block.type === 'tool_use' && block.id && block.name) {
				toolCalls++;
				toolCounts[block.name] = (toolCounts[block.name] ?? 0) + 1;
				const input = block.input ?? {};
				uses.set(block.id, { name: block.name, input, at });
				if (firstEdit === null && EDIT_TOOLS.has(block.name)) {
					firstEdit = toolCalls - 1;
				}
				if (block.name === 'Skill' && typeof input.skill === 'string') {
					skills.add(input.skill);
				}
				if (block.name === 'Read') {
					const skill = String(input.file_path ?? input.filePath ?? '').match(SKILL_FILE)?.[1];
					if (skill) {
						skills.add(skill);
					}
				}
				if (block.name === 'Bash' && typeof input.command === 'string') {
					commandCounts.set(input.command, (commandCounts.get(input.command) ?? 0) + 1);
				}
			}
			if (block.type === 'tool_result' && block.tool_use_id) {
				const use = uses.get(block.tool_use_id);
				const text = resultText(block);
				const failed = block.is_error === true || /\bexit(ed)? (code )?[1-9]/i.test(text);
				if (block.is_error) {
					toolErrors++;
				}
				if (use?.name === 'Bash' && typeof use.input.command === 'string') {
					commandTimes.push({ command: use.input.command.slice(0, 160), seconds: (at - use.at) / 1000 });
					if (failed && TEST_COMMAND.test(use.input.command)) {
						failedTestRuns++;
					}
				}
			}
		}
	}

	const tokens = { input: 0, output: 0, cacheRead: 0, cacheCreate: 0 };
	for (const usage of usageById.values()) {
		tokens.input += usage.input_tokens ?? 0;
		tokens.output += usage.output_tokens ?? 0;
		tokens.cacheRead += usage.cache_read_input_tokens ?? 0;
		tokens.cacheCreate += usage.cache_creation_input_tokens ?? 0;
	}
	const loaded = [...skills].sort();
	const loadedShort = new Set(loaded.map(shortName));
	const first = events.at(0)?.timestamp;
	const last = events.at(-1)?.timestamp;

	return {
		wallSeconds: first && last ? (Date.parse(last) - Date.parse(first)) / 1000 : 0,
		toolCalls,
		toolCounts,
		toolCallsBeforeFirstEdit: firstEdit,
		toolErrors,
		slowestCommands: commandTimes.sort((a, b) => b.seconds - a.seconds).slice(0, 5),
		failedTestRuns,
		repeatedCommands: [...commandCounts].filter(([, times]) => times >= 3).map(([command, times]) => ({ command, times })),
		skillsLoaded: loaded,
		missingSkills: manifest.filter((skill) => !loadedShort.has(shortName(skill))),
		tokens,
	};
}

export function parse(text: string): Line[] {
	return text
		.split('\n')
		.filter((line) => line.trim())
		.flatMap((line) => {
			try {
				return [JSON.parse(line) as Line];
			} catch {
				return [];
			}
		});
}

// Only directories: ~/.claude/projects also holds stray files such as .DS_Store.
const dirs = (path: string) => (existsSync(path) ? readdirSync(path, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => join(path, entry.name)) : []);

export function findAgentTranscript(agentId: string, root = join(homedir(), '.claude', 'projects')): string {
	for (const projectDir of dirs(root)) {
		for (const sessionDir of dirs(projectDir)) {
			const file = join(sessionDir, 'subagents', `agent-${agentId}.jsonl`);
			if (existsSync(file)) {
				return file;
			}
		}
	}
	throw new Error(`no transcript for agent ${agentId} under ${root}`);
}

function main(argv: string[]): void {
	const files: string[] = [];
	let manifest: string[] = [];
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--manifest') {
			manifest = (argv[++i] ?? '').split(',').map((skill) => skill.trim()).filter(Boolean);
		} else if (argv[i] === '--agent') {
			files.push(findAgentTranscript(argv[++i] ?? ''));
		} else if (argv[i] === '--help' || argv[i] === '-h') {
			console.log('node metrics.ts <transcript.jsonl>... | --agent <agentId> [--manifest skill-a,skill-b]');
			return;
		} else {
			files.push(argv[i]);
		}
	}
	if (files.length === 0) {
		throw new Error('give transcript files or --agent <agentId>; see --help');
	}
	const lines = files.flatMap((file) => parse(readFileSync(file, 'utf8')));
	console.log(JSON.stringify(measure(lines, manifest), null, 2));
}

// Compares real paths: a skill folder may be a symlink, and paths can hold spaces.
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
	try {
		main(process.argv.slice(2));
	} catch (error) {
		console.error((error as Error).message);
		process.exit(1);
	}
}
