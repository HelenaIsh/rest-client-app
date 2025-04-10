import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RequestBodyEditor from '../RequestBodyEditor';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  RequestBodyEditor: {
    type: {
      json: 'JSON',
      text: 'Text',
    },
    actions: {
      prettify: 'Prettify',
      clear: 'Clear',
    },
    errors: {
      invalidJson: 'Invalid JSON',
    },
  },
};

describe('RequestBodyEditor', () => {
  const mockSetRequestBody = vi.fn();

  beforeEach(() => {
    mockSetRequestBody.mockClear();
  });

  it('renders with default props', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="{}"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('radio', { name: 'JSON' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Text' })).not.toBeChecked();
    expect(
      screen.getByRole('button', { name: 'Prettify' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('switches between JSON and text modes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="{}"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    const textRadio = screen.getByRole('radio', { name: 'Text' });
    fireEvent.click(textRadio);

    expect(textRadio).toBeChecked();
    expect(screen.getByRole('radio', { name: 'JSON' })).not.toBeChecked();
  });

  it('shows error state for invalid JSON', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="{invalid json"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prettify' })).toBeDisabled();
  });

  it('prettifies valid JSON when prettify button is clicked', () => {
    const validJson = '{"name":"John","age":30}';
    const prettifiedJson = '{\n  "name": "John",\n  "age": 30\n}';

    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody={validJson}
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    const prettifyButton = screen.getByRole('button', { name: 'Prettify' });
    fireEvent.click(prettifyButton);

    expect(mockSetRequestBody).toHaveBeenCalledWith(prettifiedJson);
  });

  it('clears content when clear button is clicked', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="some content"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);

    expect(mockSetRequestBody).toHaveBeenCalledWith('{}');
  });

  it('clears content to empty string when in text mode', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="some content"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    const textRadio = screen.getByRole('radio', { name: 'Text' });
    fireEvent.click(textRadio);

    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);

    expect(mockSetRequestBody).toHaveBeenCalledWith('');
  });

  it('has the correct styling classes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <RequestBodyEditor
          requestBody="{}"
          setRequestBody={mockSetRequestBody}
        />
      </NextIntlClientProvider>
    );

    const buttonContainer = screen.getByRole('button', {
      name: 'Prettify',
    }).parentElement;
    expect(buttonContainer).toHaveClass('flex gap-2');
  });
});
