import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import SignInPage from '@/app/[locale]/(auth)/signin/page';
import { NextIntlClientProvider } from 'next-intl';

const mockUseAuthState = vi.fn();
const mockUseRouter = vi.fn();
const mockUseSignInWithEmailAndPassword = vi.fn();

vi.mock('@/app/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return () => {}; // Return cleanup function
    }),
  },
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: mockUseAuthState,
  useSignInWithEmailAndPassword: mockUseSignInWithEmailAndPassword,
}));

vi.mock('next/navigation', () => ({
  useRouter: mockUseRouter,
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
      invalidCredential: 'Invalid credentials',
      userDisabled: 'User disabled',
      userNotFound: 'User not found',
      wrongPassword: 'Wrong password',
      tooManyRequests: 'Too many requests',
    },
  },
};

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    mockUseSignInWithEmailAndPassword.mockReturnValue([vi.fn(), null, false, null]);
    mockUseRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });
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
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows error message for invalid email', async () => {
    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('shows error message for invalid password', async () => {
    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Password requirements not met')).toBeInTheDocument();
  });

  it('handles successful sign in', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ user: {} });
    mockUseSignInWithEmailAndPassword.mockReturnValue([
      mockSignIn,
      null,
      false,
      null,
    ]);

    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'ValidPass123!');
    });
  });

  it('shows error message when sign in fails', async () => {
    const error = { code: 'auth/invalid-credential' };
    mockUseSignInWithEmailAndPassword.mockReturnValue([
      vi.fn(),
      null,
      false,
      error,
    ]);

    renderSignInPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
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
    mockUseAuthState.mockReturnValue([mockUser, false, undefined]);
    renderSignInPage();
    expect(mockUseRouter().push).toHaveBeenCalledWith('/');
  });
});
