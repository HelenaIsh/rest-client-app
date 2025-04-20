import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import SignInPage from '@/app/[locale]/(auth)/signin/page';
import { NextIntlClientProvider } from 'next-intl';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';

vi.mock('@/app/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return () => {};
    }),
  },
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
  useSignInWithEmailAndPassword: vi.fn(),
}));

const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const messages = {
  SignInPage: {
    mode: 'Sign In',
    form: {
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
    },
    errors: {
      invalidEmail: 'Invalid email',
      passwordRequirements: 'Password requirements not met',
      unknown: 'Unknown error',
      invalidCredentials: 'Invalid credentials',
    },
  },
};

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthState).mockReturnValue([null, false, undefined]);
    vi.mocked(useSignInWithEmailAndPassword).mockReturnValue([
      vi.fn(),
      undefined,
      false,
      undefined,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInPage = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SignInPage />
      </NextIntlClientProvider>
    );
  };

  it('renders the sign in form', () => {
    renderSignInPage();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows error message for invalid password', async () => {
    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(
        messages.SignInPage.errors.passwordRequirements
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-red-500', 'text-sm', 'mt-1');
    });
  });

  it('handles successful sign in', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ user: {} });
    vi.mocked(useSignInWithEmailAndPassword).mockReturnValue([
      mockSignIn,
      undefined,
      false,
      undefined,
    ]);

    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'ValidPass123!'
      );
    });
  });

  it('redirects to home page if user is already authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
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
      phoneNumber: null,
      photoURL: null,
      providerId: '',
    };
    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);
    renderSignInPage();
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
