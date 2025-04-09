'use client';

import MethodSelector, { methods } from '@components/MethodSelector';
import React, { FormEvent, useState, useEffect } from 'react';
import EndpointInput from '@components/EndpointInput';
import SendButton from '@components/SendButton';
import { Header } from '@/types';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { useRouter } from 'next/navigation';
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
      const options: RequestInit = {
        method: selectedMethod,
        headers: requestHeaders,
        ...(selectedMethod !== 'GET' &&
          selectedMethod !== 'HEAD' && { body: requestBody }),
      };

      try {
        const response = await fetch(endpointUrl, options);
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
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpointUrl) {
      setToast({ message: 'Invalid or missing endpoint URL', type: 'error' });
      return;
    }

    try {
      new URL(endpointUrl);
    } catch {
      setToast({ message: 'URL is incorrect', type: 'error' });
      return;
    }

    router.push(
      buildRequestUrl(endpointUrl, selectedMethod, requestBody!, headers)
    );
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
          </div>
          <Tabs tabs={tabs} defaultActiveTab="body" />
        </form>
        <p className={'text-lg m-4'}>{t('response')}</p>
        <p className={`font-mono font-bold ${getStatusColor(responseStatus)}`}>
          {responseStatus ? `HTTP ${responseStatus}` : t('noResponseYet')}
        </p>{' '}
        <div className="border border-gray-300 rounded-md">
          <CodeMirror
            value={responseData as string}
            extensions={
              language ? [language as Extension] : [EditorView.lineWrapping]
            }
            readOnly={true}
            height="250px"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
