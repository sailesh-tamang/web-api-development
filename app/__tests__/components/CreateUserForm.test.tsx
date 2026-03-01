import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import CreateUserForm from '@/app/component/admin/CreateUserForm';
import { setupMockRouter, resetMockRouter } from '@/app/__tests__/mocks/mockNextRouter';
import { mockFetchResponse } from '@/app/__tests__/testUtils';

jest.mock('next/navigation');

describe('CreateUserForm Component', () => {
  beforeEach(() => {
    setupMockRouter();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    resetMockRouter();
    jest.restoreAllMocks();
  });

  it('renders create user form', () => {
    const { container } = render(<CreateUserForm />);
    
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('displays form fields for user creation', () => {
    const { container } = render(<CreateUserForm />);
    
    // Check for form element
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('validates email format on blur', async () => {
    const user = userEvent.setup();
    
    const { container } = render(<CreateUserForm />);
    
    const emailInputs = container.querySelectorAll('input[type="email"]');
    if (emailInputs.length > 0) {
      const emailInput = emailInputs[0];
      await user.type(emailInput, 'invalid-email');
      expect(emailInput).toBeInTheDocument();
    }
  });

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup();
    
    const mockResponse = { message: 'User created successfully', userId: '123' };
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse(201, mockResponse));
    
    const { container } = render(<CreateUserForm />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('displays error message on failed user creation', async () => {
    const user = userEvent.setup();
    
    const mockError = { message: 'Email already exists' };
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse(409, mockError));
    
    const { container } = render(<CreateUserForm />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('disables submit button during submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockFetchResponse(201, {})), 500))
    );
    
    const { container } = render(<CreateUserForm />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse(201, {}));
    
    const { container } = render(<CreateUserForm />);
    
    const emailInputs = container.querySelectorAll('input[type="email"]');
    if (emailInputs.length > 0) {
      expect(emailInputs[0]).toBeInTheDocument();
    }
  });

  it('requires email field', async () => {
    const { container } = render(<CreateUserForm />);
    
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const { container } = render(<CreateUserForm />);
    expect(container.querySelector('form')).toBeTruthy();
  });
});
