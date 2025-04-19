import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Client from '../page';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const mockUseAuthState = vi.hoisted(() => vi.fn());
const mockUseRouter = vi.hoisted(() => vi.fn());

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
  useParams: vi.fn(),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => {
    return vi.fn().mockImplementation(() => <div>Mock RestClient</div>);
  }),
}));

const messages = {
  RestClient: {
    loading: 'Loading...',
  },
  Common: {
    loading: 'Loading...',
  },
};

describe('Client', () => {
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
    mockUseAuthState.mockReturnValue([mockUser, false, undefined]);
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('shows loading state while checking authentication', () => {
    mockUseAuthState.mockReturnValue([null, true, undefined]);
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Client />
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('redirects to signin when user is not authenticated', () => {
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Client />
      </NextIntlClientProvider>
    );

    expect(mockRouter.push).toHaveBeenCalledWith('/signin');
  });

  it('renders the client page with RestClient component when authenticated', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Client />
      </NextIntlClientProvider>
    );

    const container = screen.getByTestId('client-container');
    expect(container).toHaveClass(
      'w-full',
      'h-full',
      'max-w-7xl',
      'mx-auto',
      'p-4',
      'shadow-lg',
      'flex',
      'flex-col'
    );

    expect(screen.getByText('Mock RestClient')).toBeInTheDocument();
  });
});
