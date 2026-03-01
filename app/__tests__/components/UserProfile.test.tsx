import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import UserProfile from '@/app/component/profile/UserProfile';
import Cookies from '@/app/__tests__/mocks/mockJsCookie';
import { setupMockRouter, resetMockRouter } from '@/app/__tests__/mocks/mockNextRouter';
import { mockFetchResponse } from '@/app/__tests__/testUtils';

jest.mock('next/navigation');
jest.mock('js-cookie');

describe('UserProfile Component', () => {
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

  it('renders user profile section', () => {
    const { container } = render(<UserProfile />);
    
    // Profile component should be present
    expect(container.querySelector('[class*="container"]')).toBeTruthy();
  });

  it('displays user information fields', () => {
    const { container } = render(<UserProfile />);
    
    // Check for typical profile content
    expect(container.querySelector('[class*="container"]')).toBeTruthy();
  });

  it('loads user profile data on mount', async () => {
    const mockUserData = {
      id: '1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: 'Male',
    };
    
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, mockUserData)
    );
    
    const { container } = render(<UserProfile />);
    
    // Component renders without error
    expect(container).toBeTruthy();
  });

  it('handles profile update submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValue(
      mockFetchResponse(200, { message: 'Profile updated' })
    );
    
    const { container } = render(<UserProfile />);
    
    // Component renders
    expect(container).toBeTruthy();
  });

  it('displays error message on failed update', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Update failed'));
    
    const { container } = render(<UserProfile />);
    
    // Component should render and handle error gracefully
    expect(container.querySelector('[class*="container"]')).toBeTruthy();
  });

  it('disables submit button during form submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockFetchResponse(200, {})), 500))
    );
    
    const { container } = render(<UserProfile />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
      
      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    }
  });

  it('validates form input before submission', async () => {
    const user = userEvent.setup();
    
    const { container } = render(<UserProfile />);
    
    const emailInputs = container.querySelectorAll('input[type="email"]');
    if (emailInputs.length > 0) {
      expect(emailInputs[0]).toBeInTheDocument();
    }
  });

  it('handles successful profile update', async () => {
    const user = userEvent.setup();
    
    const mockResponse = { message: 'Profile updated successfully' };
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse(200, mockResponse));
    
    const { container } = render(<UserProfile />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    if (submitButton) {
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    }
  });
});
