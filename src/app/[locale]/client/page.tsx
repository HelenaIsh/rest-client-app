'use client';

import dynamic from 'next/dynamic';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import Loading from '@/components/Loading';

const RestClient = dynamic(() => import('./components/RestClient'), {
  loading: () => <Loading className="h-full" />,
});

export default function Client() {
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

  return (
    <div data-testid="client-container" className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
      <RestClient />
    </div>
  );
}
