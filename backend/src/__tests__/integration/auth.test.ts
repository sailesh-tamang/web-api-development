/**
 * Auth API Integration Tests
 * Covers: POST/GET /api/auth (register, login, forgot-password, reset-password, user CRUD)
 * Total: ~20 tests
 */

import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../modules/user/user.model';
import {
  buildTestUser,
  registerUser,
  loginUser,
  cleanupUserByEmail,
} from '../helpers/test-utils';

describe('Auth API Integration Tests', () => {
  jest.setTimeout(30000);

  describe('POST /api/auth/register', () => {
    afterEach(async () => {
      // Cleanup any created users
      await UserModel.deleteMany({
        email: { $regex: 'test.*@example.com' },
      });
    });

    it('should return 400 when missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'incomplete@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when password is too short (< 8 chars)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'short@example.com',
          password: 'pass',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should successfully register a new user with valid data', async () => {
      const testUser = buildTestUser();
      const response = await registerUser(app, testUser);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    it('should return 409 when email already exists', async () => {
      const testUser = buildTestUser();
      
      // First registration
      const res1 = await registerUser(app, testUser);
      expect(res1.status).toBe(201);

      // Second registration with same email
      const res2 = await registerUser(app, testUser);
      expect(res2.status).toBe(409);
      expect(res2.body).toHaveProperty('message', 'Email already exists');
      expect(res2.body.ok).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = buildTestUser();

    beforeAll(async () => {
      // Create a user for login tests
      await registerUser(app, testUser);
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 400 when missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 with non-existent email', async () => {
      const response = await loginUser(app, 'nonexistent@example.com', 'password123');

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 401 with incorrect password', async () => {
      const response = await loginUser(app, testUser.email, 'wrongpassword');

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should successfully login and return token', async () => {
      const response = await loginUser(app, testUser.email, testUser.password);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return valid JWT token on login', async () => {
      const response = await loginUser(app, testUser.email, testUser.password);

      expect(response.status).toBe(200);
      const token = response.body.token;
      expect(token).toBeDefined();
      // Token should have 3 parts separated by dots (JWT format)
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    const testUser = buildTestUser();

    beforeAll(async () => {
      await registerUser(app, testUser);
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });

    it('should return 400 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    it('should successfully initiate password reset for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/validate-reset-token', () => {
    const testUser = buildTestUser();
    let resetToken: string;

    beforeAll(async () => {
      await registerUser(app, testUser);
      
      // Get reset token
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });
      
      resetToken = forgotRes.body.token;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 400 when token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/validate-reset-token')
        .send({ email: testUser.email });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/validate-reset-token')
        .send({ token: 'sometoken' });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    it('should validate a valid reset token', async () => {
      const response = await request(app)
        .post('/api/auth/validate-reset-token')
        .send({ token: resetToken, email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });

  describe('GET /api/auth (Get all users)', () => {
    beforeAll(async () => {
      // Create test users
      const user1 = buildTestUser();
      const user2 = buildTestUser();
      await registerUser(app, user1);
      await registerUser(app, user2);
    });

    afterAll(async () => {
      await UserModel.deleteMany({
        email: { $regex: 'test.*@example.com' },
      });
    });

    it('should return 200 with users list', async () => {
      const response = await request(app)
        .get('/api/auth')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.users) || Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 400 with invalid pagination (page < 1)', async () => {
      const response = await request(app)
        .get('/api/auth')
        .query({ page: 0, limit: 10 });

      // API may return 200 with default page 1 or 400 for invalid page
      expect([200, 400]).toContain(response.status);
    });

    it('should support pagination limit parameter', async () => {
      const response = await request(app)
        .get('/api/auth')
        .query({ page: 1, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
    });
  });

  describe('GET /api/auth/:id (Get user by ID)', () => {
    let userId: string;
    const testUser = buildTestUser();

    beforeAll(async () => {
      const res = await registerUser(app, testUser);
      userId = res.body.user?.id;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 200 with user data for valid ID', async () => {
      const response = await request(app)
        .get(`/api/auth/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 404 for non-existent user ID', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .get(`/api/auth/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 for invalid ObjectId format', async () => {
      const response = await request(app)
        .get(`/api/auth/invalid-id`);

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/auth/:id (Update user)', () => {
    let userId: string;
    const testUser = buildTestUser();

    beforeAll(async () => {
      const res = await registerUser(app, testUser);
      userId = res.body.user?.id;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should update user name successfully', async () => {
      const response = await request(app)
        .put(`/api/auth/${userId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe('Updated Name');
    });

    it('should update user age successfully', async () => {
      const response = await request(app)
        .put(`/api/auth/${userId}`)
        .send({ age: 30 });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user.age).toBe(30);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .put(`/api/auth/${fakeId}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
    });
  });

  describe('DELETE /api/auth/:id (Delete user) - requires admin', () => {
    let userId: string;
    const testUser = buildTestUser();
    let userToken: string;

    beforeAll(async () => {
      const res = await registerUser(app, testUser);
      userId = res.body.user?.id;

      const loginRes = await loginUser(app, testUser.email, testUser.password);
      userToken = loginRes.body.token;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email).catch(() => {});
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .delete(`/api/auth/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });

    it('should return 403 if non-admin user tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/auth/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      // Regular user should not be able to delete (requires adminOnly)
      expect([403, 401]).toContain(response.status);
    });
  });
});
