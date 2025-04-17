// src/app/[locale]/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
// Używamy komponentów i hooków z next-intl dla poprawnej obsługi lokalizacji

// import { useRouter, Link, useLocale } from '@/i18n/navigation';
// import { useTranslations } from 'next-intl';
// // Jawny import btoa dla bezpieczeństwa i spójności
// import { btoa } from 'buffer';
// Poprawione importy:
import { useRouter, Link } from '@/i18n/navigation'; // Router i Link z pliku nawigacji
import { useLocale, useTranslations } from 'next-intl'; // useLocale i useTranslations bezpośrednio z next-intl
// import { btoa } from 'buffer';
// import { buildClientStateUrl } from '@/app/[locale]/client/utils/buildClientStateUrl'; // Poprawna ścieżka


// Definicja struktury wpisu w historii (bez zmian)
interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

export default function HistoryPage() {
  // --- Hooks ---
  const { user, loading: authLoading } = useAuth(); // Stan autentykacji
  const router = useRouter(); // Router świadomy lokalizacji
  const locale = useLocale(); // Aktualna lokalizacja (np. 'en', 'pl')
  const t = useTranslations('History'); // Funkcja do tłumaczeń (zakładając klucz 'History')

  // --- State ---
  const [history, setHistory] = useState<HistoryEntry[]>([]); // Tablica wpisów historii
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania danych historii

  // --- Effects ---

  // Efekt: Przekierowanie niezalogowanego użytkownika
  useEffect(() => {
    // Uruchom tylko gdy stan autentykacji jest ustalony (!authLoading)
    if (!authLoading && !user) {
      // Przekieruj do strony logowania z uwzględnieniem lokalizacji
      router.push(`/${locale}/signin`);
    }
  }, [user, authLoading, router, locale]); // Zależności: stan auth, router, locale

  // Efekt: Ładowanie historii z localStorage po zalogowaniu
  useEffect(() => {
    // Uruchom tylko gdy stan autentykacji jest ustalony i użytkownik jest zalogowany
    if (!authLoading && user) {
      setIsLoading(true); // Rozpocznij ładowanie historii
      try {
        const storedHistory = localStorage.getItem('rest-client-history');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as HistoryEntry[];
          // Sortuj od najnowszych do najstarszych
          setHistory(parsedHistory.sort((a, b) => b.timestamp - a.timestamp));
        } else {
          setHistory([]); // Brak historii w localStorage
        }
      } catch (error) {
        console.error('Błąd podczas ładowania lub parsowania historii:', error);
        setHistory([]); // Ustaw pustą tablicę w razie błędu
      } finally {
        setIsLoading(false); // Zakończ ładowanie historii (sukces lub błąd)
      }
    } else if (!authLoading && !user) {
      // Jeśli użytkownik nie jest zalogowany po sprawdzeniu, zakończ ładowanie
      setIsLoading(false);
      setHistory([]);
    }
  }, [user, authLoading]); // Zależności: stan użytkownika i ładowania autentykacji

  // --- Renderowanie ---

  // Stan ładowania (autentykacji lub historii)
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-500">
        {t('loading')} {/* Użyj tłumaczenia */}
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany (przekierowanie w toku)
  // Ten stan nie powinien być widoczny długo, ale zabezpiecza przed renderowaniem reszty
  if (!user) {
    return null;
  }

  // Główna zawartość strony
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('title')}</h1>

      {/* Komunikat o pustej historii */}
      {history.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="mb-4 text-gray-600">{t('emptyMessage')}</p>
          {/* Link do klienta REST z uwzględnieniem lokalizacji */}
          <Link
            href={`/${locale}/client`} // Poprawny link z locale
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {t('goToClient')}
          </Link>
        </div>
      ) : (
        // Lista wpisów historii
        <ul className="space-y-3">
          {history.map((entry) => {
            // Bezpieczne generowanie URL dla linku wewnątrz mapowania
            let targetHref = '';
            try {
              // Kodowanie nagłówków jako parametrów zapytania
              // URLSearchParams poprawnie obsługuje Record<string, string> i kodowanie URI
              const headerParams = new URLSearchParams(entry.headers);
              const headersQuery = headerParams.toString();

              // Kodowanie URL i ciała zapytania do Base64
              const encodedUrl = btoa(entry.url);
              // Poprawna obsługa braku ciała zapytania (pusty string)
              const encodedBody = entry.body ? btoa(entry.body) : '';

              // Konstrukcja finalnego URL z uwzględnieniem lokalizacji
              // targetHref = `/${locale}/client/${entry.method}/${encodedUrl}/${encodedBody}${headersQuery ? `?${headersQuery}` : ''}`;
              targetHref = `/client/${entry.method}/${encodedUrl}/${encodedBody}${headersQuery ? `?${headersQuery}` : ''}`;
            } catch (error) {
              console.error(
                'Błąd podczas kodowania wpisu historii dla URL:',
                error,
                entry
              );
              // Zwróć element wskazujący na błąd, zamiast psuć całą listę
              return (
                <li
                  key={entry.id}
                  className="p-3 border border-red-300 bg-red-50 rounded text-red-700"
                >
                  Błąd wyświetlania wpisu: {entry.method} {entry.url}
                </li>
              );
            }

            // Renderowanie elementu listy z linkiem
            return (
              <li key={entry.id}>
                {/* Link z next-intl dla poprawnej nawigacji */}
                <Link
                  href={targetHref}
                  className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    {/* Wyświetlenie metody HTTP */}
                    <span className="inline-block font-mono px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                      {entry.method}
                    </span>
                    {/* Wyświetlenie URL (obcięte, jeśli za długie) */}
                    <span className="text-gray-700 break-all">{entry.url}</span>
                  </div>
                  {/* Wyświetlenie sformatowanej daty i czasu */}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleString(locale)} {/* Użyj locale do formatowania daty */}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
