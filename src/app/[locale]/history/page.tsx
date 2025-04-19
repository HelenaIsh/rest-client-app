'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getHistory } from '../client/utils/utils';

const ITEMS_PER_PAGE = 10;

const HistoryComponent = () => {
  const t = useTranslations('History');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

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
        <h1>{t('title')}</h1>
      </div>

      {history.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentItems.map((item, index) => (
              <div
                key={`${item.method}-${item.endpointUrl}-${index}`}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <Link href={item.path} className="block">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
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
                    <span className="text-gray-700">{item.endpointUrl}</span>
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
                      currentPage === page ? 'bg-blue-500 text-white' : ''
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
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{t('emptyHistory')}</p>
          <Link
            href="/client"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {t('tryRestClient')}
          </Link>
        </div>
      )}
    </>
  );
};

const History = dynamic(() => Promise.resolve(HistoryComponent), {
  ssr: false,
});

export default History;
