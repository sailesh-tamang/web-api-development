import { setupMockRouter, resetMockRouter } from './mocks/mockNextRouter';
import { resetMockCookies } from './mocks/mockJsCookie';

export const setupTestEnvironment = () => {
  setupMockRouter();
};

export const resetTestEnvironment = () => {
  resetMockRouter();
  resetMockCookies();
};

export const mockFetchResponse = (status: number, data: any) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
};

export const mockFetchError = () => {
  return Promise.reject(new Error('Fetch failed'));
};
