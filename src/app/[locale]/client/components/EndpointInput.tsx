import { useTranslations } from 'next-intl';

export default function EndpointInput({
  endpointUrl,
  setEndpointUrl,
}: {
  endpointUrl?: string;
  setEndpointUrl: (endpointUrl: string) => void;
}) {
  const t = useTranslations('EndpointInput');

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
      onChange={(e) => {
        const filtered = e.target.value.replace(/[а-яА-ЯёЁ]/g, '');
        setEndpointUrl(filtered);
      }}
      placeholder={t('placeholder')}
      title={isValid ? '' : t('errors.invalidUrl')}
      aria-label={t('aria.endpointUrl')}
    />
  );
}
