import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create('hop', '0.8, 0, 0.2, 1');
CustomEase.create('hop2', '0.9, 0, 0.1, 1');

const splitText = (
  selector: string,
  type: 'chars' | 'words' | 'lines',
  className: string,
  mask = true,
) => {
  return SplitText.create(selector, {
    type: type,
    [`${type}Class`]: className,
    ...(mask && { mask: type }),
  });
};

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

    // Pad the mask (not the char) so letter-spacing of the word stays intact.
    mask.style.paddingTop = '0.2em';
    mask.style.paddingRight = '0.25em';
    mask.style.marginTop = '-0.2em';
    mask.style.marginRight = '-0.25em';
  });
}

export const animateHero = () => {
  const compassRose = document.querySelector<HTMLElement>('[data-animate-compass-rose]');
  const coordinates = document.querySelector<HTMLElement>('[data-animate-coordinates]');
  const titleStudio = document.querySelector<HTMLElement>('[data-animate-title-studio]');

  const titleSplit = splitText('.title-main-animate', 'chars', 'char', true);
  const descSplit = splitText('.text-block-animate', 'lines', 'line', true);
  expandItalicCharMasks(titleSplit.chars);

  gsap.set(compassRose, {
    opacity: 0,
  });
  gsap.set(coordinates, {
    opacity: 0,
  });
  gsap.set(titleStudio, {
    opacity: 0,
  });

  const tl = gsap.timeline({ delay: 0.5 });

  tl.to('.title-main-animate .char', {
    y: '0%',
    duration: 2,
    ease: 'hop',
    stagger: { each: 0.075, from: 'random' },
  })
    .to(
      titleStudio,
      {
        opacity: 1,
      },
      '>-0.5',
    )
    .to(
      coordinates,
      {
        opacity: 1,
      },
      '>-0.5',
    )
    .to(
      compassRose,
      {
        opacity: 1,
      },
      '>-0.5',
    )
    .to(
      '.text-block-animate .line',
      {
        y: '0%',
        duration: 2,
        ease: 'hop',
        stagger: { each: 0.075 },
      },
      '<',
    );
};
