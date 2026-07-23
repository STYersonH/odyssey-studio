import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

gsap.registerPlugin(ScrollTrigger);

const WORK_BG_DEFAULT = '#d6cec3';

const CONTENT_SEL = [
  '[data-anim="project-number"]',
  '[data-anim="project-title"]',
  '[data-anim="project-desc"]',
  '[data-anim="project-stat"]',
  '[data-anim="project-stat-label"]',
].join(', ');

function getCardTextEls(card: HTMLElement) {
  return gsap.utils.toArray<HTMLElement>(card.querySelectorAll(CONTENT_SEL));
}

function hideCardText(els: HTMLElement[]) {
  gsap.set(els, { x: 72, autoAlpha: 0 });
}

function revealCardText(els: HTMLElement[]) {
  return gsap.to(els, {
    x: 0,
    autoAlpha: 1,
    duration: 0.75,
    stagger: 0.08,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

/** Inverse of reveal — slides back out to the right (not an instant hide). */
function concealCardText(els: HTMLElement[]) {
  return gsap.to(els, {
    x: 72,
    autoAlpha: 0,
    duration: 0.55,
    stagger: { each: 0.06, from: 'end' },
    ease: 'power3.in',
    overwrite: 'auto',
  });
}

function setWorkBg(root: HTMLElement, color: string) {
  gsap.to(root, {
    backgroundColor: color,
    duration: 0.55,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

/** Bg to restore when leaving a card backward (previous project, or default cream). */
function getLeaveBackBg(cards: HTMLElement[], index: number) {
  if (index <= 0) return WORK_BG_DEFAULT;
  return cards[index - 1]?.dataset.bg || WORK_BG_DEFAULT;
}

export const initWorkAnimation = createSectionAnimationController({
  rootId: 'work',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    const track = root.querySelector<HTMLElement>('[data-anim="work-track"]');
    const subtitleEl = root.querySelector<HTMLElement>('[data-anim="work-subtitle"]');
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>('[data-anim="project-card"]'),
    );

    if (!track) return () => {};

    // ── Desktop (>= 1025px): pin → title intro hold → horizontal scroll ──
    mm.add('(min-width: 1025px)', () => {
      const getScrollDistance = () => {
        const container = track.parentElement;
        if (!container) return 0;
        return Math.max(0, track.scrollWidth - container.clientWidth);
      };

      /** Scroll while pinned before the track moves — room for Copy title scrub. */
      const getIntroDistance = () => window.innerHeight * 0.5;

      if (subtitleEl) gsap.set(subtitleEl, { x: 200, opacity: 0 });
      gsap.set(root, { backgroundColor: WORK_BG_DEFAULT });

      // Slogan images lag upward (parallax) while Work rises into the viewport.
      // Positive y = shift down in the slogan, so they rise slower than the section.
      const sloganImages = gsap.utils.toArray<HTMLElement>(
        '#slogan [data-anim="img-1"], #slogan [data-anim="img-2"], #slogan [data-anim="img-3"]',
      );
      const parallaxY = [120, 220, 160];
      const sloganParallaxTweens = sloganImages.map((img, i) =>
        gsap.to(img, {
          y: parallaxY[i] ?? 160,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        }),
      );

      // Subtitle slide (title reveal is owned by Copy in WorkHeading)
      let subtitleSt: ScrollTrigger | null = null;
      if (subtitleEl) {
        subtitleSt = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'top center',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            gsap.to(subtitleEl, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' });
          },
          onEnterBack: () => {
            gsap.to(subtitleEl, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' });
          },
        });
      }

      // Pin: hold (title scrub) → then move track left.
      // Duration weights match px so end += intro + distance stays 1:1 with scrub.
      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getIntroDistance() + getScrollDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const moveTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        duration: () => Math.max(getScrollDistance(), 1),
        ease: 'none',
      });

      horizontalTl.to({}, { duration: () => getIntroDistance() }).add(moveTween);

      // Per-card: text slides in from the right once the card locks into view;
      // section bg shifts to that project's color.
      const cardTriggers: ScrollTrigger[] = [];
      cards.forEach((card, index) => {
        const textEls = getCardTextEls(card);
        hideCardText(textEls);
        const bg = card.dataset.bg || WORK_BG_DEFAULT;

        const st = ScrollTrigger.create({
          trigger: card,
          containerAnimation: moveTween,
          // When the card's left edge reaches the padded left of the viewport
          // (matches the media + copy layout in the screenshot).
          start: 'left 30%',
          onEnter: () => {
            revealCardText(textEls);
            setWorkBg(root, bg);
          },
          onEnterBack: () => {
            revealCardText(textEls);
            setWorkBg(root, bg);
          },
          onLeaveBack: () => {
            concealCardText(textEls);
            // Same moment as text disperse — previous project (or heading cream)
            setWorkBg(root, getLeaveBackBg(cards, index));
          },
        });
        cardTriggers.push(st);
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        sloganParallaxTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        gsap.set(sloganImages, { clearProps: 'y' });
        subtitleSt?.kill();
        cardTriggers.forEach((st) => st.kill());
        horizontalTl.scrollTrigger?.kill();
        horizontalTl.kill();
        moveTween.kill();
        window.removeEventListener('resize', onResize);
        clearSectionStyles(root);
      };
    });

    // ── Mobile/Tablet: vertical stack — text from right + bg per card ──
    mm.add('(max-width: 1025px)', () => {
      gsap.set(root, { backgroundColor: WORK_BG_DEFAULT });

      const triggers = cards.map((card, index) => {
        const textEls = getCardTextEls(card);
        hideCardText(textEls);
        const bg = card.dataset.bg || WORK_BG_DEFAULT;

        return ScrollTrigger.create({
          trigger: card,
          start: 'top 75%',
          onEnter: () => {
            revealCardText(textEls);
            setWorkBg(root, bg);
          },
          onEnterBack: () => {
            revealCardText(textEls);
            setWorkBg(root, bg);
          },
          onLeaveBack: () => {
            concealCardText(textEls);
            setWorkBg(root, getLeaveBackBg(cards, index));
          },
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        clearSectionStyles(root);
      };
    });
  },
});
