'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/types';
import { methods } from '@/app/client/components/MethodSelector';
import dynamic from 'next/dynamic';

const RestClient = dynamic(() => import('../../components/RestClient'), {
  loading: () => <div>Loading REST Client...</div>,
});

export default function RequestPage() {
  const params = useParams<{
    path: string[];
    method: (typeof methods)[number];
  }>();
  const searchParams = useSearchParams();

  const [encodedUrl, encodedBody] = params.path || [];
  const endpointUrl = Buffer.from(
    decodeURIComponent(encodedUrl),
    'base64'
  ).toString('utf8');

  const requestBody = encodedBody
    ? Buffer.from(decodeURIComponent(encodedBody), 'base64').toString('utf8')
    : '{}';

  const headers: Header[] = [];
  searchParams.forEach((value, key) => {
    headers.push({ id: Date.now() + Math.random(), key, value, enabled: true });
  });

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
      <RestClient
        initialMethod={params.method}
        initialUrl={endpointUrl}
        initialBody={requestBody}
        initialHeaders={headers}
      />
    </div>
  );
}
