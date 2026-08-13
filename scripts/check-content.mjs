#!/usr/bin/env node
/**
 * Content gate. Runs before every build.
 *
 * Two jobs:
 *
 *   1. Translation pairing — hard failure, always. Every slug under work/ and
 *      blog/ must exist in every language, and the homepage copy must exist in
 *      every language. This is decision §11.4 in site-plan.md: a post is one
 *      entry with two bodies and cannot ship half-translated. Schemas can't
 *      enforce it because they see one file at a time.
 *
 *   2. Placeholder detection — warning locally, hard failure with --strict for
 *      anything not marked `draft: true`. The deploy workflow runs --strict, so
 *      a case study can sit half-written in the repo for as long as it needs to,
 *      but the moment someone publishes it the TODO markers block the deploy.
 *      Case study numbers are the thing this is protecting: an invented figure
 *      on a live page is the one failure mode with no cheap recovery.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LANGS } from '../src/i18n/config.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src/content');
const STRICT = process.argv.includes('--strict');

/** Collections stored as <collection>/<lang>/<slug>.md */
const PAIRED_COLLECTIONS = ['work', 'blog'];

/** Text that must never reach production. */
const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /\bLorem ipsum\b/i,
  /\{\{[^}]+\}\}/, // {{ fill me in }}
];

const errors = [];
const warnings = [];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function slugsFor(collection, lang) {
  const dir = join(CONTENT, collection, lang);
  if (!existsSync(dir)) return null;
  return new Set(
    walk(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => relative(dir, f).replace(/\.md$/, ''))
  );
}

// --- 1. Translation pairing -------------------------------------------------

for (const collection of PAIRED_COLLECTIONS) {
  const byLang = new Map();

  for (const lang of LANGS) {
    const slugs = slugsFor(collection, lang);
    if (slugs === null) {
      errors.push(`src/content/${collection}/${lang}/ is missing.`);
      continue;
    }
    byLang.set(lang, slugs);
  }

  const all = new Set([...byLang.values()].flatMap((s) => [...s]));

  for (const slug of [...all].sort()) {
    const missing = LANGS.filter((lang) => !byLang.get(lang)?.has(slug));
    if (missing.length) {
      const present = LANGS.filter((l) => byLang.get(l)?.has(slug));
      errors.push(
        `${collection}/${slug} exists in ${present.join(', ')} but not in ${missing.join(', ')}. ` +
          `Every entry ships in all languages or not at all.`
      );
    }
  }
}

// Homepage copy is one file per language rather than a paired folder.
for (const lang of LANGS) {
  const file = join(CONTENT, 'home', `${lang}.yaml`);
  if (!existsSync(file)) errors.push(`src/content/home/${lang}.yaml is missing.`);
}

// --- 2. Placeholder detection ----------------------------------------------

for (const file of walk(CONTENT)) {
  if (!/\.(md|ya?ml)$/.test(file)) continue;

  const rel = relative(ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  // An entry flagged `draft: true` never reaches the built site, so its
  // placeholders can never mislead anyone — they only warn. Clearing the flag
  // is the act of publishing, and that is when --strict starts caring.
  const isDraft = lines.some((l) => /^draft:\s*true\s*$/.test(l));

  lines.forEach((line, i) => {
    const pattern = PLACEHOLDER_PATTERNS.find((p) => p.test(line));
    if (!pattern) return;
    const message = `${rel}:${i + 1} — placeholder content: ${line.trim().slice(0, 90)}`;
    if (!isDraft && STRICT) errors.push(message);
    else warnings.push(message);
  });
}

// --- Report -----------------------------------------------------------------

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

if (warnings.length) {
  console.log(bold(yellow(`\n${warnings.length} placeholder(s) — fine for now, blocked on deploy:`)));
  for (const w of warnings) console.log(yellow(`  · ${w}`));
}

if (errors.length) {
  console.error(bold(red(`\n${errors.length} content error(s):`)));
  for (const e of errors) console.error(red(`  ✗ ${e}`));
  console.error(
    red(
      STRICT
        ? '\nThe site cannot be deployed until these are resolved.\n'
        : '\nFix these before building.\n'
    )
  );
  process.exit(1);
}

console.log(green(`\n✓ Content check passed${STRICT ? ' (strict)' : ''}.\n`));
