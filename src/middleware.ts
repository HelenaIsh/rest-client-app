import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // Załóżmy, że ten plik istnieje
// Logika autentykacji (może być w tym samym pliku lub importowana)
const protectedPaths = ['/client', '/history', '/variables'];
function checkAuth(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname; // Użyj pathname z oryginalnego żądania
// Sprawdź, czy bieżąca ścieżka (bez locale) jest chroniona
  // Uwaga: next-intl może dodać prefix językowy, więc musimy go potencjalnie usunąć do porównania
  // lub użyć funkcji next-intl do uzyskania ścieżki bez locale, jeśli jest dostępna.
  // Dla uproszczenia, załóżmy, że pathname tutaj jest już bez locale (next-intl może to robić)
  // LUB dostosuj logikę sprawdzania ścieżki, aby uwzględniała możliwe prefixy locale.
// Prostsze podejście: sprawdzaj, czy ścieżka *zaczyna się* od chronionej ścieżki
  // (po usunięciu potencjalnego prefixu locale)
  const localePrefix = routing.locales.find(loc => pathname.startsWith(`/${loc}/`));
  const pathWithoutLocale = localePrefix
    ? pathname.substring(localePrefix.length + 1) // Usuń /en, /pl itp.
    : pathname; // Jeśli nie ma prefixu
const isProtectedPath = protectedPaths.some(path =>
    pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/')
  );
const authToken = request.cookies.get('auth-token')?.value;
// Reguła 1: Chroniona ścieżka, brak tokenu -> przekieruj na logowanie
  if (isProtectedPath && !authToken) {
    // Ważne: Przekieruj na stronę logowania Z uwzględnieniem bieżącego locale!
    const signInUrl = new URL(`${localePrefix || ''}/signin`, request.url);
    console.log(`Redirecting to signin: ${signInUrl.toString()}`);
    return NextResponse.redirect(signInUrl);
  }
// Reguła 2: Jest token, próba wejścia na logowanie/rejestrację -> przekieruj do aplikacji
  const isAuthPage = pathWithoutLocale === '/signin' || pathWithoutLocale === '/signup';
  if (authToken && isAuthPage) {
     // Ważne: Przekieruj na stronę klienta Z uwzględnieniem bieżącego locale!
    const clientUrl = new URL(`${localePrefix || ''}/client`, request.url);
    console.log(`Redirecting to client area: ${clientUrl.toString()}`);
    return NextResponse.redirect(clientUrl);
  }
// Jeśli żadna reguła autentykacji nie wymaga przekierowania, zwróć null
  return null;
}
// Główny middleware i18n
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: 'en',
  localeDetection: true,
  // Opcjonalnie: Można tu dodać prefixy ścieżek, jeśli są używane
  // pathnames: routing.pathnames // Jeśli używasz tłumaczenia ścieżek
});
// Scalony middleware
export default function middleware(request: NextRequest) {
  // 1. Najpierw uruchom middleware i18n
  const i18nResponse = intlMiddleware(request);
// Sprawdź, czy i18n zwróciło już odpowiedź (np. przekierowanie językowe)
  // Jeśli tak, zwróć ją od razu.
  // Musimy sprawdzić, czy status to redirect (3xx) lub czy ma nagłówek 'x-middleware-rewrite'
  // NextResponse.next() ma status 200, więc nie wpadnie w ten warunek.
  if (i18nResponse.status >= 300 && i18nResponse.status < 400 || i18nResponse.headers.has('x-middleware-rewrite')) {
      console.log('i18n middleware returned a response (redirect/rewrite), skipping auth check for this step.');
      return i18nResponse;
  }
// 2. Jeśli i18n nie zwróciło przekierowania/przepisania, uruchom logikę autentykacji
  console.log(`Checking auth for: ${request.nextUrl.pathname}`);
  const authResponse = checkAuth(request);
  if (authResponse) {
    console.log('Auth middleware returned a redirect.');
    return authResponse; // Zwróć odpowiedź z logiki autentykacji (np. przekierowanie)
  }
// 3. Jeśli ani i18n, ani auth nie zwróciły specjalnej odpowiedzi,
  // zwróć odpowiedź z i18n (która w tym przypadku będzie prawdopodobnie wynikiem NextResponse.next() z wewnątrz intlMiddleware,
  // potencjalnie z dodanymi nagłówkami i18n)
  console.log('Neither i18n nor auth redirected. Proceeding with i18n response.');
  return i18nResponse;
}
// Połączony matcher - musi obejmować WSZYSTKO, co jest istotne dla i18n LUB auth
export const config = {
  matcher: [
    // Ten wzorzec z i18n jest zwykle wystarczająco szeroki:
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Upewnij się, że obejmuje ścieżki z obu oryginalnych matcherów,
    // jeśli wzorzec i18n ich nie pokrywał. W tym przypadku prawdopodobnie pokrywa.
    // Można jawnie dodać, jeśli są wątpliwości:
    '/', '/history', '/client', '/variables', '/signin', '/signup',
    // '/client/:path*', '/history/:path*', '/variables/:path*'
    // Ale wzorzec /((?!...)*) powinien je złapać.
  ],
};