/**
 * The section-mark vocabulary. Lives here rather than in Glyph.astro so both
 * the component and everything that passes it a name share one source, and so
 * adding a mark is a compile error everywhere it is used wrongly.
 *
 * Each name describes a chart form, never a subject: `panels` is small
 * multiples, not "portfolio". See Glyph.astro for what each one draws and
 * which section it belongs to.
 */
export type GlyphName =
  | 'trend'
  | 'ranges'
  | 'panels'
  | 'ticks'
  | 'flow'
  | 'lines'
  | 'scatter'
  | 'target';

/**
 * Marks are drawn in the chart palette, but they are section *identity* rather
 * than data encoding — so unlike a series, they are assigned by meaning, not in
 * sequence. Nothing on the page reads two of them as comparable quantities.
 *
 * The rule they do keep: a coloured mark beside a label carries identity, the
 * label itself stays in neutral ink (design-system.md).
 */
export type GlyphTone = 'accent' | 'data' | 'marketing' | 'ai' | 'proof' | 'writing';

export const TONE_VAR: Record<GlyphTone, string> = {
  accent: 'var(--color-accent)',
  data: 'var(--color-series-1)', // cyan
  marketing: 'var(--color-series-2)', // amber
  ai: 'var(--color-series-4)', // violet
  proof: 'var(--color-series-5)', // emerald
  writing: 'var(--color-series-3)', // rose
};
