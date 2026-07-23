import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

/** Custom ease available as `ease="hop"` on `<Copy>`. */
export const HOP_EASE_ID = 'hop';

const HOP_EASE_PATH = 'M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1';

/** Register project CustomEases once (idempotent). */
export function ensureCopyEases() {
  if (!CustomEase.get(HOP_EASE_ID)) {
    CustomEase.create(HOP_EASE_ID, HOP_EASE_PATH);
  }
}

/**
 * Resolve the ease for a tween.
 * Scrub always uses `none` so progress maps 1:1 to scroll.
 */
export function resolveCopyEase(scrub: boolean, ease: string): string {
  return scrub ? 'none' : ease;
}

/**
 * Resolve tween duration.
 * Scrub always uses `1` so stagger maps cleanly across the scrub range.
 */
export function resolveCopyDuration(scrub: boolean, duration: number): number {
  return scrub ? 1 : duration;
}
