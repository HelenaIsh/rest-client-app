'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type HistoryItem = {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  status?: number;
};

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a placeholder for actual history fetching logic
    // In a real implementation, you would fetch history from Firebase or another backend
    if (user) {
      // Simulate loading history data
      setTimeout(() => {
        const mockHistory: HistoryItem[] = [
          {
            id: '1',
            method: 'GET',
            url: 'https://api.example.com/users',
            timestamp: new Date().toISOString(),
            status: 200
          },
          {
            id: '2',
            method: 'POST',
            url: 'https://api.example.com/users',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 201
          }
        ];
        setHistory(mockHistory);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Request History</h1>
      
      {history.length === 0 ? (
        <p className="text-gray-500">No request history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      item.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                      item.method === 'POST' ? 'bg-green-100 text-green-800' :
                      item.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      item.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.method}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.url}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      (item.status && item.status < 300) ? 'bg-green-100 text-green-800' :
                      (item.status && item.status < 400) ? 'bg-yellow-100 text-yellow-800' :
                      (item.status && item.status >= 400) ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
