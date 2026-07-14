import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whenFontsReady } from './when-fonts-ready';

gsap.registerPlugin(ScrollTrigger);

export type SectionAnimationContext = {
  root: HTMLElement;
  mm: gsap.MatchMedia;
};

type SetupCleanup = void | (() => void);

export type SectionAnimationControllerOptions = {
  /** DOM id of the section root (e.g. "hero", "partners"). */
  rootId: string;
  /**
   * Build the animation after optional font loading.
   * Return a cleanup that kills ScrollTriggers, listeners, and resets section styles.
   */
  setup: (context: SectionAnimationContext) => SetupCleanup;
  /**
   * Refresh ScrollTrigger after layout settles. Set false for intro-only sections
   * that do not register scroll triggers (e.g. Hero).
   * @default true
   */
  refreshScrollTrigger?: boolean;
  /**
   * Wait for webfonts before running setup (needed for SplitText metrics).
   * @default true
   */
  waitForFonts?: boolean;
};

const REFRESH_DELAY_MS = 150;

/**
 * Creates an idempotent section initializer for `astro:page-load`.
 * Works for scroll-driven sections and page-intro timelines alike.
 */
export function createSectionAnimationController({
  rootId,
  setup,
  refreshScrollTrigger = true,
  waitForFonts = true,
}: SectionAnimationControllerOptions) {
  let mm: gsap.MatchMedia | null = null;
  let cleanupSetup: (() => void) | undefined;

  return () => {
    if (typeof window === 'undefined') return;

    const root = document.getElementById(rootId);
    if (!root) return;

    void (async () => {
      cleanupSetup?.();
      mm?.revert();

      if (waitForFonts) await whenFontsReady();
      if (!document.getElementById(rootId)) return;

      mm = gsap.matchMedia();
      const cleanupResult = setup({ root, mm });
      cleanupSetup = typeof cleanupResult === 'function' ? cleanupResult : undefined;

      if (!refreshScrollTrigger) return;

      requestAnimationFrame(() => ScrollTrigger.refresh());
      window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DELAY_MS);
    })();
  };
}
