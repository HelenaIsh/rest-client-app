'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getHistory } from '../client/utils/utils';

const HistoryComponent = () => {
  const t = useTranslations('History');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1>{t('title')}</h1>
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, index) => (
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
