import gsap from 'gsap';
import { clearSectionStyles } from '../../../../utils/clear-section-styles';
import { createSectionAnimationController } from '../../../../utils/create-section-animation-controller';
import { setCardsRest } from './cards-animation';
import { showDescStatic } from './description-animation';
import { setupInteraction } from './interaction-animation';
import { setupDesktopPin } from './pin-animation';
import { isDesktopViewport, readItems } from './animation-shared';

export const initServicesAnimation = createSectionAnimationController({
  rootId: 'services',
  waitForFonts: false,
  setup: ({ root, mm }) => {
    const cardA = root.querySelector<HTMLElement>('[data-anim="services-card-a"]');
    const cardB = root.querySelector<HTMLElement>('[data-anim="services-card-b"]');
    const cards = [cardA, cardB].filter(Boolean) as HTMLElement[];
    const payload = readItems(root);
    const activeIndex = Number(root.dataset.servicesActive ?? '1');
    const activeItem = payload[activeIndex] ?? payload[0];

    // Images + list are static on enter; only the title Copy animates.
    setCardsRest(cards);

    const mobileDescs = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-anim="services-item-desc"]'),
    );
    if (!isDesktopViewport()) {
      gsap.set(mobileDescs, { height: 0, overflow: 'hidden' });
    }

    // Description visible without motion; Copy reveal only on service swap.
    if (activeItem) {
      showDescStatic(root, activeIndex, activeItem.description);
    }

    setupDesktopPin(root, mm);

    const cleanupInteraction = setupInteraction(root, cards, payload);

    return () => {
      cleanupInteraction();
      clearSectionStyles(root);
    };
  },
});
