import gsap from 'gsap';
import { reinitCopy } from '../../../../components/Copy/animation';
import { isDesktopViewport } from './animation-shared';

/** Instant open/close for mb/tb description panels. */
function setAccordionPanel(opts: {
  closeEl?: HTMLElement | null;
  openEl: HTMLElement;
}) {
  const { closeEl, openEl } = opts;

  if (closeEl && closeEl !== openEl) {
    gsap.set(closeEl, { height: 0, overflow: 'hidden' });
    closeEl.querySelector<HTMLElement>('[data-copy]')?.classList.remove('copy-ready');
  }

  gsap.set(openEl, { height: 'auto', overflow: 'hidden' });
}

function getDesktopCopyRoot(root: HTMLElement) {
  return root
    .querySelector<HTMLElement>('[data-anim="services-desc-desktop"]')
    ?.querySelector<HTMLElement>('[data-copy]');
}

function getMobileDesc(root: HTMLElement, index: number) {
  return root.querySelector<HTMLElement>(
    `[data-anim="services-item-desc"][data-index="${index}"]`,
  );
}

/**
 * Show the active description without Copy motion (section enter).
 * Swap animations still use `playDescReveal`.
 */
export function showDescStatic(root: HTMLElement, index: number, text: string) {
  if (isDesktopViewport()) {
    const copyRoot = getDesktopCopyRoot(root);
    const textEl = copyRoot?.querySelector<HTMLElement>('[data-copy-text]');
    if (textEl) textEl.textContent = text;
    copyRoot?.classList.add('copy-ready');
    return;
  }

  const itemDesc = getMobileDesc(root, index);
  if (!itemDesc) return;

  const copyRoot = itemDesc.querySelector<HTMLElement>('[data-copy]');
  const textEl = copyRoot?.querySelector<HTMLElement>('[data-copy-text]');
  if (textEl) textEl.textContent = text;

  setAccordionPanel({ openEl: itemDesc });
  copyRoot?.classList.add('copy-ready');
}

/** Reveal description via Copy `slideFromTop` (manual roots) — service swaps. */
export function playDescReveal(
  root: HTMLElement,
  index: number,
  text: string,
  opts?: { closeEl?: HTMLElement | null },
) {
  if (isDesktopViewport()) {
    reinitCopy(getDesktopCopyRoot(root), text);
    return;
  }

  const itemDesc = getMobileDesc(root, index);
  if (!itemDesc) return;

  setAccordionPanel({
    closeEl: opts?.closeEl,
    openEl: itemDesc,
  });
  reinitCopy(itemDesc.querySelector<HTMLElement>('[data-copy]'), text);
}
