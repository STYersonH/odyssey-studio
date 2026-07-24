import gsap from 'gsap';

const BOUNCE_EASE = 'back.out(2.4)';
const CARD_STAGGER = 0.09;
const CARD_DURATION = 0.48;

export const CARD_FROM = { autoAlpha: 0, y: '3rem', scale: 0.78, rotation: 0 } as const;

function cardTargetRotation(card: HTMLElement) {
  return Number(card.dataset.rotation ?? '0');
}

/** Resting pose (visible + tilt) — used when there is no enter bounce. */
export function setCardsRest(cards: HTMLElement[]) {
  cards.forEach((card) => {
    gsap.set(card, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotation: cardTargetRotation(card),
    });
  });
}

/** Bounce-stagger: flat (0°) → each card’s rest tilt. */
export function playCardsBounce(
  cards: HTMLElement[],
  timeline?: gsap.core.Timeline,
) {
  const host = timeline ?? gsap.timeline();
  if (!timeline) gsap.killTweensOf(cards);

  const base = timeline ? host.duration() : 0;

  cards.forEach((card, i) => {
    host.fromTo(
      card,
      { ...CARD_FROM },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: cardTargetRotation(card),
        duration: CARD_DURATION,
        ease: BOUNCE_EASE,
        overwrite: 'auto',
      },
      base + i * CARD_STAGGER,
    );
  });

  return host;
}
