import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MethodSelector, { methods } from '../MethodSelector';
import '@testing-library/jest-dom';

describe('MethodSelector', () => {
  const mockSetSelectedMethod = vi.fn();

  beforeEach(() => {
    mockSetSelectedMethod.mockClear();
  });

  it('renders all HTTP methods as options', () => {
    render(
      <MethodSelector
        selectedMethod="GET"
        setSelectedMethod={mockSetSelectedMethod}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    methods.forEach((method) => {
      const option = screen.getByRole('option', { name: method });
      expect(option).toBeInTheDocument();
      expect(option).toHaveValue(method);
    });
  });

  it('calls setSelectedMethod when a new method is selected', () => {
    render(
      <MethodSelector
        selectedMethod="GET"
        setSelectedMethod={mockSetSelectedMethod}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POST' } });

    expect(mockSetSelectedMethod).toHaveBeenCalledWith('POST');
  });

  it('uses the default value of GET when no method is provided', () => {
    render(
      <MethodSelector
        selectedMethod={undefined}
        setSelectedMethod={mockSetSelectedMethod}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('GET');
  });

  it('has the correct styling classes', () => {
    render(
      <MethodSelector
        selectedMethod="GET"
        setSelectedMethod={mockSetSelectedMethod}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('p-2 border border-gray-300 rounded-md');
  });
});
