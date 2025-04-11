import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Client from '../page';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => {
    return vi.fn().mockImplementation(() => <div>Mock RestClient</div>);
  }),
}));

const messages = {
  RestClient: {
    loading: 'Loading...',
  },
};

describe('Client', () => {
  it('renders the client page with RestClient component', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <Client />
      </NextIntlClientProvider>
    );

    const container = screen.getByTestId('client-container');
    expect(container).toHaveClass(
      'w-full',
      'h-full',
      'max-w-7xl',
      'mx-auto',
      'p-4',
      'bg-white',
      'text-gray-500',
      'rounded-2xl',
      'shadow-lg',
      'flex',
      'flex-col'
    );

    expect(screen.getByText('Mock RestClient')).toBeInTheDocument();
  });
});
