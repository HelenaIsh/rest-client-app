import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Ścieżki, które wymagają autentykacji
  const protectedPaths = [
    '/client',
    '/history',
    '/variables'
  ];

  // Sprawdź, czy żądana ścieżka jest chroniona
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Pobierz token autentykacji z ciasteczka (będzie ustawiane po zalogowaniu)
  const authToken = request.cookies.get('auth-token')?.value;

  // Jeśli ścieżka jest chroniona i nie ma tokenu, przekieruj do strony logowania
  if (isProtectedPath && !authToken) {
    const signInUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Jeśli dane logowania są błędne, przekieruj do strony rejestracji
  if (request.nextUrl.pathname === '/signin' && !authToken) {
    const signUpUrl = new URL('/signup', request.url);
    return NextResponse.redirect(signUpUrl);
  }


  
  // Jeśli użytkownik jest zalogowany i próbuje dostać się do stron logowania/rejestracji,
  // przekieruj go do strony głównej klienta REST
  if (authToken && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup')) {
    const clientUrl = new URL('/client', request.url);
    return NextResponse.redirect(clientUrl);
  }

  return NextResponse.next();
}

// Konfiguracja, które ścieżki powinny być sprawdzane przez middleware
export const config = {
  matcher: [
    '/client/:path*',
    '/history/:path*',
    '/variables/:path*',
    '/signin',
    '/signup'
  ],
};
