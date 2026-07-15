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
  /** mb: one <p> per word (2 lines). tb+: single <p>. */
  visionMb: '[data-anim="slogan-vision"] [data-vision="mb"] p',
  visionTb: '[data-anim="slogan-vision"] [data-vision="tb"]',
  sloganLine: '[data-anim="slogan-line"]',
} as const;

const VISION_BLUR_PX = 20;
const LINE_BLUR_PX = 4;
const IMG_KEYS = ['img1', 'img2', 'img3'] as const;

/** Start scale from Figma initial/final size ratio (mb ~0.6; tb ~0.5). */
const IMG_SCALE_START: Record<AnimBreakpoint, number> = {
  mb: 0.6,
  tb: 0.5,
  dk: 0.35,
  'dk-lg': 0.35,
};

const VISION_SCALE_START: Record<AnimBreakpoint, number> = {
  mb: 0.42,
  tb: 0.5,
  dk: 0.3,
  'dk-lg': 0.3,
};

const VISION_MAX_Y: Record<AnimBreakpoint, number> = {
  mb: 23,
  tb: 76,
  dk: 64,
  'dk-lg': 78,
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
 * Split visible vision copy into chars and set blurred / invisible initial state.
 * mb uses one <p> per word; tb+ uses a single line. Centering via x/yPercent -50
 * so animating `y` does not wipe CSS translate.
 */
function setupVisionChars(
  vision: HTMLElement | null,
  visionTexts: HTMLElement[],
  splits: SplitText[],
  scaleStart: number,
): Element[] {
  if (!vision) return [];

  gsap.set(vision, {
    autoAlpha: visionTexts.length ? 1 : 0,
    scale: scaleStart,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
  });

  if (!visionTexts.length) return [];

  const chars: Element[] = [];
  visionTexts.forEach((textEl) => {
    const split = SplitText.create(textEl, {
      type: 'chars',
      charsClass: 'vision-char',
    });
    splits.push(split);
    chars.push(...split.chars);
  });

  gsap.set(chars, {
    autoAlpha: 0,
    filter: `blur(${VISION_BLUR_PX}px)`,
  });

  return chars;
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
    const sloganLines = root.querySelectorAll<HTMLElement>(SEL.sloganLine);

    const triggers: ScrollTrigger[] = [];
    const splits: SplitText[] = [];
    const bp = getAnimBreakpoint();
    const imgScaleStart = IMG_SCALE_START[bp];
    const visionScaleStart = VISION_SCALE_START[bp];
    const visionTexts =
      bp === 'mb'
        ? Array.from(root.querySelectorAll<HTMLElement>(SEL.visionMb))
        : Array.from(root.querySelectorAll<HTMLElement>(SEL.visionTb));

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
        scale: imgScaleStart,
      });
    });

    const visionChars = setupVisionChars(vision, visionTexts, splits, visionScaleStart);
    const sloganLineChars = setupSloganLineChars(sloganLines, splits);

    // Phase 1: enter scrub (about fade) + vision letter focus.
    const phase1 = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        onUpdate: (self) => {
          if (bp !== 'mb' && bp !== 'tb') {
            gsap.set('[data-anim="enter"]', {
              y: `${80 * self.progress}%`,
              autoAlpha: 1 - 1.3 * self.progress,
            });
          }
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
        end: `+=${window.innerHeight * (bp !== 'mb' && bp !== 'tb' ? 4 : 2)}px`,
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
