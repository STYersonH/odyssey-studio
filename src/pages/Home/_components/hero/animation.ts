import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/all';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create('hop', '0.8, 0, 0.2, 1');

const SEL = {
  titleMain: '[data-anim="title-main"]',
  titleStudio: '[data-anim="title-studio"]',
  compassRose: '[data-anim="compass-rose"]',
  coordinates: '[data-anim="coordinates"]',
  description: '[data-anim="description"]',
} as const;

/** Give only italic Y masks extra room so overflow:hidden doesn't clip them. */
function expandItalicCharMasks(chars: Element[]) {
  chars.forEach((char) => {
    const el = char as HTMLElement;
    const isItalicY =
      el.classList.contains('titulo-y') ||
      el.classList.contains('font-neue-medium-italic') ||
      (el.textContent === 'Y' && getComputedStyle(el).fontStyle === 'italic');

    if (!isItalicY) return;

    const mask = el.parentElement;
    if (!mask || mask.classList.contains('titulo')) return;

    mask.style.paddingTop = '0.2em';
    mask.style.paddingRight = '0.25em';
    mask.style.marginTop = '-0.2em';
    mask.style.marginRight = '-0.25em';
  });
}

export const initHeroAnimation = createSectionAnimationController({
  rootId: 'hero',
  refreshScrollTrigger: false,
  setup: ({ root }) => {
    const splits: SplitText[] = [];
    const titleMain = root.querySelector<HTMLElement>(SEL.titleMain);
    const titleStudio = root.querySelector<HTMLElement>(SEL.titleStudio);
    const compassRose = root.querySelector<HTMLElement>(SEL.compassRose);
    const coordinates = root.querySelector<HTMLElement>(SEL.coordinates);
    const descriptions = root.querySelectorAll<HTMLElement>(SEL.description);

    let titleChars: Element[] = [];
    if (titleMain) {
      const titleSplit = SplitText.create(titleMain, {
        type: 'chars',
        charsClass: 'char',
        mask: 'chars',
      });
      splits.push(titleSplit);
      titleChars = titleSplit.chars;
      expandItalicCharMasks(titleChars);
    }

    const descriptionLines: Element[] = [];
    descriptions.forEach((block) => {
      const lineSplit = SplitText.create(block, {
        type: 'lines',
        linesClass: 'line',
        mask: 'lines',
      });
      splits.push(lineSplit);
      descriptionLines.push(...lineSplit.lines);
    });

    const timeline = gsap.timeline({ delay: 0.5 });

    timeline
      .to(titleChars, {
        y: '0%',
        duration: 2,
        ease: 'hop',
        stagger: { each: 0.075, from: 'random' },
      })
      .to(titleStudio, { opacity: 1 }, '>-0.5')
      .to(coordinates, { opacity: 1 }, '>-0.5')
      .to(compassRose, { opacity: 1 }, '>-0.5')
      .to(
        descriptionLines,
        {
          y: '0%',
          duration: 2,
          ease: 'hop',
          stagger: { each: 0.075 },
        },
        '<',
      );

    return () => {
      timeline.kill();
      clearSectionStyles(root, splits);
    };
  },
});
