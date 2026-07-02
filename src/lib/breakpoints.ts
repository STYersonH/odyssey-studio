/**
 * Breakpoints aligned with `src/styles/figma_var.css` (@theme breakpoints).
 * Use only in the browser (client scripts / islands).
 */

export const BREAKPOINT_QUERIES = {
  /** Viewport width ≤ 744px */
  mobile: '(max-width: 744px)',
  /** 744px ≤ width ≤ 1200px (same ranges as the former React hook) */
  tablet: '(min-width: 744px) and (max-width: 1200px)',
  /** width ≥ 1200px */
  desktop: '(min-width: 1200px)',
  /** width ≥ 1700px */
  largeDesktop: '(min-width: 1700px)',
} as const;

export type BreakpointFlags = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isSmallScreen: boolean;
  isBigScreen: boolean;
};

export function getBreakpointFlags(): BreakpointFlags {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
      isSmallScreen: false,
      isBigScreen: false,
    };
  }

  const isMobile = window.matchMedia(BREAKPOINT_QUERIES.mobile).matches;
  const isTablet = window.matchMedia(BREAKPOINT_QUERIES.tablet).matches;
  const isDesktop = window.matchMedia(BREAKPOINT_QUERIES.desktop).matches;
  const isLargeDesktop = window.matchMedia(BREAKPOINT_QUERIES.largeDesktop).matches;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmallScreen: isMobile || isTablet,
    isBigScreen: isDesktop || isLargeDesktop,
  };
}

/**
 * Subscribe to viewport changes; callback runs when any tracked breakpoint may have changed.
 * Returns an unsubscribe function.
 */
export function subscribeBreakpoints(onChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQueries = [
    window.matchMedia(BREAKPOINT_QUERIES.mobile),
    window.matchMedia(BREAKPOINT_QUERIES.tablet),
    window.matchMedia(BREAKPOINT_QUERIES.desktop),
    window.matchMedia(BREAKPOINT_QUERIES.largeDesktop),
  ];

  const handler = () => {
    onChange();
  };

  mediaQueries.forEach((mq) => mq.addEventListener('change', handler));

  return () => {
    mediaQueries.forEach((mq) => mq.removeEventListener('change', handler));
  };
}
