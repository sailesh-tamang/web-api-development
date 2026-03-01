import request from 'supertest';
import { Express } from 'express';
import { UserModel } from '../../modules/user/user.model';

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

/**
 * Build a test user object with optional overrides
 */
export function buildTestUser(overrides?: Partial<TestUser>): TestUser {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'password123',
    ...overrides,
  };
}

/**
 * Register a user via POST /api/auth/register
 */
export async function registerUser(app: Express, user: TestUser) {
  return request(app)
    .post('/api/auth/register')
    .send(user);
}

/**
 * Login a user via POST /api/auth/login and return the response
 */
export async function loginUser(
  app: Express,
  email: string,
  password: string
) {
  return request(app)
    .post('/api/auth/login')
    .send({ email, password });
}

/**
 * Format an authorization header with Bearer token
 */
export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Create an admin user and login to get admin token
 */
export async function createAdminUserAndLogin(
  app: Express,
  overrides?: Partial<TestUser>
) {
  const adminUser = buildTestUser({
    name: 'Admin User',
    ...overrides,
  });

  // Register as regular user first
  const registerRes = await registerUser(app, adminUser);
  if (registerRes.status !== 201) {
    throw new Error(`Failed to register admin user: ${registerRes.status}`);
  }

  // Manually set admin role in DB
  const userId = registerRes.body.user?.id;
  if (userId) {
    await UserModel.findByIdAndUpdate(userId, { role: 'admin' });
  }

  // Login
  const loginRes = await loginUser(app, adminUser.email, adminUser.password);
  if (loginRes.status !== 200) {
    throw new Error(`Failed to login admin user: ${loginRes.status}`);
  }

  return {
    user: adminUser,
    token: loginRes.body.token,
    userId,
    response: loginRes,
  };
}

/**
 * Create a regular user and login to get user token
 */
export async function createUserAndLogin(
  app: Express,
  overrides?: Partial<TestUser>
) {
  const testUser = buildTestUser(overrides);

  const registerRes = await registerUser(app, testUser);
  if (registerRes.status !== 201) {
    throw new Error(`Failed to register user: ${registerRes.status}`);
  }

  const loginRes = await loginUser(app, testUser.email, testUser.password);
  if (loginRes.status !== 200) {
    throw new Error(`Failed to login user: ${loginRes.status}`);
  }

  return {
    user: testUser,
    token: loginRes.body.token,
    userId: registerRes.body.user?.id,
    response: loginRes,
  };
}

/**
 * Cleanup user by email (used in afterAll/afterEach)
 */
export async function cleanupUserByEmail(email: string) {
  await UserModel.deleteOne({ email });
}

/**
 * Cleanup user by ID
 */
export async function cleanupUserById(userId: string) {
  await UserModel.findByIdAndDelete(userId);
}
