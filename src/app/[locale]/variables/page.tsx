import { useTranslations } from 'next-intl';

const Variables: React.FC = () => {
  const t = useTranslations('Variables');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default Variables;
