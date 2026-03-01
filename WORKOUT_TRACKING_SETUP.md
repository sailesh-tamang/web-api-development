# Workout Tracking System Setup Guide

## Overview
Your fitness app now has a complete workout tracking system that stores data in MongoDB. The "Start Workout" and "View Reports" buttons are fully functional.

## What's Been Set Up

### Backend (Node.js/Express)

#### 1. **Workout Model** (`backend/src/modules/workout/workout.model.ts`)
Stores workout data in MongoDB with fields:
- `userId`: Reference to the user
- `workoutName`: Name of the workout
- `description`: Workout details
- `duration`: Time in minutes
- `caloriesBurned`: Estimated calories burned
- `difficulty`: Easy/Moderate/Hard/Very Hard
- `startTime`: When workout started
- `endTime`: When workout ended
- `status`: in-progress/completed/cancelled
- `notes`: Additional notes

#### 2. **Workout Controller** (`backend/src/modules/workout/workout.controller.ts`)
Provides API endpoints:
- `POST /api/workout/start` - Create a new workout session
- `PUT /api/workout/:workoutId/end` - Complete a workout
- `GET /api/workout/history` - Get workout history with filters
- `GET /api/workout/stats` - Get user statistics (total workouts, calories, duration)
- `DELETE /api/workout/:workoutId` - Delete a workout

#### 3. **Workout Routes** (`backend/src/modules/workout/workout.route.ts`)
Registers all the endpoints

#### 4. **Updated App** (`backend/src/app.ts`)
Routes are registered in the Express app

### Frontend (Next.js/React)

#### 1. **Workout Service** (`app/lib/workoutService.ts`)
Helper functions to call the backend APIs:
- `startWorkout()` - Initiate a new workout
- `endWorkout()` - Complete and save a workout
- `getWorkoutHistory()` - Fetch user's workout history
- `getWorkoutStats()` - Get statistics
- `deleteWorkout()` - Remove a workout

#### 2. **Start Workout Modal** (`app/component/dashboard/StartWorkoutModal.tsx`)
- Predefined workout templates (Morning Run, Strength Training, Yoga, HIIT, Swimming)
- Custom workout creation
- Real-time duration and calories input

#### 3. **Workout Reports Modal** (`app/component/dashboard/WorkoutReportsModal.tsx`)
- Display stats (total workouts, duration, calories, completed count)
- Show recent workout history
- Filter by date range capability

#### 4. **Updated Dashboard** (`app/component/dashboard/Dashboard.tsx`)
- Buttons now trigger modals
- Manages modal states

## How to Use

### 1. **For Users - Start a Workout**
1. Click "Start Workout" button on dashboard
2. Either:
   - Select from 5 preset workouts (Morning Run, Strength Training, Yoga Flow, HIIT Cardio, Swimming)
   - Create a custom workout with your own details
3. Click "Start Workout" - session is saved to MongoDB
4. The app tracks when it started

### 2. **For Users - View Reports**
1. Click "View Reports" button
2. See statistics:
   - Total workouts completed
   - Total time spent working out
   - Total calories burned
   - Number of completed sessions
3. Browse recent workouts with dates, durations, and difficulty

### 3. **For Developers - Next Steps**

#### Add Authentication Middleware
You'll need to add authentication to protect these routes. Update `workout.route.ts`:

```typescript
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware); // Add this line

// Then your routes...
```

#### Create an Auth Middleware (if you don't have one)
Create `backend/src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

#### Store Auth Token on Frontend
In your login/auth service, store the token:

```typescript
// After successful login
localStorage.setItem("token", response.data.token);
```

The `StartWorkoutModal` and `WorkoutReportsModal` already retrieve the token from localStorage.

#### Add Real-time Tracking (Optional)
Create a "Workout In Progress" page to track active workouts:

```typescript
// app/workout/active/page.tsx
// Show a timer, distance/calories tracker, and "End Workout" button
// Call endWorkout API when user stops

const handleEndWorkout = async () => {
  await workoutService.endWorkout(activeWorkoutId, {
    actualDuration: elapsedTime,
    actualCalories: calculatedCalories,
    notes: userNotes,
  }, token);
};
```

## Environment Variables

Make sure your frontend has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## MongoDB Collections

After using the system, you'll have a `workouts` collection with documents like:

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "workoutName": "Morning Run",
  "description": "5K outdoor run",
  "duration": 32,
  "caloriesBurned": 285,
  "difficulty": "Moderate",
  "startTime": ISODate("2024-01-15T06:30:00Z"),
  "endTime": null,
  "status": "in-progress",
  "notes": "",
  "createdAt": ISODate("2024-01-15T06:30:00Z"),
  "updatedAt": ISODate("2024-01-15T06:30:00Z")
}
```

## Testing the APIs

Using Thunder Client or Postman:

**1. Start Workout**
```
POST http://localhost:5000/api/workout/start
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "workoutName": "Morning Run",
  "description": "5K outdoor run",
  "estimatedDuration": 32,
  "caloriesBurned": 285,
  "difficulty": "Moderate"
}
```

**2. Get Workout History**
```
GET http://localhost:5000/api/workout/history?limit=10&skip=0
Authorization: Bearer <your-token>
```

**3. Get Statistics**
```
GET http://localhost:5000/api/workout/stats
Authorization: Bearer <your-token>
```

**4. End Workout**
```
PUT http://localhost:5000/api/workout/:workoutId/end
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "actualDuration": 32,
  "actualCalories": 290,
  "notes": "Good session!"
}
```

## Future Enhancements

1. **Live Tracking During Workout**
   - GPS integration for running/cycling
   - Real-time heart rate monitoring
   - Step counter integration

2. **Advanced Analytics**
   - Weekly/monthly reports
   - Charts and graphs
   - Personal bests and records
   - Workout calendar

3. **Social Features**
   - Share workouts with friends
   - Challenge other users
   - Leaderboards

4. **Integrations**
   - Sync with Fitbit/Apple Watch
   - Google Fit integration
   - Wearable device sync

## Troubleshooting

**Issue: 401 Unauthorized on API calls**
- Make sure you have a valid JWT token in localStorage
- Ensure auth middleware is checking the correct token format

**Issue: MongoDB connection error**
- Verify MONGO_URI environment variable
- Check MongoDB is running
- Ensure network access is allowed

**Issue: Modal doesn't appear**
- Check browser console for errors
- Verify StartWorkoutModal and WorkoutReportsModal are imported in Dashboard.tsx
- Ensure modal state is being set correctly

## Questions?

The system uses:
- **Backend**: Express, MongoDB, TypeScript
- **Frontend**: Next.js, React, TypeScript
- **Authentication**: JWT (you need to implement)
- **Storage**: MongoDB

Good luck building! 🚀
