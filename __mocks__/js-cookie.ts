const mockCookieStore: Record<string, string> = {};

const Cookies = {
  get: jest.fn((key?: string) => {
    if (!key) return mockCookieStore;
    return mockCookieStore[key];
  }),
  set: jest.fn((key: string, value: string, options?: Record<string, any>) => {
    mockCookieStore[key] = value;
    return value;
  }),
  remove: jest.fn((key: string, options?: Record<string, any>) => {
    delete mockCookieStore[key];
  }),
};

export default Cookies;
