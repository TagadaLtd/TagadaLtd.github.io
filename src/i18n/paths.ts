import { LANGS, DEFAULT_LANG, type Lang } from './ui';

/**
 * URL helpers.
 *
 * The path *segments* are the same in both languages — /en/work/ and /fr/work/.
 * Only the visible labels are translated (see ui.ts). That keeps one route file
 * per page instead of one per page per language, and keeps hreflang pairing
 * trivial: swap the first segment, everything else is identical.
 */

export function isLang(value: string | undefined): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** Reads the language out of a URL. Never throws — unknown prefixes get the default. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : (DEFAULT_LANG as Lang);
}

/** Builds an in-site path: localPath('en', 'work') -> '/en/work/' */
export function localPath(lang: Lang, ...segments: (string | undefined)[]): string {
  const parts = [lang, ...segments].filter(Boolean).map((s) => String(s).replace(/^\/|\/$/g, ''));
  return `/${parts.join('/')}/`;
}

/**
 * The same page in another language.
 *
 * Required by site-plan.md §3: the switcher returns you to the same page, never
 * to the homepage. Because only the first segment encodes language, this is a
 * swap rather than a lookup — which is why it cannot silently fall back.
 */
export function translatePath(pathname: string, to: Lang): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLang(segments[0])) segments[0] = to;
  else segments.unshift(to);
  return `/${segments.join('/')}/`;
}

/** Every language variant of the current path, for <link rel="alternate" hreflang>. */
export function alternates(pathname: string): { lang: Lang; path: string }[] {
  return (LANGS as readonly Lang[]).map((lang) => ({ lang, path: translatePath(pathname, lang) }));
}

/** True when `href` is the current page or an ancestor of it — used to mark the active nav item. */
export function isActiveSection(pathname: string, href: string): boolean {
  if (href === pathname) return true;
  const section = href.split('/').filter(Boolean)[1];
  const current = pathname.split('/').filter(Boolean)[1];
  return Boolean(section) && section === current;
}
