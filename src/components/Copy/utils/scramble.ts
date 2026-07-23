import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
const SCRAMBLE_DURATION = 0.25;
const SCRAMBLE_STAGGER = 50;

type ScrambleCharEl = HTMLElement & {
  scrambleInterval?: ReturnType<typeof setInterval> | null;
  scrambleTimeout?: ReturnType<typeof setTimeout> | null;
  staggerTimeout?: ReturnType<typeof setTimeout> | null;
};

export type ScrambleInstance = {
  wordSplit: SplitText;
  charSplits: SplitText[];
  allChars: Element[];
  playTimeout: ReturnType<typeof setTimeout> | null;
};

export type ScrambleOptions = {
  duration?: number;
  charDelay?: number;
  stagger?: number;
  maxIterations?: number | null;
};

function scrambleChar(
  charEl: ScrambleCharEl,
  showAfter = true,
  duration = SCRAMBLE_DURATION,
  charDelay = 50,
  maxIterations: number | null = null,
) {
  if (!charEl.dataset.originalText) {
    charEl.dataset.originalText = charEl.textContent ?? '';
  }
  const originalText = charEl.dataset.originalText;
  let iterations = 0;
  const iterationsCount = maxIterations || Math.floor(Math.random() * 6) + 3;

  if (showAfter) gsap.set(charEl, { opacity: 1 });

  if (charEl.scrambleInterval) clearInterval(charEl.scrambleInterval);
  if (charEl.scrambleTimeout) clearTimeout(charEl.scrambleTimeout);

  const interval = setInterval(() => {
    if (originalText === ' ') {
      charEl.textContent = ' ';
    } else {
      charEl.textContent =
        SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    iterations++;

    if (iterations >= iterationsCount) {
      clearInterval(interval);
      charEl.scrambleInterval = null;
      charEl.textContent = originalText;
      if (!showAfter) gsap.set(charEl, { opacity: 0 });
    }
  }, charDelay);

  charEl.scrambleInterval = interval;

  const timeout = setTimeout(() => {
    clearInterval(interval);
    charEl.scrambleInterval = null;
    charEl.scrambleTimeout = null;
    charEl.textContent = originalText;
    if (!showAfter) gsap.set(charEl, { opacity: 0 });
  }, duration * 1000);

  charEl.scrambleTimeout = timeout;
}

function scrambleText(
  elements: Element[],
  showAfter = true,
  duration = SCRAMBLE_DURATION,
  charDelay = 50,
  stagger = SCRAMBLE_STAGGER,
  maxIterations: number | null = null,
) {
  elements.forEach((el, index) => {
    const charEl = el as ScrambleCharEl;
    if (charEl.staggerTimeout) clearTimeout(charEl.staggerTimeout);

    const staggerTimeout = setTimeout(() => {
      scrambleChar(charEl, showAfter, duration, charDelay, maxIterations);
      charEl.staggerTimeout = null;
    }, index * stagger);

    charEl.staggerTimeout = staggerTimeout;
  });
}

/** Split element into words/chars and hide chars for scramble-in setup. */
export function createScrambleSplit(element: HTMLElement): ScrambleInstance | null {
  if (!element?.textContent?.trim()) return null;

  const wordSplit = new SplitText(element, { type: 'words' });
  const charSplits = wordSplit.words.map(
    (word) => new SplitText(word, { type: 'chars' }),
  );

  const allChars: Element[] = [];
  charSplits.forEach((split) => allChars.push(...split.chars));

  gsap.set(allChars, { opacity: 0 });

  return { wordSplit, charSplits, allChars, playTimeout: null };
}

/** Play scramble-in on an existing split instance after optional delay. */
export function playScrambleIn(
  instance: ScrambleInstance,
  delay = 0,
  options: ScrambleOptions = {},
) {
  if (!instance?.allChars?.length) return;

  const {
    duration = SCRAMBLE_DURATION,
    charDelay = 50,
    stagger = SCRAMBLE_STAGGER,
    maxIterations = null,
  } = options;

  instance.allChars.forEach((el) => clearScrambleCharTimers(el as ScrambleCharEl));

  if (instance.playTimeout) {
    clearTimeout(instance.playTimeout);
    instance.playTimeout = null;
  }

  gsap.set(instance.allChars, { opacity: 0 });

  instance.playTimeout = setTimeout(() => {
    instance.playTimeout = null;
    scrambleText(
      instance.allChars,
      true,
      duration,
      charDelay,
      stagger,
      maxIterations,
    );
  }, delay * 1000);
}

/** Split element and trigger scramble-in in one call. */
export function scrambleIn(
  element: HTMLElement,
  delay = 0,
  options: ScrambleOptions = {},
) {
  const instance = createScrambleSplit(element);
  if (!instance) return null;

  playScrambleIn(instance, delay, options);
  return instance;
}

/** Scramble-out chars in reverse order. */
export function scrambleOut(
  element: HTMLElement,
  delay = 0,
  options: ScrambleOptions = {},
) {
  if (!element) return null;

  const {
    duration = SCRAMBLE_DURATION,
    charDelay = 50,
    stagger = SCRAMBLE_STAGGER,
    maxIterations = null,
  } = options;

  const existing = element.querySelectorAll('[data-original-text], .char');

  if (existing.length === 0) {
    const wordSplit = new SplitText(element, { type: 'words' });
    const charSplits = wordSplit.words.map(
      (word) => new SplitText(word, { type: 'chars' }),
    );
    const chars: Element[] = [];
    charSplits.forEach((split) => chars.push(...split.chars));

    gsap.set(chars, { opacity: 1 });

    setTimeout(() => {
      scrambleText(
        [...chars].reverse(),
        false,
        duration,
        charDelay,
        stagger,
        maxIterations,
      );
    }, delay * 1000);

    return { wordSplit, charSplits, allChars: chars, playTimeout: null };
  }

  gsap.set(existing, { opacity: 1 });

  setTimeout(() => {
    scrambleText(
      [...existing].reverse(),
      false,
      duration,
      charDelay,
      stagger,
      maxIterations,
    );
  }, delay * 1000);

  return null;
}

/** Clear all scramble-related timers on a single char element. */
export function clearScrambleCharTimers(charEl: ScrambleCharEl | null) {
  if (!charEl) return;

  if (charEl.scrambleInterval) {
    clearInterval(charEl.scrambleInterval);
    charEl.scrambleInterval = null;
  }
  if (charEl.scrambleTimeout) {
    clearTimeout(charEl.scrambleTimeout);
    charEl.scrambleTimeout = null;
  }
  if (charEl.staggerTimeout) {
    clearTimeout(charEl.staggerTimeout);
    charEl.staggerTimeout = null;
  }
}

/** Revert SplitText and cancel all timers for a scramble instance. */
export function revertScrambleInstance(instance: ScrambleInstance | null) {
  if (!instance) return;

  if (instance.playTimeout) {
    clearTimeout(instance.playTimeout);
    instance.playTimeout = null;
  }

  instance.allChars?.forEach((el) => clearScrambleCharTimers(el as ScrambleCharEl));
  instance.charSplits?.forEach((split) => split?.revert());
  instance.wordSplit?.revert();
}

/** Split visible text and scramble chars without hiding first. */
export function scrambleVisible(
  element: HTMLElement,
  delay = 0,
  options: ScrambleOptions = {},
) {
  if (!element?.textContent?.trim()) return null;

  const {
    duration = SCRAMBLE_DURATION,
    charDelay = 50,
    stagger = SCRAMBLE_STAGGER,
    maxIterations = null,
  } = options;

  const wordSplit = new SplitText(element, { type: 'words' });
  const charSplits = wordSplit.words.map(
    (word) => new SplitText(word, { type: 'chars' }),
  );

  const allChars: Element[] = [];
  charSplits.forEach((split) => allChars.push(...split.chars));

  gsap.set(allChars, { opacity: 1 });

  setTimeout(() => {
    scrambleText(allChars, true, duration, charDelay, stagger, maxIterations);
  }, delay * 1000);

  return { wordSplit, charSplits, allChars, playTimeout: null };
}
