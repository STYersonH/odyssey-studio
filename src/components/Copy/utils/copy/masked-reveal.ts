import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ensureCopyEases } from './eases';
import { COPY_READY_CLASS, createScrollTrigger, isScrubEnabled } from './shared';
import type {
  CopyOptions,
  CopyStrategy,
  CopyStrategyDefaults,
} from './types';

gsap.registerPlugin(SplitText, ScrollTrigger);

export type MaskedRevealTweenContext = {
  scrub: boolean;
  paused: boolean;
  options: CopyOptions;
};

export type MaskedRevealConfig = {
  id: string;
  defaults: CopyStrategyDefaults;
  /** Split one source element into a SplitText (chars / lines / words). */
  createSplit: (
    element: HTMLElement,
    onSplit: () => void,
    options: CopyOptions,
  ) => SplitText;
  /** Extract the units to animate from a split (+ any mask/indent fixups). */
  getUnits: (
    split: SplitText,
    element: HTMLElement,
    options: CopyOptions,
  ) => HTMLElement[];
  /** Set the pre-reveal state (e.g. yPercent: 110). */
  setInitial: (units: HTMLElement[]) => void;
  /** Build the reveal tween (paused; scroll/mount decides playback). */
  buildTween: (
    units: HTMLElement[],
    ctx: MaskedRevealTweenContext,
  ) => gsap.core.Tween;
};

/**
 * Shared lifecycle for masked SplitText reveals (slide, random, blur, depth…).
 *
 * Handles fonts-ready visibility, (re)splitting on resize, a single combined
 * tween across all target elements, and scroll/mount playback — including
 * `scrub` and `reverse`. Variants only provide the split + tween specifics.
 */
export function createMaskedRevealStrategy(
  config: MaskedRevealConfig,
): CopyStrategy {
  return {
    id: config.id,
    defaults: config.defaults,

    setup(ctx, helpers) {
      ensureCopyEases();

      const { root, targetElements, options, triggerElement } = ctx;
      const { scheduleRebuild } = helpers;

      const splitInstances: SplitText[] = [];
      const scrollTriggers: ScrollTrigger[] = [];
      let combinedTween: gsap.core.Tween | null = null;

      const setReady = (ready: boolean) => {
        root.classList.toggle(COPY_READY_CLASS, ready);
      };

      const clearScrollTriggers = () => {
        scrollTriggers.forEach((st) => st?.kill());
        scrollTriggers.length = 0;
      };

      const runCombinedAnimation = () => {
        combinedTween?.kill();
        combinedTween = null;
        clearScrollTriggers();

        const units: HTMLElement[] = [];
        targetElements.forEach((element, index) => {
          const split = splitInstances[index];
          if (!split) return;
          units.push(...config.getUnits(split, element, options));
        });

        if (units.length === 0) {
          setReady(true);
          return;
        }

        config.setInitial(units);
        setReady(true);

        const scrub = isScrubEnabled(options.scrub);
        const paused = scrub || options.animateOnScroll;

        combinedTween = config.buildTween(units, { scrub, paused, options });

        const st = createScrollTrigger({
          animateOnScroll: options.animateOnScroll,
          scrub: options.scrub,
          reverse: options.reverse,
          triggerElement,
          start: options.start,
          end: options.end,
          animation: combinedTween,
        });
        if (st) scrollTriggers.push(st);

        if (!paused) combinedTween.play();
      };

      const createSplits = () => {
        setReady(false);

        splitInstances.forEach((split) => split?.revert());
        splitInstances.length = 0;

        targetElements.forEach((element) => {
          const split = config.createSplit(
            element,
            () => scheduleRebuild(runCombinedAnimation),
            options,
          );
          splitInstances.push(split);
        });
      };

      createSplits();

      return {
        cleanup() {
          combinedTween?.kill();
          combinedTween = null;
          clearScrollTriggers();
          splitInstances.forEach((split) => split?.revert());
          splitInstances.length = 0;
          setReady(false);
        },
      };
    },
  };
}
