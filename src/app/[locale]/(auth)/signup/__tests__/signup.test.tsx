import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import SignUpPage from '@/app/[locale]/(auth)/signup/page';
import { NextIntlClientProvider } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('@/app/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return () => {}; // Return cleanup function
    }),
  },
}));

const mockUseAuthState = vi.fn();
const mockUseCreateUserWithEmailAndPassword = vi.fn();

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: mockUseAuthState,
  useCreateUserWithEmailAndPassword: mockUseCreateUserWithEmailAndPassword,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const messages = {
  SignUpPage: {
    mode: 'Sign Up',
    form: {
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
    },
    errors: {
      invalidEmail: 'Invalid email',
      passwordRequirements: 'Password requirements not met',
      unknown: 'Unknown error',
      emailInUse: 'Email already in use',
      weakPassword: 'Password is too weak',
    },
  },
};

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    mockUseCreateUserWithEmailAndPassword.mockReturnValue([
      vi.fn(),
      undefined,
      false,
      undefined,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpPage = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <SignUpPage />
      </NextIntlClientProvider>
    );
  };

  it('renders the sign up form', () => {
    renderSignUpPage();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows error message for invalid email', async () => {
    renderSignUpPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('shows error message for invalid password', async () => {
    renderSignUpPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText('Password requirements not met')
    ).toBeInTheDocument();
  });

  it('handles successful sign up', async () => {
    const mockCreateUser = vi.fn().mockResolvedValue({ user: {} });
    mockUseCreateUserWithEmailAndPassword.mockReturnValue([
      mockCreateUser,
      undefined,
      false,
      undefined,
    ]);

    renderSignUpPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        'test@example.com',
        'ValidPass123!'
      );
    });
  });

  it('shows error message when email is already in use', async () => {
    const error = {
      code: 'auth/email-already-in-use',
      name: 'AuthError',
      message: 'Email already in use',
      customData: {
        appName: 'test-app',
      },
    };
    mockUseCreateUserWithEmailAndPassword.mockReturnValue([
      vi.fn(),
      undefined,
      false,
      error,
    ]);

    renderSignUpPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
  });

  it('shows error message for weak password', async () => {
    const error = {
      code: 'auth/weak-password',
      name: 'AuthError',
      message: 'Password is too weak',
      customData: {
        appName: 'test-app',
      },
    };
    mockUseCreateUserWithEmailAndPassword.mockReturnValue([
      vi.fn(),
      undefined,
      false,
      error,
    ]);

    renderSignUpPage();
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Password is too weak')).toBeInTheDocument();
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

    const mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    };

    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    renderSignUpPage();
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
