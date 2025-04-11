import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const RestClient = dynamic(() => import('./components/RestClient'), {
  loading: () => <Loading />,
});

const Loading = () => {
  const t = useTranslations('RestClient');
  return <div>{t('loading')}</div>;
};

export default function Client() {
  return (
    <div data-testid="client-container" className="w-full h-full max-w-7xl mx-auto p-4 bg-white text-gray-500 rounded-2xl shadow-lg flex flex-col ">
      <RestClient />
    </div>
  );
}
