import { HistoryEntry } from '@/types';
import { btoa } from 'buffer';

export const buildClientStateUrl = (
  locale: string,
  entryData: Pick<HistoryEntry, 'method' | 'url' | 'headers' | 'body'>
): string => {
  const { method, url, headers, body } = entryData;
  try {
    const encodedUrl = btoa(url);

    const encodedBody = body ? btoa(body) : '';

    const path = `/${locale}/client/${method}/${encodedUrl}/${encodedBody}`;

    const headerParams = new URLSearchParams(headers);
    const queryString = headerParams.toString();

    return `${path}${queryString ? `?${queryString}` : ''}`;
  } catch (error) {
    console.error('Błąd podczas budowania URL stanu klienta:', error);

    return `/${locale}/client`;
  }
};
