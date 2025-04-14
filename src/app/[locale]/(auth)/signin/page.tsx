import { useTranslations } from 'next-intl';

const SignInPage: React.FC = () => {
  const t = useTranslations('SignInPage');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default SignInPage;
