'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/types';
import { methods } from '@components/MethodSelector';
import dynamic from 'next/dynamic';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useEffect } from 'react';
import Loading from '@/components/Loading';

const RestClient = dynamic(() => import('../../components/RestClient'), {
  loading: () => <Loading className="h-full" />,
});

export default function RequestPage() {
  const params = useParams<{
    path: string[];
    method: (typeof methods)[number];
  }>();
  const searchParams = useSearchParams();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading className="h-full" />;
  }

  if (!user) {
    return null;
  }

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
    <div data-testid="request-container" className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
      <RestClient
        initialMethod={params.method}
        initialUrl={endpointUrl}
        initialBody={requestBody}
        initialHeaders={headers}
      />
    </div>
  );
}
