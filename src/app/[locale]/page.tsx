'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

const MainPage: React.FC = () => {
  const t = useTranslations('MainPage');
  const locale = useLocale();
  const isAuthenticated = true;
  //TODO - Currently, isAuthenticated is hardcoded(thue/false) for different states of the main page — we need to connect the Authentication!

  return (
    <div className="main-container">
      <div className="app-content">
        {!isAuthenticated ? (
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
            <h1 className="welcome-sign">{t('welcomeBack')}</h1>
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
      {/*TODO Authors Section -  write a description */}
      <div className="authors-content">
        <h2 className="authors-sign">{t('ourTeam')}</h2>
        <div className="authors">
          <a
            href="https://github.com/AlanKowalzky"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            <Image
              src="/images/AlanKowalzky.jpeg"
              alt="Alan Kowalzky"
              width={50}
              height={50}
              className="author-img"
            />
            <span>Alan Kowalzky</span>
            <p className="author-description">{t('alanDescription')}</p>
          </a>

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
