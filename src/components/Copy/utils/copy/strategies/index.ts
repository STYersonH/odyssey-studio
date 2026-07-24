import { blurStrategy } from './blur';
import { depthStrategy } from './depth';
import { flickerStrategy } from './flicker';
import { randomStrategy } from './random';
import {
  slideFromBottomStrategy,
  slideFromTopStrategy,
} from './slide';
import type { CopyStrategy } from '../types';

/**
 * Strategy registry for Copy text reveals.
 *
 * To add a variant:
 *  1. Create `strategies/myVariant.ts` exporting a strategy
 *  2. Register it here (or via `registerCopyStrategy`)
 *  3. Use `<Copy variant="myVariant">`
 *
 * Only strategy modules live in this folder. Shared helpers live in `../`.
 */
const strategies: Record<string, CopyStrategy> = {
  slideFromBottom: slideFromBottomStrategy,
  slideFromTop: slideFromTopStrategy,
  /** Alias of `slideFromBottom` for older call sites. */
  slide: slideFromBottomStrategy,
  flicker: flickerStrategy,
  random: randomStrategy,
  blur: blurStrategy,
  depth: depthStrategy,
};

export function getCopyStrategy(variant: string): CopyStrategy {
  return strategies[variant] ?? strategies.slideFromBottom;
}

export function registerCopyStrategy(strategy: CopyStrategy) {
  if (!strategy?.id) {
    throw new Error('Copy strategy requires an `id`');
  }
  strategies[strategy.id] = strategy;
}

export function listCopyStrategies() {
  return Object.keys(strategies);
}
