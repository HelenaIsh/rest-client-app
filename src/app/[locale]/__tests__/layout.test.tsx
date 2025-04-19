import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import LocaleLayout from '../layout';
import '@testing-library/jest-dom';

vi.mock('@/app/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn();
    }),
  },
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  hasLocale: vi.fn(),
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    const translations = {
      Header: { signIn: 'Sign In' },
      Footer: { copyright: '© 2024' },
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('../../../messages/en.json', () => ({
  default: {
    Header: { signIn: 'Sign In' },
    Footer: { copyright: '© 2024' },
  },
}));

describe('LocaleLayout', () => {
  const mockParams = { locale: 'en' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children with correct layout structure', async () => {
    const { getByRole } = render(
      await LocaleLayout({
        children: <div>Test Content</div>,
        params: Promise.resolve(mockParams),
      })
    );

    expect(getByRole('banner')).toBeInTheDocument(); // Header
    expect(getByRole('main')).toBeInTheDocument(); // Main content
    expect(getByRole('contentinfo')).toBeInTheDocument(); // Footer
  });

  it('renders with correct locale and messages', async () => {
    const { getByText } = render(
      await LocaleLayout({
        children: <div>Test Content</div>,
        params: Promise.resolve(mockParams),
      })
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
