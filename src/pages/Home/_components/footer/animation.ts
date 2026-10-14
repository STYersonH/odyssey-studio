import { ensureLenisScroll } from '../../../../lib/lenisScroll';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';

const SEL = {
  backToTop: '[data-anim="footer-back-to-top"]',
} as const;

export const initFooterAnimation = createSectionAnimationController({
  rootId: 'footer',
  waitForFonts: false,
  refreshScrollTrigger: false,
  setup: ({ root }) => {
    const lenis = ensureLenisScroll();
    const backToTop = root.querySelector<HTMLButtonElement>(SEL.backToTop);

    const onBackToTop = () => {
      lenis.scrollTo(0);
    };
    backToTop?.addEventListener('click', onBackToTop);

    return () => {
      backToTop?.removeEventListener('click', onBackToTop);
    };
  },
});
