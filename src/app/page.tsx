'use client';

import Link from 'next/link';

const MainPage: React.FC = () => {
  const isAuthenticated = true;
  //TODO - Currently, isAuthenticated is hardcoded(thue/false) for different states of the main page — we need to connect the Authentication!

  return (
    <div>
      {!isAuthenticated ? (
        <div className="welcome-section">
          <h1 className="welcome-sign">Welcome!</h1>
          <div className="auth-links">
            <Link href="/signin" className="btn">
              Sign In
            </Link>
            <Link href="/signup" className="btn">
              Sign Up
            </Link>
          </div>
        </div>
      ) : (
        <div className="welcome-section">
          <h1 className="welcome-sign">Welcome Back, Username!</h1>
          <div className="client-links">
            <Link href="/client" className="btn">
              REST Client
            </Link>
            <Link href="/history" className="btn">
              History
            </Link>
            <Link href="/variables" className="btn">
              Variables
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
