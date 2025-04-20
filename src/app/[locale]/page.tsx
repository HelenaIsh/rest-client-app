'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';

const MainPage: React.FC = () => {
  const t = useTranslations('MainPage');
  const locale = useLocale();
  const [user, loading] = useAuthState(auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="main-container">
        <div className="app-content">
          <Loading className="h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="app-content">
        {!user ? (
          <div className="welcome-section">
            <h1 className="welcome-sign">{t('welcome')}</h1>
            <div className="auth-links">
              <Link href={`/${locale}/signin`} className="btn">
                {t('signIn')}
              </Link>
              <Link href={`/${locale}/signup`} className="btn">
                {t('signUp')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="welcome-section">
            <h1 className="welcome-sign">{`${t('welcomeBack')}, ${user.email}`}</h1>
            <div className="client-links">
              <Link href={`/${locale}/client`} className="btn">
                {t('restClient')}
              </Link>
              <Link href={`/${locale}/history`} className="btn">
                {t('history')}
              </Link>
              <Link href={`/${locale}/variables`} className="btn">
                {t('variables')}
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="mb-8 bg-white text-gray-900 text-center p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-2">
          REST Client - Project description
        </h1>
        <p className="mb-2">
          This is a lightweight REST client, inspired by Postman. It allows you
          to test APIs by selecting HTTP methods, entering endpoints, editing
          headers, and providing request bodies.
        </p>
      </div>
      <div className="authors-content">
        <h2 className="authors-sign">{t('ourTeam')}</h2>
        <div className="authors">
          <a
            href="https://github.com/HelenaIsh"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            <Image
              src="/images/HelenaIsh.jpeg"
              alt="Helena Ish"
              width={50}
              height={50}
              className="author-img"
            />
            <span>Helena Ish</span>
            <p className="author-description">{t('helenaDescription')}</p>
          </a>

          <a
            href="https://github.com/mayskii"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            <Image
              src="/images/mayskii.png"
              alt="Mayskii"
              width={50}
              height={50}
              className="author-img"
            />
            <span>Mayskii</span>
            <p className="author-description">{t('mayaDescription')}</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
