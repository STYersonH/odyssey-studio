import { createRevealAnimation } from './utils';
import type { RevealDirection, RevealScrub } from './utils';

type Controller = { cleanup: () => void };

type RevealOptionsPayload = {
  animateOnScroll: boolean;
  delay: number;
  stagger: number | null;
  from: RevealDirection;
  out: RevealDirection | null;
  distance: number | null;
  trigger: string | null;
  start: string | null;
  end: string | null;
  scrub: RevealScrub;
  reverse: boolean;
  ease: string | null;
  duration: number | null;
};

const DEFAULT_OPTIONS: RevealOptionsPayload = {
  animateOnScroll: true,
  delay: 0,
  stagger: null,
  from: 'right',
  out: null,
  distance: null,
  trigger: null,
  start: null,
  end: null,
  scrub: false,
  reverse: false,
  ease: null,
  duration: null,
};

const instances = new Map<HTMLElement, Controller>();

function readOptions(root: HTMLElement): RevealOptionsPayload {
  const raw = root.dataset.revealOptions;
  if (!raw) return { ...DEFAULT_OPTIONS };
  return JSON.parse(raw) as RevealOptionsPayload;
}

function pruneDetached() {
  for (const [el, ctrl] of instances) {
    if (!document.contains(el)) {
      ctrl.cleanup();
      instances.delete(el);
    }
  }
}

function initRevealRoot(root: HTMLElement) {
  instances.get(root)?.cleanup();
  instances.delete(root);

  let isActive = true;
  const payload = readOptions(root);

  const animation = createRevealAnimation({
    root,
    options: {
      animateOnScroll: payload.animateOnScroll,
      delay: payload.delay,
      from: payload.from,
      scrub: payload.scrub,
      reverse: payload.reverse,
      trigger: payload.trigger,
      ...(payload.stagger != null ? { stagger: payload.stagger } : {}),
      ...(payload.out != null ? { out: payload.out } : {}),
      ...(payload.distance != null ? { distance: payload.distance } : {}),
      ...(payload.start != null ? { start: payload.start } : {}),
      ...(payload.end != null ? { end: payload.end } : {}),
      ...(payload.ease != null ? { ease: payload.ease } : {}),
      ...(payload.duration != null ? { duration: payload.duration } : {}),
    },
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

/** Boot / re-boot every `[data-reveal]` root (idempotent for View Transitions). */
export function initRevealAnimations(scope: ParentNode = document) {
  if (typeof window === 'undefined') return;

  pruneDetached();

  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((root) => {
    initRevealRoot(root);
  });
}
