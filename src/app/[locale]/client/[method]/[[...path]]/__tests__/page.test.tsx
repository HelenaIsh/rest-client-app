import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequestPage from '../page';
import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';
import { User } from 'firebase/auth';
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
  useParams: vi.fn(),
  useSearchParams: () => new URLSearchParams('Authorization=Bearer token'),
  useRouter: mockUseRouter,
}));

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => {
    return vi.fn().mockImplementation((props) => (
      <div data-testid="mock-rest-client">
        <div>Method: {props.initialMethod}</div>
        <div>URL: {props.initialUrl}</div>
        <div>Body: {props.initialBody}</div>
        <div>Headers: {JSON.stringify(props.initialHeaders)}</div>
      </div>
    ));
  }),
}));

const messages = {
  RestClient: {
    loading: 'Loading REST Client...',
  },
  Common: {
    loading: 'Loading...',
  },
};

describe('RequestPage', () => {
  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  };

  const mockUser: Partial<User> = {
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

  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({
      method: 'GET',
      path: ['aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20=', 'e30='], // base64 encoded 'https://api.example.com' and '{}'
    });
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('shows loading state while checking authentication', () => {
    mockUseAuthState.mockReturnValue([null, true, undefined]);

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestPage />
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('redirects to signin when user is not authenticated', () => {
    mockUseAuthState.mockReturnValue([null, false, undefined]);

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestPage />
      </NextIntlClientProvider>
    );

    expect(mockRouter.push).toHaveBeenCalledWith('/signin');
  });

  it('renders the request page with RestClient component when user is authenticated', () => {
    mockUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestPage />
      </NextIntlClientProvider>
    );

    const container = screen.getByTestId('request-container');
    expect(container).toHaveClass(
      'w-full',
      'h-full',
      'max-w-7xl',
      'mx-auto',
      'p-4',
      'bg-white',
      'text-gray-500',
      'rounded-2xl',
      'shadow-lg',
      'flex',
      'flex-col'
    );

    const mockRestClient = screen.getByTestId('mock-rest-client');
    expect(mockRestClient).toBeInTheDocument();
    expect(screen.getByText('Method: GET')).toBeInTheDocument();
    expect(
      screen.getByText('URL: https://api.example.com')
    ).toBeInTheDocument();
    expect(screen.getByText('Body: {}')).toBeInTheDocument();
  });

  it('decodes URL and body parameters correctly', () => {
    mockUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestPage />
      </NextIntlClientProvider>
    );

    expect(
      screen.getByText('URL: https://api.example.com')
    ).toBeInTheDocument();
    expect(screen.getByText('Body: {}')).toBeInTheDocument();
  });

  it('converts search params to headers correctly', () => {
    mockUseAuthState.mockReturnValue([mockUser as User, false, undefined]);

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestPage />
      </NextIntlClientProvider>
    );

    const headersText = screen.getByText(/Headers:/);
    expect(headersText).toBeInTheDocument();
    const headers = JSON.parse(
      headersText.textContent!.replace('Headers: ', '')
    );
    expect(headers).toHaveLength(1);
    expect(headers[0]).toMatchObject({
      key: 'Authorization',
      value: 'Bearer token',
      enabled: true,
    });
  });
});
