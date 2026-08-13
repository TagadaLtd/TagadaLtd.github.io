import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/**
 * Entry ids are `<lang>/<slug>` because content is stored one file per language.
 * These helpers are the only place that knows that, so changing the storage
 * layout later touches this file and nothing else.
 */

export function parseId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

/**
 * Drafts render in `astro dev` and are excluded from the built site. That is
 * what makes it safe to keep TODO-shaped case studies in the repo: they are
 * visible while the structure is being reviewed, and cannot reach production.
 */
const INCLUDE_DRAFTS = import.meta.env.DEV;

function published<T extends { data: { draft: boolean } }>(entries: T[]): T[] {
  return INCLUDE_DRAFTS ? entries : entries.filter((e) => !e.data.draft);
}

export type WorkEntry = CollectionEntry<'work'>;
export type BlogEntry = CollectionEntry<'blog'>;

export async function getWork(lang: Lang): Promise<WorkEntry[]> {
  const entries = await getCollection('work', ({ id }) => parseId(id).lang === lang);
  return published(entries).sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedWork(lang: Lang, limit = 3): Promise<WorkEntry[]> {
  const all = await getWork(lang);
  const featured = all.filter((e) => e.data.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPosts(lang: Lang): Promise<BlogEntry[]> {
  const entries = await getCollection('blog', ({ id }) => parseId(id).lang === lang);
  return published(entries).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getHome(lang: Lang) {
  const entry = await getEntry('home', lang);
  if (!entry) throw new Error(`Missing src/content/home/${lang}.yaml`);
  return entry.data;
}

/** Rough reading time. Good enough to set expectations; not worth a dependency. */
export function readingTime(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}
