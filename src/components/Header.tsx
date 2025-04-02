'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

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
        <Image src="/vercel.svg" alt="Logo" width={30} height={30} />
      </Link>

      <nav className="nav">
        <Link href="#" className="nav-link">
          EN / RU
        </Link>
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
