// Checks every verification skill's feature map (.claude/skills/verify-*/features/) against the
// feature entry contract create-verification-skill writes. Run: node scripts/check-feature-map.ts
//
// - README.md lists every feature file under "## Features", and every listed file exists.
// - Each feature file has an H1, a paragraph, then exactly these H2s in order: Sub-features,
//   How to get to it (user POV), Driving it with <harness>, Gotchas.
// - Sub-features and How to get to it have a bullet; Driving it starts with "Preconditions:".
// - No feature file names a path git tracks: the map names user paths, not implementation.
// - Every relative link outside inline code resolves; a link starting with / is a site route.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SKILLS = '.claude/skills';
const SECTIONS = ['Sub-features', 'How to get to it (user POV)', 'Driving it with', 'Gotchas'] as const;

/** The feature map folders: `.claude/skills/verify-<app>/features/`. */
export function maps(root: string): string[] {
  const skills = join(root, SKILLS);
  if (!existsSync(skills)) return [];
  return readdirSync(skills)
    .filter((d) => d.startsWith('verify-') && existsSync(join(skills, d, 'features')))
    .map((d) => `${SKILLS}/${d}/features`);
}

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
    for (const m of text.replace(/`[^`]*`/g, '').matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      const target = m[1] ?? '';
      if (/^[a-z]+:/i.test(target) || target.startsWith('/')) continue;
      const path = posix.normalize(posix.join(posix.dirname(file), target)).replace(/\/$/, '');
      if (!exists(path)) errors.push(`${file}:${line}: link ${target} does not resolve`);
    }
  }
}

export function check(root: string, tracked: readonly string[]): Result {
  const found = maps(root);
  if (found.length === 0) return { errors: [`no ${SKILLS}/verify-*/features/ folder: run /aysnc-skills:create-verification-skill`], summary: '' };
  const results = found.map((dir) => checkMap(root, dir, tracked));
  const count = results.reduce((n, r) => n + r.count, 0);
  return { errors: results.flatMap((r) => r.errors), summary: `feature map: ${count} features in ${found.length} map(s), all listed and in shape` };
}

function checkMap(root: string, mapDir: string, tracked: readonly string[]): { errors: string[]; count: number } {
  const errors: string[] = [];
  const dir = join(root, mapDir);
  if (!existsSync(join(dir, 'README.md'))) return { errors: [`${mapDir}/README.md is missing`], count: 0 };

  const files = new Set(tracked);
  const folders = new Set(tracked.flatMap((f) => f.split('/').slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join('/'))));
  const exists = (p: string) => files.has(p) || folders.has(p) || existsSync(join(root, p));

  const readme = `${mapDir}/README.md`;
  const readmeLines = prose(readFileSync(join(root, readme), 'utf8'));
  links(readme, readmeLines, exists, errors);

  const start = readmeLines.findIndex((l) => l.text === '## Features');
  const listed = new Set<string>();
  if (start === -1) errors.push(`${readme}: missing a "## Features" list`);
  else {
    for (const { text } of readmeLines.slice(start + 1)) {
      if (text.startsWith('## ')) break;
      const m = /^- \[[^\]]+\]\(([^)#]+\.md)\)/.exec(text);
      if (m?.[1]) listed.add(m[1].replace(/^\.\//, ""));
    }
  }

  const features = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
  for (const f of features) if (!listed.has(f)) errors.push(`${readme}: ${f} is missing from "## Features"`);

  for (const name of features) {
    const file = `${mapDir}/${name}`;
    const lines = prose(readFileSync(join(root, file), 'utf8'));
    links(file, lines, exists, errors);

    const content = lines.filter((l) => l.text.trim() !== '' && !l.text.startsWith('<!--'));
    if (!content[0]?.text.startsWith('# ')) errors.push(`${file}: must start with an H1 title`);
    if (!content[1] || content[1].text.startsWith('#')) errors.push(`${file}: needs a paragraph after the title`);

    const headings = lines.filter((l) => l.text.startsWith('## ')).map((l) => l.text.slice(3).trim());
    const inOrder = headings.length === SECTIONS.length && SECTIONS.every((s, i) => (s === 'Driving it with' ? headings[i]?.startsWith(`${s} `) : headings[i] === s));
    if (!inOrder) {
      errors.push(`${file}: sections must be exactly ${SECTIONS.map((s) => `"${s}"`).join(', ')} in that order (found ${headings.map((h) => `"${h}"`).join(', ') || 'none'})`);
    }

    const section = (title: string) => {
      const i = lines.findIndex((l) => l.text === `## ${title}` || (title.endsWith(' with') && l.text.startsWith(`## ${title} `)));
      if (i === -1) return [];
      const rest = lines.slice(i + 1);
      const end = rest.findIndex((l) => l.text.startsWith('## '));
      return (end === -1 ? rest : rest.slice(0, end)).map((l) => l.text);
    };
    if (!section('Sub-features').some((t) => /^- \S/.test(t))) errors.push(`${file}: "Sub-features" needs at least one bullet`);
    if (!section('How to get to it (user POV)').some((t) => /^- \S/.test(t))) errors.push(`${file}: "How to get to it (user POV)" needs at least one bullet`);
    const driving = section('Driving it with').filter((t) => t.trim() !== '');
    if (driving[0]?.trim() !== 'Preconditions:') errors.push(`${file}: "Driving it with ..." must start with "Preconditions:"`);
    if (!driving.some((t) => /^- \*\*[^*]+\*\*/.test(t))) errors.push(`${file}: "Driving it with ..." needs a labeled step (- **Step.** action, command, result)`);

    for (const { line, text } of lines) {
      for (const m of text.matchAll(/`([^`\s]+)`/g)) {
        const token = (m[1] ?? '').replace(/^\.\//, '').replace(/\/$/, '');
        if (token.includes('/') && (files.has(token) || folders.has(token))) {
          errors.push(`${file}:${line}: names the repo path ${token}; say what the user touches instead`);
        }
      }
    }
  }

  return { errors, count: features.length };
}

function main(): void {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const { errors, summary } = check(root, tracked);
  for (const error of errors) console.error(error);
  if (errors.length > 0) {
    console.error(`\n${errors.length} problem(s). Fix the feature map, not this script.`);
    process.exit(1);
  }
  console.log(summary);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
