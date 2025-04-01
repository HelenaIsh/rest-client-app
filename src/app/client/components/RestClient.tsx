'use client';

import MethodSelector from '@/app/client/components/MethodSelector';
import EndpointInput from '@/app/client/components/EndpointInput';
import SendButton from '@/app/client/components/SendButton';
import { FormEvent, useState } from 'react';
import { Header, methods } from '@/types';
import RequestBodyEditor from '@/app/client/components/RequestBodyEditor';
import HeaderEditor from '@/app/client/components/HeaderEditor';

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
          <p className={'text-lg mt-6'}>Body</p>
          <RequestBodyEditor
            requestBody={requestBody}
            setRequestBody={setRequestBody}
          />
          <p className={'text-lg mt-6'}>Headers</p>
          <HeaderEditor headers={headers} setHeaders={setHeaders} />
        </form>
      </div>
    </div>
  );
}
