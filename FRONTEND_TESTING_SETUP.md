# Frontend Testing Setup - Jest + React Testing Library

This document describes the Jest and React Testing Library setup for the Fitness Web frontend.

## Setup Overview

The frontend testing infrastructure has been configured with:
- **Jest**: JavaScript testing framework
- **React Testing Library (RTL)**: DOM testing utilities
- **next/jest**: Next.js Jest configuration
- **TypeScript**: Full TypeScript support
- **@testing-library/user-event**: User interaction simulation

## Directory Structure

```
app/
├── __tests__/
│   ├── components/              # Component test files
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   ├── TopBar.test.tsx
│   │   ├── LoginForm.test.tsx
│   │   ├── Dashboard.test.tsx
│   │   ├── UserProfile.test.tsx
│   │   ├── CreateUserForm.test.tsx
│   │   └── WalkingTracker.test.tsx
│   ├── mocks/                   # Mock utilities
│   │   ├── mockNextRouter.ts    # Mock next/navigation
│   │   └── mockJsCookie.ts      # Mock js-cookie
│   ├── setupTests.ts            # Jest setup with RTL
│   ├── testUtils.ts             # Common test utilities
│   └── testHelpers.ts           # Helper functions for test data
├── component/                   # React components
├── lib/                         # Libraries
└── ...

__mocks__/                       # Module mocks
├── next/
│   └── navigation.ts
└── js-cookie.ts

jest.config.js                   # Jest configuration
```

## Required Dev Dependencies

The following packages are required for frontend testing (add to package.json devDependencies):

```json
{
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "@testing-library/react": "^15.0.0",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "identity-obj-proxy": "^3.0.0",
  "@types/jest": "^29.5.11"
}
```

