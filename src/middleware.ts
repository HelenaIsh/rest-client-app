import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware'; // Potrzebujemy next-intl
import { routing } from './i18n/routing'; // Potrzebujemy konfiguracji i18n

// --- Logika autentykacji ---
const protectedPaths = ['/client', '/history', '/variables']; // Ścieżki BEZ locale

function checkAuth(request: NextRequest): NextResponse | null {
  console.log('--- Inside checkAuth ---');
  const originalPathname = request.nextUrl.pathname;
  console.log('checkAuth received pathname:', originalPathname);

  const localePrefix = routing.locales.find((loc) =>
    originalPathname.startsWith(`/${loc}/`)
  );
  console.log('Detected localePrefix:', localePrefix);

  const pathWithoutLocale = localePrefix
    ? originalPathname.substring(localePrefix.length + 1) // Usuwa tylko pierwszy prefix
    : originalPathname;
  console.log('Calculated pathWithoutLocale:', pathWithoutLocale);

  // Sprawdź, czy ścieżka BEZ locale jest chroniona
  const isProtectedPath = protectedPaths.some(
    (path) =>
      pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
  );
  console.log('Is protected path:', isProtectedPath);

  const authToken = request.cookies.get('auth-token')?.value;
  console.log('Auth token present:', !!authToken);

  // Reguła 1: Chroniona ścieżka, brak tokenu -> przekieruj na logowanie (z locale)
  if (isProtectedPath && !authToken) {
    const signInPath = localePrefix ? `/${localePrefix}/signin` : '/signin'; // Zapewnij wiodący '/'
    const signInUrl = new URL(signInPath, request.url);
    console.log(
      `!!! Auth check FAILED. Redirecting to signin: ${signInUrl.toString()}`
    );
    return NextResponse.redirect(signInUrl);
  }

  // Reguła 2: Jest token, próba wejścia na logowanie/rejestrację -> przekieruj do aplikacji (z locale)
  const isAuthPage =
    pathWithoutLocale === '/signin' || pathWithoutLocale === '/signup';
  if (authToken && isAuthPage) {
    const clientPath = localePrefix ? `/${localePrefix}/client` : '/client'; // Zapewnij wiodący '/'
    const clientUrl = new URL(clientPath, request.url);
    console.log(
      `User logged in, redirecting from auth page to: ${clientUrl.toString()}`
    );
    return NextResponse.redirect(clientUrl);
  }

  console.log('--- Exiting checkAuth (no auth redirect needed) ---');
  return null;
}

// --- Główny middleware i18n ---
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale, // Użyj defaultLocale z routing.ts
  localeDetection: true, // Ważne dla przekierowania z /
  localePrefix: 'always', // Domyślne, ale jawne: zawsze używaj prefixu /en/ lub /ru/
});

// --- Scalony middleware (Auth -> i18n) ---
export default function middleware(request: NextRequest) {
  console.log(`--- Middleware START for: ${request.nextUrl.pathname} ---`);

  // 1. Sprawdź autentykację jako pierwszą
  console.log(`--> Running checkAuth FIRST for: ${request.nextUrl.pathname}`);
  const authResponse = checkAuth(request);
  if (authResponse) {
    console.log('Auth middleware returned a redirect. Returning authResponse.');
    return authResponse; // Przekierowanie auth ma priorytet
  }

  // 2. Jeśli auth OK, uruchom middleware i18n
  console.log(
    'Auth check passed (returned null). Proceeding to i18n middleware.'
  );
  const i18nResponse = intlMiddleware(request);
  // intlMiddleware z localePrefix: 'always' i localeDetection: true
  // automatycznie obsłuży przekierowanie z '/' na '/en' (lub inny wykryty/domyślny język)

  console.log(`i18nMiddleware status: ${i18nResponse.status}`);
  console.log('Returning response from i18n middleware.');
  return i18nResponse; // Zwróć odpowiedź i18n (może to być przekierowanie z / na /en)
}

// --- Konfiguracja matchera ---
export const config = {
  matcher: [
    /*
     * Dopasuj wszystkie ścieżki żądań oprócz tych, które zaczynają się od:
     * - api (trasy API)
     * - _next/static (pliki statyczne)
     * - _next/image (optymalizacja obrazów)
     * - favicon.ico (plik favicon)
     * - Jakiekolwiek pliki z rozszerzeniem (np. .png)
     * WAŻNE: Ten wzorzec obejmuje ścieżkę główną '/'
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
