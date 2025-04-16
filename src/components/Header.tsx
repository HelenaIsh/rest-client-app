
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toggleToOtherLocale } from '../i18n/locale-utils';
import { useAuth } from '../app/context/AuthContext'; 


const Header: React.FC = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const { user, loading, signOut } = useAuth(); 
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Header');

  
  const handleSignOut = async (): Promise<void> => {
  
    await signOut();
  
    router.push(`/${locale}/`);
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
      {/* Fix logo link to include locale */}
      <Link href={`/${locale}/`} className="logo">
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

        
        {loading ? (
          <span className="nav-link">...</span> 
        ) : user ? (
          
          <button onClick={handleSignOut} className="nav-link">
            {t('signOut')}
          </button>
        ) : (
        
          <>
            <Link href={`/${locale}/signin`} className="nav-link">
              {t('signIn')}
            </Link>
            <Link href={`/${locale}/signup`} className="nav-link">
              {t('signUp')}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
