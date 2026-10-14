import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ensureLenisScroll } from '../../lib/lenisScroll';

gsap.registerPlugin(CustomEase);

const HOP = CustomEase.create('odyssey-mobile-menu', '.87,0,.13,1');
const CLIP_CLOSED = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
const CLIP_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
const DESKTOP_QUERY = '(min-width: 1025px)';

const getPushTargets = () => {
  const excluded = ['[data-header]', '[data-mobile-menu-root]', '[data-preloader]'];

  return Array.from(document.body.children).filter((child): child is HTMLElement => {
    if (!(child instanceof HTMLElement)) return false;
    return !excluded.some((selector) => child.matches(selector));
  });
};

export function initMobileMenuAnimation() {
  const root = document.querySelector<HTMLElement>('[data-mobile-menu-root]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]');
  const overlay = document.querySelector<HTMLElement>('[data-mobile-menu-overlay]');
  const content = document.querySelector<HTMLElement>('[data-mobile-menu-content]');
  const hamTop = document.querySelector<HTMLElement>('[data-mobile-menu-icon-top]');
  const hamBottom = document.querySelector<HTMLElement>('[data-mobile-menu-icon-bottom]');
  const lines = Array.from(document.querySelectorAll<HTMLElement>('[data-mobile-menu-line]'));
  const columns = Array.from(
    document.querySelectorAll<HTMLElement>('[data-mobile-menu-col], [data-mobile-menu-footer]'),
  );

  if (!root || !toggle || !overlay || !content) return;

  const win = window as Window & { __odysseyMobileMenuCleanup?: () => void };
  win.__odysseyMobileMenuCleanup?.();

  const lenis = ensureLenisScroll();
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  const pushTargets = getPushTargets();
  const openAria = toggle.getAttribute('aria-label') ?? 'Open navigation';
  const closeAria = toggle.dataset.closeAria ?? 'Close navigation';

  let isOpen = false;
  let isAnimating = false;
  let motion: gsap.core.Timeline | null = null;

  const setExpanded = (expanded: boolean) => {
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? closeAria : openAria);
    overlay.setAttribute('aria-hidden', String(!expanded));
    if (expanded) document.documentElement.setAttribute('data-mobile-menu-open', '');
    else document.documentElement.removeAttribute('data-mobile-menu-open');
  };

  const lockScroll = (locked: boolean) => {
    if (locked) lenis.stop();
    else lenis.start();
  };

  const cta = document.querySelector<HTMLElement>('[data-header] a[href="#contact"]');
  const ctaTop = cta?.querySelector<HTMLElement>('[data-button-label-top]');
  const ctaBottom = cta?.querySelector<HTMLElement>('[data-button-label-bottom]');
  const logo = document.querySelector<HTMLElement>('[data-header-logo]');

  const logoColor = () => {
    const probe = 40;
    const onDark = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]')).some(
      (section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probe && rect.bottom >= probe;
      },
    );
    return onDark ? '#f2f2f2' : '#171717';
  };

  /** While the sheet is open the CTA stays put and turns white. */
  const paintCta = (open: boolean) => {
    const duration = 0.45;
    if (!cta) return;
    gsap.to(cta, {
      backgroundColor: open ? '#ffffff' : '#171717',
      duration,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    if (ctaTop) {
      gsap.to(ctaTop, {
        color: open ? '#171717' : '#f2f2f2',
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (ctaBottom) {
      gsap.to(ctaBottom, {
        color: '#171717',
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (logo) {
      gsap.to(logo, {
        color: open ? '#ffffff' : logoColor(),
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  gsap.set(root, { pointerEvents: 'none' });
  gsap.set(overlay, { clipPath: CLIP_CLOSED });
  gsap.set(content, { yPercent: -50 });
  gsap.set(lines, { y: '-110%' });
  if (hamTop) gsap.set(hamTop, { y: -3, rotate: 0, scaleX: 1 });
  if (hamBottom) gsap.set(hamBottom, { y: 3, rotate: 0, scaleX: 1 });

  const openMenu = () => {
    if (isAnimating || desktopQuery.matches) return;
    isAnimating = true;
    isOpen = true;
    setExpanded(true);
    lockScroll(true);
    gsap.set(root, { pointerEvents: 'auto' });
    paintCta(true);

    motion?.kill();
    motion = gsap.timeline({
      defaults: { ease: HOP },
      onComplete: () => {
        isAnimating = false;
      },
    });

    motion
      .to(pushTargets, { y: '16svh', duration: 1 }, 0)
      .to(overlay, { clipPath: CLIP_OPEN, duration: 1 }, 0)
      .to(content, { yPercent: 0, duration: 1 }, 0);

    if (hamTop) motion.to(hamTop, { y: 0, rotate: 45, scaleX: 1.05, duration: 0.75 }, 0);
    if (hamBottom) motion.to(hamBottom, { y: 0, rotate: -45, scaleX: 1.05, duration: 0.75 }, 0);

    columns.forEach((column) => {
      const columnLines = Array.from(
        column.querySelectorAll<HTMLElement>('[data-mobile-menu-line]'),
      );
      if (columnLines.length === 0) return;
      motion?.to(columnLines, { y: '0%', duration: 1.35, stagger: -0.055 }, 0.05);
    });
  };

  const closeMenu = () => {
    if (!isOpen || isAnimating) return;
    isAnimating = true;
    isOpen = false;
    setExpanded(false);
    lockScroll(false);
    paintCta(false);

    motion?.kill();
    motion = gsap.timeline({
      defaults: { ease: HOP },
      onComplete: () => {
        gsap.set(root, { pointerEvents: 'none' });
        gsap.set(lines, { y: '-110%' });
        isAnimating = false;
      },
    });

    motion
      .to(pushTargets, { y: '0svh', duration: 1 }, 0)
      .to(overlay, { clipPath: CLIP_CLOSED, duration: 1 }, 0)
      .to(content, { yPercent: -50, duration: 1 }, 0);

    if (hamTop) motion.to(hamTop, { y: -3, rotate: 0, scaleX: 1, duration: 0.75 }, 0);
    if (hamBottom) motion.to(hamBottom, { y: 3, rotate: 0, scaleX: 1, duration: 0.75 }, 0);
  };

  const forceClose = () => {
    motion?.kill();
    gsap.killTweensOf([root, overlay, content, hamTop, hamBottom, ...lines, ...pushTargets].filter(Boolean));
    gsap.set(root, { pointerEvents: 'none' });
    gsap.set(pushTargets, { y: '0svh' });
    gsap.set(overlay, { clipPath: CLIP_CLOSED });
    gsap.set(content, { yPercent: -50 });
    gsap.set(lines, { y: '-110%' });
    if (hamTop) gsap.set(hamTop, { y: -3, rotate: 0, scaleX: 1 });
    if (hamBottom) gsap.set(hamBottom, { y: 3, rotate: 0, scaleX: 1 });
    setExpanded(false);
    lockScroll(false);
    if (cta) gsap.set(cta, { backgroundColor: '#171717' });
    if (ctaTop) gsap.set(ctaTop, { color: '#f2f2f2' });
    if (ctaBottom) gsap.set(ctaBottom, { color: '#171717' });
    if (logo) gsap.set(logo, { color: logoColor() });
    isOpen = false;
    isAnimating = false;
  };

  const onToggle = () => {
    if (isAnimating) return;
    if (isOpen) closeMenu();
    else openMenu();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeMenu();
  };

  const onResize = () => {
    if (desktopQuery.matches) forceClose();
  };

  const ac = new AbortController();
  const { signal } = ac;

  toggle.addEventListener('click', onToggle, { signal });
  document.addEventListener('keydown', onKeyDown, { signal });
  window.addEventListener('resize', onResize, { signal });

  root.querySelectorAll('a').forEach((link) => {
    link.addEventListener(
      'click',
      () => {
        if (isAnimating) return;
        closeMenu();
      },
      { signal },
    );
  });

  win.__odysseyMobileMenuCleanup = () => {
    ac.abort();
    forceClose();
  };
}
