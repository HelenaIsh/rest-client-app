'use client';

import MethodSelector, {
  methods,
} from '@/app/client/components/MethodSelector';
import EndpointInput from '@/app/client/components/EndpointInput';
import SendButton from '@/app/client/components/SendButton';
import React, { FormEvent, useEffect, useState } from 'react';
import { Header } from '@/types';
import RequestBodyEditor from '@/app/client/components/RequestBodyEditor';
import HeaderEditor from '@/app/client/components/HeaderEditor';
import Tabs from '@/app/client/components/Tabs';
import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { EditorView } from '@codemirror/view';
import { useRouter } from 'next/navigation';

const getFilteredHeaders = (headers: Header[]): Record<string, string> => {
  return headers.reduce(
    (acc, { key, value, enabled }) => {
      if (enabled && key) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
};

const handleResponse = async (response: Response) => {
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

const buildRequestUrl = (
  endpointUrl: string,
  selectedMethod: (typeof methods)[number],
  requestBody: string,
  headers: Header[]
) => {
  const encodedUrl = btoa(endpointUrl);
  let path = `/client/${selectedMethod}/${encodedUrl}`;

  if (selectedMethod !== 'GET' && selectedMethod !== 'HEAD') {
    const encodedBody = btoa(requestBody);
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
  const [endpointUrl, setEndpointUrl] = useState<string>(initialUrl as string);
  const [selectedMethod, setSelectedMethod] = useState<
    (typeof methods)[number]
  >(initialMethod as (typeof methods)[number]);
  const [requestBody, setRequestBody] = useState(initialBody);
  const [headers, setHeaders] = useState<Header[]>(
    initialHeaders && initialHeaders.length > 1
      ? initialHeaders
      : [{ id: 1, key: '', value: '', enabled: false }]
  );
  const [responseData, setResponseData] = useState<unknown>('');
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [language, setLanguage] = useState<unknown>(null);

  const router = useRouter();

  useEffect(() => {
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
        console.error('Error fetching data:', error);
        // setResponseData(`Request failed: ${error}`);
      }
    };

    myFetch();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpointUrl) {
      alert('Invalid or missing endpoint URL');
      return;
    }

    router.push(
      buildRequestUrl(endpointUrl, selectedMethod, requestBody!, headers)
    );
  };

  const tabs = [
    {
      id: 'body',
      label: 'Body',
      content: (
        <RequestBodyEditor
          requestBody={requestBody}
          setRequestBody={setRequestBody}
        />
      ),
    },
    {
      id: 'headers',
      label: 'Headers',
      content: <HeaderEditor headers={headers} setHeaders={setHeaders} />,
    },
  ];

  return (
    <div className="space-y-6">
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
        <p className={'text-lg m-4'}>Response</p>
        <p>{responseStatus}</p>
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
