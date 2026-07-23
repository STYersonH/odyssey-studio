import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureLenisScroll } from '../../lib/lenisScroll';

gsap.registerPlugin(ScrollTrigger);

const ST_ID = 'site-header-compact';
const CLEANUP_KEY = '__odysseyHeaderCompactCleanup';

/**
 * Compact dock: rises from below when Hero's 70% mark hits the viewport top.
 * Full header is absolute — scrolls away with the document.
 *
 * Uses getBoundingClientRect (Lenis-safe) rather than relying only on
 * ScrollTrigger's scroll position.
 */
export function initHeaderAnimation() {
  if (typeof window === 'undefined') return;

  const win = window as Window & {
    [CLEANUP_KEY]?: () => void;
  };
  win[CLEANUP_KEY]?.();

  const compact = document.querySelector<HTMLElement>('[data-header-compact]');
  const inner = document.querySelector<HTMLElement>('[data-header-compact-inner]');
  const hero = document.querySelector<HTMLElement>('#hero');

  if (!compact || !inner) return;

  ScrollTrigger.getById(ST_ID)?.kill();
  const lenis = ensureLenisScroll();

  // Extra px so borders/anti-alias don’t peek above the overflow clip
  const hideY = () => Math.max(inner.offsetHeight, 35) + 8;

  gsap.set(inner, { y: hideY(), force3D: true });
  compact.style.pointerEvents = 'none';
  compact.setAttribute('aria-hidden', 'true');

  let visible = false;

  const show = () => {
    if (visible) return;
    visible = true;
    compact.style.pointerEvents = 'auto';
    compact.setAttribute('aria-hidden', 'false');
    gsap.to(inner, {
      y: 0,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: true,
      force3D: true,
    });
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    gsap.to(inner, {
      y: hideY,
      duration: 0.4,
      ease: 'power2.in',
      overwrite: true,
      force3D: true,
      onComplete: () => {
        if (!visible) {
          compact.style.pointerEvents = 'none';
          compact.setAttribute('aria-hidden', 'true');
        }
      },
    });
  };

  /** True when the point at 70% of the Hero has reached (or passed) the viewport top. */
  const shouldShow = () => {
    if (!hero) return window.scrollY > window.innerHeight * 0.7;
    const rect = hero.getBoundingClientRect();
    return rect.top + rect.height * 0.7 <= 0;
  };

  const sync = () => {
    if (shouldShow()) show();
    else hide();
  };

  ScrollTrigger.create({
    id: ST_ID,
    trigger: hero ?? document.body,
    start: '70% top',
    end: 'max',
    onUpdate: sync,
    onRefresh: sync,
  });

  lenis.on('scroll', sync);
  window.addEventListener('resize', sync);
  requestAnimationFrame(sync);

  win[CLEANUP_KEY] = () => {
    lenis.off('scroll', sync);
    window.removeEventListener('resize', sync);
    ScrollTrigger.getById(ST_ID)?.kill();
  };
}
