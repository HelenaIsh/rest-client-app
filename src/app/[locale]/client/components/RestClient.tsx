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
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import {
  buildRequestUrl,
  getFilteredHeaders,
  getStatusColor,
  handleResponse,
  addToHistory,
} from '@/app/[locale]/client/utils/utils';
import RequestBodyEditor from '@components/RequestBodyEditor';
import HeaderEditor from '@components/HeaderEditor';
import Tabs from '@components/Tabs';
import { useTranslations } from 'next-intl';
import { useVariables } from '@/app/context/VariablesContext';

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
  const [requestBody, setRequestBody] = useState(initialBody || '{}');
  const [headers, setHeaders] = useState<Header[]>(
    initialHeaders && initialHeaders.length > 0
      ? initialHeaders
      : [{ id: 1, key: '', value: '', enabled: false }]
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

  useEffect(() => {
    if (!initialMethod && !initialUrl) return;
    try {
      new URL(initialUrl!);
    } catch {
      setToast({ message: 'URL is incorrect', type: 'error' });
      return;
    }
    const myFetch = async () => {
      const requestHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...getFilteredHeaders(headers),
      };

      try {
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: endpointUrl,
            selectedMethod,
            requestHeaders,
            body:
              selectedMethod !== 'GET' && selectedMethod !== 'HEAD'
                ? requestBody
                : undefined,
          }),
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpointUrl) {
      setToast({ message: 'Invalid or missing endpoint URL', type: 'error' });
      return;
    }

    const urlResult = substituteVariables(endpointUrl);
    const bodyResult = substituteVariables(requestBody!);
    const headersWithSubstitutions = headers.map((header) => {
      const { result } = substituteVariables(header.value);
      return {
        ...header,
        value: result,
      };
    });

    const allMissingVariables = [
      ...urlResult.missingVariables,
      ...bodyResult.missingVariables,
      ...headersWithSubstitutions.flatMap(
        (header) => substituteVariables(header.value).missingVariables
      ),
    ];

    if (allMissingVariables.length > 0) {
      setToast({
        message: `Missing variables: ${allMissingVariables.join(', ')}`,
        type: 'error',
      });
      return;
    }

    const path = buildRequestUrl(
      urlResult.result,
      selectedMethod,
      bodyResult.result,
      headersWithSubstitutions
    );

    const newHistoryItem = {
      method: selectedMethod,
      endpointUrl: urlResult.result,
      body: bodyResult.result,
      headers: headersWithSubstitutions,
      path,
    };

    addToHistory(newHistoryItem);
    router.push(path);
  };

  const handleGenerateCode = (lang: string) => {
    const urlResult = substituteVariables(endpointUrl);
    const bodyResult = substituteVariables(requestBody);

    const allMissingVariables = [
      ...urlResult.missingVariables,
      ...bodyResult.missingVariables,
    ];

    if (allMissingVariables.length > 0) {
      setToast({
        message: t('missingVariables'),
        type: 'error',
      });
      return;
    }

    try {
      new URL(urlResult.result);
      setSelectedLanguage(lang);
      setActiveResponseTab('code');
    } catch {
      setToast({
        message: t('generateCodeError'),
        type: 'error',
      });
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
            value={typeof responseData === 'string' ? responseData : ''}
            extensions={[
              EditorView.lineWrapping,
              ...(language ? [language as Extension] : []),
            ]}
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
              extensions={[javascript()]}
              readOnly={true}
              height="250px"
              className="text-sm"
            />
          ) : (
            <p className="text-gray-500">{t('noCodeYet')}</p>
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
          <div className="flex items-stretch">
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
            setGeneratedCode={setGeneratedCode}
          />
          <Tabs tabs={tabs} defaultActiveTab="body" />
          <p
            className={`font-mono font-bold ${getStatusColor(responseStatus)}`}
          >
            {responseStatus ? `HTTP ${responseStatus}` : t('noResponseYet')}
          </p>{' '}
          <Tabs
            tabs={responseTabs}
            activeTab={activeResponseTab}
            onTabChange={setActiveResponseTab}
          />
        </form>
      </div>
    </div>
  );
}
