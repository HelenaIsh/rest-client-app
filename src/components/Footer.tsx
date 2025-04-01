'use client';

const Footer: React.FC = () => {
    return (
      <footer className="footer">
        <p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} Course Logo</p>
      </footer>
    );
  }
  
  export default Footer;