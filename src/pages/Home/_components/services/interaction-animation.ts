import gsap from 'gsap';
import { playCardsBounce } from './cards-animation';
import { playDescReveal } from './description-animation';
import { isDesktopViewport, showOverlayFor, type ServiceItem } from './animation-shared';

/** Hover / tap: swap preview images + description for the active service. */
export function setupInteraction(
  root: HTMLElement,
  cards: HTMLElement[],
  items: ServiceItem[],
) {
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-anim="services-item-btn"]'),
  );
  const mobileDescs = Array.from(
    root.querySelectorAll<HTMLElement>('[data-anim="services-item-desc"]'),
  );
  const imgA = root.querySelector<HTMLImageElement>('[data-anim="services-card-a-img"]');
  const imgB = root.querySelector<HTMLImageElement>('[data-anim="services-card-b-img"]');
  const overlayA = root.querySelector<HTMLImageElement>(
    '[data-anim="services-card-a-overlay"]',
  );

  if (!buttons.length || !items.length) return () => {};

  let active = Number(root.dataset.servicesActive ?? '1');
  let swapTween: gsap.core.Timeline | null = null;

  const applyActiveUi = (index: number) => {
    buttons.forEach((btn, i) => {
      const on = i === index;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.classList.toggle('text-white', on);
      btn.classList.toggle('text-[#4d4d4d]', !on);
    });
  };

  const swapImages = (item: ServiceItem) => {
    if (imgA && item.images[0]) imgA.src = item.images[0];
    if (imgB && item.images[1]) imgB.src = item.images[1];
    if (overlayA) overlayA.classList.toggle('hidden', !showOverlayFor(item));
  };

  const setActive = (index: number) => {
    if (index === active || index < 0 || index >= items.length) return;

    const prev = active;
    active = index;
    root.dataset.servicesActive = String(index);
    applyActiveUi(index);

    const item = items[index];

    swapTween?.kill();
    gsap.killTweensOf(cards);

    swapTween = gsap.timeline();
    swapTween.to(cards, {
      autoAlpha: 0,
      y: '0.875rem',
      scale: 0.92,
      duration: 0.12,
      stagger: { each: 0.03, from: 'end' },
      ease: 'power2.in',
    });
    swapTween.add(() => swapImages(item));
    swapTween.add(() =>
      playDescReveal(root, index, item.description, {
        closeEl: !isDesktopViewport() ? mobileDescs[prev] : null,
      }),
    );
    playCardsBounce(cards, swapTween);
  };

  const onActivate = (e: Event) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const index = Number(btn.dataset.index);
    if (Number.isNaN(index)) return;
    if (e.type === 'click') btn.focus({ preventScroll: true });
    setActive(index);
  };

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  buttons.forEach((btn) => {
    if (canHover) btn.addEventListener('mouseenter', onActivate);
    btn.addEventListener('click', onActivate);
  });

  return () => {
    swapTween?.kill();
    buttons.forEach((btn) => {
      btn.removeEventListener('mouseenter', onActivate);
      btn.removeEventListener('click', onActivate);
    });
  };
}
