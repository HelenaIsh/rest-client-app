import { HistoryEntry, Header } from '@/types';
import { useCallback } from 'react';

interface SaveHistoryData {
  method: string;
  url: string;
  headers: Header[];
  body?: string;
}

const MAX_HISTORY_ITEMS = 50;

export function useHistorySaver() {
  const saveRequestToHistory = useCallback((data: SaveHistoryData) => {
    const { method, url, headers, body } = data;

    try {
      const historyHeaders = headers.reduce(
        (acc, header) => {
          if (header.enabled && header.key) {
            acc[header.key] = header.value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        method: method,
        url: url,
        headers: historyHeaders,
        body: body || undefined,
        timestamp: Date.now(),
      };

      const historyString = localStorage.getItem('rest-client-history');
      let currentHistory: HistoryEntry[] = historyString
        ? JSON.parse(historyString)
        : [];

      currentHistory.unshift(newEntry);

      if (currentHistory.length > MAX_HISTORY_ITEMS) {
        currentHistory = currentHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      localStorage.setItem(
        'rest-client-history',
        JSON.stringify(currentHistory)
      );
    } catch (error) {
      console.error(
        'Błąd podczas zapisywania historii do localStorage:',
        error
      );
    }
  }, []);

  return { saveRequestToHistory };
}
