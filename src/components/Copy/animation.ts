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
  variant: 'slide',
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

/** Boot / re-boot every `[data-copy]` root (idempotent for View Transitions). */
export function initCopyAnimations(scope: ParentNode = document) {
  if (typeof window === 'undefined') return;

  pruneDetached();

  scope.querySelectorAll<HTMLElement>('[data-copy]').forEach((root) => {
    void initCopyRoot(root);
  });
}
