import { useTranslations } from 'next-intl';

export default function SendButton() {
  const t = useTranslations('SendButton');
  return (
    <button
      type="submit"
      className="px-6 border border-gray-300 rounded-md
            hover:bg-[var(--foreground)] hover:text-[var(--background)]
            active:bg-[var(--background)] active:text-[var(--foreground)]
            transition-colors duration-150"
    >
      {t('send')}
    </button>
  );
}
