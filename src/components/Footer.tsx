'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="footer">
      <div className="footer-container">
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/rss-logo.svg"
            alt="RS School Logo"
            width={40}
            height={40}
          />
        </a>

        <div className="footer-github-container">
          <p className="footer-github-article">{t('developedBy')}</p>
          <div className="footer-github-links">
            <a
              href="https://github.com/HelenaIsh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="github-img-container">
                <Image
                  src="/images/HelenaIsh.jpeg"
                  className="github-logo"
                  alt="Github Logo"
                  width={40}
                  height={40}
                  style={{ height: 'auto' }}
                />
              </div>
            </a>
            <a
              href="https://github.com/mayskii"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="github-img-container">
                <Image
                  src="/images/mayskii.png"
                  className="github-logo"
                  alt="Github Logo"
                  width={40}
                  height={40}
                  style={{ height: 'auto' }}
                />
              </div>
            </a>
          </div>
        </div>

        <p className="footer-copyright">
          {t('copyright')} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
