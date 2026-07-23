import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whenFontsReady } from '../../../../utils/when-fonts-ready';
import type { CopyScrub } from './types';

gsap.registerPlugin(ScrollTrigger);

const TEXT_SELECTOR =
  'h1,h2,h3,h4,h5,h6,p,a,li,label,blockquote,figcaption,span';

/** Root class toggled once the reveal is set up (drives visibility in copy.css). */
export const COPY_READY_CLASS = 'copy-ready';

/** Wait for custom fonts before splitting text. */
export async function waitForFonts() {
  try {
    await whenFontsReady();
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

/** Resolve ScrollTrigger trigger element from selector or fallback. */
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

/** Collect leaf text elements in DOM order for shared stagger. */
export function getAnimatableElements(root: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
  ).filter((el) => root.contains(el) && el.textContent?.trim());

  const leaves = candidates.filter(
    (el) => !candidates.some((other) => other !== el && el.contains(other)),
  );

  if (leaves.length > 0) return leaves;

  if (root.hasAttribute('data-copy-wrapper') && root.children.length > 0) {
    return Array.from(root.children) as HTMLElement[];
  }

  return [root];
}

/** Move text-indent to first split unit so mask aligns correctly. */
export function preserveTextIndent(element: HTMLElement, units: HTMLElement[]) {
  const computedStyle = window.getComputedStyle(element);
  const textIndent = computedStyle.textIndent;
  if (textIndent && textIndent !== '0px' && units.length > 0) {
    units[0].style.paddingLeft = textIndent;
    element.style.textIndent = '0';
  }
}

export function isScrubEnabled(scrub: CopyScrub | undefined): boolean {
  return scrub === true || (typeof scrub === 'number' && scrub >= 0);
}

type CreateScrollTriggerParams = {
  animateOnScroll: boolean;
  triggerElement: HTMLElement;
  start: string;
  end?: string;
  scrub?: CopyScrub;
  /** Play-once only: reverse on scroll-up past `start`, replay on re-enter. */
  reverse?: boolean;
  animation?: gsap.core.Animation;
  onEnter?: () => void;
};

/**
 * Create a ScrollTrigger for Copy.
 * - scrub: animation progress follows scroll between start → end
 * - else + animateOnScroll: play on enter (reverse on leave-back when `reverse`)
 * - else: null (caller plays on mount)
 */
export function createScrollTrigger({
  animateOnScroll,
  triggerElement,
  start,
  end = 'top 20%',
  scrub = false,
  reverse = false,
  animation,
  onEnter,
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

  // `onEnter` callbacks (e.g. flicker timers) can't be reversed → always once.
  if (onEnter) {
    return ScrollTrigger.create({
      trigger: triggerElement,
      start,
      once: true,
      refreshPriority: -1,
      onEnter,
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

/** Debounced rebuild scheduler (e.g. SplitText onSplit / resize). */
export function createRebuildScheduler(isActive: () => boolean, delayMs = 50) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return {
    schedule(run: () => void) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        if (isActive()) run();
      }, delayMs);
    },
    clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}
