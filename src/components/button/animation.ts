import gsap from 'gsap';

const DURATION = 0.3;
const EASE = 'power3.inOut';

type ButtonType = 'primary' | 'secondary';

interface ButtonTheme {
  bgRest: string;
  bgHover: string;
}

function getTheme(type: ButtonType): ButtonTheme {
  const isPrimary = type === 'primary';

  return {
    bgRest: isPrimary ? '#171717' : '#f2f2f2',
    bgHover: isPrimary ? '#f2f2f2' : '#171717',
  };
}

function getLabelOffset(track: HTMLElement, topLine: HTMLElement) {
  const styles = getComputedStyle(track);
  const gap =
    Number.parseFloat(styles.rowGap || styles.gap || '0') ||
    Number.parseFloat(styles.getPropertyValue('--button-track-gap')) ||
    8;

  return topLine.offsetHeight + gap;
}

function getIconSize(button: HTMLElement) {
  const size = Number.parseFloat(
    getComputedStyle(button).getPropertyValue('--button-icon-size'),
  );
  return Number.isFinite(size) && size > 0 ? size : 16;
}

export function initButtonAnimation(button: HTMLElement) {
  if (button.dataset.buttonInit === 'true') return;
  button.dataset.buttonInit = 'true';

  const type = (button.dataset.buttonType ?? 'primary') as ButtonType;
  const hasIcon = button.dataset.buttonIcon !== 'false';
  const theme = getTheme(type);
  const iconSize = getIconSize(button);
  const iconPadding = 2;

  const labelTrack = button.querySelector<HTMLElement>('[data-button-label-track]');
  const labelTop = button.querySelector<HTMLElement>('[data-button-label-top]');
  const iconWrap = button.querySelector<HTMLElement>('[data-button-icon-wrap]');
  const icon = button.querySelector<HTMLElement>('[data-button-icon]');
  const iconSvg = icon?.querySelector('svg');

  if (!labelTrack || !labelTop) return;

  const labelOffset = () => getLabelOffset(labelTrack, labelTop);

  gsap.set(button, { backgroundColor: theme.bgRest });
  gsap.set(labelTrack, { y: 0 });

  if (hasIcon && iconWrap && icon) {
    gsap.set(iconWrap, { width: 0 });
    gsap.set(icon, { width: 0, height: 0, padding: 0 });
    if (iconSvg) gsap.set(iconSvg, { opacity: 0, scale: 0.6 });
  }

  const timeline = gsap.timeline({
    paused: true,
    defaults: { duration: DURATION, ease: EASE },
  });

  timeline
    .to(button, { backgroundColor: theme.bgHover }, 0)
    .fromTo(labelTrack, { y: 0 }, { y: () => -labelOffset() }, 0);

  if (hasIcon && iconWrap && icon) {
    timeline
      .fromTo(iconWrap, { width: 0 }, { width: iconSize }, 0)
      .fromTo(
        icon,
        { width: 0, height: 0, padding: 0 },
        { width: iconSize, height: iconSize, padding: iconPadding },
        0,
      );

    if (iconSvg) {
      timeline.fromTo(iconSvg, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, 0);
    }
  }

  const play = () => timeline.play();
  const reverse = () => timeline.reverse();

  button.addEventListener('mouseenter', play);
  button.addEventListener('mouseleave', reverse);
  button.addEventListener('focusin', play);
  button.addEventListener('focusout', reverse);
}

export function initButtonAnimations(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLElement>('[data-button]:not([data-button-init="true"])')
    .forEach(initButtonAnimation);
}
