/** Path only: no query/hash; trim trailing slash except root. */
export function stripNavPath(path: string): string {
  let p = path.split('?')[0]?.split('#')[0] ?? '';
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

/** Current URL is any localized Home route (e.g. /es/Home, /, /en). */
export function isHomePathForNav(path: string): boolean {
  const n = stripNavPath(path);
  if (n === '/' || n === '') return true;
  if (n === '/en') return true;
  return /\/Home$/i.test(n);
}

function stripHrefPath(href: string): string {
  const [pathPart] = href.split('#');
  if (!pathPart || pathPart === '#') return '';
  return stripNavPath(pathPart);
}

/** Nav link href points to Home (matches getLocalizedPath Home variants). */
export function hrefIndicatesHomeLink(href: string): boolean {
  const h = stripHrefPath(href);
  if (h === '/' || h === '/en' || h === '/Home') return true;
  return /\/Home$/i.test(h);
}

/** True when the browser location matches this nav link (Home aliases included). */
export function navPathMatchesLink(locationPathname: string, linkHref: string): boolean {
  const loc = stripNavPath(locationPathname);
  const href = stripHrefPath(linkHref);
  if (loc === href) return true;
  if (isHomePathForNav(loc) && hrefIndicatesHomeLink(linkHref)) return true;
  return false;
}
