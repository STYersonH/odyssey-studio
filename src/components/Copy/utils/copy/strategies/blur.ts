import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { resolveCopyDuration, resolveCopyEase } from '../eases';
import { createMaskedRevealStrategy } from '../masked-reveal';
import { preserveTextIndent } from '../shared';

/** Starting blur radius (px). Strong enough to match a soft fade-out look. */
const BLUR_START_PX = 16;

/**
 * Blur strategy — line (or word) reveal from heavy blur → sharp.
 *
 * With stagger (+ scrub), early lines clear first while later ones stay
 * soft — the progressive focus gradient from the reference image.
 * Supports play-once, `reverse`, and scrub.
 */
export const blurStrategy = createMaskedRevealStrategy({
  id: 'blur',
  defaults: {
    start: 'top 85%',
    end: 'top 25%',
    stagger: 0.12,
    scrub: false,
    ease: 'power2.out',
    duration: 1.1,
  },

  createSplit(element, onSplit, options) {
    if (options.type === 'chars') {
      return SplitText.create(element, {
        type: 'chars',
        charsClass: 'char',
        autoSplit: true,
        onSplit,
      });
    }

    const isWordSplit = options.type === 'words';
    return SplitText.create(element, {
      type: isWordSplit ? 'words' : 'lines',
      autoSplit: true,
      ...(isWordSplit
        ? { wordsClass: 'word' }
        : { linesClass: 'line', lineThreshold: 0.1 }),
      onSplit,
    });
  },

  getUnits(split, element, options) {
    const key =
      options.type === 'chars'
        ? 'chars'
        : options.type === 'words'
          ? 'words'
          : 'lines';
    const units = (split[key] ?? []) as HTMLElement[];
    preserveTextIndent(element, units);
    return units;
  },

  setInitial(units) {
    gsap.set(units, {
      filter: `blur(${BLUR_START_PX}px)`,
      autoAlpha: 0.35,
    });
  },

  buildTween(units, { scrub, paused, options }) {
    return gsap.to(units, {
      filter: 'blur(0px)',
      autoAlpha: 1,
      duration: resolveCopyDuration(scrub, options.duration),
      ease: resolveCopyEase(scrub, options.ease),
      delay: scrub ? 0 : options.delay,
      stagger: options.stagger,
      paused,
    });
  },
});
