import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';
import { setupProcessHeroClip } from './hero-clip-animation';

gsap.registerPlugin(ScrollTrigger);

const MM_DESKTOP = '(min-width: 1025px)';
const MM_MOBILE_TABLET = '(max-width: 1024px)';

const INACTIVE_OPACITY = 0.06;
/** Rest tilt matches Figma ~2° */
const IMAGE_REST_ROTATE = 2;
const IMAGE_EXIT_X = 110;
const IMAGE_EXIT_ROTATE = 18;

type ImageSide = 'left' | 'right';

function getStepImage(wrap: HTMLElement) {
  return wrap.querySelector<HTMLElement>('[data-anim="process-step-image"]');
}

function getImageSide(img: HTMLElement): ImageSide {
  return img.dataset.imageSide === 'left' ? 'left' : 'right';
}

/** Exit pose: from the right (steps 01–02) or from the left (step 03). */
function exitPose(side: ImageSide) {
  const dir = side === 'left' ? -1 : 1;
  return {
    x: IMAGE_EXIT_X * dir,
    rotation: IMAGE_EXIT_ROTATE * dir,
    opacity: 0,
  };
}

function showStepImage(img: HTMLElement) {
  const from = exitPose(getImageSide(img));
  gsap.fromTo(img, from, {
    x: 0,
    rotation: IMAGE_REST_ROTATE,
    opacity: 1,
    duration: 0.35,
    ease: 'back.out(3)',
    overwrite: 'auto',
  });
}

function hideStepImage(img: HTMLElement) {
  gsap.to(img, {
    ...exitPose(getImageSide(img)),
    duration: 0.35,
    ease: 'power2.in',
    overwrite: 'auto',
  });
}

/**
 * Desktop: the step closest to viewport center is focused (Eliot-style).
 * Images spin in/out from the right (01–02) or left (03).
 * Tablet/mobile: all steps fully visible, image at rest tilt.
 */
export const initProcessAnimation = createSectionAnimationController({
  rootId: 'process',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    const stepsEl = root.querySelector<HTMLElement>('[data-anim="process-steps"]');
    const wraps = Array.from(
      root.querySelectorAll<HTMLElement>('[data-anim="process-step-wrap"]'),
    );

    if (!stepsEl || wraps.length === 0) return;

    mm.add(MM_DESKTOP, () => {
      let active = -1;
      const cleanupImgHeadingClip = setupProcessHeroClip(root);

      const setActive = (next: number) => {
        if (next === active || next < 0 || next >= wraps.length) return; // do nothing
        const prev = active;
        active = next;

        wraps.forEach((wrap, i) => {
          const isOn = i === active;
          gsap.to(wrap, {
            opacity: isOn ? 1 : INACTIVE_OPACITY,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          });

          const img = getStepImage(wrap);
          if (!img) return;

          if (isOn) showStepImage(img);
          else if (i === prev || prev === -1) hideStepImage(img);
          else gsap.set(img, exitPose(getImageSide(img)));
        });
      };

      // Initial: step 01 focused; only its image visible.
      wraps.forEach((wrap, i) => {
        gsap.set(wrap, { opacity: i === 0 ? 1 : INACTIVE_OPACITY });
        const img = getStepImage(wrap);
        if (!img) return;
        if (i === 0) {
          gsap.set(img, {
            x: 0,
            rotation: IMAGE_REST_ROTATE,
            opacity: 1,
          });
        } else {
          gsap.set(img, exitPose(getImageSide(img)));
        }
      });
      active = 0;

      const pickClosestToCenter = () => {
        const midY = window.innerHeight * 0.5;
        let best = 0;
        let bestDist = Infinity;
        wraps.forEach((wrap, i) => {
          const rect = wrap.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - midY);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      };

      const st = ScrollTrigger.create({
        trigger: stepsEl,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: pickClosestToCenter,
        onEnter: pickClosestToCenter,
        onEnterBack: pickClosestToCenter,
      });

      return () => {
        cleanupImgHeadingClip();
        st.kill();
        clearSectionStyles(root);
      };
    });

    mm.add(MM_MOBILE_TABLET, () => {
      wraps.forEach((wrap) => {
        gsap.set(wrap, { opacity: 1, clearProps: 'opacity' });
        const img = getStepImage(wrap);
        if (img) {
          gsap.set(img, {
            x: 0,
            rotation: IMAGE_REST_ROTATE,
            opacity: 1,
          });
        }
      });

      return () => {
        clearSectionStyles(root);
      };
    });
  },
});
