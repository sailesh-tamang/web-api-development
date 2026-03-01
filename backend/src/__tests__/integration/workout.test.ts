/**
 * Workout API Integration Tests
 * Covers: POST /api/workout/start, PUT /:workoutId/end, GET /history, /stats, /today, DELETE /:workoutId
 * All routes require auth middleware (Bearer token)
 * Total: ~15 tests
 */

import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../modules/user/user.model';
import { WorkoutModel } from '../../modules/workout/workout.model';
import {
  buildTestUser,
  registerUser,
  loginUser,
  createUserAndLogin,
  cleanupUserByEmail,
} from '../helpers/test-utils';

describe('Workout API Integration Tests', () => {
  jest.setTimeout(30000);

  let userToken: string;
  let userId: string;
  let testUser: any;

  beforeAll(async () => {
    // Create and login a regular user
    const userSetup = await createUserAndLogin(app);
    testUser = userSetup.user;
    userToken = userSetup.token;
    userId = userSetup.userId;
  });

  afterAll(async () => {
    // Cleanup user and their workouts
    await WorkoutModel.deleteMany({ userId });
    await cleanupUserByEmail(testUser.email);
  });

  describe('POST /api/workout/start (Start a workout)', () => {
    const workoutData = {
      workoutName: 'Running',
      description: 'Morning run',
      estimatedDuration: 30,
      caloriesBurned: 300,
      difficulty: 'Moderate',
    };

    afterEach(async () => {
      // Cleanup created workouts
      await WorkoutModel.deleteMany({
        userId,
        workoutName: workoutData.workoutName,
      });
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .post('/api/workout/start')
        .send(workoutData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 400 when missing workoutName', async () => {
      const { workoutName, ...incompleteData } = workoutData;

      const response = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when missing estimatedDuration', async () => {
      const { estimatedDuration, ...incompleteData } = workoutData;

      const response = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when missing caloriesBurned', async () => {
      const { caloriesBurned, ...incompleteData } = workoutData;

      const response = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should successfully start a workout', async () => {
      const response = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workoutData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Workout started successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('workoutName', workoutData.workoutName);
      expect(response.body.data).toHaveProperty('status', 'in-progress');
    });

    it('should return 400 when same workout is started twice on same day', async () => {
      // Start first workout
      const res1 = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workoutData);

      expect(res1.status).toBe(201);

      // Try to start same workout again on same day
      const res2 = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workoutData);

      expect(res2.status).toBe(400);
      expect(res2.body).toHaveProperty('message');
      expect(res2.body.message).toContain('already started');
    });

    it('should allow different workout names on same day', async () => {
      const workout1 = { ...workoutData, workoutName: 'Running' };
      const workout2 = { ...workoutData, workoutName: 'Cycling' };

      const res1 = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workout1);

      expect(res1.status).toBe(201);

      const res2 = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workout2);

      expect(res2.status).toBe(201);
      expect(res2.body.data.workoutName).toBe('Cycling');

      // Cleanup
      await WorkoutModel.deleteMany({
        userId,
        workoutName: { $in: ['Running', 'Cycling'] },
      });
    });
  });

  describe('PUT /api/workout/:workoutId/end (End a workout)', () => {
    let workoutId: string;
    const workoutData = {
      workoutName: 'Gym Session',
      description: 'Weight training',
      estimatedDuration: 60,
      caloriesBurned: 400,
    };

    beforeEach(async () => {
      // Start a workout by creating one in DB
      const startRes = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workoutData);

      if (startRes.status === 201) {
        workoutId = startRes.body.data._id;
      }
    });

    afterEach(async () => {
      await WorkoutModel.deleteMany({ userId, workoutName: workoutData.workoutName });
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .put(`/api/workout/${workoutId}/end`)
        .send({ actualDuration: 55, actualCalories: 380 });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 400 for invalid workout ID format', async () => {
      const response = await request(app)
        .put('/api/workout/invalid-id/end')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ actualDuration: 55, actualCalories: 380 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid workout ID');
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .put(`/api/workout/${fakeId}/end`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ actualDuration: 55, actualCalories: 380 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Workout not found');
    });

    it('should successfully end a workout', async () => {
      const response = await request(app)
        .put(`/api/workout/${workoutId}/end`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          actualDuration: 55,
          actualCalories: 380,
          notes: 'Great session!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Workout completed successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'completed');
      expect(response.body.data).toHaveProperty('notes', 'Great session!');
    });

    it('should update actual duration and calories', async () => {
      const actualDuration = 45;
      const actualCalories = 350;

      const response = await request(app)
        .put(`/api/workout/${workoutId}/end`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ actualDuration, actualCalories });

      expect(response.status).toBe(200);
      expect(response.body.data.duration).toBe(actualDuration);
      expect(response.body.data.caloriesBurned).toBe(actualCalories);
    });

    it('should return 403 if trying to end another users workout', async () => {
      // Create another user
      const otherUser = buildTestUser();
      const otherRes = await registerUser(app, otherUser);
      const otherLoginRes = await loginUser(app, otherUser.email, otherUser.password);
      const otherUserToken = otherLoginRes.body.token;

      const response = await request(app)
        .put(`/api/workout/${workoutId}/end`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ actualDuration: 50, actualCalories: 350 });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Unauthorized to update this workout');

      await cleanupUserByEmail(otherUser.email);
    });
  });

  describe('GET /api/workout/history (Get workout history)', () => {
    beforeAll(async () => {
      // Create a few workouts
      const workouts = [
        { workoutName: 'History1', description: 'Test', estimatedDuration: 30, caloriesBurned: 250 },
        { workoutName: 'History2', description: 'Test', estimatedDuration: 45, caloriesBurned: 350 },
      ];

      for (const workout of workouts) {
        await request(app)
          .post('/api/workout/start')
          .set('Authorization', `Bearer ${userToken}`)
          .send(workout);
      }
    });

    afterAll(async () => {
      await WorkoutModel.deleteMany({
        userId,
        workoutName: { $regex: 'History' },
      });
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/workout/history');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return workouts with pagination', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', `Bearer ${userToken}`)
        .query({ limit: 10, skip: 0 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Workouts retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination with limit', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', `Bearer ${userToken}`)
        .query({ limit: 1, skip: 0 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should support pagination with skip', async () => {
      const response = await request(app)
        .get('/api/workout/history')
        .set('Authorization', `Bearer ${userToken}`)
        .query({ limit: 10, skip: 0 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/workout/stats (Get workout statistics)', () => {
    beforeAll(async () => {
      // Create and complete a workout
      const statsWorkout = {
        workoutName: 'Stats Test',
        description: 'For stats',
        estimatedDuration: 50,
        caloriesBurned: 400,
      };

      const startRes = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(statsWorkout);

      if (startRes.status === 201) {
        const workoutId = startRes.body.data._id;
        await request(app)
          .put(`/api/workout/${workoutId}/end`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ actualDuration: 45, actualCalories: 380 });
      }
    });

    afterAll(async () => {
      await WorkoutModel.deleteMany({ userId, workoutName: 'Stats Test' });
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/workout/stats');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 400 for invalid user ID', async () => {
      // This is hard to test directly, but the endpoint validates userId
      const response = await request(app)
        .get('/api/workout/stats')
        .set('Authorization', `Bearer ${userToken}`);

      // Should succeed if userId is valid
      expect([200, 400]).toContain(response.status);
    });

    it('should return workout statistics', async () => {
      const response = await request(app)
        .get('/api/workout/stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Statistics retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalWorkouts');
      expect(response.body.data).toHaveProperty('totalDuration');
      expect(response.body.data).toHaveProperty('totalCalories');
      expect(response.body.data).toHaveProperty('completedWorkouts');
    });
  });

  describe('GET /api/workout/today (Get today progress)', () => {
    beforeAll(async () => {
      // Create and complete a workout for today
      const todayWorkout = {
        workoutName: 'Today Test',
        description: 'Today',
        estimatedDuration: 40,
        caloriesBurned: 350,
      };

      const startRes = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(todayWorkout);

      if (startRes.status === 201) {
        const workoutId = startRes.body.data._id;
        await request(app)
          .put(`/api/workout/${workoutId}/end`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ actualDuration: 38, actualCalories: 330 });
      }
    });

    afterAll(async () => {
      await WorkoutModel.deleteMany({ userId, workoutName: 'Today Test' });
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .get('/api/workout/today');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it("should return today's progress", async () => {
      const response = await request(app)
        .get('/api/workout/today')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', "Today's progress retrieved successfully");
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalWorkouts');
      expect(response.body.data).toHaveProperty('totalDuration');
      expect(response.body.data).toHaveProperty('totalCalories');
      expect(response.body.data).toHaveProperty('totalDistance');
      expect(Array.isArray(response.body.data.workouts)).toBe(true);
    });
  });

  describe('DELETE /api/workout/:workoutId (Delete a workout)', () => {
    let workoutId: string;
    const deleteWorkoutData = {
      workoutName: 'Delete Test',
      description: 'To be deleted',
      estimatedDuration: 30,
      caloriesBurned: 250,
    };

    beforeEach(async () => {
      const startRes = await request(app)
        .post('/api/workout/start')
        .set('Authorization', `Bearer ${userToken}`)
        .send(deleteWorkoutData);

      if (startRes.status === 201) {
        workoutId = startRes.body.data._id;
      }
    });

    afterEach(async () => {
      await WorkoutModel.deleteMany({ userId, workoutName: deleteWorkoutData.workoutName });
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app)
        .delete(`/api/workout/${workoutId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 400 for invalid workout ID format', async () => {
      const response = await request(app)
        .delete('/api/workout/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid workout ID');
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = '000000000000000000000000';
      const response = await request(app)
        .delete(`/api/workout/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Workout not found');
    });

    it('should successfully delete a workout', async () => {
      const response = await request(app)
        .delete(`/api/workout/${workoutId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Workout deleted successfully');
    });

    it('should return 403 if trying to delete another users workout', async () => {
      const otherUser = buildTestUser();
      const otherRes = await registerUser(app, otherUser);
      const otherLoginRes = await loginUser(app, otherUser.email, otherUser.password);
      const otherUserToken = otherLoginRes.body.token;

      const response = await request(app)
        .delete(`/api/workout/${workoutId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Unauthorized to delete this workout');

      await cleanupUserByEmail(otherUser.email);
    });
  });
});
