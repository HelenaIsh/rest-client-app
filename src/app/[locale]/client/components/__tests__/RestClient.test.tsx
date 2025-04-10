import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestClient from '../RestClient';
import { useRouter } from 'next/navigation';
import { useVariables } from '@/app/context/VariablesContext';
import { Header } from '@/types';
import { methods } from '@components/MethodSelector';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';
import { headerEditorMessages } from '@components/__tests__/HeaderEditor.test';
import { RequestBodyMessages } from '@components/__tests__/RequestBodyEditor.test';
import { sendButtonMessages } from '@components/__tests__/SendButton.test';
import { endpointInputMessages } from '@components/__tests__/EndpointInput.test';

vi.mock('@uiw/react-codemirror', () => ({
  default: vi
    .fn()
    .mockImplementation(({ value }) => (
      <div data-testid="codemirror">{value}</div>
    )),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/app/context/VariablesContext', () => ({
  useVariables: vi.fn(),
}));

const messages = {
  RestClient: {
    body: 'Body',
    headers: 'Headers',
    response: 'Response',
    noResponseYet: 'No response yet',
    genericError: 'An error occurred',
    networkError: 'Network error',
  },
  ...headerEditorMessages,
  ...RequestBodyMessages,
  ...sendButtonMessages,
  ...endpointInputMessages,
};

describe('RestClient', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockSubstituteVariables = {
    substituteVariables: vi.fn().mockImplementation((value) => ({
      result: value,
      missingVariables: [],
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as vi.Mock).mockReturnValue(mockRouter);
    (useVariables as vi.Mock).mockReturnValue(mockSubstituteVariables);
  });

  const renderWithProvider = (props = {}) => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RestClient {...props} />
      </NextIntlClientProvider>
    );
  };

  it('renders with default props', () => {
    renderWithProvider();

    expect(
      screen.getByRole('textbox', { name: /endpoint/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
  });

  it('renders with initial props', () => {
    const initialProps = {
      initialMethod: 'POST' as (typeof methods)[number],
      initialUrl: 'https://api.example.com',
      initialBody: '{"key": "value"}',
      initialHeaders: [
        {
          id: 1,
          key: 'Content-Type',
          value: 'application/json',
          enabled: true,
        },
      ] as Header[],
    };

    renderWithProvider(initialProps);

    expect(screen.getByRole('textbox', { name: /endpoint/i })).toHaveValue(
      'https://api.example.com'
    );
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('shows error toast for invalid URL', async () => {
    renderWithProvider();

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid or missing endpoint URL')
      ).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    renderWithProvider();

    const endpointInput = screen.getByRole('textbox', { name: /endpoint/i });
    fireEvent.change(endpointInput, {
      target: { value: 'https://api.example.com' },
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it('handles variable substitution', async () => {
    const mockSubstituteVariablesWithMissing = {
      substituteVariables: vi.fn().mockImplementation((value) => ({
        result: value,
        missingVariables: ['MISSING_VAR'],
      })),
    };
    (useVariables as vi.Mock).mockReturnValue(
      mockSubstituteVariablesWithMissing
    );

    renderWithProvider();

    const endpointInput = screen.getByRole('textbox', { name: /endpoint/i });
    fireEvent.change(endpointInput, {
      target: { value: 'https://api.example.com' },
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Missing variables: MISSING_VAR/)
      ).toBeInTheDocument();
    });
  });
});
