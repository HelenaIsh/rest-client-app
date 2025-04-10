import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations = {
      Footer: { developedBy: 'Developed by', copyright: 'Copyright' },
    };
    return translations[key as keyof typeof translations] || key;
  },
}));

describe('Footer', () => {
  it('renders the RS School logo with correct link', () => {
    render(<Footer />);

    const rsSchoolLink = screen.getByRole('link', { name: /RS School Logo/i });
    expect(rsSchoolLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink).toHaveAttribute('rel', 'noopener noreferrer');

    const rsSchoolLogo = screen.getByAltText('RS School Logo');
    expect(rsSchoolLogo).toBeInTheDocument();
    expect(rsSchoolLogo).toHaveAttribute('width', '40');
    expect(rsSchoolLogo).toHaveAttribute('height', '40');
  });

  it('renders the "Developed by" text', () => {
    render(<Footer />);

    const developedByText = screen.getByText('developedBy');
    expect(developedByText).toBeInTheDocument();
  });

  it('renders GitHub links for all developers', () => {
    render(<Footer />);

    const alanLink = screen.getByRole('link', { name: /AlanKowalzky/i });
    expect(alanLink).toHaveAttribute('href', 'https://github.com/AlanKowalzky');
    expect(alanLink).toHaveAttribute('target', '_blank');
    expect(alanLink).toHaveAttribute('rel', 'noopener noreferrer');

    const alanImage = screen.getByAltText('AlanKowalzky');
    expect(alanImage).toBeInTheDocument();
    expect(alanImage).toHaveAttribute('width', '40');
    expect(alanImage).toHaveAttribute('height', '40');

    const links = screen.getAllByRole('link');
    const helenaLink = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/HelenaIsh'
    );
    expect(helenaLink).toHaveAttribute('href', 'https://github.com/HelenaIsh');
    expect(helenaLink).toHaveAttribute('target', '_blank');
    expect(helenaLink).toHaveAttribute('rel', 'noopener noreferrer');

    const mayskiiLink = links.find(
      (link) => link.getAttribute('href') === 'https://github.com/mayskii'
    );
    expect(mayskiiLink).toHaveAttribute('href', 'https://github.com/mayskii');
    expect(mayskiiLink).toHaveAttribute('target', '_blank');
    expect(mayskiiLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the copyright text with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText((content) => {
      return (
        content.includes('copyright') && content.includes(`© ${currentYear}`)
      );
    });
    expect(copyrightText).toBeInTheDocument();
  });
});
