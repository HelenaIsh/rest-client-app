// src/app/[locale]/client/components/RestClient.tsx
'use client';

import MethodSelector, { methods } from '@components/MethodSelector';
import React, { FormEvent, useState, useEffect } from 'react';
import EndpointInput from '@components/EndpointInput';
import SendButton from '@components/SendButton';
import GenerateButton from '@components/GenerateButton';
import GenerateCode from '@components/GenerateCode';
import { Header } from '@/types';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
// import { useRouter } from 'next/navigation'; // Usunięto
import Toast from '@/components/Toast';
import {
  buildRequestUrl, // Pozostawione dla minimalnych zmian
  getFilteredHeaders,
  getStatusColor,
  handleResponse,
} from '@/app/[locale]/client/utils/utils';
import RequestBodyEditor from '@components/RequestBodyEditor';
import HeaderEditor from '@components/HeaderEditor';
import Tabs from '@components/Tabs';
// import { useTranslations, useLocale } from 'next-intl'; // Dodano useLocale
import { useTranslations } from 'next-intl'; 
import { useVariables } from '@/app/context/VariablesContext';
// import { buildClientStateUrl } from '@/app/[locale]/client/utils/buildClientStateUrl'; // Usunięto - nieużywany w tej wersji

// --- ZMIANA 1: Import hooka ---
import { useHistorySaver } from '../utils/useHistorySaver'; // Poprawna ścieżka do hooka
// --- ZMIANA 2: Poprawiony import routera ---
import { useRouter } from '@/i18n/navigation';

