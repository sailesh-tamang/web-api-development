import { useRouter, useSearchParams } from 'next/navigation';

export const mockPush = jest.fn();
export const mockPrefetch = jest.fn();
export const mockBack = jest.fn();
export const mockRefresh = jest.fn();

export const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
export const mockUseSearchParams =
  useSearchParams as jest.MockedFunction<typeof useSearchParams>;

export const setupMockRouter = () => {
  mockUseRouter.mockReturnValue({
    push: mockPush,
    prefetch: mockPrefetch,
    back: mockBack,
    refresh: mockRefresh,
    forward: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  } as any);

  mockUseSearchParams.mockReturnValue(new URLSearchParams());
};

export const resetMockRouter = () => {
  mockPush.mockReset();
  mockPrefetch.mockReset();
  mockBack.mockReset();
  mockRefresh.mockReset();
};
