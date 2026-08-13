import { LANGS, DEFAULT_LANG } from './config.mjs';

export type Lang = 'en' | 'fr';

export { LANGS, DEFAULT_LANG };

/**
 * Interface strings only — navigation, buttons, labels.
 *
 * Page copy does NOT live here; it lives in src/content/ so it can be edited
 * in the CMS. These strings are the settled label glossary (site-plan.md §3)
 * and changing one changes it sitewide, on purpose.
 */
export const ui = {
  en: {
    'nav.work': 'Work',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.cta': 'Work with me',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',

    'lang.switch': 'Switch language',
    'lang.en': 'English',
    'lang.fr': 'Français',

    'footer.newsletter.title': 'Marketing and data, roughly monthly',
    'footer.newsletter.body':
      'Occasional notes on customer data, measurement, and the tools in between. No more than one email a month.',
    'footer.newsletter.email': 'Email address',
    'footer.newsletter.submit': 'Subscribe',
    'footer.elsewhere': 'Elsewhere',
    'footer.privacy': 'Privacy',
    'footer.built': 'Built with Astro. Hosted on GitHub Pages. Analytics without cookies.',
    'footer.location': 'Moka, Mauritius · GMT+4',

    'work.readCase': 'Read the case study',
    'work.sector': 'Sector',
    'work.scale': 'Scale',
    'work.year': 'Year',
    'blog.readingTime': 'min read',
    'blog.readPost': 'Read',

    'placeholder.badge': 'Placeholder — awaiting real content',
  },
  fr: {
    'nav.work': 'Réalisations',
    'nav.services': 'Prestations',
    'nav.about': 'À propos',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.cta': 'Travaillons ensemble',
    'nav.menu': 'Menu',
    'nav.close': 'Fermer',
    'nav.skip': 'Aller au contenu',

    'lang.switch': 'Changer de langue',
    'lang.en': 'English',
    'lang.fr': 'Français',

    'footer.newsletter.title': 'Marketing et données, environ une fois par mois',
    'footer.newsletter.body':
      'Quelques notes sur les données clients, la mesure, et les outils entre les deux. Pas plus d’un e-mail par mois.',
    'footer.newsletter.email': 'Adresse e-mail',
    'footer.newsletter.submit': 'S’abonner',
    'footer.elsewhere': 'Ailleurs',
    'footer.privacy': 'Confidentialité',
    'footer.built':
      'Construit avec Astro. Hébergé sur GitHub Pages. Analytics sans cookies.',
    'footer.location': 'Moka, Maurice · GMT+4',

    'work.readCase': 'Lire l’étude de cas',
    'work.sector': 'Secteur',
    'work.scale': 'Échelle',
    'work.year': 'Année',
    'blog.readingTime': 'min de lecture',
    'blog.readPost': 'Lire',

    'placeholder.badge': 'Contenu provisoire — en attente du contenu réel',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

/** Returns a `t()` bound to one language. Falls back to English if a key is missing. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[DEFAULT_LANG as Lang][key];
  };
}
