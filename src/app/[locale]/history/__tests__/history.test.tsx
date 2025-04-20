import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useTranslations } from 'next-intl';
import { getHistory } from '@/app/[locale]/client/utils/utils';
import { HistoryItem, Header } from '@/types';
import '@testing-library/jest-dom';
import { HistoryComponent } from '../HistoryComponent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

type HistoryMessages = {
  title: string;
  emptyHistory: string;
  tryRestClient: string;
};

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

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
  NextIntlClientProvider: ({
    children,
  }: {
    children: React.ReactNode;
    messages: { History: HistoryMessages };
    locale: string;
  }) => <div data-testid="next-intl-provider">{children}</div>,
}));

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => (
      <a href={href} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

vi.mock('@/app/[locale]/client/utils/utils', () => ({
  getHistory: vi.fn(),
}));

const messages = {
  History: {
    title: 'History',
    emptyHistory: 'No history items found',
    tryRestClient: 'Try REST Client',
  } as HistoryMessages,
};

const mockHistoryItems: HistoryItem[] = [
  {
    method: 'GET',
    endpointUrl: 'https://api.example.com/users',
    path: '/client?url=https://api.example.com/users&method=GET',
    body: '',
    headers: [] as Header[],
  },
  {
    method: 'POST',
    endpointUrl: 'https://api.example.com/posts',
    path: '/client?url=https://api.example.com/posts&method=POST',
    body: '',
    headers: [] as Header[],
  },
  {
    method: 'PUT',
    endpointUrl: 'https://api.example.com/users/1',
    path: '/client?url=https://api.example.com/users/1&method=PUT',
    body: '',
    headers: [] as Header[],
  },
  {
    method: 'DELETE',
    endpointUrl: 'https://api.example.com/posts/1',
    path: '/client?url=https://api.example.com/posts/1&method=DELETE',
    body: '',
    headers: [] as Header[],
  },
];

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

describe('HistoryComponent', () => {
  beforeEach(() => {
    const mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    };
    vi.clearAllMocks();
    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    const mockTranslations = Object.assign(
      (key: keyof HistoryMessages): string => messages.History[key],
      {
        rich: vi.fn(),
        markup: vi.fn(),
        raw: vi.fn(),
        has: vi.fn(),
      }
    ) as ReturnType<typeof useTranslations>;
    vi.mocked(useTranslations).mockReturnValue(mockTranslations);
    vi.mocked(getHistory).mockReturnValue(mockHistoryItems);
  });

  const renderWithProvider = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HistoryComponent />
      </NextIntlClientProvider>
    );
  };

  it('renders the page title', () => {
    renderWithProvider();
    expect(screen.getByText(messages.History.title)).toBeInTheDocument();
  });

  it('displays history items with correct method badges', () => {
    renderWithProvider();

    const getBadge = screen.getByText('GET');
    expect(getBadge).toHaveClass('bg-green-100', 'text-green-800');

    const postBadge = screen.getByText('POST');
    expect(postBadge).toHaveClass('bg-blue-100', 'text-blue-800');

    const putBadge = screen.getByText('PUT');
    expect(putBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');

    const deleteBadge = screen.getByText('DELETE');
    expect(deleteBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('displays endpoint URLs correctly', () => {
    renderWithProvider();
    mockHistoryItems.forEach((item) => {
      expect(screen.getByText(item.endpointUrl)).toBeInTheDocument();
    });
  });

  it('renders pagination controls when there are more than 10 items', () => {
    const manyItems: HistoryItem[] = Array.from({ length: 15 }, (_, i) => ({
      method: 'GET',
      endpointUrl: `https://api.example.com/items/${i}`,
      path: `/client?url=https://api.example.com/items/${i}&method=GET`,
      body: '',
      headers: [] as Header[],
    }));

    vi.mocked(getHistory).mockReturnValue(manyItems);
    renderWithProvider();

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('disables previous button on first page and next button on last page', () => {
    const manyItems: HistoryItem[] = Array.from({ length: 15 }, (_, i) => ({
      method: 'GET',
      endpointUrl: `https://api.example.com/items/${i}`,
      path: `/client?url=https://api.example.com/items/${i}&method=GET`,
      body: '',
      headers: [] as Header[],
    }));

    vi.mocked(getHistory).mockReturnValue(manyItems);
    renderWithProvider();

    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('shows empty state when there are no history items', () => {
    vi.mocked(getHistory).mockReturnValue([]);
    renderWithProvider();

    expect(screen.getByText(messages.History.emptyHistory)).toBeInTheDocument();
    expect(
      screen.getByText(messages.History.tryRestClient)
    ).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    renderWithProvider();
    const links = screen.getAllByTestId('mock-link');

    mockHistoryItems.forEach((item, index) => {
      expect(links[index]).toHaveAttribute('href', item.path);
    });
  });

  it('changes page when clicking pagination buttons', () => {
    const manyItems: HistoryItem[] = Array.from({ length: 15 }, (_, i) => ({
      method: 'GET',
      endpointUrl: `https://api.example.com/items/${i}`,
      path: `/client?url=https://api.example.com/items/${i}&method=GET`,
      body: '',
      headers: [] as Header[],
    }));

    vi.mocked(getHistory).mockReturnValue(manyItems);
    renderWithProvider();

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(
      screen.getByText('https://api.example.com/items/10')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('https://api.example.com/items/0')
    ).not.toBeInTheDocument();
  });
});
