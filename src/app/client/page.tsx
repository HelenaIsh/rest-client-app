import dynamic from 'next/dynamic';

const RestClient = dynamic(() => import('./components/RestClient'), {
  loading: () => <div>Loading REST Client...</div>,
});

export default function Client() {
  return (
    <div className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
        <RestClient />
    </div>
  );
}
