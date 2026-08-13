// Generates the icon and Open Graph assets that were missing entirely:
// public/favicon.svg, public/favicon-48.png, public/apple-touch-icon.png,
// public/og/home-en.png, public/og/home-fr.png.
//
// Run manually with `node scripts/generate-social-images.mjs` after changing
// a template below. Not part of the build — these are static files committed
// to the repo, not generated per-build (GitHub Pages has no server to do it,
// and there is no reason to pay the cost on every push when the source copy
// hasn't changed).
//
// Deliberately minimal: a rounded-square favicon reusing the "trend" glyph
// vocabulary already defined in Glyph.astro, and an OG card built from the
// same tokens as the rest of the site (dark plane, plot-paper grid, the mono
// wordmark treatment from Header.astro). No new brand decisions — typography
// and a real visual identity are still open (CLAUDE.md). Swap these out
// wholesale once that lands.

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, 'public');
const ogDir = path.join(publicDir, 'og');

const SANS = "Helvetica, Arial, 'Segoe UI', sans-serif";
const MONO = "Menlo, Consolas, 'Liberation Mono', monospace";

// Dark theme tokens (design-system.md: dark is the house view; light exists
// because a visitor asked for it). Copied, not imported — these are static
// build-time SVGs with no access to the CSS custom properties.
const PLANE = '#0a0c10';
const INK = '#eceae4';
const INK_3 = '#7e7d75';
const GRID = '#eceae40d';
const ACCENT_HI = '#8aeaf4';

const favicon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${PLANE}"/>
  <path d="M6 27V4" stroke="${INK_3}" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M6 27h20" stroke="${INK_3}" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M8 24 24 8" stroke="${ACCENT_HI}" stroke-width="2.1" stroke-linecap="round"/>
  <circle cx="11" cy="19.5" r="1.9" fill="${ACCENT_HI}"/>
  <circle cx="16.5" cy="18" r="1.9" fill="${ACCENT_HI}"/>
  <circle cx="21.5" cy="11.5" r="1.9" fill="${ACCENT_HI}"/>
</svg>`.trim();

function gridRects(w, h, size) {
  let out = '';
  for (let x = 0; x <= w; x += size) out += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" />`;
  for (let y = 0; y <= h; y += size) out += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" />`;
  return out;
}

// Greedy word-wrap against an estimated glyph width rather than a fixed split
// point — the FR line is visibly longer than the EN one at the same
// character-midpoint, which is what a naive halfway split got wrong (it ran
// the last word off the 1200px canvas). 0.56em is a standard approximation
// for a bold sans's average advance width; good enough for two known lines,
// not a general text layout engine.
function wrapToWidth(text, fontSize, maxWidth) {
  const charWidth = fontSize * 0.56;
  const maxChars = Math.floor(maxWidth / charWidth);
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function ogSvg({ eyebrow, positioning }) {
  const W = 1200;
  const H = 630;
  const maxWidth = W - 160; // 80px margin each side
  let fontSize = 52;
  let lines = wrapToWidth(positioning, fontSize, maxWidth);
  if (lines.length > 2) {
    fontSize = 44;
    lines = wrapToWidth(positioning, fontSize, maxWidth);
  }
  const lineHeight = fontSize + 12;
  const startY = lines.length === 1 ? 330 : 300;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PLANE}"/>
  <g stroke="${GRID}" stroke-width="1">${gridRects(W, H, 56)}</g>

  <text x="80" y="120" font-family="${MONO}" font-size="20" letter-spacing="1.5" fill="${ACCENT_HI}">${eyebrow.toUpperCase()}</text>

  ${lines
    .map(
      (line, i) =>
        `<text x="80" y="${startY + i * lineHeight}" font-family="${SANS}" font-size="${fontSize}" font-weight="600" fill="${INK}">${line}</text>`
    )
    .join('\n  ')}

  <path d="M80 24V4" stroke="${INK_3}" stroke-width="0" opacity="0"/>
  <text x="80" y="${H - 64}" font-family="${MONO}" font-size="22" font-weight="500" fill="${INK}">Sébastien Borges Lopes</text>
  <rect x="80" y="${H - 46}" width="46" height="2" fill="${ACCENT_HI}"/>
  <text x="${W - 80}" y="${H - 64}" text-anchor="end" font-family="${MONO}" font-size="18" fill="${INK_3}">tagadaltd.github.io</text>
</svg>`.trim();
}

await mkdir(ogDir, { recursive: true });

await writeFile(path.join(publicDir, 'favicon.svg'), favicon + '\n');
await sharp(Buffer.from(favicon)).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48.png'));
await sharp(Buffer.from(favicon))
  .resize(180, 180)
  .flatten({ background: PLANE })
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));

const cards = {
  'home-en.png': { eyebrow: 'Digital marketing · Data · AI — Mauritius', positioning: 'I sit between your marketing team and your data, and make them talk.' },
  'home-fr.png': { eyebrow: 'Marketing digital · Données · IA — Maurice', positioning: 'Je fais le pont entre votre équipe marketing et vos données — et je les fais parler.' },
};

for (const [file, copy] of Object.entries(cards)) {
  await sharp(Buffer.from(ogSvg(copy)))
    .png()
    .toFile(path.join(ogDir, file));
}

console.log('Wrote favicon.svg, favicon-48.png, apple-touch-icon.png, og/home-en.png, og/home-fr.png');
