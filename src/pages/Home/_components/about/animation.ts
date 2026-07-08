import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureLenisScroll } from '../../../../lib/lenisScroll';

gsap.registerPlugin(ScrollTrigger);

const triggers: ScrollTrigger[] = [];

export function initAboutTextReveal() {
  triggers.forEach((trigger) => trigger.kill());
  triggers.length = 0;

  ensureLenisScroll();

  const elements = gsap.utils.toArray<HTMLElement>('.animate-text');

  elements.forEach((el) => {
    el.dataset.text = el.textContent?.trim() ?? '';
    el.style.setProperty('--clip-value', '100%');

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        const clipValue = Math.max(0, 100 - self.progress * 100);
        el.style.setProperty('--clip-value', `${clipValue}%`);
      },
    });

    triggers.push(trigger);
  });
}
