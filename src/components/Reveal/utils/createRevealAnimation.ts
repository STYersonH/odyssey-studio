import gsap from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RevealController, RevealOptions } from './types';
import {
  REVEAL_READY_CLASS,
  createRevealScrollTrigger,
  getRevealTargets,
  isScrubEnabled,
  offsetFor,
  resolveTriggerElement,
} from './shared';

const DEFAULTS: RevealOptions = {
  animateOnScroll: true,
  delay: 0,
  stagger: 0.08,
  from: 'right',
  out: 'right',
  distance: 72,
  trigger: null,
  start: 'top 80%',
  end: 'top 20%',
  scrub: false,
  reverse: false,
  ease: 'power3.out',
  duration: 0.75,
};

export type CreateRevealAnimationParams = {
  root: HTMLElement;
  options: Partial<RevealOptions>;
  isActive: () => boolean;
};

/**
 * Stagger children in/out by direction.
 * - scrub: single from→visible tween tied to scroll (`out` ignored; scrub reverses)
 * - reverse + same out/from: toggleActions reverse
 * - reverse + different `out`: custom enter / leave-back tweens
 */
export function createRevealAnimation({
  root,
  options: partial,
  isActive,
}: CreateRevealAnimationParams): RevealController | null {
  const options: RevealOptions = {
    ...DEFAULTS,
    ...partial,
    out: partial.out ?? partial.from ?? DEFAULTS.out,
  };

  const targets = getRevealTargets(root);
  if (!targets.length) {
    root.classList.add(REVEAL_READY_CLASS);
    return { cleanup: () => root.classList.remove(REVEAL_READY_CLASS) };
  }

  const scrub = isScrubEnabled(options.scrub);
  const fromOffset = offsetFor(options.from, options.distance);
  const outOffset = offsetFor(options.out, options.distance);
  const asymmetricExit = options.reverse && options.out !== options.from && !scrub;

  const triggerElement = resolveTriggerElement(options.trigger, root);
  const scrollTriggers: ScrollTrigger[] = [];
  let enterTween: gsap.core.Tween | null = null;
  let exitTween: gsap.core.Tween | null = null;

  root.classList.remove(REVEAL_READY_CLASS);

  // Kill CSS transitions on animated props — Tailwind `transition` on buttons
  // otherwise lags behind GSAP and feels like the element “holds” mid-move.
  gsap.set(targets, {
    ...fromOffset,
    autoAlpha: 0,
    force3D: true,
  });
  // Prevent Tailwind/CSS `transition` from lagging transform/opacity behind GSAP.
  targets.forEach((el) => {
    el.style.setProperty('transition', 'none', 'important');
  });

  root.classList.add(REVEAL_READY_CLASS);

  const playEnter = () => {
    exitTween?.kill();
    enterTween?.kill();
    enterTween = gsap.to(targets, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: scrub ? 1 : options.duration,
      stagger: options.stagger,
      delay: scrub ? 0 : options.delay,
      ease: scrub ? 'none' : options.ease,
      overwrite: 'auto',
    });
    return enterTween;
  };

  const playExit = () => {
    enterTween?.kill();
    exitTween?.kill();
    exitTween = gsap.to(targets, {
      ...outOffset,
      autoAlpha: 0,
      duration: options.duration * 0.75,
      stagger: { each: options.stagger * 0.75, from: 'end' },
      ease: 'power3.in',
      overwrite: 'auto',
    });
    return exitTween;
  };

  if (scrub) {
    const tween = gsap.fromTo(
      targets,
      { ...fromOffset, autoAlpha: 0 },
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: options.stagger,
        ease: 'none',
        paused: true,
      },
    );
    enterTween = tween;

    const st = createRevealScrollTrigger({
      animateOnScroll: true,
      triggerElement,
      start: options.start,
      end: options.end,
      scrub: options.scrub,
      animation: tween,
    });
    if (st) scrollTriggers.push(st);
  } else if (asymmetricExit) {
    const st = createRevealScrollTrigger({
      animateOnScroll: options.animateOnScroll,
      triggerElement,
      start: options.start,
      reverse: true,
      onEnter: () => {
        if (isActive()) playEnter();
      },
      onLeaveBack: () => {
        if (isActive()) playExit();
      },
    });
    if (st) scrollTriggers.push(st);
    else playEnter();
  } else {
    const tween = gsap.to(targets, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: options.duration,
      stagger: options.stagger,
      delay: options.delay,
      ease: options.ease,
      paused: options.animateOnScroll,
    });
    enterTween = tween;

    const st = createRevealScrollTrigger({
      animateOnScroll: options.animateOnScroll,
      triggerElement,
      start: options.start,
      reverse: options.reverse,
      animation: tween,
    });
    if (st) scrollTriggers.push(st);
    else tween.play();
  }

  return {
    cleanup() {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers.length = 0;
      enterTween?.kill();
      exitTween?.kill();
      enterTween = null;
      exitTween = null;
      gsap.set(targets, {
        clearProps: 'transform,opacity,visibility,transition',
      });
      targets.forEach((el) => {
        el.style.removeProperty('transition');
      });
      root.classList.remove(REVEAL_READY_CLASS);
    },
  };
}
