'use client';

import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
{/* TODO correct link for github */}
          <a
            href="https://github.com/HelenaIsh/rest-client-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/Github_logo.png"
              className="github-logo"
              alt="Github Logo"
              width={40}
              height={40}
              style={{ height: 'auto' }}
            />
          </a>
        </p>
        <p className="footer-copyright">
          Copyright &copy; {new Date().getFullYear()}
        </p>
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
      </div>
    </footer>
  );
};

export default Footer;
