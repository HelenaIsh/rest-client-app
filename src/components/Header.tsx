'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
    isAuthenticated: boolean;
  }

  const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {

    const onSignOut = () => {
        console.log('Sign out clicked');
      };

  
  return (
    <header className="header">
       <Link href="/" className="logo">
        <Image 
          src="/globe.svg"
          alt="Logo" 
          width={40}
          height={40}
        />
      </Link>
      <nav>
      <button className="nav-btn">EN / RU</button>
      {isAuthenticated ? (
      <button onClick={onSignOut} className="nav-btn">Sign Out</button>
    ) : (
      <>
        <Link href="/signin" className="nav-btn">Sign In</Link>
        <Link href="/signup" className="nav-btn">Sign Up</Link>
      </>
    )}
      </nav>
    </header>
  );
}

export default Header;
