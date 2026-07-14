/** Wait for webfonts before SplitText or other text measurements. */
export async function whenFontsReady(): Promise<void> {
  if (typeof document === 'undefined') return;
  await document.fonts?.ready;
}
