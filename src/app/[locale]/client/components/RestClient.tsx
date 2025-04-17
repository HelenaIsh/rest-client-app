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

import Toast from '@/components/Toast';
import {
  buildRequestUrl,
  getFilteredHeaders,
  getStatusColor,
  handleResponse,
} from '@/app/[locale]/client/utils/utils';
import RequestBodyEditor from '@components/RequestBodyEditor';
import HeaderEditor from '@components/HeaderEditor';
import Tabs from '@components/Tabs';

import { useTranslations } from 'next-intl';
import { useVariables } from '@/app/context/VariablesContext';

import { useHistorySaver } from '../utils/useHistorySaver';

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

  const [requestBody, setRequestBody] = useState(initialBody || '');
  const [headers, setHeaders] = useState<Header[]>(
    initialHeaders && initialHeaders.length > 0
      ? initialHeaders
      : [{ id: Date.now(), key: '', value: '', enabled: true }]
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

  const router = useRouter();

  const { saveRequestToHistory } = useHistorySaver();

  useEffect(() => {
    if (!initialUrl) return;

    try {
      new URL(initialUrl);
    } catch {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return;
    }

    const myFetch = async () => {
      const requestHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getFilteredHeaders(initialHeaders || []),
      };
      const options: RequestInit = {
        method: initialMethod || 'GET',
        headers: requestHeaders,

        ...(initialMethod &&
          initialMethod !== 'GET' &&
          initialMethod !== 'HEAD' &&
          initialBody && { body: initialBody }),
      };

      try {
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
  }, [initialMethod, initialUrl, initialBody, initialHeaders, t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!endpointUrl) {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return;
    }
    try {
      new URL(endpointUrl);
    } catch {
      setToast({ message: t('invalidUrl'), type: 'error' });
      return;
    }

    const urlResult = substituteVariables(endpointUrl);
    const bodyResult = substituteVariables(requestBody);

    const headersWithSubstitutions = headers.map((header) => {
      const { result, missingVariables } = substituteVariables(header.value);
      return { ...header, value: result, _missingVariables: missingVariables };
    });

    const allMissingVariables = [
      ...urlResult.missingVariables,
      ...bodyResult.missingVariables,
      ...headersWithSubstitutions.flatMap((h) => h._missingVariables || []),
    ].filter((v, i, a) => a.indexOf(v) === i);

    if (allMissingVariables.length > 0) {
      setToast({
        message: `${t('missingVariables')}: ${allMissingVariables.join(', ')}`,
        type: 'error',
      });
      return;
    }

    saveRequestToHistory({
      method: selectedMethod,
      url: urlResult.result,
      headers: headersWithSubstitutions,
      body: bodyResult.result,
    });

    router.push(
      buildRequestUrl(
        urlResult.result,
        selectedMethod,
        bodyResult.result,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        headersWithSubstitutions.map(({ _missingVariables, ...rest }) => rest)
      )
    );
  };

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

  const responseTabs = [
    {
      id: 'response',
      label: t('response'),
      content: (
        <div className="rounded-md border border-gray-300 overflow-hidden">
          <CodeMirror
            value={
              typeof responseData === 'object' && responseData !== null
                ? JSON.stringify(responseData, null, 2)
                : String(responseData ?? '')
            }
            extensions={
              language
                ? [language as Extension, EditorView.lineWrapping]
                : [EditorView.lineWrapping]
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
              extensions={[javascript(), EditorView.lineWrapping]}
              readOnly={true}
              height="250px"
              className="text-sm"
            />
          ) : (
            <p className="text-gray-500 p-4">{t('noCodeYet')}</p>
          )}
        </div>
      ),
    },
  ];

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
          <div className="flex items-stretch mb-4">
            {' '}
            {/* Dodano margines dolny */}
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
            headers={headers}
            setGeneratedCode={setGeneratedCode}
          />
          <Tabs tabs={tabs} defaultActiveTab="body" />
          <div className="mt-6">
            {' '}
            {/* Dodano margines górny dla sekcji odpowiedzi */}
            <p
              className={`font-mono font-bold mb-2 ${getStatusColor(responseStatus)}`}
            >
              {responseStatus
                ? `Status: ${responseStatus}`
                : t('noResponseYet')}
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
