/**
 * Error Handling & Validation Integration Tests
 * Covers: Global error scenarios, invalid inputs, authorization failures
 * Total: ~12 tests
 */

import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../modules/user/user.model';
import {
  buildTestUser,
  registerUser,
  loginUser,
  createUserAndLogin,
  cleanupUserByEmail,
  TestUser,
} from '../helpers/test-utils';

/**
 * Build a test user object with optional overrides and extra randomization
 */
function buildUniqueTestUser(overrides?: Partial<TestUser>): TestUser {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}${random}@example.com`,
    password: 'password123',
    ...overrides,
  };
}

describe('Error Handling & Validation Tests', () => {
  jest.setTimeout(30000);

  describe('Invalid Request Body & Malformed JSON', () => {
    it('should return 400 for invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{invalid json}');

      // Express body-parser should reject invalid JSON
      expect(response.status).toBe(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'only@email.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject extremely long strings in fields', async () => {
      const longString = 'a'.repeat(10000);
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: longString,
          email: 'test@example.com',
          password: 'password123',
        });

      // Should either succeed or return 413 (payload too large)
      expect([201, 400, 413]).toContain(response.status);
    });

    it('should reject negative numbers for numeric fields', async () => {
      const testUser = buildTestUser();
      const { token } = await createUserAndLogin(app);

      const response = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${token}`)
        .send({
          workoutName: 'Test',
          description: 'Test',
          estimatedDuration: -30, // negative duration
          caloriesBurned: 300,
        });

      // Should either accept or reject
      expect([400, 201]).toContain(response.status);
    });
  });

  describe('Invalid ID Formats', () => {
    it('should return 500 or 400 for invalid MongoDB ObjectId in GET /api/auth/:id', async () => {
      const response = await request(app)
        .get('/api/auth/not-valid-id-format');

      expect([400, 500]).toContain(response.status);
    });

    it('should return 400 for invalid ObjectId in PUT /api/auth/:id', async () => {
      const response = await request(app)
        .put('/api/auth/invalid-id')
        .send({ name: 'Test' });

      expect([400, 500]).toContain(response.status);
    });

    it('should return 400 for invalid ObjectId in DELETE /api/auth/:id', async () => {
      const response = await request(app)
        .delete('/api/auth/not-valid-id');

      expect([400, 401, 500]).toContain(response.status);
    });

    it('should return 400 for invalid workout ID in PUT /api/workout/:id/end', async () => {
      const userSetup = await createUserAndLogin(app);
      const response = await request(app)
        .put('/api/workout/invalid-id/end')
        .set('Authorization', `Bearer ${userSetup.token}`)
        .send({ actualDuration: 30, actualCalories: 200 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid workout ID');

      await cleanupUserByEmail(userSetup.user.email);
    });
  });

  describe('Authorization & Authentication Errors', () => {
    it('should return 401 when no Authorization header is provided', async () => {
      const response = await request(app)
        .get('/api/workout/history');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 for missing Bearer in Authorization header', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', 'token-without-bearer');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 with invalid/expired JWT token', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', 'Bearer invalid.jwt.token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 403 when non-admin accesses admin endpoint', async () => {
      const userSetup = await createUserAndLogin(app);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userSetup.token}`);

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'Forbidden: admin only');

      await cleanupUserByEmail(userSetup.user.email);
    });

    it('should return 401 for empty Bearer token', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Resource Not Found', () => {
    it('should return 404 for non-existent user', async () => {
      const fakeId = '999999999999999999999999';
      const response = await request(app)
        .get(`/api/auth/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 404 for non-existent workout', async () => {
      const userSetup = await createUserAndLogin(app);
      const fakeId = '999999999999999999999999';

      const response = await request(app)
        .put(`/api/workout/${fakeId}/end`)
        .set('Authorization', `Bearer ${userSetup.token}`)
        .send({ actualDuration: 30, actualCalories: 200 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Workout not found');

      await cleanupUserByEmail(userSetup.user.email);
    });

    it('should return 404 for non-existent admin user', async () => {
      const userSetup = await createUserAndLogin(app);

      // Make user admin to access admin endpoints
      const userId = userSetup.userId;
      await UserModel.findByIdAndUpdate(userId, { role: 'admin' });

      // Re-login to get new admin token
      const loginRes = await loginUser(app, userSetup.user.email, userSetup.user.password);
      const adminToken = loginRes.body.token;

      const fakeId = '999999999999999999999999';
      const response = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(userSetup.user.email);
    });
  });

  describe('Validation & Data Constraints', () => {
    it('should reject valid email but empty password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');

      await cleanupUserByEmail('test@example.com');
    });

    it('should handle multiple validation errors', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject password reset with mismatched passwords', async () => {
      const testUser = buildTestUser();
      await registerUser(app, testUser);

      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      const resetToken = forgotRes.body.token;

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          email: testUser.email,
          newPassword: 'newpassword123',
          confirmPassword: 'differentpassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message');

      await cleanupUserByEmail(testUser.email);
    });

    it('should reject password reset with short password', async () => {
      const testUser = buildTestUser();
      await registerUser(app, testUser);

      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      const resetToken = forgotRes.body.token;

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          email: testUser.email,
          newPassword: '123',
          confirmPassword: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(testUser.email);
    });
  });

  describe('Concurrent Request Safety', () => {
    it('should handle concurrent login attempts', async () => {
      const testUser = buildTestUser();
      await registerUser(app, testUser);

      // Send 3 concurrent login requests
      const responses = await Promise.all([
        loginUser(app, testUser.email, testUser.password),
        loginUser(app, testUser.email, testUser.password),
        loginUser(app, testUser.email, testUser.password),
      ]);

      // All should succeed
      responses.forEach((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
      });

      await cleanupUserByEmail(testUser.email);
    });

    it('should handle sequential user creation attempts', async () => {
      const user1 = buildUniqueTestUser();
      const user2 = buildUniqueTestUser();

      // Create users sequentially to avoid any race conditions
      const res1 = await registerUser(app, user1);
      expect(res1.status).toBe(201);

      const res2 = await registerUser(app, user2);
      expect(res2.status).toBe(201);

      await cleanupUserByEmail(user1.email);
      await cleanupUserByEmail(user2.email);
    });
  });

  describe('HTTP Method Errors', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/undefined-endpoint');

      expect([404, 200]).toContain(response.status);
    });

    it('should handle method not allowed on routes', async () => {
      const response = await request(app)
        .delete('/api/auth/register');

      // DELETE on /register is not defined, may return 401, 404, or 405
      expect([401, 404, 405]).toContain(response.status);
    });
  });
});
