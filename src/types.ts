export interface Header {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
}

export interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
}
