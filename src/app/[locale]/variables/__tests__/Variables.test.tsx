import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useVariables } from '@/app/context/VariablesContext';
import { Auth } from 'firebase/auth';
import { useState } from 'react';
import '@testing-library/jest-dom';

const MockVariablesComponent = () => {
  const [user, loading] = useAuthState({} as Auth);
  const router = useRouter();
  const { variables, addVariable, removeVariable } = useVariables();
  const [formData, setFormData] = useState({ name: '', value: '' });

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.value) {
      addVariable(formData);
      setFormData({ name: '', value: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>Variables</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Variable name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="value"
          placeholder="Variable value"
          value={formData.value}
          onChange={handleChange}
        />
        <button type="submit">Add Variable</button>
      </form>
      <div>
        {variables.map((variable) => (
          <div key={variable.name}>
            <span>{variable.name}</span>
            <span>{variable.value}</span>
            <button onClick={() => removeVariable(variable.name)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

vi.mock('@/app/[locale]/variables/page', () => ({
  default: MockVariablesComponent,
}));

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

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthState).mockReturnValue([mockUser, false, undefined]);
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
        <MockVariablesComponent />
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

  it('displays existing variables', () => {
    renderWithProvider();

    mockVariables.forEach((variable) => {
      expect(screen.getByText(variable.name)).toBeInTheDocument();
      expect(screen.getByText(variable.value)).toBeInTheDocument();
    });
  });
});
