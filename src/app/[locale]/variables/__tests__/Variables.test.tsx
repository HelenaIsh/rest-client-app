import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useVariables } from '@/app/context/VariablesContext';
import '@testing-library/jest-dom';
import { VariablesComponent } from '../page';

type VariablesMessages = {
  title: string;
  description: string;
  variableNamePlaceholder: string;
  variableValuePlaceholder: string;
  addVariableButton: string;
  deleteButton: string;
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

const mockTranslations = Object.assign(
  (key: keyof VariablesMessages): string => messages.Variables[key],
  {
    rich: vi.fn(),
    markup: vi.fn(),
    raw: vi.fn(),
    has: vi.fn(),
  }
);

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => mockTranslations),
  NextIntlClientProvider: ({
    children,
  }: {
    children: React.ReactNode;
    messages: { Variables: VariablesMessages };
    locale: string;
  }) => <div data-testid="next-intl-provider">{children}</div>,
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/app/context/VariablesContext', () => ({
  useVariables: vi.fn(),
}));

const messages = {
  Variables: {
    title: 'Variables',
    description: 'This is the Variables page',
    variableNamePlaceholder: 'Variable name',
    variableValuePlaceholder: 'Variable value',
    addVariableButton: 'Add Variable',
    deleteButton: 'Delete',
  } as VariablesMessages,
};

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

const mockVariables = [
  { name: 'API_KEY', value: '12345' },
  { name: 'BASE_URL', value: 'https://api.example.com' },
];

describe('VariablesComponent', () => {
  const mockAddVariable = vi.fn();
  const mockRemoveVariable = vi.fn();
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
    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useVariables).mockReturnValue({
      variables: mockVariables,
      addVariable: mockAddVariable,
      removeVariable: mockRemoveVariable,
      getVariableValue: vi.fn(),
      substituteVariables: vi.fn(),
    });
  });

  const renderWithProvider = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <VariablesComponent />
      </NextIntlClientProvider>
    );
  };

  it('redirects to signin when user is not authenticated', () => {
    vi.mocked(useAuthState).mockReturnValue([null, false, undefined]);
    renderWithProvider();
    expect(mockRouter.push).toHaveBeenCalledWith('/signin');
  });

  it('renders the form inputs when authenticated', () => {
    renderWithProvider();
    expect(
      screen.getByPlaceholderText(messages.Variables.variableNamePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(messages.Variables.variableValuePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: messages.Variables.addVariableButton })
    ).toBeInTheDocument();
  });

  it('adds a new variable when form is submitted', async () => {
    renderWithProvider();

    const nameInput = screen.getByPlaceholderText(
      messages.Variables.variableNamePlaceholder
    );
    const valueInput = screen.getByPlaceholderText(
      messages.Variables.variableValuePlaceholder
    );
    const submitButton = screen.getByRole('button', {
      name: messages.Variables.addVariableButton,
    });

    fireEvent.change(nameInput, { target: { value: 'NEW_VAR' } });
    fireEvent.change(valueInput, { target: { value: 'new_value' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddVariable).toHaveBeenCalledWith({
        name: 'NEW_VAR',
        value: 'new_value',
      });
    });

    expect(nameInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });

  it('does not add a variable when name or value is empty', () => {
    renderWithProvider();

    const nameInput = screen.getByPlaceholderText(
      messages.Variables.variableNamePlaceholder
    );
    const valueInput = screen.getByPlaceholderText(
      messages.Variables.variableValuePlaceholder
    );
    const submitButton = screen.getByRole('button', {
      name: messages.Variables.addVariableButton,
    });

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(valueInput, { target: { value: 'some_value' } });
    fireEvent.click(submitButton);
    expect(mockAddVariable).not.toHaveBeenCalled();

    fireEvent.change(nameInput, { target: { value: 'some_name' } });
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(mockAddVariable).not.toHaveBeenCalled();
  });

  it('removes a variable when delete button is clicked', () => {
    renderWithProvider();

    const deleteButtons = screen.getAllByRole('button', {
      name: messages.Variables.deleteButton,
    });
    fireEvent.click(deleteButtons[0]);

    expect(mockRemoveVariable).toHaveBeenCalledWith('API_KEY');
  });

  it('displays existing variables', () => {
    renderWithProvider();

    mockVariables.forEach((variable) => {
      expect(screen.getByText(`{{${variable.name}}}`)).toBeInTheDocument();
      expect(screen.getByText(variable.value)).toBeInTheDocument();
    });
  });
});
