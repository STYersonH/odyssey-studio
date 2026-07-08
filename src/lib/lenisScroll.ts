import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const LENIS_KEY = '__odysseyLenis';

/** Single Lenis instance wired to ScrollTrigger — safe to call from any component. */
export function ensureLenisScroll() {
  const win = window as Window & { [LENIS_KEY]?: Lenis };
  if (win[LENIS_KEY]) return win[LENIS_KEY];

  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  win[LENIS_KEY] = lenis;
  return lenis;
}
