/**
 * Admin API Integration Tests
 * Covers: POST/GET /api/admin (admin user management with adminOnly middleware)
 * Total: ~12 tests
 */

import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../modules/user/user.model';
import {
  buildTestUser,
  registerUser,
  loginUser,
  createAdminUserAndLogin,
  cleanupUserByEmail,
} from '../helpers/test-utils';

describe('Admin API Integration Tests', () => {
  jest.setTimeout(30000);
  
  let adminToken: string;
  let adminUser: any;
  let adminUserId: string;

  beforeAll(async () => {
    // Create an admin user for testing
    const adminSetup = await createAdminUserAndLogin(app);
    adminToken = adminSetup.token;
    adminUser = adminSetup.user;
    adminUserId = adminSetup.userId;
  });

  afterAll(async () => {
    // Cleanup admin user and any created test users
    await UserModel.deleteMany({
      email: { $regex: 'test|admin' },
    });
  });

  describe('POST /api/admin/users (Create user as admin)', () => {
    const testUser = buildTestUser();

    afterEach(async () => {
      await cleanupUserByEmail(testUser.email).catch(() => {});
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .send(testUser);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 403 if non-admin user tries to create', async () => {
      const regularUser = buildTestUser();
      const registerRes = await registerUser(app, regularUser);
      const loginRes = await loginUser(app, regularUser.email, regularUser.password);

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .send(testUser);

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);
      expect(response.body).toHaveProperty('message', 'Forbidden: admin only');

      await cleanupUserByEmail(regularUser.email);
    });

    it('should return 400 when missing required fields', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'incomplete@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    it('should return 409 when email already exists', async () => {
      // First create a user
      const res1 = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);

      expect(res1.status).toBe(201);

      // Try to create again with same email
      const res2 = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);

      expect(res2.status).toBe(409);
      expect(res2.body.ok).toBe(false);
      expect(res2.body).toHaveProperty('message', 'Email exists');
    });

    it('should successfully create a new user as admin', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('message', 'User created');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });
  });

  describe('GET /api/admin/users (List all users)', () => {
    beforeAll(async () => {
      // Ensure we have at least 2 users
      const user1 = buildTestUser();
      const user2 = buildTestUser();
      await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user1);
      await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user2);
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });

    it('should return 403 for non-admin user', async () => {
      const regularUser = buildTestUser();
      await registerUser(app, regularUser);
      const loginRes = await loginUser(app, regularUser.email, regularUser.password);

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(regularUser.email);
    });

    it('should return 200 with users array for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/admin/users/:id (Get specific user)', () => {
    let testUserId: string;
    const testUser = buildTestUser();

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);
      testUserId = res.body.user?.id;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });

    it('should return 403 for non-admin user', async () => {
      const regularUser = buildTestUser();
      await registerUser(app, regularUser);
      const loginRes = await loginUser(app, regularUser.email, regularUser.password);

      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(regularUser.email);
    });

    it('should return 200 with user data for admin', async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id (Update user)', () => {
    let testUserId: string;
    const testUser = buildTestUser();

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);
      testUserId = res.body.user?.id;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email);
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });

    it('should return 403 for non-admin user', async () => {
      const regularUser = buildTestUser();
      await registerUser(app, regularUser);
      const loginRes = await loginUser(app, regularUser.email, regularUser.password);

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(regularUser.email);
    });

    it('should update user successfully for admin', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Admin Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe('Admin Updated Name');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .put(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
    });
  });

  describe('DELETE /api/admin/users/:id (Delete user)', () => {
    let testUserId: string;
    const testUser = buildTestUser();

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUser);
      testUserId = res.body.user?.id;
    });

    afterAll(async () => {
      await cleanupUserByEmail(testUser.email).catch(() => {});
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`);

      expect(response.status).toBe(401);
      expect(response.body.ok).toBe(false);
    });

    it('should return 403 for non-admin user', async () => {
      const regularUser = buildTestUser();
      await registerUser(app, regularUser);
      const loginRes = await loginUser(app, regularUser.email, regularUser.password);

      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.ok).toBe(false);

      await cleanupUserByEmail(regularUser.email);
    });

    it('should delete user successfully for admin', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body).toHaveProperty('message', 'User deleted');
    });

    it('should return 404 when trying to delete non-existent user', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .delete(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.ok).toBe(false);
    });
  });
});