export default function RestClient({
  initialMethod,
  initialUrl,
  initialBody,
  initialHeaders,
}: {
  initialMethod?: (typeof methods)[number];
  initialUrl?: string;
  initialBody?: string;
  initialHeaders?: Header[];
}) {
  const { substituteVariables } = useVariables();
  const t = useTranslations('RestClient');
  
  const [endpointUrl, setEndpointUrl] = useState<string>(initialUrl || '');
  const [selectedMethod, setSelectedMethod] = useState<
    (typeof methods)[number]
  >(initialMethod || 'GET');
  // Zmieniono domyślne body na pusty string
  const [requestBody, setRequestBody] = useState(initialBody || '');
  const [headers, setHeaders] = useState<Header[]>(
    initialHeaders && initialHeaders.length > 0
      ? initialHeaders
      : // Lepsze domyślne: unikalne ID, enabled: true
        [{ id: Date.now(), key: '', value: '', enabled: true }]
  );
  const [responseData, setResponseData] = useState<unknown>('');
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [language, setLanguage] = useState<unknown>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [activeResponseTab, setActiveResponseTab] =
    useState<string>('response');

  const router = useRouter(); // Użyj routera z i18n
  // --- ZMIANA 3: Wywołanie hooka ---
  const { saveRequestToHistory } = useHistorySaver();

  // useEffect do fetchowania danych przy ładowaniu z initial* props
  useEffect(() => {
    // Uruchom tylko jeśli jest initialUrl (wskaźnik, że ładujemy z historii/linku)
    if (!initialUrl) return;

    // Walidacja initialUrl
    try {
      new URL(initialUrl);
    } catch {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return;
    }

    const myFetch = async () => {
      // Użyj DANYCH POCZĄTKOWYCH (initial*) do wykonania zapytania
      const requestHeaders = {
        'Content-Type': 'application/json', // Domyślne, może być nadpisane
        Accept: 'application/json', // Domyślne
        ...getFilteredHeaders(initialHeaders || []), // Użyj initialHeaders
      };
      const options: RequestInit = {
        method: initialMethod || 'GET', // Użyj initialMethod
        headers: requestHeaders,
        // Dodaj ciało tylko dla odpowiednich metod, użyj initialBody
        ...(initialMethod &&
          initialMethod !== 'GET' &&
          initialMethod !== 'HEAD' &&
          initialBody && { body: initialBody }),
      };

      try {
        // Użyj initialUrl do zapytania
        const response = await fetch(initialUrl, options);
        setResponseStatus(response.status);
        const { data, detectedLanguage } = await handleResponse(response);
        setResponseData(data);
        setLanguage(detectedLanguage);
      } catch (error) {
        let errorMessage = t('genericError');
        if (error instanceof TypeError) {
          errorMessage = t('networkError');
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setToast({ message: errorMessage, type: 'error' });
      }
    };

    myFetch();
    // Zależności: uruchom ponownie, jeśli którekolwiek z danych początkowych się zmienią
  }, [initialMethod, initialUrl, initialBody, initialHeaders, t]); // Dodano t do zależności

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Walidacja URL ze stanu komponentu
    if (!endpointUrl) {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return;
    }
    try {
      new URL(endpointUrl);
    } catch {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return; // Przerwij, jeśli URL jest niepoprawny
    }

    // Podstawienie zmiennych
    const urlResult = substituteVariables(endpointUrl);
    const bodyResult = substituteVariables(requestBody); // Użyj requestBody ze stanu
    // Poprawka: Przechowuj brakujące zmienne tymczasowo
    const headersWithSubstitutions = headers.map((header) => {
      const { result, missingVariables } = substituteVariables(header.value);
      return { ...header, value: result, _missingVariables: missingVariables };
    });

    // Poprawka: Poprawne zbieranie i sprawdzanie brakujących zmiennych
    const allMissingVariables = [
      ...urlResult.missingVariables,
      ...bodyResult.missingVariables,
      ...headersWithSubstitutions.flatMap((h) => h._missingVariables || []),
    ].filter((v, i, a) => a.indexOf(v) === i); // Usuń duplikaty

    if (allMissingVariables.length > 0) {
      setToast({
        message: `${t('missingVariables')}: ${allMissingVariables.join(', ')}`,
        type: 'error',
      });
      return; // Przerwij, jeśli brakuje zmiennych
    }

    // --- ZMIANA 4: Wywołanie zapisu do historii ---
    saveRequestToHistory({
      method: selectedMethod,
      url: urlResult.result,
      headers: headersWithSubstitutions, // Przekaż Header[] po podstawieniu
      body: bodyResult.result,
    });
    // --- Koniec zmiany ---

    // Nawigacja (nadal używa buildRequestUrl, aby zminimalizować zmiany)
    router.push(
      buildRequestUrl(
        urlResult.result,
        selectedMethod,
        bodyResult.result, // Przekaż wynik podstawienia
        // Usuń pole tymczasowe przed przekazaniem do buildRequestUrl
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
        headersWithSubstitutions.map(({ _missingVariables, ...rest }) => rest)
      )
    );
  };

  // Funkcja obsługująca generowanie kodu (bez zmian w logice)
  const handleGenerateCode = (lang: string) => {
    const urlResult = substituteVariables(endpointUrl);
    const bodyResult = substituteVariables(requestBody);
    const allMissingVariables = [
      ...urlResult.missingVariables,
      ...bodyResult.missingVariables,
    ];
    if (allMissingVariables.length > 0) {
      setToast({ message: t('missingVariables'), type: 'error' });
      return;
    }
    try {
      new URL(urlResult.result);
      setSelectedLanguage(lang);
      setActiveResponseTab('code');
    } catch {
      setToast({ message: t('generateCodeError'), type: 'error' });
    }
  };

  // Definicje zakładek dla edytora zapytania (bez zmian)
  const tabs = [
    {
      id: 'body',
      label: t('body'),
      content: (
        <RequestBodyEditor
          requestBody={requestBody}
          setRequestBody={setRequestBody}
        />
      ),
    },
    {
      id: 'headers',
      label: t('headers'),
      content: <HeaderEditor headers={headers} setHeaders={setHeaders} />,
    },
  ];

  // Definicje zakładek dla sekcji odpowiedzi (poprawka wyświetlania JSON)
  const responseTabs = [
    {
      id: 'response',
      label: t('response'),
      content: (
        <div className="rounded-md border border-gray-300 overflow-hidden">
          <CodeMirror
            // Poprawka: Bezpieczniejsze sprawdzanie typu i konwersja
            value={
              typeof responseData === 'object' && responseData !== null
                ? JSON.stringify(responseData, null, 2) // Sformatuj obiekty JSON
                : String(responseData ?? '') // Konwertuj inne typy na string (lub pusty string dla null/undefined)
            }
            extensions={
              language ? [language as Extension, EditorView.lineWrapping] : [EditorView.lineWrapping]
            }
            readOnly={true}
            height="250px"
            className="text-sm"
          />
        </div>
      ),
    },
    {
      id: 'code',
      label: t('generatedCode'),
      content: (
        <div className="whitespace-pre-wrap rounded-md border border-gray-300 overflow-hidden">
          {generatedCode ? (
            <CodeMirror
              value={generatedCode}
              extensions={[javascript(), EditorView.lineWrapping]} // Domyślnie JS
              readOnly={true}
              height="250px"
              className="text-sm"
            />
          ) : (
            <p className="text-gray-500 p-4">{t('noCodeYet')}</p> // Dodano padding
          )}
        </div>
      ),
    },
  ];

  // Renderowanie komponentu (dodano drobne marginesy)
  return (
    <div className="space-y-6 relative">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-stretch mb-4"> {/* Dodano margines dolny */}
            <EndpointInput
              endpointUrl={endpointUrl}
              setEndpointUrl={setEndpointUrl}
            />
            <MethodSelector
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            <SendButton />
            <GenerateButton onLanguageSelect={handleGenerateCode} />
          </div>
          <GenerateCode
            language={selectedLanguage}
            method={selectedMethod}
            url={endpointUrl}
            body={requestBody}
            headers={headers} // Przekazano headers
            setGeneratedCode={setGeneratedCode}
          />
          <Tabs tabs={tabs} defaultActiveTab="body" />
          <div className="mt-6"> {/* Dodano margines górny dla sekcji odpowiedzi */}
            <p
              className={`font-mono font-bold mb-2 ${getStatusColor(responseStatus)}`} // Dodano margines dolny
            >
              {responseStatus ? `Status: ${responseStatus}` : t('noResponseYet')}
            </p>
            <Tabs
              tabs={responseTabs}
              activeTab={activeResponseTab}
              onTabChange={setActiveResponseTab}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
