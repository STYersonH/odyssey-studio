import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureCopyEases } from '../../../../components/Copy/utils/copy/eases';
import { ensureLenisScroll } from '../../../../lib/lenisScroll';
import { whenFontsReady } from '../../../../utils/when-fonts-ready';
import { isPreloaderDone, markPreloaderDone } from './preloader-state';

const SEL = {
  root: '[data-preloader]',
  ring: '[data-preloader-ring]',
  count: '[data-preloader-count]',
  counter: '[data-preloader-counter]',
} as const;

/** Hop curve from the reference counter (`CustomEase.create("hop", "0.8, 0, 0.02, 1")`). */
const COUNTER_HOP = '0.8, 0, 0.02, 1';
const LOAD_TIMEOUT_MS = 6000;

/**
 * Absolute angles (deg). Positive is clockwise.
 * A needle: fast through the middle, slow as it turns around, no overshoot.
 * Wide spins first, then shorter swings, resting at 0° (the Figma position).
 */
const COMPASS_SWINGS: Array<[angle: number, duration: number]> = [
  [420, 0.9],
  [-300, 0.8],
  [180, 0.7],
  [-100, 0.62],
  [48, 0.55],
  [-20, 0.5],
  [6, 0.45],
  [0, 0.55],
];

/** Same spacing as the reference counter. The compass timeline is stretched to end with 99. */
const COUNTER_STOPS = [27, 41, 56, 72, 88, 99];
const COUNTER_START = 1;
const COUNTER_STEP = 0.75;

/** Letters fade in clockwise (N → E → S → W) before the ring starts spinning. */
const LETTER_ORDER = ['N', 'E', 'S', 'W'];
const LETTER_DURATION = 0.4;
const LETTER_STAGGER = 0.2;

const REVEAL_DELAY = 0.2;
const REVEAL_DURATION = 1.1;

let running = false;

function whenWindowLoaded() {
  if (document.readyState === 'complete') return Promise.resolve();
  const loaded = new Promise<void>((resolve) =>
    window.addEventListener('load', () => resolve(), { once: true }),
  );
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, LOAD_TIMEOUT_MS));
  return Promise.race([loaded, timeout]);
}

function skipPreloader(root: HTMLElement) {
  markPreloaderDone();
  gsap.set(root, { display: 'none' });
}

/**
 * Compass preloader: N/E/W/S spin like a compass lost in a magnetic field and settle
 * as the count reaches 99. Then the black screen lifts and the Hero intro plays.
 */
