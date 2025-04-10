import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeaderEditor from '../HeaderEditor';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  HeaderEditor: {
    table: {
      key: 'Key',
      value: 'Value',
      enabled: 'Enabled',
      delete: 'Delete',
    },
    placeholders: {
      key: 'Enter header key',
      value: 'Enter header value',
    },
    aria: {
      deleteRow: 'Delete row',
    },
  },
};

describe('HeaderEditor', () => {
  const mockHeaders = [
    { id: 1, key: 'Content-Type', value: 'application/json', enabled: true },
    { id: 2, key: 'Authorization', value: 'Bearer token', enabled: true },
  ];

  const mockSetHeaders = vi.fn();

  beforeEach(() => {
    mockSetHeaders.mockClear();
  });

  it('renders the header table with correct columns', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders all header rows with correct values', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    mockHeaders.forEach((header) => {
      expect(screen.getByDisplayValue(header.key)).toBeInTheDocument();
      expect(screen.getByDisplayValue(header.value)).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox', { name: '' })[0]).toBeChecked();
    });
  });

  it('calls setHeaders when a header value changes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    const keyInput = screen.getByDisplayValue('Content-Type');
    fireEvent.change(keyInput, { target: { value: 'New-Header' } });

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { ...mockHeaders[0], key: 'New-Header' },
      mockHeaders[1],
    ]);
  });

  it('toggles header enabled state when checkbox is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { ...mockHeaders[0], enabled: false },
      mockHeaders[1],
    ]);
  });

  it('deletes a header when delete button is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    const deleteButton = screen.getAllByRole('button', {
      name: messages.HeaderEditor.aria.deleteRow,
    })[0];
    fireEvent.click(deleteButton);

    expect(mockSetHeaders).toHaveBeenCalledWith([mockHeaders[1]]);
  });

  it('adds a new empty row when the last row is filled', () => {
    const headersWithEmptyLastRow = [
      ...mockHeaders,
      { id: 3, key: '', value: '', enabled: false },
    ];

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor
          headers={headersWithEmptyLastRow}
          setHeaders={mockSetHeaders}
        />
      </NextIntlClientProvider>
    );

    const lastKeyInput = screen.getAllByRole('textbox').slice(-2)[0];
    fireEvent.change(lastKeyInput, { target: { value: 'New-Key' } });

    expect(mockSetHeaders).toHaveBeenCalledWith([
      ...headersWithEmptyLastRow.slice(0, -1),
      { ...headersWithEmptyLastRow[2], key: 'New-Key' },
      { id: expect.any(Number), key: '', value: '', enabled: false },
    ]);
  });

  it('has the correct styling classes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <HeaderEditor headers={mockHeaders} setHeaders={mockSetHeaders} />
      </NextIntlClientProvider>
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full', 'border-collapse');

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveClass('w-full p-1 border border-gray-300 rounded-md');
    });
  });
});
