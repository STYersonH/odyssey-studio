import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureCopyEases } from '../../../../components/Copy/utils/copy/eases';

gsap.registerPlugin(ScrollTrigger);

/** Hero clipPath: hidden via right inset → reveals left→right. */
const CLIP_HIDDEN = 'inset(0 100% 0 0%)';
const CLIP_VISIBLE = 'inset(0 0% 0 0%)';
/** After title Copy (words, stagger 0.2, duration 0.9) — same start as Copy. */
const CLIP_DELAY = 2;
const CLIP_DURATION = 0.85;
const CLIP_START = 'top 55%';

/**
 * Desktop heading hero: clipPath L→R after the title Copy reveal.
 * Returns cleanup (no-op if hero is missing).
 */
export function setupProcessHeroClip(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>('[data-anim="process-hero"]');
  const img = hero?.querySelector<HTMLImageElement>('img');
  if (!hero) return () => {};

  ensureCopyEases();

  gsap.set(hero, { clipPath: CLIP_HIDDEN });

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(
    hero,
    { clipPath: CLIP_HIDDEN },
    {
      clipPath: CLIP_VISIBLE,
      duration: CLIP_DURATION,
      ease: 'hop',
    },
    CLIP_DELAY,
  );
  tl.fromTo(
    img ?? '',
    { scale: 1.3 },
    { scale: 1, duration: CLIP_DURATION, ease: 'hop' },
    CLIP_DELAY,
  );

  const st = ScrollTrigger.create({
    trigger: root,
    start: CLIP_START,
    onEnter: () => tl.play(),
    onLeaveBack: () => tl.reverse(),
  });

  return () => {
    st.kill();
    tl.kill();
  };
}
