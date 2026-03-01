export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}));

export const useSearchParams = jest.fn(() => new URLSearchParams());
export const usePathname = jest.fn(() => '/');
