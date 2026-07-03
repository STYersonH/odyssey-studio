import gsap from 'gsap';

const DURATION = 0.3;
const EASE = 'power3.inOut';

function getLabelOffset(track: HTMLElement, topLine: HTMLElement) {
  const styles = getComputedStyle(track);
  const gap =
    Number.parseFloat(styles.rowGap || styles.gap || '0') ||
    Number.parseFloat(styles.getPropertyValue('--nav-link-track-gap')) ||
    4;

  return topLine.offsetHeight + gap;
}

export function initNavLinkAnimation(link: HTMLElement) {
  if (link.dataset.navLinkInit === 'true') return;
  link.dataset.navLinkInit = 'true';

  const labelTrack = link.querySelector<HTMLElement>('[data-nav-link-track]');
  const labelTop = link.querySelector<HTMLElement>('[data-nav-link-top]');

  if (!labelTrack || !labelTop) return;

  const labelOffset = () => getLabelOffset(labelTrack, labelTop);

  gsap.set(labelTrack, { y: 0 });

  const timeline = gsap.timeline({
    paused: true,
    defaults: { duration: DURATION, ease: EASE },
  });

  timeline.fromTo(labelTrack, { y: 0 }, { y: () => -labelOffset() });

  const play = () => timeline.play();
  const reverse = () => timeline.reverse();

  link.addEventListener('mouseenter', play);
  link.addEventListener('mouseleave', reverse);
  link.addEventListener('focusin', play);
  link.addEventListener('focusout', reverse);
}

export function initNavLinkAnimations(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>('[data-nav-link]:not([data-nav-link-init="true"])')
    .forEach(initNavLinkAnimation);
}
