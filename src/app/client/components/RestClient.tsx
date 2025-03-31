'use client';

import MethodSelector from '@/app/client/components/MethodSelector';
import EndpointInput from '@/app/client/components/EndpointInput';
import SendButton from '@/app/client/components/SendButton';
import { FormEvent, useState } from 'react';
import { methods } from '@/types';

export default function RestClient() {
  const [endpointUrl, setEndpointUrl] = useState('');
  const [selectedMethod, setSelectedMethod] =
    useState<(typeof methods)[number]>('GET');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      'submit',
      'endpointUrl',
      endpointUrl,
      'selectedMethod',
      selectedMethod
    );
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="flex items-stretch">
          <EndpointInput
            endpointUrl={endpointUrl}
            setEndpointUrl={setEndpointUrl}
          />
          <MethodSelector
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
          <SendButton />
        </form>
      </div>
    </div>
  );
}
