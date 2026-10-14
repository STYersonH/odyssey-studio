import gsap from 'gsap';
import { ensureLenisScroll } from '../../lib/lenisScroll';

const CLEANUP_KEY = '__odysseyHeaderCleanup';
const COLOR_DARK = '#171717';
const COLOR_LIGHT = '#f2f2f2';
const PROBE_Y = 40;
const TOP_LOCK = 12;

/**
 * Logo and nav links turn white while a dark section sits under the header.
 * The bar hides on scroll down and returns on scroll up.
 * Sections opt in with `data-header-theme="dark"`.
 */
export function initHeaderAnimation() {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    [CLEANUP_KEY]?: () => void;
    __odysseyHeaderCompactCleanup?: () => void;
  };
  win[CLEANUP_KEY]?.();
  win.__odysseyHeaderCompactCleanup?.();

  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const targets = [
    header.querySelector<HTMLElement>('[data-header-logo]'),
    ...header.querySelectorAll<HTMLElement>('[data-nav-link]'),
  ].filter((node): node is HTMLElement => node !== null);

  const lenis = ensureLenisScroll();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let light = false;
  let ready = false;
  let lastScroll = window.scrollY;
  let offset = 0;

  const hideDistance = () => header.offsetHeight + 16;

  gsap.set(header, { y: 0, force3D: true });

  const slideTo = (y: number) => {
    gsap.to(header, {
      y,
      duration: reduceMotion ? 0 : 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
      force3D: true,
    });
  };

  /** Scroll down pushes the bar up; scroll up eases it back into view. */
  const syncVisibility = () => {
    const current = window.scrollY;
    const delta = current - lastScroll;
    lastScroll = current;
    if (Math.abs(delta) < 0.5) return;

    if (document.documentElement.hasAttribute('data-mobile-menu-open')) return;

    if (current <= TOP_LOCK) offset = 0;
    else offset = gsap.utils.clamp(-hideDistance(), 0, offset - delta);

    slideTo(offset);
  };

  const overDarkSection = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]')).some(
      (section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= PROBE_Y && rect.bottom >= PROBE_Y;
      },
    );

  const sync = () => {
    if (document.documentElement.hasAttribute('data-mobile-menu-open')) return;
    const next = overDarkSection();
    if (ready && next === light) return;
    const color = next ? COLOR_LIGHT : COLOR_DARK;
    if (!ready) gsap.set(targets, { color });
    else {
      gsap.to(targets, {
        color,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    light = next;
    ready = true;
  };

  const onScroll = () => {
    sync();
    syncVisibility();
  };

  lenis.on('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', sync);
  requestAnimationFrame(sync);

  win[CLEANUP_KEY] = () => {
    lenis.off('scroll', onScroll);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', sync);
    gsap.killTweensOf([header, ...targets]);
  };
  win.__odysseyHeaderCompactCleanup = undefined;
}
