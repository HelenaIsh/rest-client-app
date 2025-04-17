// src/app/[locale]/client/utils/buildClientStateUrl.ts
import { HistoryEntry } from '@/types'; // Zaimportuj typ
import { btoa } from 'buffer'; // Zaimportuj btoa

// Funkcja do budowania URL stanu klienta
export const buildClientStateUrl = (
  locale: string,
  entryData: Pick<HistoryEntry, 'method' | 'url' | 'headers' | 'body'>
): string => {
  const { method, url, headers, body } = entryData;
  try {
    const encodedUrl = btoa(url);
    // Poprawna obsługa braku body - pusty string w URL
    const encodedBody = body ? btoa(body) : '';

    // Ścieżka z locale
    const path = `/${locale}/client/${method}/${encodedUrl}/${encodedBody}`;

    // Nagłówki jako query params (URLSearchParams poprawnie koduje)
    const headerParams = new URLSearchParams(headers); // Przyjmuje Record<string, string>
    const queryString = headerParams.toString();

    return `${path}${queryString ? `?${queryString}` : ''}`;
  } catch (error) {
    console.error('Błąd podczas budowania URL stanu klienta:', error);
    // Zwróć domyślny URL klienta w razie błędu
    return `/${locale}/client`;
  }
};
