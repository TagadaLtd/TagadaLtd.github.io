import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content lives as one file per language: work/en/slug.md and work/fr/slug.md.
 * The entry id is therefore `<lang>/<slug>`.
 *
 * Nothing in the schema enforces that both halves exist — schemas validate one
 * file at a time. That rule (site-plan.md §11.4: no post ships half-translated)
 * is enforced by scripts/check-content.mjs, which runs before every build.
 */

const CATEGORIES = ['data', 'marketing', 'ai'] as const;

/** One headline number on a case study. Shown large; this is the part people read. */
const metric = z.object({
  value: z.string(), // "-89%", "6h → 20min", "40,000"
  label: z.string(),
  note: z.string().optional(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(), // lead with the outcome, not the task
    summary: z.string(),
    // Anonymity pattern (site-plan.md §5): sector · scale · date, never a name.
    sector: z.string(),
    scale: z.string(),
    role: z.string(),
    timeframe: z.string(),
    year: z.number(),
    tools: z.array(z.string()).default([]),
    results: z.array(metric).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),
    draft: z.boolean().default(false),
  }),
});

/** Homepage copy. Structured rather than prose so the CMS can present fields. */
const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: '*.yaml' }),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      positioning: z.string(),
      ctaPrimary: z.string(),
      ctaSecondary: z.string(),
    }),
    thesis: z.object({
      label: z.string(),
      body: z.string(),
    }),
    method: z.object({
      label: z.string(),
      title: z.string(),
      beats: z
        .array(
          z.object({
            step: z.string(),
            title: z.string(),
            body: z.string(),
          })
        )
        .length(3),
    }),
    pillars: z.object({
      label: z.string(),
      title: z.string(),
      items: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    selectedWork: z.object({ label: z.string(), title: z.string(), cta: z.string() }),
    proof: z.object({
      label: z.string(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })),
      certifications: z.array(z.string()),
    }),
    process: z.object({
      label: z.string(),
      title: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
    }),
    writing: z.object({ label: z.string(), title: z.string(), cta: z.string() }),
    close: z.object({
      title: z.string(),
      body: z.string(),
      cta: z.string(),
    }),
  }),
});

export const collections = { work, blog, home };
export { CATEGORIES };
