'use client';

import Link from 'next/link';

const MainPage: React.FC = () => {
  const isAuthenticated = true;

  return (
    <div>
      <main className="main-content">
        {!isAuthenticated ? (
          <div className="welcome-section">
            <h1 className="welcome-sign">Welcome!</h1>
            <div className="auth-links">
              <Link href="/signin" className="nav-btn">Sign In</Link>
              <Link href="/signup" className="nav-btn">Sign Up</Link>
            </div>
          </div>
        ) : (
          <div className="welcome-section">
            <h1 className="welcome-sign">Welcome Back, Username!</h1>
            <div className="client-links">
              <Link href="/rest-client" className="nav-btn">REST Client</Link>
              <Link href="/history" className="nav-btn">History</Link>
              <Link href="/variables" className="nav-btn">Variables</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;
