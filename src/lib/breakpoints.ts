/**
 * Animation viewport tiers for GSAP / section scripts.
 * See docs/animation-breakpoints.md
 *
 * Names match project Tailwind prefixes (mb/tb/dk/dk-lg), but the
 * thresholds below are for animations.
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
