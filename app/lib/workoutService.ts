const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

export interface WorkoutData {
  workoutName: string;
  description?: string;
  estimatedDuration: number; // in minutes
  caloriesBurned: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Very Hard";
}

export interface WorkoutResponse {
  message: string;
  data: any;
}

const buildHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseError = async (response: Response, fallbackMessage: string) => {
  const body = await response.json().catch(() => null as any);
  throw new Error(body?.message || fallbackMessage);
};

export const workoutService = {
  // Start a new workout
  startWorkout: async (workoutData: WorkoutData, token: string): Promise<WorkoutResponse> => {
    const response = await fetch(`${API_BASE}/workout/start`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
      await parseError(response, "Failed to start workout");
    }

    return response.json();
  },

  // End/complete a workout
  endWorkout: async (
    workoutId: string,
    data: {
      actualDuration?: number;
      actualCalories?: number;
      notes?: string;
    },
    token: string
  ): Promise<WorkoutResponse> => {
    const response = await fetch(`${API_BASE}/workout/${workoutId}/end`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await parseError(response, "Failed to end workout");
    }

    return response.json();
  },

  // Get workout history/reports
  getWorkoutHistory: async (
    filters?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      skip?: number;
    },
    token?: string
  ): Promise<WorkoutResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.skip) params.append("skip", filters.skip.toString());
    }

    const response = await fetch(`${API_BASE}/workout/history?${params.toString()}`, {
      method: "GET",
      headers: buildHeaders(token),
    });

    if (!response.ok) {
      await parseError(response, "Failed to fetch workout history");
    }

    return response.json();
  },

  // Get workout statistics
  getWorkoutStats: async (token: string): Promise<WorkoutResponse> => {
    const response = await fetch(`${API_BASE}/workout/stats`, {
      method: "GET",
      headers: buildHeaders(token),
    });

    if (!response.ok) {
      await parseError(response, "Failed to fetch workout stats");
    }

    return response.json();
  },

  // Delete a workout
  deleteWorkout: async (workoutId: string, token: string): Promise<WorkoutResponse> => {
    const response = await fetch(`${API_BASE}/workout/${workoutId}`, {
      method: "DELETE",
      headers: buildHeaders(token),
    });

    if (!response.ok) {
      await parseError(response, "Failed to delete workout");
    }

    return response.json();
  },

  // Get today's progress (completed workouts)
  getTodayProgress: async (token: string): Promise<WorkoutResponse> => {
    const response = await fetch(`${API_BASE}/workout/today`, {
      method: "GET",
      headers: buildHeaders(token),
    });

    if (!response.ok) {
      await parseError(response, "Failed to fetch today's progress");
    }

    return response.json();
  },
};
