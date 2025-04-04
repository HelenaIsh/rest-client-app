'use client';

import Image from 'next/image';

const Footer: React.FC = () => {
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
          <p className="footer-github-article">Developed by the team:</p>
          <div className="footer-github-links">
            <a
              href="https://github.com/AlanKowalzky"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="github-img-container">
                <Image
                  src="/images/AlanKowalzky.jpeg"
                  className="github-logo"
                  alt="AlanKowalzky"
                  width={40}
                  height={40}
                  style={{ height: 'auto' }}
                />
              </div>
            </a>
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
          Copyright &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
