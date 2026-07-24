export type CopyVariant =
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'slide'
  | 'flicker'
  | 'random'
  | 'blur'
  | 'depth'
  | (string & {});

export type CopySplitType = 'lines' | 'words' | 'chars';

/** `false` = play once on enter. `true` / number = scrub (number = lag smoothness). */
export type CopyScrub = boolean | number;

/**
 * GSAP ease id for play-once / mount (ignored when `scrub` is on → always `none`).
 * Built-ins: `power1.out`, `power3.out`, `circ.out`, `expo.out`, … plus custom `hop`.
 */
export type CopyEase = string;

export type CopyOptions = {
  animateOnScroll: boolean;
  delay: number;
  stagger: number;
  type: CopySplitType;
  trigger: string | null;
  triggerPoint: string | null;
  start: string;
  /** ScrollTrigger end — used when `scrub` is enabled. */
  end: string;
  scrub: CopyScrub;
  /**
   * Play-once only: reverse back to the initial state when scrolling up past
   * `start` (and replay when scrolling down again). Ignored with `scrub`.
   */
  reverse: boolean;
  /** GSAP ease when not scrubbing. Ignored with `scrub`. */
  ease: CopyEase;
  /** Tween duration in seconds. Strategy default if omitted. */
  duration: number;
};

export type CopyStrategyDefaults = {
  start: string;
  stagger: number;
  end?: string;
  scrub?: CopyScrub;
  ease?: CopyEase;
  duration?: number;
};

export type CopyStrategyContext = {
  root: HTMLElement;
  targetElements: HTMLElement[];
  options: CopyOptions;
  triggerElement: HTMLElement;
};

export type CopyStrategyHelpers = {
  scheduleRebuild: (run: () => void) => void;
  isActive: () => boolean;
};

export type CopyStrategyInstance = {
  cleanup: () => void;
};

export type CopyStrategy = {
  id: string;
  defaults: CopyStrategyDefaults;
  setup: (ctx: CopyStrategyContext, helpers: CopyStrategyHelpers) => CopyStrategyInstance;
};
