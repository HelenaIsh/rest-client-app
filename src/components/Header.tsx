'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
}

//TODO - Currently, isAuthenticated is hardcoded(thue/false) for different states of header ([Sign In] | [Sign up] OR [Sign Out])
// — we need to connect the Authentication here

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

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
{/* TODO - Internationalization (i18n) */}
        <button className="nav-link">EN / RU</button>
        {isAuthenticated ? (
          <Link href="#" onClick={onSignOut} className="nav-link">
            Sign Out
          </Link>
        ) : (
          <>
            <Link href="/signin" className="nav-link">
              Sign In
            </Link>
            <Link href="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
