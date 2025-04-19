import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateButton from '../GenerateButton';
import { NextIntlClientProvider } from 'next-intl';
import '@testing-library/jest-dom';

const messages = {
  GenerateButton: {
    generate: 'Generate',
  },
};

describe('GenerateButton', () => {
  it('renders the generate button', () => {
    const onLanguageSelect = vi.fn();
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <GenerateButton onLanguageSelect={onLanguageSelect} />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Generate');
  });

  it('opens dropdown menu when clicked', () => {
    const onLanguageSelect = vi.fn();
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <GenerateButton onLanguageSelect={onLanguageSelect} />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('curl')).toBeInTheDocument();
    expect(screen.getByText('JavaScript (Fetch API)')).toBeInTheDocument();
    expect(screen.getByText('JavaScript (XHR)')).toBeInTheDocument();
    expect(screen.getByText('NodeJS')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('C#')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('calls onLanguageSelect with correct language when an option is clicked', () => {
    const onLanguageSelect = vi.fn();
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <GenerateButton onLanguageSelect={onLanguageSelect} />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const pythonOption = screen.getByText('Python');
    fireEvent.click(pythonOption);

    expect(onLanguageSelect).toHaveBeenCalledWith('python');
  });
});
