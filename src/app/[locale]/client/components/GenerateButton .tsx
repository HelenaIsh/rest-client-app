import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function GenerateButton() {
  const t = useTranslations('GenerateButton');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleMenu}
        className="px-6 h-full border border-gray-300 rounded-md
            hover:bg-blue-100 hover:text-blue-700
            active:bg-blue-200 active:text-blue-800
            transition-colors duration-150"
      >
        {t('generate')}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          <ul className="py-1">
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">curl</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">JavaScript (Fetch API)</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">JavaScript (XHR)</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">NodeJS</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">Python</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">Java</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">C#</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">Go</li>
          </ul>
        </div>
      )}
    </div>
  );
}
