import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionAnimationContext } from '../../../../utils/create-section-animation-controller';
import { MM_DESKTOP } from './animation-shared';

/** Extra scroll while #services stays pinned on desktop. */
const DESKTOP_PIN_DISTANCE = '+=70%';

/** Desktop-only: pin briefly before releasing to the next section. */
export function setupDesktopPin(
  root: HTMLElement,
  mm: SectionAnimationContext['mm'],
) {
  mm.add(MM_DESKTOP, () => {
    const pinSt = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: DESKTOP_PIN_DISTANCE,
      pin: true,
      pinSpacing: true,
    });
    return () => pinSt.kill();
  });
}
