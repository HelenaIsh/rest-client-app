'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

import { useRouter, Link } from '@/i18n/navigation'; // Router i Link z pliku nawigacji
import { useLocale, useTranslations } from 'next-intl'; // useLocale i useTranslations bezpośrednio z next-intl

interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth(); // Stan autentykacji
  const router = useRouter(); // Router świadomy lokalizacji
  const locale = useLocale(); // Aktualna lokalizacja (np. 'en', 'pl')
  const t = useTranslations('History'); // Funkcja do tłumaczeń (zakładając klucz 'History')

  const [history, setHistory] = useState<HistoryEntry[]>([]); // Tablica wpisów historii
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania danych historii

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/signin`);
    }
  }, [user, authLoading, router, locale]); // Zależności: stan auth, router, locale

  useEffect(() => {
    if (!authLoading && user) {
      setIsLoading(true); // Rozpocznij ładowanie historii
      try {
        const storedHistory = localStorage.getItem('rest-client-history');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as HistoryEntry[];

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
      setIsLoading(false);
      setHistory([]);
    }
  }, [user, authLoading]); // Zależności: stan użytkownika i ładowania autentykacji

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-500">
        {t('loading')} {/* Użyj tłumaczenia */}
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        <ul className="space-y-3">
          {history.map((entry) => {
            let targetHref = '';
            try {
              const headerParams = new URLSearchParams(entry.headers);
              const headersQuery = headerParams.toString();

              const encodedUrl = btoa(entry.url);

              const encodedBody = entry.body ? btoa(entry.body) : '';

              targetHref = `/client/${entry.method}/${encodedUrl}/${encodedBody}${headersQuery ? `?${headersQuery}` : ''}`;
            } catch (error) {
              console.error(
                'Błąd podczas kodowania wpisu historii dla URL:',
                error,
                entry
              );

              return (
                <li
                  key={entry.id}
                  className="p-3 border border-red-300 bg-red-50 rounded text-red-700"
                >
                  Błąd wyświetlania wpisu: {entry.method} {entry.url}
                </li>
              );
            }

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
                    {new Date(entry.timestamp).toLocaleString(locale)}{' '}
                    {/* Użyj locale do formatowania daty */}
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
