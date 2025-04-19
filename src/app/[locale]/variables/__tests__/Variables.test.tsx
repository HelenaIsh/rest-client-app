import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Variables from '../page';
import { useVariables } from '@/app/context/VariablesContext';
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
  useSearchParams: () => new URLSearchParams('Authorization=Bearer token'),
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
  },
  Common: {
    loading: 'Loading...',
  },
};

describe('Variables', () => {
  const mockAddVariable = vi.fn();
  const mockRemoveVariable = vi.fn();
  const mockGetVariableValue = vi.fn();
  const mockSubstituteVariables = vi.fn();
  const mockVariables = [
    { name: 'API_KEY', value: '12345' },
    { name: 'BASE_URL', value: 'https://api.example.com' },
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
    vi.mocked(useVariables).mockReturnValue({
      variables: mockVariables,
      addVariable: mockAddVariable,
      removeVariable: mockRemoveVariable,
      getVariableValue: mockGetVariableValue,
      substituteVariables: mockSubstituteVariables,
    });
  });

  const renderWithProvider = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Variables />
      </NextIntlClientProvider>
    );
  };

  it('shows loading state while checking authentication', () => {
    mockUseAuthState.mockReturnValue([null, true, undefined]);
    renderWithProvider();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('redirects to signin when user is not authenticated', () => {
    mockUseAuthState.mockReturnValue([null, false, undefined]);
    renderWithProvider();
    expect(mockRouter.push).toHaveBeenCalledWith('/signin');
  });

  it('renders the page title when authenticated', () => {
    renderWithProvider();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('renders the form inputs when authenticated', () => {
    renderWithProvider();

    expect(screen.getByPlaceholderText('Variable name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Variable value')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Variable' })
    ).toBeInTheDocument();
  });

  it('adds a new variable when form is submitted', async () => {
    renderWithProvider();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const submitButton = screen.getByRole('button', { name: 'Add Variable' });

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

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const submitButton = screen.getByRole('button', { name: 'Add Variable' });

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

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    expect(mockRemoveVariable).toHaveBeenCalledWith('API_KEY');
  });
});
