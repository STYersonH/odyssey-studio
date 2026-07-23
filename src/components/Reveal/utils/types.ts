/** Direction the element travels from (enter) or toward (exit). */
export type RevealDirection = 'left' | 'right' | 'top' | 'bottom';

/** `false` = play once. `true` / number = scrub (number = lag smoothness). */
export type RevealScrub = boolean | number;

export type RevealOptions = {
  animateOnScroll: boolean;
  delay: number;
  stagger: number;
  /** Enter: where units come from. */
  from: RevealDirection;
  /**
   * Exit: where units go on reverse / leave-back.
   * Defaults to `from` (play the enter tween backwards).
   */
  out: RevealDirection;
  /** Pixel travel for the offset. */
  distance: number;
  trigger: string | null;
  start: string;
  end: string;
  scrub: RevealScrub;
  reverse: boolean;
  ease: string;
  duration: number;
};

export type RevealController = {
  cleanup: () => void;
};
