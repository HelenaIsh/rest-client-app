import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EndpointInput from '../EndpointInput';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  EndpointInput: {
    placeholder: 'Enter endpoint URL',
    errors: { invalidUrl: 'Invalid URL' },
    aria: { endpointUrl: 'Endpoint URL input' },
  },
};

describe('EndpointInput', () => {
  const mockSetEndpointUrl = vi.fn();

  beforeEach(() => {
    mockSetEndpointUrl.mockClear();
  });

  it('renders with default props', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EndpointInput setEndpointUrl={mockSetEndpointUrl} />
      </NextIntlClientProvider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute(
      'placeholder',
      messages.EndpointInput.placeholder
    );
    expect(input).toHaveAttribute(
      'aria-label',
      messages.EndpointInput.aria.endpointUrl
    );
  });

  it('calls setEndpointUrl when input changes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EndpointInput setEndpointUrl={mockSetEndpointUrl} />
      </NextIntlClientProvider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://api.example.com' } });

    expect(mockSetEndpointUrl).toHaveBeenCalledWith('https://api.example.com');
  });

  it('shows error state for invalid URL', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EndpointInput
          endpointUrl="invalid-url"
          setEndpointUrl={mockSetEndpointUrl}
        />
      </NextIntlClientProvider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute(
      'title',
      messages.EndpointInput.errors.invalidUrl
    );
  });

  it('shows valid state for valid URL', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EndpointInput
          endpointUrl="https://api.example.com"
          setEndpointUrl={mockSetEndpointUrl}
        />
      </NextIntlClientProvider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-gray-300');
    expect(input).toHaveAttribute('title', '');
  });

  it('has the correct styling classes', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EndpointInput setEndpointUrl={mockSetEndpointUrl} />
      </NextIntlClientProvider>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('flex-1 p-2 border rounded-md');
  });
});
