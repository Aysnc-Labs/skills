// Checks docs/features/ against its contract. Run: node scripts/check-features.ts
//
// - README.md lists every feature file under "## Features", and every listed file exists.
// - Each feature file has an H1, a paragraph, then exactly: Parts, Reach it, Try it, Traps.
// - Parts and Reach it have a bullet; Try it has a "Start:" line and a numbered step.
// - No feature file names a path git tracks: features say what a user touches, not where code lives.
// - Every relative link resolves.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DIR = 'docs/features';
const SECTIONS = ['Parts', 'Reach it', 'Try it', 'Traps'] as const;

export interface Result {
  readonly errors: readonly string[];
  readonly summary: string;
}

/** Text outside fenced code blocks, with its 1-based line numbers. */
function prose(text: string): Array<{ line: number; text: string }> {
  let fenced = false;
  return text.split('\n').flatMap((t, i) => {
    if (t.startsWith('```')) {
      fenced = !fenced;
      return [];
    }
    return fenced ? [] : [{ line: i + 1, text: t }];
  });
}

function links(file: string, lines: ReturnType<typeof prose>, exists: (p: string) => boolean, errors: string[]) {
  for (const { line, text } of lines) {
    for (const m of text.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      const target = m[1] ?? '';
      if (/^[a-z]+:/i.test(target)) continue;
      const path = posix.normalize(posix.join(posix.dirname(file), target)).replace(/\/$/, '');
      if (!exists(path)) errors.push(`${file}:${line}: link ${target} does not resolve`);
    }
  }
}

export function check(root: string, tracked: readonly string[]): Result {
  const errors: string[] = [];
  const dir = join(root, DIR);
  if (!existsSync(join(dir, 'README.md'))) return { errors: [`${DIR}/README.md is missing`], summary: '' };

  const files = new Set(tracked);
  const folders = new Set(tracked.flatMap((f) => f.split('/').slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join('/'))));
  const exists = (p: string) => files.has(p) || folders.has(p) || existsSync(join(root, p));

  const readme = `${DIR}/README.md`;
  const readmeLines = prose(readFileSync(join(root, readme), 'utf8'));
  links(readme, readmeLines, exists, errors);

  const start = readmeLines.findIndex((l) => l.text === '## Features');
  const listed = new Set<string>();
  if (start === -1) errors.push(`${readme}: missing a "## Features" list`);
  else {
    for (const { text } of readmeLines.slice(start + 1)) {
      if (text.startsWith('## ')) break;
      const m = /^- \[[^\]]+\]\(([^)#]+\.md)\)/.exec(text);
      if (m?.[1]) listed.add(m[1]);
    }
  }

  const features = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
  for (const f of features) if (!listed.has(f)) errors.push(`${readme}: ${f} is missing from "## Features"`);

  for (const name of features) {
    const file = `${DIR}/${name}`;
    const lines = prose(readFileSync(join(root, file), 'utf8'));
    links(file, lines, exists, errors);

    const content = lines.filter((l) => l.text.trim() !== '' && !l.text.startsWith('<!--'));
    if (!content[0]?.text.startsWith('# ')) errors.push(`${file}: must start with an H1 title`);
    if (!content[1] || content[1].text.startsWith('#')) errors.push(`${file}: needs a paragraph after the title`);

    const headings = lines.filter((l) => l.text.startsWith('## ')).map((l) => l.text.slice(3).trim());
    if (headings.join('|') !== SECTIONS.join('|')) {
      errors.push(`${file}: sections must be exactly ${SECTIONS.map((s) => `"${s}"`).join(', ')} in that order (found ${headings.map((h) => `"${h}"`).join(', ') || 'none'})`);
    }

    const section = (title: string) => {
      const i = lines.findIndex((l) => l.text === `## ${title}`);
      if (i === -1) return [];
      const rest = lines.slice(i + 1);
      const end = rest.findIndex((l) => l.text.startsWith('## '));
      return (end === -1 ? rest : rest.slice(0, end)).map((l) => l.text);
    };
    if (!section('Parts').some((t) => /^- \S/.test(t))) errors.push(`${file}: "Parts" needs at least one bullet`);
    if (!section('Reach it').some((t) => /^- \S/.test(t))) errors.push(`${file}: "Reach it" needs at least one bullet`);
    const tryIt = section('Try it');
    if (!tryIt.some((t) => t.trim() === 'Start:')) errors.push(`${file}: "Try it" needs a "Start:" line`);
    if (!tryIt.some((t) => /^\d+\.\s+\S/.test(t))) errors.push(`${file}: "Try it" needs at least one numbered step`);

    for (const { line, text } of lines) {
      for (const m of text.matchAll(/`([^`\s]+)`/g)) {
        const token = (m[1] ?? '').replace(/^\.\//, '').replace(/\/$/, '');
        if (token.includes('/') && (files.has(token) || folders.has(token))) {
          errors.push(`${file}:${line}: names the repo path ${token}; say what the user touches instead`);
        }
      }
    }
  }

  return { errors, summary: `features: ${features.length} files, all listed and in shape` };
}

function main(): void {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const { errors, summary } = check(root, tracked);
  for (const error of errors) console.error(error);
  if (errors.length > 0) {
    console.error(`\n${errors.length} problem(s). Fix ${DIR}/, not this script.`);
    process.exit(1);
  }
  console.log(summary);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
