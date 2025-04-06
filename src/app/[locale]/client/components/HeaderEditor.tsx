import { Header } from '@/types';

const HeaderEditor = ({
  headers,
  setHeaders,
}: {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}) => {
  const handleChange = (id: number, field: keyof Header, value: string) => {
    const newHeaders = headers.map((header) =>
      header.id === id ? { ...header, [field]: value } : header
    );

    if (
      id === newHeaders[newHeaders.length - 1].id &&
      field === 'key' &&
      value.trim() !== ''
    ) {
      setHeaders([
        ...newHeaders,
        { id: Date.now(), key: '', value: '', enabled: false },
      ]);
      return;
    }

    setHeaders(newHeaders);
  };

  const toggleEnabled = (id: number) => {
    const newHeaders = headers.map((header) =>
      header.id === id ? { ...header, enabled: !header.enabled } : header
    );
    setHeaders(newHeaders);
  };

  const deleteRow = (id: number) => {
    const newHeaders = headers.filter((header) => header.id !== id);
    setHeaders(newHeaders);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 text-left">Key</th>
          <th className="border border-gray-300 p-2 text-left">Value</th>
          <th className="border border-gray-300 p-2 text-left w-10">Enabled</th>
          <th className="border border-gray-300 p-2 text-left w-10">Delete</th>
        </tr>
      </thead>
      <tbody>
        {headers.map((header) => (
          <tr key={header.id} className="hover:bg-gray-50">
            <td className="border border-gray-300 p-1">
              <input
                type="text"
                value={header.key}
                onChange={(e) => handleChange(header.id, 'key', e.target.value)}
                className="w-full p-1 border border-gray-300 rounded-md"
                placeholder="key"
              />
            </td>
            <td className="border border-gray-300 p-1">
              <input
                type="text"
                value={header.value}
                onChange={(e) =>
                  handleChange(header.id, 'value', e.target.value)
                }
                className="w-full p-1 border border-gray-300 rounded-md"
                placeholder="value"
              />
            </td>
            <td className="border border-gray-300 p-1 text-center">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={() => toggleEnabled(header.id)}
                className="h-4 w-4"
              />
            </td>
            <td className="border border-gray-300 p-1 text-center">
              {headers.length > 1 && (
                <button
                  onClick={() => deleteRow(header.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HeaderEditor;
