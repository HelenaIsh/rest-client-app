export const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export default function MethodSelector({
  selectedMethod,
  setSelectedMethod,
}: {
  selectedMethod?: (typeof methods)[number];
  setSelectedMethod: (selectedMethod: (typeof methods)[number]) => void;
}) {
  return (
    <select
      className="p-2 border border-gray-300 rounded-md"
      value={selectedMethod}
      onChange={(e) =>
        setSelectedMethod(e.target.value as (typeof methods)[number])
      }
    >
      {methods.map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  );
}
