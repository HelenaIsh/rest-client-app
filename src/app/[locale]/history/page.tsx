import { useTranslations } from 'next-intl';

const History: React.FC = () => {
  const t = useTranslations('History');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default History;
