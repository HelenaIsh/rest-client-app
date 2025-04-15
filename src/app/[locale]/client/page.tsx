'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const RestClient = dynamic(() => import('./components/RestClient'), {
  loading: () => <Loading />,
});

const Loading = () => {
  const t = useTranslations('RestClient');
  return <div>{t('loading')}</div>;
};

export default function Client() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
      <RestClient />
    </div>
  );
}
