/**
 * Animation viewport tiers for GSAP / section scripts.
 * See docs/animation-breakpoints.md
 *
 * Names match project Tailwind prefixes (tb/dk/dk-lg for CSS min-widths).
 * JS also has `mb` for viewports below 440px (no CSS prefix — base styles).
 */

export const BREAKPOINTS = {
  tb: 440,
  dk: 744,
  dkLg: 1600,
} as const;

export type AnimBreakpoint = 'mb' | 'tb' | 'dk' | 'dk-lg';

/** Active animation breakpoint for the given width (default: window). */
export function getAnimBreakpoint(
  width = typeof window !== 'undefined' ? window.innerWidth : 0,
): AnimBreakpoint {
  if (width >= BREAKPOINTS.dkLg) return 'dk-lg';
  if (width >= BREAKPOINTS.dk) return 'dk';
  if (width >= BREAKPOINTS.tb) return 'tb';
  return 'mb';
}