export function initPreloader() {
  const root = document.querySelector<HTMLElement>(SEL.root);
  if (!root) return;

  const ring = root.querySelector<HTMLElement>(SEL.ring);
  const count = root.querySelector<HTMLElement>(SEL.count);
  const counter = root.querySelector<HTMLElement>(SEL.counter);
  const tens = counter?.querySelector<HTMLElement>('[data-digit="tens"]');
  const ones = counter?.querySelector<HTMLElement>('[data-digit="ones"]');

  if (isPreloaderDone() || !ring || !count || !tens || !ones) {
    skipPreloader(root);
    return;
  }
  if (running) return;
  running = true;
  root.setAttribute('data-preloader-active', '');

  ensureCopyEases();
  const lenis = ensureLenisScroll();
  lenis.stop();
  document.documentElement.style.overflow = 'hidden';

  let settled = 0;
  let loaded = false;
  let revealing = false;
  let compassSettled = false;

  if (!CustomEase.get('counterHop')) CustomEase.create('counterHop', COUNTER_HOP);

  // Same counter as codegrid-realevate-landing-page/script.js
  const counterColumns = [tens, ones];

  counterColumns.forEach((column) => {
    for (let digit = 0; digit <= 9; digit++) {
      const digitElement = document.createElement('span');
      digitElement.textContent = String(digit);
      digitElement.className = 'flex h-[1em] w-[1ch] shrink-0 items-center justify-center';
      column.appendChild(digitElement);
    }
  });

  let digitHeight = counterColumns[0].querySelector('span')?.getBoundingClientRect().height || 0;

  const animateCounterTo = (value: number) => {
    const tensDigit = Math.floor(value / 10);
    const onesDigit = value % 10;

    gsap.to(counterColumns[0], {
      y: -tensDigit * digitHeight,
      duration: 0.75,
      ease: 'counterHop',
    });

    gsap.to(counterColumns[1], {
      y: -onesDigit * digitHeight,
      duration: 0.75,
      ease: 'counterHop',
    });

    root.setAttribute('aria-valuenow', String(value));
  };

  const counterEnd = COUNTER_START + COUNTER_STOPS.length * COUNTER_STEP;
  const swingTotal = COMPASS_SWINGS.reduce((sum, [, duration]) => sum + duration, 0);
  const swingScale = counterEnd / swingTotal;

  const compass = gsap.timeline({
    paused: true,
    onComplete: () => {
      compassSettled = true;
    },
  });
  for (const [angle, duration] of COMPASS_SWINGS) {
    compass.to(ring, { rotation: angle, duration: duration * swingScale, ease: 'sine.inOut' });
  }

  const tick = () => {
    if (!revealing && loaded && settled === 99 && compassSettled) reveal();
  };

  const finish = () => {
    root.remove();
    const html = document.documentElement;
    html.style.removeProperty('overflow');
    html.style.removeProperty('overflow-x');
    html.style.removeProperty('overflow-y');
    // lenis-stopped keeps overflow:hidden, so the scrollbar cannot return until Lenis starts.
    lenis.start();

    const settle = () => {
      const vw = html.clientWidth;
      const locked = [...document.querySelectorAll<HTMLElement>('body *')].filter(
        (el) => el.style.width && el.getBoundingClientRect().right > vw + 1,
      );
      locked.forEach((el) => {
        el.style.width = '';
        el.style.maxWidth = '';
      });
      ScrollTrigger.refresh();
      running = false;
    };

    const waitForScrollbar = (frame = 0) => {
      const barIsVisible = html.clientWidth < window.innerWidth;
      if (barIsVisible || frame >= 30) {
        settle();
        return;
      }
      requestAnimationFrame(() => waitForScrollbar(frame + 1));
    };

    requestAnimationFrame(() => waitForScrollbar());
  };

  const reveal = () => {
    revealing = true;
    gsap.ticker.remove(tick);
    compass.kill();
    gsap.set(ring, { rotation: 0 });

    const lift = REVEAL_DELAY + 0.3;
    gsap
      .timeline({ onComplete: finish })
      .to([ring, count], { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, REVEAL_DELAY)
      .to(root, { yPercent: -100, duration: REVEAL_DURATION, ease: 'hop' }, lift)
      .call(markPreloaderDone, [], lift + REVEAL_DURATION * 0.35);
  };

  gsap.ticker.add(tick);

  // Fonts first, then one frame so the letters are painted before the first spin.
  void whenFontsReady().then(() => {
    requestAnimationFrame(() => {
      if (revealing) return;

      const measured = counterColumns[0].querySelector('span')?.getBoundingClientRect().height;
      if (measured) digitHeight = measured;

      const letters = LETTER_ORDER.map((letter) =>
        ring.querySelector<HTMLElement>(`[data-preloader-letter="${letter}"]`),
      ).filter((letter): letter is HTMLElement => letter !== null);

      gsap.set(letters, { autoAlpha: 0 });

      const beginSpin = () => {
        compass.play();

        COUNTER_STOPS.forEach((value, index) => {
          gsap.delayedCall(COUNTER_START + index * COUNTER_STEP, () => animateCounterTo(value));
        });

        const countDone = new Promise<void>((resolve) => {
          gsap.delayedCall(counterEnd, resolve);
        });

        void Promise.all([countDone, whenWindowLoaded()]).then(() => {
          settled = 99;
          loaded = true;
        });
      };

      gsap.to(letters, {
        autoAlpha: 1,
        duration: LETTER_DURATION,
        stagger: LETTER_STAGGER,
        ease: 'power2.out',
        onComplete: beginSpin,
      });
    });
  });
}
