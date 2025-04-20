import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tabs from '../Tabs';
import '@testing-library/jest-dom';

describe('Tabs', () => {
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content 1</div>,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content 2</div>,
    },
  ];

  it('renders all tab labels', () => {
    render(<Tabs tabs={mockTabs} />);

    mockTabs.forEach((tab) => {
      const tabButton = screen.getByRole('button', { name: tab.label });
      expect(tabButton).toBeInTheDocument();
    });
  });

  it('shows the first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeVisible();
  });

  it('shows the specified default tab content', () => {
    render(<Tabs tabs={mockTabs} defaultActiveTab="tab2" />);

    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('switches content when clicking a tab', () => {
    render(<Tabs tabs={mockTabs} />);

    const tab2Button = screen.getByRole('button', { name: 'Tab 2' });
    fireEvent.click(tab2Button);

    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('applies correct styling to active and inactive tabs', () => {
    render(<Tabs tabs={mockTabs} />);

    const activeTab = screen.getByRole('button', { name: 'Tab 1' });
    const inactiveTab = screen.getByRole('button', { name: 'Tab 2' });

    expect(activeTab).toHaveClass('font-bold text-blue-600');
    expect(inactiveTab).toHaveClass('text-gray-600');
  });

  it('has the correct container styling', () => {
    render(<Tabs tabs={mockTabs} />);

    const tabContainer = screen.getAllByRole('button')[0].parentElement;
    expect(tabContainer).toHaveClass('flex space-x-4 m-4');
  });

  it('has the correct content container styling', () => {
    render(<Tabs tabs={mockTabs} />);

    const contentContainer = screen.getByText('Content 1').parentElement;
    expect(contentContainer).toHaveClass('h-[350px] overflow-auto');
  });
});
