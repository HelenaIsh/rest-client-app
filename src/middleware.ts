import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const protectedPaths = ['/client', '/history', '/variables'];

function checkAuth(request: NextRequest): NextResponse | null {
  console.log('--- Inside checkAuth ---');
  const originalPathname = request.nextUrl.pathname;
  console.log('checkAuth received pathname:', originalPathname);

  const localePrefix = routing.locales.find((loc) =>
    originalPathname.startsWith(`/${loc}/`)
  );
  console.log('Detected localePrefix:', localePrefix);

  const pathWithoutLocale = localePrefix
    ? originalPathname.substring(localePrefix.length + 1)
    : originalPathname;
  console.log('Calculated pathWithoutLocale:', pathWithoutLocale);

  const isProtectedPath = protectedPaths.some(
    (path) =>
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
  );
  console.log('Is protected path:', isProtectedPath);

  const authToken = request.cookies.get('auth-token')?.value;
  console.log('Auth token present:', !!authToken);

  if (isProtectedPath && !authToken) {
    const signInPath = localePrefix ? `/${localePrefix}/signin` : '/signin';
    const signInUrl = new URL(signInPath, request.url);
    console.log(
      `!!! Auth check FAILED. Redirecting to signin: ${signInUrl.toString()}`
    );
    return NextResponse.redirect(signInUrl);
  }

  const isAuthPage =
    pathWithoutLocale === '/signin' || pathWithoutLocale === '/signup';
  if (authToken && isAuthPage) {
    const clientPath = localePrefix ? `/${localePrefix}/client` : '/client';
    const clientUrl = new URL(clientPath, request.url);
    console.log(
      `User logged in, redirecting from auth page to: ${clientUrl.toString()}`
    );
    return NextResponse.redirect(clientUrl);
  }

  console.log('--- Exiting checkAuth (no auth redirect needed) ---');
  return null;
}

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  console.log(`--- Middleware START for: ${request.nextUrl.pathname} ---`);

  console.log(`--> Running checkAuth FIRST for: ${request.nextUrl.pathname}`);
  const authResponse = checkAuth(request);
  if (authResponse) {
    console.log('Auth middleware returned a redirect. Returning authResponse.');
    return authResponse;
  }

  console.log(
    'Auth check passed (returned null). Proceeding to i18n middleware.'
  );
  const i18nResponse = intlMiddleware(request);

  console.log(`i18nMiddleware status: ${i18nResponse.status}`);
  console.log('Returning response from i18n middleware.');
  return i18nResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
