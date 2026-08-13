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
