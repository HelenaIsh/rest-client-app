import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { NextIntlClientProvider } from 'next-intl';
import { signOut } from '@firebase/auth';
import '@testing-library/jest-dom';

const mockUseAuthState = vi.hoisted(() => vi.fn());
const mockUseRouter = vi.hoisted(() => vi.fn());
const mockUsePathname = vi.hoisted(() => vi.fn());
const mockUseLocale = vi.hoisted(() => vi.fn());

vi.mock('@/app/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn();
    }),
  },
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: mockUseAuthState,
}));

vi.mock('next/navigation', () => ({
  useRouter: mockUseRouter,
  usePathname: mockUsePathname,
}));

vi.mock('next-intl', () => ({
  useLocale: mockUseLocale,
  useTranslations: () => (key: string) => {
    const translations = {
      Header: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
      },
    };
    return translations[key as keyof typeof translations] || key;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('@/i18n/locale-utils', () => ({
  toggleToOtherLocale: (locale: string, pathname: string) => {
    return locale === 'en' ? '/ru' + pathname : '/en' + pathname;
  },
}));

vi.mock('@firebase/auth', () => ({
  signOut: vi.fn(),
}));

describe('Header', () => {
  const mockUser = {
    uid: '123',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: vi.fn(),
    getIdToken: vi.fn(),
    getIdTokenResult: vi.fn(),
    reload: vi.fn(),
    toJSON: vi.fn(),
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: '',
  };

  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    mockUseRouter.mockReturnValue(mockRouter);
    mockUsePathname.mockReturnValue('/');
    mockUseLocale.mockReturnValue('en');
  });

  const renderWithProvider = () => {
    return render(
      <NextIntlClientProvider messages={{}} locale="en">
        <Header />
      </NextIntlClientProvider>
    );
  };

  it('renders sign in and sign up links when user is not authenticated', () => {
    renderWithProvider();

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
    expect(screen.queryByText('signOut')).not.toBeInTheDocument();
  });

  it('renders sign out link when user is authenticated', () => {
    mockUseAuthState.mockReturnValue([mockUser, false, undefined]);
    renderWithProvider();

    expect(screen.getByText('signOut')).toBeInTheDocument();
    expect(screen.queryByText('signIn')).not.toBeInTheDocument();
    expect(screen.queryByText('signUp')).not.toBeInTheDocument();
  });

  it('shows locale toggle button with correct text', () => {
    renderWithProvider();
    expect(screen.getByText('РУС')).toBeInTheDocument();

    mockUseLocale.mockReturnValue('ru');
    renderWithProvider();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('calls router.push with correct path when locale is toggled', () => {
    renderWithProvider();
    const localeButton = screen.getByText('РУС');
    fireEvent.click(localeButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/ru/');

    mockUseLocale.mockReturnValue('ru');
    renderWithProvider();
    const localeButtonRu = screen.getByText('EN');
    fireEvent.click(localeButtonRu);
    expect(mockRouter.push).toHaveBeenCalledWith('/en/');
  });

  it('adds sticky class when scrolling', () => {
    renderWithProvider();
    const header = screen.getByRole('banner');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(header).toHaveClass('sticky');
  });

  it('removes sticky class when scrolling back to top', () => {
    renderWithProvider();
    const header = screen.getByRole('banner');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    expect(header).toHaveClass('sticky');

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);
    expect(header).not.toHaveClass('sticky');
  });

  it('calls signOut when sign out link is clicked', () => {
    mockUseAuthState.mockReturnValue([mockUser, false, undefined]);
    renderWithProvider();

    const signOutLink = screen.getByText('signOut');
    fireEvent.click(signOutLink);

    expect(vi.mocked(signOut)).toHaveBeenCalled();
  });
});
