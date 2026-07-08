import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureLenisScroll } from '../../../../lib/lenisScroll';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

gsap.registerPlugin(ScrollTrigger);

const SEL = {
  enter: '[data-anim="enter"]',
  textBlock: '[data-anim="text-block"]',
} as const;

const ENTRY_Y_PERCENT = -35;

function setupTextRevealElements(root: HTMLElement) {
  const blocks = root.querySelectorAll<HTMLElement>(SEL.textBlock);

  blocks.forEach((el) => {
    el.dataset.text = el.textContent?.trim() ?? '';
    el.style.setProperty('--clip-value', '100%');
  });

  return blocks;
}

export const initAboutAnimation = createSectionAnimationController({
  rootId: 'about',
  waitForFonts: false,
  setup: ({ root }) => {
    ensureLenisScroll();

    const enterEl = root.querySelector<HTMLElement>(SEL.enter);
    const textBlocks = setupTextRevealElements(root);
    const triggers: ScrollTrigger[] = [];

    if (enterEl) {
      const enterTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom bottom',
        markers: true,
        scrub: true,
        onUpdate: (self) => {
          const yValue = ENTRY_Y_PERCENT * (1 - self.progress);
          gsap.set(enterEl, { y: `${yValue}%` });
        },
      });
      triggers.push(enterTrigger);
    }

    textBlocks.forEach((el) => {
      const textBlockTrigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1,
        onUpdate: (self) => {
          const clipValue = Math.max(0, 100 - self.progress * 100);
          el.style.setProperty('--clip-value', `${clipValue}%`);
        },
      });
      triggers.push(textBlockTrigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      textBlocks.forEach((el) => delete el.dataset.text);
      clearSectionStyles(root);
    };
  },
});
