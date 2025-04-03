'use client';

import Link from 'next/link';
import Image from 'next/image';

const MainPage: React.FC = () => {
  const isAuthenticated = true;
  //TODO - Currently, isAuthenticated is hardcoded(thue/false) for different states of the main page — we need to connect the Authentication!

  return (
    <div className="main-container">

<div className="app-content">
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
{/*TODO Authors Section -  write a description */}
      <div className="authors-content">
        <h2 className="authors-sign">Our Team</h2>
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
            <p className="author-description">
{/*TODO Authors Section -  write a description */}
              we need to fill out this section and write some information about the team member.
            </p>
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
            <p className="author-description">
{/*TODO Authors Section -  write a description */}
              we need to fill out this section and write some information about the team member.
            </p>
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
            <p className="author-description">
{/*TODO Authors Section -  write a description */}
              we need to fill out this section and write some information about the team member.
            </p>
          </a>
        </div>
      </div>

    </div>
  );
};

export default MainPage;
