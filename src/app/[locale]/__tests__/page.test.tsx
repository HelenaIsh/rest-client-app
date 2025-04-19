import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainPage from '../page';
import { useAuthState } from 'react-firebase-hooks/auth';
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

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations = {
      MainPage: {
        welcome: 'Welcome',
        welcomeBack: 'Welcome back',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        restClient: 'REST Client',
        history: 'History',
        variables: 'Variables',
        ourTeam: 'Our Team',
        alanDescription: 'Alan description',
        helenaDescription: 'Helena description',
        mayaDescription: 'Maya description',
      },
    };
    return translations[key as keyof typeof translations] || key;
  },
  useLocale: () => 'en',
}));

describe('MainPage', () => {
  const mockUser = {
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message and auth links for unauthenticated users', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      null,
      false,
      undefined,
    ]);

    render(<MainPage />);

    expect(screen.getByText('welcome')).toBeInTheDocument();
    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
  });

  it('renders welcome back message and app links for authenticated users', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      mockUser,
      false,
      undefined,
    ]);

    render(<MainPage />);

    expect(
      screen.getByText(`welcomeBack, ${mockUser.email}`)
    ).toBeInTheDocument();
    expect(screen.getByText('restClient')).toBeInTheDocument();
    expect(screen.getByText('history')).toBeInTheDocument();
    expect(screen.getByText('variables')).toBeInTheDocument();
  });

  it('shows loading state when auth is loading', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      null,
      true,
      undefined,
    ]);

    render(<MainPage />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders team section with author information', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      null,
      false,
      undefined,
    ]);

    render(<MainPage />);

    expect(screen.getByText('ourTeam')).toBeInTheDocument();
    expect(screen.getByText('Helena Ish')).toBeInTheDocument();
    expect(screen.getByText('Mayskii')).toBeInTheDocument();
  });
});
