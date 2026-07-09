import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type SetupContext = {
  root: HTMLElement;
  mm: gsap.MatchMedia;
};

type ScrollSectionControllerOptions = {
  /** DOM id of the section root (e.g. "partners"). */
  rootId: string;
  /**
   * Build the animation.
   * Kill ScrollTriggers / listeners and reset section styles in the cleanup returned
   * from setup or from each mm.add block.
   */
  setup: (context: SetupContext) => void | (() => void);
};

// Second refresh after layout settles (fonts, images, Lenis) so trigger positions stay correct.
const REFRESH_DELAY_MS = 150;

export function createScrollSectionController({ rootId, setup }: ScrollSectionControllerOptions) {
  let mm: gsap.MatchMedia | null = null;
  let cleanupSetup: (() => void) | undefined;

  // Runs on first load and on every astro:page-load, so it must be idempotent.
  return () => {
    if (typeof window === 'undefined') return;

    const root = document.getElementById(rootId);
    if (!root) return;

    // LIMPIAMOS LA EJECUCION ANTERIOR
    // -------------------------------
    // se ejecuta la función de cleanup de la sección anterior.
    cleanupSetup?.();
    // se revierte la instancia de MatchMedia de la sección anterior.
    mm?.revert();

    // REALIZAMOS UNA NUEVA EJECUCION
    // ------------------------------
    // se crea una nueva instancia de MatchMedia para cada sección.
    mm = gsap.matchMedia();
    // la funcion cleanup retornada es la que se asigna a cleanupSetup y se ejecuta en el cleanup.
    const cleanup = setup({ root, mm });
    cleanupSetup = typeof cleanup === 'function' ? cleanup : undefined;

    // REFRESCAMOS EL SCROLL TRIGGER PARA QUE LAS POSICIONES DE LOS TRIGGER SEAN CORRECTAS.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DELAY_MS);
  };
}
