import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { getAnimBreakpoint, type AnimBreakpoint } from '../../../../lib/breakpoints';
import { ensureLenisScroll } from '../../../../lib/lenisScroll';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';
import positions from './slogan-positions.json';

gsap.registerPlugin(ScrollTrigger, SplitText);

const SEL = {
  images: '[data-anim="slogan-images"]',
  img1: '[data-anim="img-1"]',
  img2: '[data-anim="img-2"]',
  img3: '[data-anim="img-3"]',
  vision: '[data-anim="slogan-vision"]',
  visionText: '[data-anim="slogan-vision"] p',
  sloganLine: '[data-anim="slogan-line"]',
} as const;

const VISION_BLUR_PX = 20;
const LINE_BLUR_PX = 4;
const IMG_KEYS = ['img1', 'img2', 'img3'] as const;

const VISION_MAX_Y: Record<AnimBreakpoint, string> = {
  mb: '40%',
  tb: '40%',
  dk: '23%',
  'dk-lg': '20%',
};

type ImgKey = (typeof IMG_KEYS)[number];
type PctPos = { left: number; top: number };

/**
 * Center of an image as % of its positioning parent.
 * Markup uses left/top + -translate-x/y-1/2, so offsetLeft/Top already
 * mark the intended center (transforms don't affect offset*).
 */
function readCenterPct(el: HTMLElement, parent: HTMLElement): PctPos {
  const w = parent.offsetWidth || 1;
  const h = parent.offsetHeight || 1;
  return {
    left: (el.offsetLeft / w) * 100,
    top: (el.offsetTop / h) * 100,
  };
}

function endPct(key: ImgKey, bp: AnimBreakpoint): PctPos {
  return positions[key][bp];
}

/**
 * Split vision text into chars and set blurred / invisible initial state.
 */
function setupVisionChars(
  vision: HTMLElement | null,
  visionText: HTMLElement | null,
  splits: SplitText[],
): Element[] {
  if (!vision) return [];

  if (!visionText) {
    gsap.set(vision, { autoAlpha: 0, scale: 0.3, y: 0 });
    return [];
  }

  const split = SplitText.create(visionText, {
    type: 'chars',
    charsClass: 'vision-char',
  });
  splits.push(split);

  gsap.set(vision, { autoAlpha: 1, scale: 0.3, y: 0 });
  gsap.set(split.chars, {
    autoAlpha: 0,
    filter: `blur(${VISION_BLUR_PX}px)`,
  });

  return split.chars;
}

/**
 * Split each slogan line into chars; start blurred + invisible.
 * Returns one char array per line (reveal order = array order).
 */
function setupSloganLineChars(
  lines: NodeListOf<HTMLElement> | HTMLElement[],
  splits: SplitText[],
): Element[][] {
  return Array.from(lines).map((line) => {
    const split = SplitText.create(line, {
      type: 'chars',
      charsClass: 'slogan-char',
    });
    splits.push(split);
    gsap.set(split.chars, {
      autoAlpha: 0,
      filter: `blur(${LINE_BLUR_PX}px)`,
    });
    return split.chars;
  });
}

export const initSloganAnimation = createSectionAnimationController({
  rootId: 'slogan',
  waitForFonts: true,
  setup: ({ root }) => {
    ensureLenisScroll();

    const imagesRoot = root.querySelector<HTMLElement>(SEL.images) ?? root;
    const images = [
      root.querySelector<HTMLElement>(SEL.img1),
      root.querySelector<HTMLElement>(SEL.img2),
      root.querySelector<HTMLElement>(SEL.img3),
    ];
    const vision = root.querySelector<HTMLElement>(SEL.vision);
    const visionText = root.querySelector<HTMLElement>(SEL.visionText);
    const sloganLines = root.querySelectorAll<HTMLElement>(SEL.sloganLine);

    const triggers: ScrollTrigger[] = [];
    const splits: SplitText[] = [];
    const bp = getAnimBreakpoint();

    // left/top = center of the image (xPercent/yPercent -50).
    images.forEach((img) => {
      if (!img) return;

      const start = readCenterPct(img, imagesRoot);
      gsap.set(img, {
        left: `${start.left}%`,
        top: `${start.top}%`,
        xPercent: -50,
        yPercent: -50,
        right: 'auto',
        bottom: 'auto',
        position: 'absolute',
        autoAlpha: 0,
        z: -800,
        scale: 0.35,
      });
    });

    const visionChars = setupVisionChars(vision, visionText, splits);
    const sloganLineChars = setupSloganLineChars(sloganLines, splits);

    // Phase 1: enter scrub (about fade) + vision letter focus.
    const phase1 = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set('[data-anim="enter"]', {
            y: `${80 * self.progress}%`,
            autoAlpha: 1 - 1.3 * self.progress,
          });
        },
      },
    });

    if (visionChars.length) {
      phase1.to(
        visionChars,
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'none',
          stagger: 0.07,
        },
        0.5,
      );
    }
    if (phase1.scrollTrigger) triggers.push(phase1.scrollTrigger);

    // Phase 2: pin — fade images in, then travel to end % + vision scale.
    const maxY = VISION_MAX_Y[bp];
    const phase2 = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
      },
    });
    if (phase2.scrollTrigger) triggers.push(phase2.scrollTrigger);

    // 0 → 0.4: staggered fade-in
    images.forEach((img, i) => {
      if (!img) return;
      phase2.to(img, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.1 + i * 0.1);
    });

    // 0.4 → 1: move to end positions + vision grows
    const travelAt = 0.4;
    const travelDurLines = 0.5;
    const travelDurVision = 0.6;

    if (vision) {
      phase2.to(
        vision,
        { scale: 1, y: maxY, duration: travelDurVision, ease: 'none' },
        travelAt,
      );
    }

    images.forEach((img, i) => {
      if (!img) return;
      const end = endPct(IMG_KEYS[i], bp);
      phase2.to(
        img,
        {
          left: `${end.left}%`,
          top: `${end.top}%`,
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          z: 0,
          duration: travelDurVision,
          ease: 'none',
        },
        travelAt,
      );
    });

    console.log('sloganLineChars', sloganLineChars);

    // Line 1 → 2 → 3: letter focus while images/vision travel.
    const lineGap = travelDurLines / Math.max(sloganLineChars.length, 1);
    sloganLineChars.forEach((chars, i) => {
      if (!chars.length) return;
      phase2.to(
        chars,
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: lineGap * 0.75,
          ease: 'none',
          stagger: 0.015,
        },
        i * lineGap + travelAt,
      );
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      phase1.kill();
      phase2.kill();
      triggers.forEach((trigger) => trigger.kill());
      clearSectionStyles(root, splits);
    };
  },
});
