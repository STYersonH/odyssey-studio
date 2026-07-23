import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createScrambleSplit,
  playScrambleIn,
  revertScrambleInstance,
  type ScrambleInstance,
} from '../../scramble';
import { COPY_READY_CLASS, createScrollTrigger } from '../shared';
import type { CopyStrategy } from '../types';

const SCRAMBLE_OPTIONS = {
  duration: 0.15,
  charDelay: 50,
  stagger: 25,
  maxIterations: 5,
};

/**
 * Flicker strategy — character scramble reveal via scramble util.
 * Note: `scrub` and `reverse` are ignored (scramble uses timers, not a
 * scrubbable tween).
 */
export const flickerStrategy: CopyStrategy = {
  id: 'flicker',
  defaults: {
    start: 'top 85%',
    stagger: 0.1,
  },

  setup(ctx) {
    const { root, targetElements, options, triggerElement } = ctx;

    const scrollTriggers: ScrollTrigger[] = [];
    let scrambleInstances: ScrambleInstance[] = [];

    root.classList.remove(COPY_READY_CLASS);

    scrambleInstances = targetElements
      .map((element) => createScrambleSplit(element))
      .filter((instance): instance is ScrambleInstance => Boolean(instance));

    root.classList.add(COPY_READY_CLASS);

    const runScrambleSequence = () => {
      scrambleInstances.forEach((instance, index) => {
        playScrambleIn(
          instance,
          options.delay + index * options.stagger,
          SCRAMBLE_OPTIONS,
        );
      });
    };

    // Scrub / reverse not supported — keep play-once / mount behavior.
    if (options.animateOnScroll) {
      const st = createScrollTrigger({
        animateOnScroll: true,
        scrub: false,
        triggerElement,
        start: options.start,
        onEnter: runScrambleSequence,
      });
      if (st) scrollTriggers.push(st);
    } else {
      runScrambleSequence();
    }

    return {
      cleanup() {
        scrollTriggers.forEach((st) => st?.kill());
        scrollTriggers.length = 0;

        scrambleInstances.forEach(revertScrambleInstance);
        scrambleInstances = [];

        root.classList.remove(COPY_READY_CLASS);
      },
    };
  },
};
