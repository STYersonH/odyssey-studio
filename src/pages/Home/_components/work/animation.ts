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

function getTextEls(scope: HTMLElement) {
  return gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(CONTENT_SEL));
}

function hideTexts(els: HTMLElement[], fromRight = true) {
  gsap.set(els, { x: fromRight ? 72 : -72, autoAlpha: 0 });
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

function setWorkBg(root: HTMLElement, color: string, duration = 0.55) {
  gsap.to(root, {
    backgroundColor: color,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function getLeaveBackBg(cards: HTMLElement[], index: number) {
  if (index <= 0) return WORK_BG_DEFAULT;
  return cards[index - 1]?.dataset.bg || WORK_BG_DEFAULT;
}

/** Clip opens right→left (hidden via left inset). */
const CLIP_HIDDEN = 'inset(0 0% 0 100%)';
const CLIP_VISIBLE = 'inset(0 0% 0 0%)';

export const initWorkAnimation = createSectionAnimationController({
  rootId: 'work',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    mm.add('(min-width: 1025px)', () => {
      const track = root.querySelector<HTMLElement>('[data-anim="work-track"]');
      const stage = root.querySelector<HTMLElement>('[data-anim="project-stage"]');
      const heading = root.querySelector<HTMLElement>('[data-anim="work-heading"]');
      const progressRoot = root.querySelector<HTMLElement>('[data-anim="work-progress"]');
      const progressLabel = root.querySelector<HTMLElement>(
        '[data-anim="work-progress-label"]',
      );
      const progressBar = root.querySelector<HTMLElement>(
        '[data-anim="work-progress-bar"]',
      );
      if (!track || !stage) return () => {};

      const mediaLayers = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll('[data-anim="project-media-layer"]'),
      );
      const contentLayers = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll('[data-anim="project-content-layer"]'),
      );
      const n = mediaLayers.length;
      if (!n) return () => {};

      const getIntroDistance = () => window.innerHeight * 0.45;
      const getStepDistance = () => window.innerHeight * 0.7;
      /** Extra pin after the last project so it can be read before unpinning. */
      const getLastHoldDistance = () => window.innerHeight * 0.85;
      /** Extra nudge so WorkHeading clears the left edge once a project is active. */
      const getHeadingNudge = () => Math.min(window.innerWidth * 0.28, 420);

      const getParkTargetX = () => {
        const container = track.parentElement;
        if (!container) return 0;
        const currentX = Number(gsap.getProperty(track, 'x')) || 0;
        const containerRect = container.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const cs = getComputedStyle(container);
        const pl = parseFloat(cs.paddingLeft) || 0;
        const pr = parseFloat(cs.paddingRight) || 0;
        const contentCenter =
          containerRect.left + pl + (containerRect.width - pl - pr) / 2;
        const trackLeft0 = trackRect.left - currentX;
        const stageCenter0 = trackLeft0 + stage.offsetLeft + stage.offsetWidth / 2;
        return contentCenter - stageCenter0;
      };

      const totalScroll = () => {
        const park = Math.abs(getParkTargetX());
        return (
          getIntroDistance() +
          Math.max(park, 1) +
          n * getStepDistance() +
          getLastHoldDistance()
        );
      };

      gsap.set(root, { backgroundColor: WORK_BG_DEFAULT });
      if (heading) gsap.set(heading, { x: 0 });
      if (progressRoot) gsap.set(progressRoot, { autoAlpha: 0 });
      if (progressBar) gsap.set(progressBar, { width: '0%' });

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

      contentLayers.forEach((layer, i) => {
        hideTexts(getTextEls(layer), true);
        gsap.set(layer, { autoAlpha: i === 0 ? 1 : 0 });
      });
      mediaLayers.forEach((layer, i) => {
        gsap.set(layer, {
          clipPath: i === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
        });
      });

      let activeIndex = -1;
      let busy = false;
      let queued: number | null = null;
      let swapTween: gsap.core.Timeline | null = null;

      const updateProgressUi = (projectProgress: number, projectIndex: number) => {
        if (progressBar) {
          gsap.set(progressBar, {
            width: `${gsap.utils.clamp(0, 1, projectProgress) * 100}%`,
          });
        }
        if (progressLabel) {
          const total = String(n).padStart(2, '0');
          if (projectIndex < 0) {
            progressLabel.textContent = `— / ${total}`;
          } else {
            progressLabel.textContent = `${String(projectIndex + 1).padStart(2, '0')} / ${total}`;
          }
        }
      };

      const setProgressVisible = (show: boolean) => {
        if (!progressRoot) return;
        gsap.to(progressRoot, {
          autoAlpha: show ? 1 : 0,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const nudgeHeading = (on: boolean) => {
        if (!heading) return;
        gsap.to(heading, {
          x: on ? -getHeadingNudge() : 0,
          // Slow exit so the title doesn't snap away when the first project lands
          duration: on ? 2.4 : 1.6,
          ease: on ? 'power1.out' : 'power2.inOut',
          overwrite: 'auto',
        });
      };

      const flushQueue = () => {
        if (queued === null) return;
        if (queued === activeIndex || (queued < 0 && activeIndex < 0)) {
          queued = null;
          return;
        }
        const next = queued;
        queued = null;
        goTo(next);
      };

      const playFirstReveal = (index: number) => {
        const layer = contentLayers[index];
        const texts = getTextEls(layer);
        const bg = layer.dataset.bg || WORK_BG_DEFAULT;
        gsap.set(layer, { autoAlpha: 1 });
        hideTexts(texts, true);
        nudgeHeading(true);
        setProgressVisible(true);
        swapTween = gsap.timeline({
          onComplete: () => {
            busy = false;
            flushQueue();
          },
        });
        swapTween.to(texts, {
          x: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
        });
        setWorkBg(root, bg, 0.7);
      };

      /** Leave project zone back to title — animate texts out (inverse of first reveal). */
      const playConcealToTitle = (from: number) => {
        const layer = contentLayers[from];
        const texts = getTextEls(layer);
        nudgeHeading(false);
        setProgressVisible(false);
        swapTween?.kill();
        swapTween = gsap.timeline({
          onComplete: () => {
            contentLayers.forEach((l, i) => {
              hideTexts(getTextEls(l), true);
              gsap.set(l, { autoAlpha: i === 0 ? 1 : 0 });
            });
            mediaLayers.forEach((l, i) => {
              gsap.set(l, {
                clipPath: i === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
              });
            });
            gsap.set(root, { backgroundColor: WORK_BG_DEFAULT });
            busy = false;
            flushQueue();
          },
        });
        swapTween.to(texts, {
          x: 72,
          autoAlpha: 0,
          duration: 0.55,
          stagger: { each: 0.05, from: 'end' },
          ease: 'power3.in',
        });
        swapTween.to(
          root,
          { backgroundColor: WORK_BG_DEFAULT, duration: 0.55, ease: 'power2.out' },
          0,
        );
      };

      const playSwap = (from: number, to: number) => {
        const forward = to > from;
        const outLayer = contentLayers[from];
        const inLayer = contentLayers[to];
        const outTexts = getTextEls(outLayer);
        const inTexts = getTextEls(inLayer);
        const outX = forward ? -72 : 72;
        const inFromX = forward ? 72 : -72;
        const bg = inLayer.dataset.bg || WORK_BG_DEFAULT;
        const higher = Math.max(from, to);
        const higherMedia = mediaLayers[higher];

        swapTween?.kill();
        swapTween = gsap.timeline({
          onComplete: () => {
            busy = false;
            flushQueue();
          },
        });

        swapTween.to(outTexts, {
          x: outX,
          autoAlpha: 0,
          duration: 0.45,
          stagger: { each: 0.05, from: forward ? 'end' : 'start' },
          ease: 'power3.in',
        });
        swapTween.set(outLayer, { autoAlpha: 0 });

        swapTween.set(inLayer, { autoAlpha: 1 });
        hideTexts(inTexts, forward);

        if (forward) {
          gsap.set(higherMedia, { clipPath: CLIP_HIDDEN });
          swapTween.to(
            higherMedia,
            { clipPath: CLIP_VISIBLE, duration: 0.75, ease: 'power2.inOut' },
            'in',
          );
        } else {
          swapTween.to(
            higherMedia,
            { clipPath: CLIP_HIDDEN, duration: 0.75, ease: 'power2.inOut' },
            'in',
          );
        }

        swapTween.fromTo(
          inTexts,
          { x: inFromX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
          },
          'in',
        );
        swapTween.to(
          root,
          { backgroundColor: bg, duration: 0.7, ease: 'power2.out' },
          'in',
        );
      };

      const goTo = (index: number) => {
        // -1 = back to title / pre-reveal
        if (index < 0) {
          if (activeIndex < 0) return;
          if (busy) {
            queued = -1;
            return;
          }
          busy = true;
          const from = activeIndex;
          activeIndex = -1;
          playConcealToTitle(from);
          return;
        }

        const clamped = Math.max(0, Math.min(n - 1, index));
        if (clamped === activeIndex) return;
        if (busy) {
          queued = clamped;
          return;
        }
        busy = true;
        const from = activeIndex;
        activeIndex = clamped;
        if (from < 0) playFirstReveal(clamped);
        else playSwap(from, clamped);
      };

      const parkTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${totalScroll()}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const intro = getIntroDistance();
            const park = Math.max(Math.abs(getParkTargetX()), 1);
            const step = getStepDistance();
            const lastHold = getLastHoldDistance();
            const stepsSpan = n * step;
            const total = intro + park + stepsSpan + lastHold;
            const pos = self.progress * total;
            const parkEnd = intro + park;

            if (pos < parkEnd) {
              updateProgressUi(0, -1);
              goTo(-1);
              return;
            }

            const intoSteps = pos - parkEnd;
            // During lastHold, stay on the final project with progress filled
            const projectProgress = Math.min(1, intoSteps / stepsSpan);
            const index = Math.min(n - 1, Math.floor(intoSteps / step));
            updateProgressUi(projectProgress, activeIndex < 0 ? index : activeIndex);
            goTo(index);
          },
        },
      });

      parkTl.to({}, { duration: () => getIntroDistance() });
      parkTl.to(track, {
        x: () => getParkTargetX(),
        duration: () => Math.max(Math.abs(getParkTargetX()), 1),
        ease: 'none',
      });
      parkTl.to({}, { duration: () => n * getStepDistance() });
      parkTl.to({}, { duration: () => getLastHoldDistance() });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        sloganParallaxTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        gsap.set(sloganImages, { clearProps: 'y' });
        swapTween?.kill();
        parkTl.scrollTrigger?.kill();
        parkTl.kill();
        window.removeEventListener('resize', onResize);
        clearSectionStyles(root);
      };
    });

    mm.add('(max-width: 1025px)', () => {
      const cards = Array.from(
        root.querySelectorAll<HTMLElement>('[data-anim="project-card"]'),
      );
      gsap.set(root, { backgroundColor: WORK_BG_DEFAULT });

      const triggers = cards.map((card, index) => {
        const textEls = getTextEls(card);
        hideTexts(textEls, true);
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
