import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SendButton from '../SendButton';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

export const sendButtonMessages = {
  SendButton: {
    send: 'Send',
  },
};

describe('SendButton', () => {
  it('renders the send button with correct text', () => {
    render(
      <NextIntlClientProvider messages={sendButtonMessages} locale="en">
        <SendButton />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Send');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('has the correct styling classes', () => {
    render(
      <NextIntlClientProvider messages={sendButtonMessages} locale="en">
        <SendButton />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6 border border-gray-300 rounded-md');
  });
});
