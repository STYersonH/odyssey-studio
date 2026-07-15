import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

gsap.registerPlugin(ScrollTrigger);

export const initWorkAnimation = createSectionAnimationController({
  rootId: 'work',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    const track = root.querySelector<HTMLElement>('[data-anim="work-track"]');
    const subtitleEl = root.querySelector<HTMLElement>('[data-anim="work-subtitle"]');
    const titleLines = root.querySelectorAll('[data-anim="work-title"] p');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-anim="project-card"]'));

    if (!track) return () => {};

    // ── Desktop (>= 744px): horizontal scroll pin ──
    mm.add('(min-width: 744px)', () => {
      // Get scroll distance dynamically
      const getScrollDistance = () => {
        const container = track.parentElement;
        if (!container) return 0;
        return Math.max(0, track.scrollWidth - container.clientWidth);
      };

      // Initial states
      gsap.set(titleLines, { y: 50, opacity: 0 });
      if (subtitleEl) gsap.set(subtitleEl, { x: 200, opacity: 0 });

      // 1. Title stagger
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'top center',
          toggleActions: 'play none none reverse',
        },
      });
      titleTl.to(titleLines, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // 2. Subtitle slide
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

      // 3. Horizontal scroll
      const horizontalSt = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
        }),
      });

      // 4. Resize handler
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        titleTl.kill();
        subtitleSt?.kill();
        horizontalSt.kill();
        window.removeEventListener('resize', onResize);
        clearSectionStyles(root);
      };
    });

    // ── Mobile/Tablet (< 744px): vertical stacked layout ──
    mm.add('(max-width: 743px)', () => {
      gsap.set(cards, { y: 40, opacity: 0 });

      const triggers = cards.map(card =>
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          onEnter: () => gsap.to(card, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }),
        })
      );

      return () => {
        triggers.forEach(t => t.kill());
        clearSectionStyles(root);
      };
    });
  },
});
