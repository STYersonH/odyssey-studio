import type { Locale } from './locales';
import { DEFAULT_LOCALE } from './locales';
import es from './translations/es';
import en from './translations/en';

const translations = { es, en } as const;

export function useTranslations(lang: Locale) {
  return translations[lang];
}

function normalizePath(path: string) {
  if (!path) return '/';
  if (path === '/') return '/';
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function stripLocalePrefix(path: string) {
  return path.replace(/^\/(es|en)(?=\/|$)/, '') || '/';
}

export function getLocalizedPath(lang: Locale, slug: string) {
  if (slug === 'Home') {
    return lang === DEFAULT_LOCALE ? '/Home' : `/${lang}/Home`;
  }
  const slugPath = `/${slug}`;
  const normalized = normalizePath(slugPath);
  return lang === DEFAULT_LOCALE ? normalized : `/${lang}${normalized === '/' ? '' : normalized}`;
}

/**
 * Swaps the locale prefix in a URL path.
 * e.g. getAlternateUrl('/About', 'en') → '/en/About'
 * e.g. getAlternateUrl('/en/About', 'es') → '/About'
 */
export function getAlternateUrl(url: string, targetLang: Locale): string {
  const normalized = normalizePath(url);
  const basePath = normalizePath(stripLocalePrefix(normalized));
  if (targetLang === DEFAULT_LOCALE) {
    return basePath;
  }
  return `/${targetLang}${basePath === '/' ? '' : basePath}`;
}
