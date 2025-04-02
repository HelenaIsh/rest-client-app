'use client';

import Image from 'next/image';

const Footer: React.FC = () => {
    return (
      <footer className="footer">
        <div className="footer-container">
            <p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Image
                src="/images/Github_logo.png" 
                alt="Github Logo" 
                width={40}      
                height={40}      
                />
            </a>
            </p>
            <p className="footer-copyright">Copyright &copy; {new Date().getFullYear()}</p> 
            <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
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
  }
  
  export default Footer;