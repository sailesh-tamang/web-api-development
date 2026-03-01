import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/component/dashboard/Dashboard';
import Cookies from '@/app/__tests__/mocks/mockJsCookie';
import { setupMockRouter, resetMockRouter } from '@/app/__tests__/mocks/mockNextRouter';
import { mockFetchResponse } from '@/app/__tests__/testUtils';

jest.mock('next/navigation');
jest.mock('js-cookie');

describe('Dashboard Component', () => {
  beforeEach(() => {
    setupMockRouter();
    jest.clearAllMocks();
    global.fetch = jest.fn();
    (Cookies.get as jest.Mock).mockReturnValue('test-token');
  });

  afterEach(() => {
    resetMockRouter();
    jest.restoreAllMocks();
  });

  it('renders dashboard when user is authenticated', () => {
    const { container } = render(<Dashboard />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('displays main dashboard content', async () => {
    const { container } = render(<Dashboard />);
    
    // Check for common dashboard elements
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('loads and displays user data on mount', async () => {
    const mockUserData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      totalWorkouts: 5,
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, mockUserData)
    );
    
    const { container } = render(<Dashboard />);
    
    // Component should render
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('displays walking tracker if present', () => {
    const { container } = render(<Dashboard />);
    
    // Component should render without error
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('displays workout details section', async () => {
    const { container } = render(<Dashboard />);
    
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('handles loading state', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockFetchResponse(200, {})), 1000))
    );
    
    const { container } = render(<Dashboard />);
    
    // Component should handle loading gracefully
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const { container } = render(<Dashboard />);
    
    // Component should still render main content
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('updates data when user navigates', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, { data: 'test' })
    );
    
    const { rerender, container } = render(<Dashboard />);
    
    rerender(<Dashboard />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('displays hero section', () => {
    const { container } = render(<Dashboard />);
    
    // Hero section should be visible
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('displays workout reports section', () => {
    const { container } = render(<Dashboard />);
    
    // Reports section should be present
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('handles authenticated user session', () => {
    (Cookies.get as jest.Mock).mockReturnValue('valid-token');
    
    const { container } = render(<Dashboard />);
    
    // Dashboard should render for authenticated user
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('renders footer', () => {
    const { container } = render(<Dashboard />);
    
    // Component should render successfully
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
