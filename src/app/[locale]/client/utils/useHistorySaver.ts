// src/app/[locale]/client/utils/useHistorySaver.ts
import { HistoryEntry, Header } from '@/types'; // Zaimportuj typy
import { useCallback } from 'react';

// Interfejs dla danych wejściowych do zapisu
interface SaveHistoryData {
  method: string;
  url: string; // Po podstawieniu
  headers: Header[]; // Tablica nagłówków *po* podstawieniu wartości
  body?: string; // Po podstawieniu
}

const MAX_HISTORY_ITEMS = 50; // Maksymalna liczba wpisów w historii

export function useHistorySaver() {
  const saveRequestToHistory = useCallback((data: SaveHistoryData) => {
    const { method, url, headers, body } = data;

    try {
      // 1. Przygotuj nagłówki w formacie Record<string, string> (tylko włączone)
      const historyHeaders = headers.reduce((acc, header) => {
        if (header.enabled && header.key) {
          acc[header.key] = header.value; // Wartość już po podstawieniu
        }
        return acc;
      }, {} as Record<string, string>);

      // 2. Stwórz obiekt HistoryEntry
      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        method: method,
        url: url,
        headers: historyHeaders,
        body: body || undefined, // Użyj undefined jeśli body jest puste
        timestamp: Date.now(),
      };

      // 3. Odczytaj, zaktualizuj i zapisz w localStorage
      const historyString = localStorage.getItem('rest-client-history');
      let currentHistory: HistoryEntry[] = historyString
        ? JSON.parse(historyString)
        : [];

      currentHistory.unshift(newEntry); // Dodaj na początek

      // Ogranicz rozmiar
      if (currentHistory.length > MAX_HISTORY_ITEMS) {
        currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      localStorage.setItem(
        'rest-client-history',
        JSON.stringify(currentHistory)
      );
    } catch (error) {
      console.error('Błąd podczas zapisywania historii do localStorage:', error);
      // Można tu dodać powiadomienie dla użytkownika, jeśli jest taka potrzeba
    }
  }, []); // Pusta tablica zależności

  return { saveRequestToHistory };
}
