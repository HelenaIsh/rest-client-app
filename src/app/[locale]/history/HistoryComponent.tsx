'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getHistory } from '../client/utils/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

const ITEMS_PER_PAGE = 10;

export const HistoryComponent = () => {
  const t = useTranslations('History');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

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

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = history.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      </div>

      {history.length > 0 ? (
        <>
          <div className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg grid gap-6">
            {currentItems.map((item, index) => (
              <div
                key={`${item.method}-${item.endpointUrl}-${index}`}
                className="border rounded-lg p-4 hover:bg-gray-100"
              >
                <Link href={item.path} className="block">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium flex-shrink-0 ${
                        item.method === 'GET'
                          ? 'bg-green-100 text-green-800'
                          : item.method === 'POST'
                            ? 'bg-blue-100 text-blue-800'
                            : item.method === 'PUT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.method === 'DELETE'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.method}
                    </span>
                    <span className="text-gray-700 text-sm block overflow-ellipsis overflow-hidden whitespace-nowrap">
                      {item.endpointUrl}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? 'bg-[var(--maincolor)] text-white'
                        : ''
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 px-4 bg-gray-50 border rounded-xl shadow-sm">
          <p className="text-gray-600 text-lg mb-4">{t('emptyHistory')}</p>
          <Link
            href="/client"
            className="inline-block bg-[var(--maincolor)] text-white font-semibold px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            {t('tryRestClient')}
          </Link>
        </div>
      )}
    </>
  );
};
