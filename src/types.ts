// src/types.ts
export interface Header {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
}

// Dodaj ten interfejs
export interface HistoryEntry {
  id: string; // Unikalny identyfikator
  method: string; // Metoda HTTP
  url: string; // URL *po* podstawieniu zmiennych
  headers: Record<string, string>; // Nagłówki *po* podstawieniu zmiennych (tylko włączone)
  body?: string; // Ciało zapytania *po* podstawieniu zmiennych (opcjonalne)
  timestamp: number; // Czas wykonania
}
