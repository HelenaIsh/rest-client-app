export default function EndpointInput({
  endpointUrl,
  setEndpointUrl,
}: {
  endpointUrl?: string;
  setEndpointUrl: (endpointUrl: string) => void;
}) {

  const isValid = (() => {
    try {
      return !!endpointUrl && new URL(endpointUrl);
    } catch {
      return false;
    }
  })();
  return (
    <input
      className={`flex-1 p-2 border rounded-md ${
        isValid ? 'border-gray-300' : 'border-red-500'
      }`}
      type="text"
      value={endpointUrl}
      onChange={(e) => setEndpointUrl(e.target.value)}
      placeholder={'Enter Endpoint URL'}
      title={isValid ? '' : 'Invalid URL'}
    />
  );
}
