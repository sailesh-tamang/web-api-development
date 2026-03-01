const mockCookies: Record<string, string> = {};

const Cookies = {
  get: jest.fn((key?: string) => {
    if (!key) {
      return mockCookies;
    }
    return mockCookies[key];
  }),
  set: jest.fn((key: string, value: string, options?: any) => {
    mockCookies[key] = value;
    return value;
  }),
  remove: jest.fn((key: string, options?: any) => {
    delete mockCookies[key];
  }),
};

export const resetMockCookies = () => {
  Object.keys(mockCookies).forEach((key) => {
    delete mockCookies[key];
  });
  (Cookies.get as jest.Mock).mockClear();
  (Cookies.set as jest.Mock).mockClear();
  (Cookies.remove as jest.Mock).mockClear();
};

export default Cookies;