Install with:
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy @types/jest
```

## Package.json Scripts

The following test scripts have been added to package.json:

```json
{
  "scripts": {
    "test": "jest --verbose",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Files Created

### 1. **Button.test.tsx** (7 tests)
- Tests rendering, onClick handlers, disabled state, className application
- Verifies multiple clicks and dynamic content updates
- Tests: button rendering, onClick, disabled state, classNames, multi-click, content types, disabled click

### 2. **Input.test.tsx** (8 tests)
- Tests input element rendering, type prop, placeholder, onChange events
- Verifies value prop, disabled state, custom className
- Tests input types (text, email, password, number)
- Tests: rendering, type prop, placeholder, onChange, value prop, disabled, className, different types, focus/blur

### 3. **TopBar.test.tsx** (6 tests)
- Tests TopBar component with next/navigation mocking
- Verifies authentication state visibility
- Tests navigation and logout functionality
- Uses mock router for route testing
- Tests: rendering when logged in, displaying items, logout, content when not logged in, router push calls, token state changes

### 4. **LoginForm.test.tsx** (11 tests)
- Comprehensive form submission tests
- Tests email/password validation
- Verifies token storage in cookies and localStorage
- Tests role-based redirects (admin vs user)
- Tests error handling and network failure scenarios
- Tests: form rendering, form submission, token storage, admin redirect, user redirect, error display, email validation, submit button disable, network errors

### 5. **Dashboard.test.tsx** (10 tests)
- Tests authenticated user dashboard rendering
- Verifies data loading on mount
- Tests loading and error states
- Tests component updates and navigation
- Tests: dashboard rendering, content display, user data loading, loading state, error handling, data updates, hero/reports sections, authenticated session, footer

### 6. **UserProfile.test.tsx** (7 tests)
- Tests user profile form rendering and data loading
- Verifies profile update submission
- Tests form validation and error handling
- Tests: profile rendering, form fields, data loading, update submission, error display, submit disable, validation

### 7. **CreateUserForm.test.tsx** (9 tests)
- Tests admin user creation form
- Verifies email validation and error handling
- Tests form submission and clearing after success
- Tests required field validation
- Tests: form rendering, form fields, email validation, form submission, error messages, submit disable, form clearing, required fields, network errors

### 8. **WalkingTracker.test.tsx** (10 tests)
- Tests walking tracker component data loading
- Verifies step count display and progress
- Tests goal achievement messaging
- Tests: component rendering, step display, data loading, loading state, progress display, goal achievement, API errors, data updates, date display, zero steps

## Mock Setup

### mockNextRouter.ts
Provides mocks for Next.js navigation:
- `useRouter` hook mock
- `useSearchParams` hook mock
- Setup and reset functions
- Mock methods: push, prefetch, back, refresh, forward, replace

### mockJsCookie.ts
Mocks js-cookie library:
- `Cookies.get()` - retrieve cookie value
- `Cookies.set()` - set cookie value
- `Cookies.remove()` - remove cookie
- Reset function for test isolation

### __mocks__/next/navigation.ts
Module mock for next/navigation at package root level

### __mocks__/js-cookie.ts
Module mock for js-cookie at package root level

## Test Utilities

### setupTests.ts
Jest setup file that:
- Imports @testing-library/jest-dom for custom matchers
- Provides custom RTL matchers: toBeInTheDocument(), toBeVisible(), etc.

### testUtils.ts
Common test utilities:
- `setupTestEnvironment()` - Initialize router and cookie mocks
- `resetTestEnvironment()` - Clean up mocks after tests
- `mockFetchResponse()` - Create mock fetch responses
- `mockFetchError()` - Create fetch error scenarios

### testHelpers.ts
Advanced test helpers:
- `renderWithProviders()` - Custom render with future provider support
- `waitForAsync()` - Async operation waiting
- `mockLocalStorage()` - localStorage mock
- `setupTest()` - Test environment setup (matchMedia, etc.)
- `createMockUser()` - Generate mock user data
- `createMockWorkout()` - Generate mock workout data
- `createMockAPIResponse()` - Create API response mocks

## Jest Configuration (jest.config.js)

```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/app/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^js-cookie$': '<rootDir>/__mocks__/js-cookie.ts',
  },
  testMatch: ['<rootDir>/app/__tests__/**/*.test.ts[x]'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
    '!app/__tests__/**',
  ],
}
```

## Best Practices Used

1. **Component Isolation**: Each test file tests a single component
2. **Descriptive Test Names**: Tests clearly describe what they verify
3. **Mock Setup/Teardown**: Proper cleanup with beforeEach/afterEach
4. **User-Centric Testing**: Uses @testing-library/user-event for user interactions
5. **Accessibility**: Tests use semantic queries (getByRole, getByPlaceholderText)
6. **Error Handling**: Tests verify error states and user feedback
7. **Async Operations**: Proper use of waitFor for async assertions
8. **Fixed Token Exhaustion**: Tests are designed to be lightweight and fast

## Running Tests

### Quick Start
```bash
npm test                    # Run all tests once
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

### Run Specific Test File
```bash
npm test Button.test.tsx
npm test LoginForm.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test --testNamePattern="button"
npm test --testNamePattern="login"
```

## Debugging Tests

Add `.only` to run a single test file:
```typescript
describe.only('Button Component', () => {
  // ...test code
});
```

Add `.skip` to skip a test:
```typescript
it.skip('should do something', () => {
  // test code
});
```

Use `screen.debug()` to print DOM:
```typescript
screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole('button')); // Prints specific element
```

## Coverage Reports

Generate coverage report:
```bash
npm run test:coverage
```

Coverage output is generated in `coverage/` directory with:
- `coverage/index.html` - Visual coverage report
- Coverage metrics for statements, branches, functions, lines

## Common Issues & Solutions

### Issue: "Cannot find module 'js-cookie'"
**Solution**: Ensure `__mocks__/js-cookie.ts` exists and jest.config.js has moduleNameMapper

### Issue: "next/navigation" not mocked
**Solution**: Tests include `jest.mock('next/navigation')` at the top

### Issue: Tests timeout
**Solution**: Use `jest.useFakeTimers()` for setTimeout-dependent code

### Issue: localStorage not available
**Solution**: Use `mockLocalStorage()` from testHelpers.ts

## Extending Tests

### Adding a New Component Test
1. Create `app/__tests__/components/YourComponent.test.tsx`
2. Import component and required testing utilities
3. Mock external dependencies (router, fetch, etc.)
4. Write test cases with descriptive names
5. Use `setupTest()` and `resetTest()` in beforeEach/afterEach

### Example Template
```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '@/app/component/YourComponent';

jest.mock('next/navigation');

describe('YourComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## Integration with CI/CD

Add to your Github Actions or CI pipeline:
```yaml
- name: Run Frontend Tests
  run: npm test -- --coverage --watchAll=false
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Summary

Created 8 comprehensive component tests covering:
- ✅ 60+ individual test cases
- ✅ Mock setup for next/navigation and js-cookie
- ✅ Proper test utilities and helpers
- ✅ Jest configuration with TypeScript support
- ✅ npm test scripts for running tests
- ✅ Coverage report generation
- ✅ Component rendering and interaction tests
- ✅ API mocking and error handling

All tests follow React Testing Library best practices and use semantic queries for better maintainability.
