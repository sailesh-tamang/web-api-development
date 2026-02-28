export interface WorkoutStep {
  title: string;
  duration?: string;
  details: string[];
}

export interface WorkoutData {
  name: string;
  duration: string;
  difficulty: string;
  calories: string;
  steps: WorkoutStep[];
}

export const workoutDetailsData: Record<string, WorkoutData> = {
  "Morning Run": {
    name: "Morning Run",
    duration: "32 min",
    difficulty: "Moderate",
    calories: "285 kcal",
    steps: [
      {
        title: "Warm-up",
        duration: "3–5 min",
        details: [
          "Light jog or brisk walk",
          "Dynamic stretches (leg swings, arm circles)",
          "Gradually increase pace",
        ],
      },
      {
        title: "Main Run",
        duration: "20–22 min",
        details: [
          "Steady 5K pace",
          'Audio cues every few minutes: "Maintain breathing rhythm"',
          '"You\'re halfway there"',
          "Pace + distance tracker on screen",
        ],
      },
      {
        title: "Cool Down",
        duration: "5 min",
        details: [
          "Slow jog → walk",
          "Light calf & hamstring stretch",
        ],
      },
      {
        title: "Summary Screen",
        details: [
          "Distance covered",
          "Time",
          "Calories burned",
          "Option to save/share workout",
        ],
      },
    ],
  },
  "Strength Training": {
    name: "Strength Training",
    duration: "48 min",
    difficulty: "Hard",
    calories: "420 kcal",
    steps: [
      {
        title: "Warm-up",
        duration: "5–8 min",
        details: [
          "Bodyweight squats",
          "Push-ups",
          "Shoulder mobility drills",
        ],
      },
      {
        title: "Main Workout",
        duration: "35 min",
        details: [
          "Full-body compound movements",
          "Squats – 3 sets",
          "Deadlifts – 3 sets",
          "Bench Press – 3 sets",
          "Rows – 3 sets",
          "Lunges – 3 sets",
          "Timer for sets/rest",
          "Rep counter",
          "Demo video of each movement",
          "Rest countdown (60–90 sec)",
        ],
      },
      {
        title: "Cool Down",
        duration: "5 min",
        details: [
          "Stretch legs, chest, shoulders",
        ],
      },
      {
        title: "Progress Tracking",
        details: [
          "Log weights used",
          "Track strength improvement",
        ],
      },
    ],
  },
  "Yoga Flow": {
    name: "Yoga Flow",
    duration: "45 min",
    difficulty: "Easy",
    calories: "180 kcal",
    steps: [
      {
        title: "Breathing Session",
        duration: "5 min",
        details: [
          "Guided inhale/exhale",
          "Relaxation focus",
        ],
      },
      {
        title: "Vinyasa Flow",
        duration: "30 min",
        details: [
          "Sun Salutations",
          "Warrior poses",
          "Balance poses",
          "Gentle transitions",
          "Calm background music",
          "Pose timer",
          "Instructor guidance",
        ],
      },
      {
        title: "Cool Down & Savasana",
        duration: "10 min",
        details: [
          "Deep stretches",
          "Final relaxation",
        ],
      },
      {
        title: "Mindfulness Summary",
        details: [
          "Duration",
          "Mood check-in",
        ],
      },
    ],
  },
  "HIIT Cardio": {
    name: "HIIT Cardio",
    duration: "25 min",
    difficulty: "Very Hard",
    calories: "380 kcal",
    steps: [
      {
        title: "Quick Warm-up",
        duration: "3–4 min",
        details: [
          "Jumping jacks",
          "High knees",
          "Arm swings",
        ],
      },
      {
        title: "Intervals",
        duration: "18–20 min",
        details: [
          "30 sec Burpees / 30 sec Rest",
          "30 sec Mountain Climbers / 30 sec Rest",
          "30 sec Jump Squats / 30 sec Rest",
          "Repeat 4–5 rounds",
          "Big countdown timer",
          '"Work" / "Rest" indicator',
          "Sound alerts for transitions",
        ],
      },
      {
        title: "Cooldown",
        duration: "3–5 min",
        details: [
          "Walk in place",
          "Full body stretch",
        ],
      },
      {
        title: "Performance Summary",
        details: [
          "Calories burned",
          "Rounds completed",
          "Heart rate zone (if connected)",
        ],
      },
    ],
  },
};
