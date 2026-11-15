import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames, ignore api, static files, favicon, etc.
  matcher: ['/', '/(kn|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

