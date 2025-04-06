'use client';

import MethodSelector, {
  methods,
} from '@components/MethodSelector';
import EndpointInput from '@components/EndpointInput';
import SendButton from '@components/SendButton';
import { FormEvent, useState } from 'react';
import { Header } from '@/types';
import RequestBodyEditor from '@components/RequestBodyEditor';
import HeaderEditor from '@components/HeaderEditor';
import Tabs from '@components/Tabs';

export default function RestClient() {
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedMethod, setSelectedMethod] =
    useState<(typeof methods)[number]>('GET');
  const [requestBody, setRequestBody] = useState('{}');
  const [headers, setHeaders] = useState<Header[]>([
    { id: 1, key: '', value: '', enabled: false },
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      'submit',
      'endpointUrl',
      endpointUrl,
      'selectedMethod',
      selectedMethod,
      'requestBody',
      requestBody,
      'headers',
      headers
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
      </div>
    </div>
  );
}
