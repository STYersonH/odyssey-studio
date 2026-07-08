import gsap from 'gsap';
import type { SplitText } from 'gsap/SplitText';

const ANIM_SELECTOR = '[data-anim], [data-anim] *';

/** Revert SplitText instances and empty the tracking array. */
export function revertSplitTextInstances(splits: SplitText[]) {
  splits.forEach((split) => split.revert());
  splits.length = 0;
}

/**
 * Reset inline styles and tweens on animated nodes inside a section root.
 * Pass `splits` when the section uses SplitText so instances are reverted first.
 */
export function clearSectionStyles(root: HTMLElement, splits?: SplitText[]) {
  if (splits?.length) revertSplitTextInstances(splits);

  const targets = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(ANIM_SELECTOR));

  targets.forEach((el) => el.removeAttribute('style'));
  gsap.killTweensOf(targets);
}
