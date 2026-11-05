// Checks docs/feature-map.md against the repository. Run: node scripts/check-feature-map.ts
//
// - Every `### Feature` has `What:`, `Paths:` and a `Try it:` list with at least one numbered step.
// - Every path in a `Paths:` line is tracked by git (a file, or a folder holding tracked files).
// - Every relative Markdown link resolves.
// - Every folder matched by the map's `Coverage:` line is claimed by some feature's path.
//
// Paths come from `git ls-files`, so ignored and untracked files never count.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MAP = 'docs/feature-map.md';

export interface Result {
  readonly errors: readonly string[];
  readonly summary: string;
}

interface Feature {
  readonly name: string;
  readonly line: number;
  what: boolean;
  paths: string[];
  steps: number;
}

const trim = (path: string) => path.replace(/^\.\//, '').replace(/\/+$/, '');

/** A `Coverage:` glob is a path whose segments may be `*`; it expands to tracked folders. */
function expand(glob: string, folders: ReadonlySet<string>): string[] {
  const parts = trim(glob).split('/');
  return [...folders].filter((folder) => {
    const segments = folder.split('/');
    return segments.length === parts.length && parts.every((p, i) => p === '*' || p === segments[i]);
  });
}

export function check(root: string, tracked: readonly string[]): Result {
  const errors: string[] = [];
  const mapPath = join(root, MAP);
  if (!existsSync(mapPath)) return { errors: [`${MAP} is missing`], summary: '' };

  const files = new Set(tracked);
  const folders = new Set<string>();
  for (const file of tracked) {
    const segments = file.split('/');
    for (let i = 1; i < segments.length; i++) folders.add(segments.slice(0, i).join('/'));
  }

  const lines = readFileSync(mapPath, 'utf8').split('\n');
  const features: Feature[] = [];
  const coverage: string[] = [];
  let current: Feature | undefined;
  let inSteps = false;
  let inFence = false;

  lines.forEach((text, index) => {
    const line = index + 1;
    if (text.startsWith('```')) inFence = !inFence;
    if (inFence) return;

    const heading = /^(#{1,3}) (.+)$/.exec(text);
    if (heading) {
      inSteps = false;
      current = heading[1] === '###' ? { name: heading[2] ?? '', line, what: false, paths: [], steps: 0 } : undefined;
      if (current) features.push(current);
      return;
    }

    const cov = /^Coverage:\s*(.+)$/.exec(text);
    if (cov && !current) {
      coverage.push(...(cov[1] ?? '').split(',').map((g) => g.replace(/`/g, '').trim()).filter(Boolean));
      return;
    }

    for (const match of text.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      const target = match[1] ?? '';
      if (/^[a-z]+:/i.test(target)) continue;
      const resolved = posix.normalize(posix.join(posix.dirname(MAP), target));
      if (!files.has(resolved) && !folders.has(trim(resolved))) errors.push(`${MAP}:${line}: link ${target} does not resolve`);
    }

    if (!current) return;
    if (/^What:\s*\S/.test(text)) current.what = true;
    const paths = /^Paths:\s*(.+)$/.exec(text);
    if (paths) {
      for (const raw of (paths[1] ?? '').matchAll(/`([^`]+)`/g)) {
        const path = trim(raw[1] ?? '');
        current.paths.push(path);
        if (!files.has(path) && !folders.has(path)) errors.push(`${MAP}:${line}: ${current.name}: path ${path} is not tracked by git`);
      }
    }
    if (/^Try it:\s*$/.test(text)) inSteps = true;
    else if (inSteps && /^\d+\.\s+\S/.test(text)) current.steps++;
    else if (inSteps && text.trim() !== '' && !/^\s/.test(text)) inSteps = false;
  });

  for (const feature of features) {
    const where = `${MAP}:${feature.line}: ${feature.name}`;
    if (!feature.what) errors.push(`${where}: missing a "What:" line`);
    if (feature.paths.length === 0) errors.push(`${where}: missing a "Paths:" line with at least one \`path\``);
    if (feature.steps === 0) errors.push(`${where}: missing "Try it:" with at least one numbered step`);
  }

  const claimed = features.flatMap((f) => f.paths);
  let modules = 0;
  for (const glob of coverage) {
    const matches = expand(glob, folders);
    if (matches.length === 0) errors.push(`${MAP}: Coverage ${glob} matches no tracked folder`);
    for (const folder of matches) {
      modules++;
      const covered = claimed.some((p) => p === folder || p.startsWith(`${folder}/`) || folder.startsWith(`${p}/`));
      if (!covered) errors.push(`${MAP}: ${folder} (Coverage ${glob}) is listed by no feature`);
    }
  }

  return { errors, summary: `feature map: ${features.length} features, ${modules} covered folders` };
}

function main(): void {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const { errors, summary } = check(root, tracked);
  for (const error of errors) console.error(error);
  if (errors.length > 0) {
    console.error(`\n${errors.length} problem(s). Fix ${MAP}, not this script.`);
    process.exit(1);
  }
  console.log(summary);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
