import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureLenisScroll } from '../../../../lib/lenisScroll';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

gsap.registerPlugin(ScrollTrigger);

const SEL = {
  enter: '[data-anim="about-enter"]',
  textReveal: '[data-anim="text-reveal"]',
  textBlock: '[data-anim="text-block"]',
} as const;

/** Matches --breakpoint-dk / --breakpoint-tb in figma_var.css */
const MM_DESKTOP = '(min-width: 1025px)';
const MM_TABLET = '(min-width: 440px) and (max-width: 1024px)';
const MM_MOBILE = '(max-width: 439px)';

const ENTRY_Y = {
  desktop: -35,
  mobileTablet: -55,
} as const;

const TEXT_REVEAL_SCROLL = {
  tablet: { start: 'top 65%', end: 'bottom 55%' },
  mobile: { start: 'top 78%', end: 'bottom 42%' },
} as const;

/** Extra scroll while #about stays pinned (room for both paragraph reveals). */
const PIN_SCROLL_DISTANCE = '+=160%';

type ScrollRange = { start: string; end: string };

/**
 * Map progress [0–1] onto a sub-range → clip % (100 = hidden white, 0 = full white).
 * Outside the range the value stays clamped at the ends.
 */
function clipForRange(progress: number, start: number, end: number) {
  if (progress <= start) return 100;
  if (progress >= end) return 0;
  return 100 * (1 - (progress - start) / (end - start));
}

function applySequentialClip(progress: number, textBlocks: HTMLElement[]) {
  const count = textBlocks.length;
  if (count === 0) return;

  textBlocks.forEach((el, i) => {
    const rangeStart = i / count;
    const rangeEnd = (i + 1) / count;
    const clip = clipForRange(progress, rangeStart, rangeEnd);
    el.style.setProperty('--clip-value', `${clip}%`);
  });
}

function setupTextBlocks(root: HTMLElement) {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>(SEL.textBlock));

  blocks.forEach((el) => {
    if (!el.dataset.text) {
      el.dataset.text = el.textContent?.trim() ?? '';
    }
    el.style.setProperty('--clip-value', '100%');
  });

  return blocks;
}

function setupEntryAnimation(
  root: HTMLElement,
  enterEl: HTMLElement,
  entryYPercent: number,
) {
  gsap.set(enterEl, { y: `${entryYPercent}%` });

  return ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: true,
    refreshPriority: 0,
    onUpdate: (self) => {
      const yValue = entryYPercent * (1 - self.progress);
      gsap.set(enterEl, { y: `${yValue}%` });
    },
  });
}

function setupDesktopTextReveal(root: HTMLElement, textBlocks: HTMLElement[]) {
  if (textBlocks.length === 0) return [];

  return [
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: PIN_SCROLL_DISTANCE,
      pin: root,
      pinSpacing: true,
      scrub: 1,
      // anticipatePin: 1,
      refreshPriority: 1,
      onUpdate: (self) => applySequentialClip(self.progress, textBlocks),
    }),
  ];
}

/** No pin — progress tied to the text container scrolling through the viewport. */
function setupContainerTextReveal(
  textReveal: HTMLElement,
  textBlocks: HTMLElement[],
  { start, end }: ScrollRange,
) {
  if (textBlocks.length === 0) return [];

  return [
    ScrollTrigger.create({
      trigger: textReveal,
      start,
      end,
      scrub: 1,
      onUpdate: (self) => applySequentialClip(self.progress, textBlocks),
    }),
  ];
}

export const initAboutAnimation = createSectionAnimationController({
  rootId: 'about',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    ensureLenisScroll();

    const enterEl = root.querySelector<HTMLElement>(SEL.enter);
    const textReveal = root.querySelector<HTMLElement>(SEL.textReveal);
    const textBlocks = setupTextBlocks(root);

    mm.add(MM_DESKTOP, () => {
      const entryTrigger = enterEl
        ? setupEntryAnimation(root, enterEl, ENTRY_Y.desktop)
        : null;
      const triggers = setupDesktopTextReveal(root, textBlocks);

      return () => {
        entryTrigger?.kill();
        triggers.forEach((trigger) => trigger.kill());
        clearSectionStyles(root);
      };
    });

    mm.add(MM_TABLET, () => {
      const entryTrigger = enterEl
        ? setupEntryAnimation(root, enterEl, ENTRY_Y.mobileTablet)
        : null;
      const triggers = textReveal
        ? setupContainerTextReveal(textReveal, textBlocks, TEXT_REVEAL_SCROLL.tablet)
        : [];

      return () => {
        entryTrigger?.kill();
        triggers.forEach((trigger) => trigger.kill());
        clearSectionStyles(root);
      };
    });

    mm.add(MM_MOBILE, () => {
      const entryTrigger = enterEl
        ? setupEntryAnimation(root, enterEl, ENTRY_Y.mobileTablet)
        : null;
      const triggers = textReveal
        ? setupContainerTextReveal(textReveal, textBlocks, TEXT_REVEAL_SCROLL.mobile)
        : [];

      return () => {
        entryTrigger?.kill();
        triggers.forEach((trigger) => trigger.kill());
        clearSectionStyles(root);
      };
    });
  },
});
