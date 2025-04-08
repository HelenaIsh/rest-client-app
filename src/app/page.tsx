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
              My name is Alan, and I am in the process of transitioning to a
              developer. I’ve completed a JavaScript Fullstack Developer course
              and am currently working on an RSSchool React course and an AWS
              Cloud Developer certification.
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
              My name is Lena. Last year, I completed the JSFE course. I already
              have some work experience — I was part of an infrastructure team
              at an IT company in Russia. I was responsible for building a React
              component library. The work was quite specific with many nuances.
              However, I didn’t work with many tools — there was no interaction
              with the backend, I had no experience with Next.js, among other
              things. Six months ago, I moved to Croatia and left my job. I
              decided to continue learning and explore the tools I hadn’t worked
              with before.
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
              My name is Maya, and I am in the process of learning to become a
              developer. I currently live in the USA and am working through the
              JSFE course, as well as taking the React course from RSSchool. My
              goal is to continue growing as a developer and eventually work on
              building complex, full-stack applications.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
