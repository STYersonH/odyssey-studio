/**
 * Shared preloader state so the Hero intro can wait for the reveal.
 * Module state survives ClientRouter navigations: the preloader plays once per full load.
 */

const DONE_ATTR = 'data-preloader-done';

let done = false;
const waiters: Array<() => void> = [];

function flagDocument() {
  document.documentElement.setAttribute(DONE_ATTR, '');
}

export function isPreloaderDone() {
  return done;
}

export function markPreloaderDone() {
  if (done) return;
  done = true;
  flagDocument();
  waiters.splice(0).forEach((resolve) => resolve());
}

/** Resolves once the preloader reveal hands off (immediately if there is no preloader). */
export function whenPreloaderDone(): Promise<void> {
  if (done || !document.querySelector('[data-preloader]')) return Promise.resolve();
  return new Promise((resolve) => waiters.push(resolve));
}

// ClientRouter swaps <html> attributes; restore the flag before the new page paints.
document.addEventListener('astro:after-swap', () => {
  if (done) flagDocument();
});
