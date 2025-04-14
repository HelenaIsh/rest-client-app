import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface GenerateButtonProps {
  onLanguageSelect: (language: string) => void;
}
export default function GenerateButton({
  onLanguageSelect,
}: GenerateButtonProps) {
  const t = useTranslations('GenerateButton');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (language: string) => {
    onLanguageSelect(language);
    setIsOpen(false);
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
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('curl')}
            >
              curl
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('jsFetch')}
            >
              JavaScript (Fetch API)
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('xhr')}
            >
              JavaScript (XHR)
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('nodejs')}
            >
              NodeJS
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('python')}
            >
              Python
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('java')}
            >
              Java
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('csharp')}
            >
              C#
            </li>
            <li
              className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleLanguageSelect('go')}
            >
              Go
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
