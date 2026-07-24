import { createCopyAnimation } from './utils/copy';
import type { CopyEase, CopyScrub, CopySplitType } from './utils/copy';

type Controller = { cleanup: () => void };

type CopyOptionsPayload = {
  variant: string;
  animateOnScroll: boolean;
  delay: number;
  stagger: number | null;
  type: CopySplitType;
  trigger: string | null;
  triggerPoint: string | null;
  start: string | null;
  end: string | null;
  scrub: CopyScrub;
  reverse: boolean;
  ease: CopyEase | null;
  duration: number | null;
};

const DEFAULT_OPTIONS: CopyOptionsPayload = {
  variant: 'slideFromBottom',
  animateOnScroll: true,
  delay: 0,
  stagger: null,
  type: 'lines',
  trigger: null,
  triggerPoint: null,
  start: null,
  end: null,
  scrub: false,
  reverse: false,
  ease: null,
  duration: null,
};

const instances = new Map<HTMLElement, Controller>();

function readOptions(root: HTMLElement): CopyOptionsPayload {
  const raw = root.dataset.copyOptions;
  if (!raw) return { ...DEFAULT_OPTIONS };
  return JSON.parse(raw) as CopyOptionsPayload;
}

function pruneDetached() {
  for (const [el, ctrl] of instances) {
    if (!document.contains(el)) {
      ctrl.cleanup();
      instances.delete(el);
    }
  }
}

async function initCopyRoot(root: HTMLElement) {
  instances.get(root)?.cleanup();
  instances.delete(root);

  let isActive = true;
  const { variant, ...options } = readOptions(root);
  const animation = await createCopyAnimation({
    root,
    variant,
    options,
    isActive: () => isActive && document.contains(root),
  });

  if (!animation || !document.contains(root)) {
    animation?.cleanup();
    return;
  }

  instances.set(root, {
    cleanup() {
      isActive = false;
      animation.cleanup();
    },
  });
}

/**
 * (Re)play a single Copy root — used for manual / content-swap reveals
 * (`manual` prop). Safe to call repeatedly after changing text content.
 *
 * If `nextText` is provided, SplitText is reverted first and then the text
 * node is updated — otherwise `revert()` would restore the previous copy and
 * wipe the swap (desktop Services description).
 */
export function reinitCopy(
  root: HTMLElement | null | undefined,
  nextText?: string,
) {
  if (typeof window === 'undefined' || !root) return;

  instances.get(root)?.cleanup();
  instances.delete(root);

  if (typeof nextText === 'string') {
    const textEl =
      root.querySelector<HTMLElement>('[data-copy-text]') ??
      root.querySelector<HTMLElement>('p,h1,h2,h3,h4,h5,h6');
    if (textEl) textEl.textContent = nextText;
  }

  root.classList.remove('copy-ready');
  void initCopyRoot(root);
}

/** Boot / re-boot every `[data-copy]` root (idempotent for View Transitions). */
export function initCopyAnimations(scope: ParentNode = document) {
  if (typeof window === 'undefined') return;

  pruneDetached();

  scope.querySelectorAll<HTMLElement>('[data-copy]').forEach((root) => {
    // Manual roots wait for `reinitCopy` (e.g. Services description after images)
    if (root.dataset.copyManual === 'true') return;
    void initCopyRoot(root);
  });
}
