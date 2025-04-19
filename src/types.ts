export interface Header {
  id: number;
  key: string;
  value: string;
  enabled: boolean;
}

export interface HistoryItem {
  method: string;
  endpointUrl: string;
  body: string;
  headers: Header[];
  path: string;
}
