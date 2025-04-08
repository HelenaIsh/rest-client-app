import { Header } from '@/types';
import { Extension } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';

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
