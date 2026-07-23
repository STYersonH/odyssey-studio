import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RevealDirection, RevealScrub } from './types';

gsap.registerPlugin(ScrollTrigger);

export const REVEAL_READY_CLASS = 'reveal-ready';

export function isScrubEnabled(scrub: RevealScrub | undefined): boolean {
  return scrub === true || (typeof scrub === 'number' && scrub >= 0);
}

export function resolveTriggerElement(
  selector: string | null | undefined,
  fallback: HTMLElement,
): HTMLElement {
  if (typeof selector === 'string' && selector.trim().length > 0) {
    return (
      fallback.closest<HTMLElement>(selector) ||
      document.querySelector<HTMLElement>(selector) ||
      fallback
    );
  }
  return fallback;
}

/**
 * Content units to stagger (layout wrappers like bare `<div>` are skipped).
 * Nested content is collected in DOM order; a candidate inside another
 * candidate is dropped (e.g. `p` inside `blockquote` → only `blockquote`).
 */
const REVEAL_CONTENT_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'img',
  'picture',
  'video',
  'figure',
  'blockquote',
  'ul',
  'ol',
  'li',
  'table',
  'a',
  'button',
  'label',
].join(',');

/**
 * Units to animate inside a Reveal root.
 *
 * Prefers semantic content nodes (`h2`, `p`, `img`, `button`, …) even when
 * wrapped in layout `<div>`s. Falls back to direct non-`<span>` children
 * when no content nodes exist.
 */
export function getRevealTargets(root: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(REVEAL_CONTENT_SELECTOR),
  ).filter((el) => root.contains(el) && el !== root);

  const contentLeaves = candidates.filter(
    (el) => !candidates.some((other) => other !== el && other.contains(el)),
  );

  if (contentLeaves.length > 0) return contentLeaves;

  const targets: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  Array.from(root.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;
    if (child.tagName === 'SPAN') return;
    if (seen.has(child)) return;
    seen.add(child);
    targets.push(child);
  });

  return targets;
}

export function offsetFor(
  direction: RevealDirection,
  distance: number,
): { x: number; y: number } {
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'top':
      return { x: 0, y: -distance };
    case 'bottom':
      return { x: 0, y: distance };
  }
}

type CreateScrollTriggerParams = {
  animateOnScroll: boolean;
  triggerElement: HTMLElement;
  start: string;
  end?: string;
  scrub?: RevealScrub;
  reverse?: boolean;
  animation?: gsap.core.Animation;
  onEnter?: () => void;
  onLeaveBack?: () => void;
};

export function createRevealScrollTrigger({
  animateOnScroll,
  triggerElement,
  start,
  end = 'top 20%',
  scrub = false,
  reverse = false,
  animation,
  onEnter,
  onLeaveBack,
}: CreateScrollTriggerParams): ScrollTrigger | null {
  if (isScrubEnabled(scrub)) {
    if (!animation) return null;
    return ScrollTrigger.create({
      trigger: triggerElement,
      start,
      end,
      scrub: scrub === true ? true : scrub,
      animation,
      refreshPriority: -1,
    });
  }

  if (!animateOnScroll) return null;

  if (onEnter || onLeaveBack) {
    return ScrollTrigger.create({
      trigger: triggerElement,
      start,
      refreshPriority: -1,
      onEnter,
      onLeaveBack,
      ...(reverse || onLeaveBack ? {} : { once: true }),
    });
  }

  return ScrollTrigger.create({
    trigger: triggerElement,
    start,
    refreshPriority: -1,
    animation,
    ...(reverse
      ? { toggleActions: 'play none none reverse' }
      : { once: true, toggleActions: 'play none none none' }),
  });
}
