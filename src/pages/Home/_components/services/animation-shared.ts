export type ServiceItem = {
  title: string;
  description: string;
  images: [string, string];
};

export const MM_DESKTOP = '(min-width: 1025px)';

export function isDesktopViewport() {
  return window.matchMedia(MM_DESKTOP).matches;
}

export function readItems(root: HTMLElement): ServiceItem[] {
  const payloadEl = root.querySelector<HTMLScriptElement>('[data-services-payload]');
  try {
    return payloadEl?.textContent ? (JSON.parse(payloadEl.textContent) as ServiceItem[]) : [];
  } catch {
    return [];
  }
}

export function showOverlayFor(item: ServiceItem) {
  return (
    item.images[0].includes('services-preview-a') &&
    item.images[1].includes('services-preview-b')
  );
}
