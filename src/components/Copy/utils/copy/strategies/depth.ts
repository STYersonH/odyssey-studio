import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { resolveCopyDuration, resolveCopyEase } from '../eases';
import { createMaskedRevealStrategy } from '../masked-reveal';

const BLUR_START_PX = 12;
const PERSPECTIVE_PX = 900;
const ROTATE_X_START = 120;
const Z_START = 20;

/**
 * Depth strategy — 3D word reveal (perspective + rotateX + Z + blur).
 *
 * Words pivot from the **top** edge into the plane (bottom swings from depth),
 * clearing focus as they land. Stagger left → right.
 * Supports play-once, `reverse`, and scrub. Always splits by words.
 */
export const depthStrategy = createMaskedRevealStrategy({
  id: 'depth',
  defaults: {
    start: 'top 85%',
    end: 'top 35%',
    stagger: 0.1,
    scrub: false,
    ease: 'power3.out',
    duration: 1.15,
  },

  createSplit(element, onSplit) {
    return SplitText.create(element, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit,
    });
  },

  getUnits(split) {
    return (split.words ?? []) as HTMLElement[];
  },

  setInitial(units) {
    const root = units[0]?.closest<HTMLElement>('[data-copy]');
    if (root) {
      gsap.set(root, {
        perspective: PERSPECTIVE_PX,
        transformStyle: 'preserve-3d',
      });
    }

    gsap.set(units, {
      transformPerspective: PERSPECTIVE_PX,
      // Top edge fixed; bottom swings in from depth (matches reference).
      transformOrigin: '50% 0%',
      rotationX: ROTATE_X_START,
      z: Z_START,
      filter: `blur(${BLUR_START_PX}px)`,
      autoAlpha: 0,
    });
  },

  buildTween(units, { scrub, paused, options }) {
    return gsap.to(units, {
      rotationX: 0,
      z: 0,
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
