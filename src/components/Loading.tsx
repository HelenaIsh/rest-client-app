'use client';

import { useTranslations } from 'next-intl';

interface LoadingProps {
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ className = '', text }) => {
  const t = useTranslations('Common');
  const loadingText = text || t('loading');

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">{loadingText}</p>
      </div>
    </div>
  );
};

export default Loading;
