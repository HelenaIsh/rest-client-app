import { Header } from '@/types';
import { Extension } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { methods } from '@components/MethodSelector';
import { HistoryItem } from '@/types';

export const getFilteredHeaders = (
  headers: Header[]
): Record<string, string> => {
  return headers.reduce(
    (acc, { key, value, enabled }) => {
      if (enabled && key) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
};

export const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('Content-Type') || '';
  let detectedLanguage: Extension | null;
  let data;

  if (contentType.includes('application/json')) {
    data = JSON.stringify(await response.json(), null, 2);
    detectedLanguage = json();
  } else if (contentType.includes('text/')) {
    data = await response.text();
    detectedLanguage = html();
  } else {
    data = await response.text();
    detectedLanguage = javascript();
  }

  return { data, detectedLanguage };
};

export const getStatusColor = (status?: number) => {
  if (!status) return 'text-gray-500';
  if (status >= 200 && status < 300) return 'text-green-600';
  if (status >= 300 && status < 400) return 'text-blue-600';
  if (status >= 400 && status < 500) return 'text-yellow-600';
  if (status >= 500) return 'text-red-600';
  return 'text-gray-500';
};

export const buildRequestUrl = (
  endpointUrl: string,
  selectedMethod: (typeof methods)[number],
  requestBody: string,
  headers: Header[]
) => {
  const toBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  };
  const encodedUrl = toBase64(endpointUrl);
  let path = `/client/${selectedMethod}/${encodedUrl}`;

  if (selectedMethod !== 'GET' && selectedMethod !== 'HEAD') {
    const encodedBody = toBase64(requestBody);
    path += `/${encodedBody}`;
  }

  const params = new URLSearchParams();
  headers.forEach((h) => {
    if (h.enabled && h.key) {
      params.append(h.key, h.value);
    }
  });

  return `${path}?${params.toString()}`;
};

export const getHistory = (): HistoryItem[] => {
  const history = localStorage.getItem('rest-client-history');
  return history ? JSON.parse(history) : [];
};

export const addToHistory = (item: HistoryItem): void => {
  const history = getHistory();
  localStorage.setItem(
    'rest-client-history',
    JSON.stringify([...history, item])
  );
};
