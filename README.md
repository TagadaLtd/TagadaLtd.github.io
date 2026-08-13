# Portfolio — Sébastien Borges Lopes

Bilingual (FR/EN) portfolio and blog. Astro, static, deployed to GitHub Pages.

## Running it

```bash
npm install
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Local server. **Drafts are visible here** and nowhere else. |
| `npm run build` | Production build. Warns about placeholder text. |
| `npm run build:strict` | What CI runs — placeholder text in a published entry fails the build. |
| `npm run check:content` | The content gate on its own. |
| `npm run check` | TypeScript and Astro diagnostics. |

## How content works

Content lives in `src/content/`, one file per language:

```
src/content/work/en/customer-segmentation.md
src/content/work/fr/customer-segmentation.md
```

Two rules are enforced by `scripts/check-content.mjs`, which runs before every build:

1. **Every entry exists in both languages.** Matching filenames, one per language folder.
   A missing twin fails the build — nothing ships half-translated.
2. **No placeholder text in published entries.** `TODO`, `FIXME`, `Lorem ipsum` and
   `{{ … }}` warn locally and fail the deploy. Entries marked `draft: true` are exempt,
   because drafts never reach the built site.

Editing normally happens in [Pages CMS](https://pagescms.org), configured by `.pages.yml`.

## Routing

`src/pages/[lang]/` is written once and built for every language in `src/i18n/config.mjs`.
`/` is the only page that redirects: it reads `navigator.language`, honours a remembered
choice, and sends the visitor to `/en/` or `/fr/`. It also renders a real two-link page for
visitors without JavaScript. **Deep links never redirect** — a shared `/fr/blog/post/` URL
stays where it is.

## Still to do

- Typography pass — the font stack is a neutral placeholder (`--font-sans` in
  `src/styles/global.css`).
- The scroll motion for the Data → Insight → Action sequence. The static three-panel
  version exists and is the source of truth; motion goes on top of it.
- Services, About, Contact and Privacy pages — routed and navigable, not yet written.
- Contact form needs a Web3Forms key; the newsletter needs a Kit account.
- Real case study numbers.
