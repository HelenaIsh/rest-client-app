import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Variables from '../page';
import { useVariables } from '@/app/context/VariablesContext';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

vi.mock('@/app/context/VariablesContext', () => ({
  useVariables: vi.fn(),
}));

const messages = {
  Variables: {
    title: 'Variables',
    variableNamePlaceholder: 'Variable name',
    variableValuePlaceholder: 'Variable value',
    addVariableButton: 'Add Variable',
    deleteButton: 'Delete',
  },
};

describe('Variables', () => {
  const mockAddVariable = vi.fn();
  const mockRemoveVariable = vi.fn();
  const mockVariables = [
    { name: 'API_KEY', value: '12345' },
    { name: 'BASE_URL', value: 'https://api.example.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useVariables as vi.Mock).mockReturnValue({
      variables: mockVariables,
      addVariable: mockAddVariable,
      removeVariable: mockRemoveVariable,
    });
  });

  const renderWithProvider = () => {
    return render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Variables />
      </NextIntlClientProvider>
    );
  };

  it('renders the page title', () => {
    renderWithProvider();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('renders the form inputs', () => {
    renderWithProvider();

    expect(screen.getByPlaceholderText('Variable name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Variable value')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Variable' })
    ).toBeInTheDocument();
  });

  it('renders existing variables', () => {
    renderWithProvider();

    expect(screen.getByText('{{API_KEY}}')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('{{BASE_URL}}')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
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
