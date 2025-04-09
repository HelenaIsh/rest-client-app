'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toggleToOtherLocale } from '../i18n/locale-utils';

interface HeaderProps {
  isAuthenticated: boolean;
}

//TODO - Currently, isAuthenticated is hardcoded(thue/false) for different states of header ([Sign In] | [Sign up] OR [Sign Out])
// — we need to connect the Authentication here

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Header');

  //TODO - Currently, onSignOut is not working.

  const onSignOut = (): void => {
    console.log('Sign out clicked');
  };

  const handleScroll = (): void => {
    if (window.scrollY > 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleLocale = () => {
    const newPath = toggleToOtherLocale(locale, pathname);
    router.push(newPath);
  };

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <Link href="/" className="logo">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={45}
          height={45}
          priority
        />
      </Link>

      <nav className="nav">
        <button className="nav-link" onClick={toggleLocale}>
          {locale === 'en' ? 'РУС' : 'EN'}
        </button>

        {isAuthenticated ? (
          <Link href="#" onClick={onSignOut} className="nav-link">
            {t('signOut')}
          </Link>
        ) : (
          <>
            <Link href="/signin" className="nav-link">
              {t('signIn')}
            </Link>
            <Link href="/signup" className="nav-link">
              {t('signUp')}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
