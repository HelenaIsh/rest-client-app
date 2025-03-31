export default function EndpointInput({
  endpointUrl,
  setEndpointUrl,
}: {
  endpointUrl?: string;
  setEndpointUrl: (endpointUrl: string) => void;
}) {
  return (
    <input
      className="flex-1 p-2 border border-gray-300 rounded-md"
      type="text"
      value={endpointUrl}
      onChange={(e) => setEndpointUrl(e.target.value)}
    />
  );
}
