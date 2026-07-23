import { ensureCopyEases } from './eases';
import {
  createRebuildScheduler,
  getAnimatableElements,
  resolveTriggerElement,
  waitForFonts,
} from './shared';
import { getCopyStrategy } from './strategies';
import type { CopyEase, CopyOptions, CopyScrub, CopySplitType } from './types';

export type CreateCopyAnimationParams = {
  root: HTMLElement;
  variant: string;
  options: Partial<{
    animateOnScroll: boolean;
    delay: number;
    stagger: number | null;
    type: CopySplitType;
    trigger: string | null;
    triggerPoint: string | null;
    start: string | null;
    end: string | null;
    scrub: CopyScrub;
    reverse: boolean;
    ease: CopyEase | null;
    duration: number | null;
  }>;
  isActive: () => boolean;
};

/**
 * Build a Copy animation controller for a root element.
 * Orchestrates fonts → strategy setup → cleanup.
 */
export async function createCopyAnimation({
  root,
  variant,
  options,
  isActive,
}: CreateCopyAnimationParams): Promise<{ cleanup: () => void } | null> {
  await waitForFonts();
  if (!isActive() || !root) return null;

  ensureCopyEases();

  const strategy = getCopyStrategy(variant);

  const mergedOptions: CopyOptions = {
    animateOnScroll: options.animateOnScroll ?? true,
    delay: options.delay ?? 0,
    type: options.type ?? 'lines',
    trigger: options.trigger ?? null,
    triggerPoint: options.triggerPoint ?? null,
    stagger: options.stagger ?? strategy.defaults.stagger,
    start: options.start ?? strategy.defaults.start,
    end: options.end ?? strategy.defaults.end ?? 'top 20%',
    scrub: options.scrub ?? strategy.defaults.scrub ?? false,
    reverse: options.reverse ?? false,
    ease: options.ease ?? strategy.defaults.ease ?? 'power3.out',
    duration: options.duration ?? strategy.defaults.duration ?? 0.75,
  };

  const rebuildScheduler = createRebuildScheduler(isActive);
  const targetElements = getAnimatableElements(root);
  const triggerElement = resolveTriggerElement(
    mergedOptions.triggerPoint ?? mergedOptions.trigger,
    root,
  );

  const instance = strategy.setup(
    {
      root,
      targetElements,
      options: mergedOptions,
      triggerElement,
    },
    {
      scheduleRebuild: rebuildScheduler.schedule,
      isActive,
    },
  );

  return {
    cleanup() {
      rebuildScheduler.clear();
      instance?.cleanup();
    },
  };
}
