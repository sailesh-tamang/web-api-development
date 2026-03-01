import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';

/**
 * Custom render function that wraps components with necessary providers
 * Can be extended to include Redux, Context providers, etc.
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Wait for async operations with default timeout
 */
export const waitForAsync = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

/**
 * Setup and teardown for tests
 */
export const setupTest = () => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * Create mock user data for testing
 */
export const createMockUser = (overrides?: Partial<any>) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Create mock workout data for testing
 */
export const createMockWorkout = (overrides?: Partial<any>) => ({
  id: '1',
  name: 'Morning Run',
  type: 'cardio',
  duration: 30,
  calories: 300,
  date: new Date().toISOString(),
  userId: '1',
  ...overrides,
});

/**
 * Create mock API response
 */
export const createMockAPIResponse = <T>(data: T, status: number = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  blob: async () => new Blob([JSON.stringify(data)]),
  headers: new Headers({
    'content-type': 'application/json',
  }),
});
