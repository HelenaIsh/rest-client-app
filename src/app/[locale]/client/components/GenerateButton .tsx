import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface GenerateButtonProps {
  onLanguageSelect: (language: string) => void;
}

const languageOptions = [
  { key: 'curl', label: 'curl' },
  { key: 'jsFetch', label: 'JavaScript (Fetch API)' },
  { key: 'xhr', label: 'JavaScript (XHR)' },
  { key: 'nodejs', label: 'NodeJS' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'csharp', label: 'C#' },
  { key: 'go', label: 'Go' },
];

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

  const renderLanguageItems = () =>
    languageOptions.map(({ key, label }) => (
      <li
        key={key}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 cursor-pointer"
        onClick={() => handleLanguageSelect(key)}
      >
        {label}
      </li>
    ));

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
        <ul className="py-1">{renderLanguageItems()}</ul>
      </div>
      )}
    </div>
  );
}
