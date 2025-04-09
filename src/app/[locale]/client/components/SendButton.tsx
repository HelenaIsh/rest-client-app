import { useTranslations } from 'next-intl';

export default function SendButton() {
  const t = useTranslations('SendButton');
  return (
    <button
      type="submit"
      className="px-6 border border-gray-300 rounded-md
            hover:bg-blue-100 hover:text-blue-700
            active:bg-blue-200 active:text-blue-800
            transition-colors duration-150"
    >
      {t('send')}
    </button>
  );
}
