import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ensureCopyEases, resolveCopyDuration, resolveCopyEase } from '../eases';
import {
  COPY_READY_CLASS,
  createScrollTrigger,
  isScrubEnabled,
} from '../shared';
import type { CopySplitType, CopyStrategy } from '../types';

gsap.registerPlugin(SplitText, ScrollTrigger);

const PERSPECTIVE_PX = 700;
const ROTATE_X_START = -90;
const TRANSFORM_ORIGIN = '50% 50% -50px';
/** Max random offset (s) between word/line groups in play-once mode. */
const GROUP_OFFSET_MAX = 0.4;

type WordGroup = { chars: HTMLElement[] };

function createSplitForType(
  element: HTMLElement,
  type: CopySplitType,
  onSplit: () => void,
) {
  if (type === 'chars') {
    return SplitText.create(element, {
      type: 'words,chars',
      wordsClass: 'word',
      charsClass: 'char',
      autoSplit: true,
      onSplit,
    });
  }

  if (type === 'words') {
    return SplitText.create(element, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit,
    });
  }

  return SplitText.create(element, {
    type: 'lines',
    linesClass: 'line',
    lineThreshold: 0.1,
    autoSplit: true,
    onSplit,
  });
}

function collectTargets(
  splits: SplitText[],
  type: CopySplitType,
): { groups: WordGroup[]; flat: HTMLElement[]; hosts: HTMLElement[] } {
  const groups: WordGroup[] = [];
  const flat: HTMLElement[] = [];
  const hosts: HTMLElement[] = [];

  splits.forEach((split) => {
    if (type === 'chars') {
      (split.words ?? []).forEach((word) => {
        const host = word as HTMLElement;
        hosts.push(host);
        const chars = Array.from(
          host.querySelectorAll<HTMLElement>('.char'),
        );
        if (chars.length === 0) return;
        groups.push({ chars });
        flat.push(...chars);
      });
      return;
    }

    const units = (
      type === 'words' ? (split.words ?? []) : (split.lines ?? [])
    ) as HTMLElement[];

    units.forEach((unit) => {
      hosts.push(unit);
      groups.push({ chars: [unit] });
      flat.push(unit);
    });
  });

  return { groups, flat, hosts };
}

/**
 * Random strategy — 3D flip reveal (rotateX) with random stagger.
 *
 * - `chars`: split words+chars; each word flips its chars with `from: "random"`
 * - `words` / `lines`: same motion on those units
 *
 * Supports play-once, `reverse`, and scrub.
 */
export const randomStrategy: CopyStrategy = {
  id: 'random',
  defaults: {
    start: 'top 80%',
    end: 'top 20%',
    stagger: 0.035,
    scrub: false,
    ease: 'power3.out',
    duration: 0.75,
  },

  setup(ctx, helpers) {
    ensureCopyEases();

    const { root, targetElements, options, triggerElement } = ctx;
    const { scheduleRebuild } = helpers;

    const splitInstances: SplitText[] = [];
    const scrollTriggers: ScrollTrigger[] = [];
    let timeline: gsap.core.Timeline | null = null;

    const setReady = (ready: boolean) => {
      root.classList.toggle(COPY_READY_CLASS, ready);
    };

    const clearScrollTriggers = () => {
      scrollTriggers.forEach((st) => st?.kill());
      scrollTriggers.length = 0;
    };

    const runAnimation = () => {
      timeline?.kill();
      timeline = null;
      clearScrollTriggers();

      const { groups, flat, hosts } = collectTargets(
        splitInstances,
        options.type,
      );

      if (flat.length === 0) {
        setReady(true);
        return;
      }

      const scrub = isScrubEnabled(options.scrub);
      const duration = resolveCopyDuration(scrub, options.duration);
      const ease = resolveCopyEase(scrub, options.ease);
      const paused = scrub || options.animateOnScroll;

      gsap.set(targetElements, {
        perspective: PERSPECTIVE_PX,
        transformStyle: 'preserve-3d',
      });

      gsap.set(hosts, {
        transformStyle: 'preserve-3d',
      });

      gsap.set(flat, {
        opacity: 0,
        rotationX: ROTATE_X_START,
        transformOrigin: TRANSFORM_ORIGIN,
        transformPerspective: PERSPECTIVE_PX,
      });

      setReady(true);

      const tl = gsap.timeline({
        paused,
        delay: scrub ? 0 : options.delay,
      });

      groups.forEach(({ chars }, index) => {
        const wordTl = gsap.timeline().to(chars, {
          rotationX: 0,
          opacity: 1,
          duration,
          ease,
          stagger:
            chars.length > 1
              ? { each: options.stagger, from: 'random' }
              : 0,
        });

        // Scrub needs stable offsets; play-once keeps the organic random lead-in.
        const at = scrub
          ? index * options.stagger
          : Math.random() * GROUP_OFFSET_MAX;

        tl.add(wordTl, at);
      });

      timeline = tl;

      const st = createScrollTrigger({
        animateOnScroll: options.animateOnScroll,
        scrub: options.scrub,
        reverse: options.reverse,
        triggerElement,
        start: options.start,
        end: options.end,
        animation: timeline,
      });
      if (st) scrollTriggers.push(st);

      if (!paused) timeline.play();
    };

    const createSplits = () => {
      setReady(false);

      splitInstances.forEach((split) => split?.revert());
      splitInstances.length = 0;

      targetElements.forEach((element) => {
        const split = createSplitForType(element, options.type, () =>
          scheduleRebuild(runAnimation),
        );
        splitInstances.push(split);
      });

      // First paint / when autoSplit doesn't fire onSplit immediately.
      scheduleRebuild(runAnimation);
    };

    createSplits();

    return {
      cleanup() {
        timeline?.kill();
        timeline = null;
        clearScrollTriggers();
        splitInstances.forEach((split) => split?.revert());
        splitInstances.length = 0;
        gsap.set(targetElements, { clearProps: 'perspective,transformStyle' });
        setReady(false);
      },
    };
  },
};
