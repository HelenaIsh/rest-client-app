import { useTranslations } from 'next-intl';

const SignUpPage: React.FC = () => {
  const t = useTranslations('SignUpPage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default SignUpPage;
