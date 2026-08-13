/**
 * Sample dataset for the dashboard demo on the homepage.
 *
 * ⚠️ EVERY NUMBER HERE IS INVENTED. It exists to show what the chart forms look
 * like, and the section that renders it says so on the page. Nothing here
 * describes real work, a real client, or a real result — and nothing from this
 * file may ever be moved into `src/content/work/` or the Proof strip, which are
 * the places that make claims. That separation is the whole reason this data is
 * allowed to exist at all (CLAUDE.md: never invent metrics).
 *
 * It is invented but not arbitrary. The figures reconcile, because a dashboard
 * whose numbers contradict each other is worse than no dashboard:
 *
 *   · Sessions 48,210 is December's Organic + Paid total (30.2K + 18.0K).
 *   · Conversions 1,494 across the channel bars = 3.1% of 48,210, the stated
 *     conversion rate.
 *   · Revenue €182K over 1,494 conversions is a €122 average order value;
 *     at a €38 cost per acquisition that is a 3.2× return on ad spend.
 *   · The quarterly stack sums to the monthly line for the two channels they
 *     share (Organic 289K, Paid 164K over the year).
 *
 * The quarterly stack covers all four channels and the KPI row covers the last
 * 30 days, so those two legitimately differ in scope rather than disagreeing.
 */

export interface Kpi {
  label: string;
  value: string;
  delta: { value: string; period: string; tone: 'good' | 'bad' | 'neutral' };
  trend: number[];
}

/** Last 30 days. Order is deliberate: volume, quality, cost, outcome. */
export const KPIS: Kpi[] = [
  {
    label: 'Sessions',
    value: '48,210',
    delta: { value: '+12.4%', period: 'vs previous 30 days', tone: 'good' },
    trend: [36.2, 37.8, 37.1, 39.4, 41.0, 40.6, 43.1, 44.8, 44.0, 46.2, 47.4, 48.2],
  },
  {
    label: 'Conversion rate',
    value: '3.1%',
    delta: { value: '+0.4pt', period: 'vs previous 30 days', tone: 'good' },
    trend: [2.4, 2.5, 2.4, 2.6, 2.7, 2.7, 2.8, 2.9, 2.8, 3.0, 3.0, 3.1],
  },
  {
    // Down is good here — which is exactly why tone is its own field.
    label: 'Cost per acquisition',
    value: '€38',
    delta: { value: '−9.2%', period: 'vs previous 30 days', tone: 'good' },
    trend: [47, 46, 45, 44, 44, 42, 41, 41, 40, 39, 39, 38],
  },
  {
    label: 'Revenue',
    value: '€182K',
    delta: { value: '+7.8%', period: 'vs previous 30 days', tone: 'good' },
    trend: [148, 152, 156, 159, 163, 167, 170, 172, 175, 177, 180, 182],
  },
];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Sessions in thousands, the two largest channels. Sums to 289K / 164K. */
export const TREND_SERIES = [
  { key: 'organic', data: [18.4, 19.8, 19.1, 21.6, 23.2, 22.8, 24.9, 26.4, 25.7, 27.9, 29.1, 30.2] },
  { key: 'paid', data: [9.8, 10.6, 11.9, 11.2, 12.8, 14.1, 13.4, 14.8, 15.6, 15.1, 17.0, 18.0] },
];

/** Conversions by channel, last 30 days. Sums to 1,494. Pre-sorted, descending. */
export const CHANNELS: { key: string; value: number }[] = [
  { key: 'organicSearch', value: 486 },
  { key: 'paidSearch', value: 342 },
  { key: 'email', value: 268 },
  { key: 'paidSocial', value: 201 },
  { key: 'direct', value: 132 },
  { key: 'referral', value: 65 },
];

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

/**
 * Sessions in thousands by quarter. Four series, in the palette's fixed order.
 * Rows are quarters, columns follow MIX_SERIES.
 */
export const MIX_SERIES = ['organic', 'paid', 'email', 'referral'];
export const MIX: number[][] = [
  [57, 32, 18, 9],
  [68, 38, 21, 10],
  [77, 44, 24, 12],
  [87, 50, 27, 13],
];
