import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { resolveCopyDuration, resolveCopyEase } from '../eases';
import { createMaskedRevealStrategy } from '../masked-reveal';
import { preserveTextIndent } from '../shared';

/**
 * Slide strategy — masked line/word reveal via SplitText + yPercent.
 * Supports play-once, `reverse`, and scrubbed progress.
 */
export const slideStrategy = createMaskedRevealStrategy({
  id: 'slide',
  defaults: {
    start: 'top 80%',
    end: 'top 20%',
    stagger: 0.05,
    scrub: false,
    ease: 'power3.out',
    duration: 0.9,
  },

  createSplit(element, onSplit, options) {
    if (options.type === 'chars') {
      return SplitText.create(element, {
        type: 'chars',
        mask: 'chars',
        charsClass: 'char',
        autoSplit: true,
        onSplit,
      });
    }

    const isWordSplit = options.type === 'words';
    return SplitText.create(element, {
      type: isWordSplit ? 'words' : 'lines',
      mask: isWordSplit ? 'words' : 'lines',
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
    gsap.set(units, { yPercent: 110 });
  },

  buildTween(units, { scrub, paused, options }) {
    return gsap.to(units, {
      yPercent: 0,
      duration: resolveCopyDuration(scrub, options.duration),
      ease: resolveCopyEase(scrub, options.ease),
      delay: scrub ? 0 : options.delay,
      stagger: options.stagger,
      paused,
    });
  },
});
