"use client";

import { useEffect, useRef, useState } from "react";
import WalkingTracker from "./WalkingTracker";
import WorkoutDetailsModal from "./WorkoutDetailsModal";
import StartWorkoutModal from "./StartWorkoutModal";
import WorkoutReportsModal from "./WorkoutReportsModal";
import { workoutDetailsData } from "./workoutData";
import { mealPlanData } from "../meal/mealPlanData";
import { workoutService } from "@/app/lib/workoutService";

const images = {
  hero: "https://i.pinimg.com/736x/a0/1d/6e/a01d6eb20afe2f8e9aed9e32ac861bbc.jpg",
  workout1: "https://share.google/vjCK3exR267EgbrHG",
  workout2: "https://images.pexels.com/photos/4498318/pexels-photo-4498318.jpeg?w=1200&h=800&fit=crop",
  workout3: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?w=1200&h=800&fit=crop",
  workout4: "https://images.pexels.com/photos/3407857/pexels-photo-3407857.jpeg?w=1200&h=800&fit=crop",
  meal: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=1200&h=800&fit=crop",
  lifestyle: "https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?w=1200&h=800&fit=crop",
};

// Workouts Data
const workouts = [
  {
    name: "Morning Run",
    duration: "32 min",
    difficulty: "Moderate",
    description: "5K outdoor run with warm-up and cool-down",
    image: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    burned: "285 kcal",
  },
  {
    name: "Strength Training",
    duration: "48 min",
    difficulty: "Hard",
    description: "Full-body workout focusing on compound movements",
    image: "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1200",
    burned: "420 kcal",
  },
  {
    name: "Yoga Flow",
    duration: "45 min",
    difficulty: "Easy",
    description: "Relaxing vinyasa flow to improve flexibility",
    image: images.workout3,
    burned: "180 kcal",
  },
  {
    name: "HIIT Cardio",
    duration: "25 min",
    difficulty: "Very Hard",
    description: "High-intensity interval training session",
    image: images.workout4,
    burned: "380 kcal",
  },
];

// Meal Plan Data
const meals = [
  {
    name: "Breakfast",
    items: "Oats, Berries, Almonds",
    macros: { protein: 12, carbs: 45, fat: 8 },
    calories: 320,
    image: "https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Lunch",
    items: "Grilled Chicken, Quinoa, Veggies",
    macros: { protein: 38, carbs: 52, fat: 12 },
    calories: 580,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Dinner",
    items: "Salmon, Sweet Potato, Broccoli",
    macros: { protein: 35, carbs: 48, fat: 14 },
    calories: 620,
    image: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

// Tips Data
const tips = [
  "Stay hydrated: Drink at least 8 glasses of water daily for optimal performance.",
  "Warm-up properly: 5-10 minutes of light cardio before intense workouts reduces injury risk.",
  "Track your meals: Consistent food logging helps identify patterns and adjust your diet.",
  "Rest days matter: Include at least 2 rest days per week for muscle recovery.",
  "Progressive overload: Gradually increase intensity to steadily improve your fitness.",
];

// Achievements Data
const achievements = [
  { badge: "🔥", label: "7-Day Streak", status: "active" },
  { badge: "⭐", label: "1000 Steps Master", status: "completed" },
  { badge: "🥇", label: "Workout Warrior", status: "active" },
  { badge: "💪", label: "Strength Champion", status: "soon" },
];

export default function Dashboard() {
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedMealDay, setSelectedMealDay] = useState(0);
  const [isStartWorkoutModalOpen, setIsStartWorkoutModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [todayProgress, setTodayProgress] = useState<any>(null);

  useEffect(() => {
    const targetOffset = (3 - (7200 / 10000)) * 226; // 226 is circumference
    setStrokeDashoffset(targetOffset);
  }, []);

  // Fetch today's progress
  useEffect(() => {
    const fetchTodayProgress = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (token) {
          const response = await workoutService.getTodayProgress(token);
          setTodayProgress(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch today's progress:", error);
      }
    };

    fetchTodayProgress();
  }, [reportsRefreshKey]); // Refresh when workouts are completed

  // Dynamic Quick Stats based on real data
  const quickStats = [
    { 
      label: "Workouts Today", 
      value: todayProgress?.totalWorkouts?.toString() || "0", 
      trend: "↑", 
      change: "+0%", 
      color: "from-emerald-500/20 to-emerald-600/20" 
    },
    { 
      label: "Distance", 
      value: `${todayProgress?.totalDistance || 0} km`, 
      trend: "↑", 
      change: "+0%", 
      color: "from-blue-500/20 to-blue-600/20" 
    },
    { 
      label: "Calories Burned", 
      value: `${todayProgress?.totalCalories || 0} kcal`, 
      trend: "↑", 
      change: "+0%", 
      color: "from-orange-500/20 to-orange-600/20" 
    },
    { 
      label: "Active Minutes", 
      value: `${todayProgress?.totalDuration || 0} min`, 
      trend: "↑", 
      change: "+0%", 
      color: "from-purple-500/20 to-purple-600/20" 
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-black to-black">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-90" />
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">
                  Fitness Tracking
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] to-green-400">
                    Dashboard
                  </span>
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                  Track your daily progress, achieve your fitness goals, and build sustainable healthy habits with real-time insights.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsStartWorkoutModalOpen(true)}
                  className="px-8 py-3 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 shadow-lg hover:shadow-green-500/50"
                >
                  Start Workout
                </button>
                <button 
                  onClick={() => setIsReportsModalOpen(true)}
                  className="px-8 py-3 border-2 border-[#A3E635] text-[#A3E635] font-semibold rounded-full hover:bg-[#A3E635]/10 transition-colors duration-200"
                >
                  View Reports
                </button>
              </div>

              {/* Mini Highlight Chips */}
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white backdrop-blur-sm">
                  ✓ Live Step Tracking
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white backdrop-blur-sm">
                  ✓ Meal Insights
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white backdrop-blur-sm">
                  ✓ Weekly Goals
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A3E635]/20 to-transparent z-20 rounded-3xl" />
              <img
                src={images.hero}
                alt="Fitness Dashboard Hero"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== QUICK STATS SECTION ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Your Progress Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 space-y-4">
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${stat.trend === "↑" ? "text-green-400" : "text-red-400"}`}>
                        {stat.trend}
                      </span>
                      <span className={`text-sm font-medium ${stat.trend === "↑" ? "text-green-400" : "text-red-400"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WALKING TRACKER CARD ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Daily Activity Tracker</h2>
          <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
            <WalkingTracker />
          </div>
        </div>
      </section>

      {/* ===================== WORKOUTS SECTION ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Recommended Workouts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workouts.map((workout, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
              >
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur text-xs font-bold text-[#A3E635] rounded-full">
                    {workout.difficulty}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{workout.duration}</p>
                    <p className="text-xs text-gray-500 mt-2">{workout.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{workout.burned}</span>
                    <button 
                      onClick={() => setSelectedWorkout(workout.name)}
                      className="px-4 py-2 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 text-xs">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROGRESS SECTION ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Your Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Steps Chart */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <h3 className="text-xl font-bold text-white mb-6">Weekly Steps</h3>
              <div className="space-y-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                  const maxSteps = 12000;
                  const steps = [8200, 10500, 7800, 11200, 9400, 6800, 8432][idx];
                  const percentage = (steps / maxSteps) * 100;
                  return (
                    <div key={day} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">{day}</span>
                        <span className="text-sm text-[#A3E635] font-semibold">{steps.toLocaleString()} steps</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A3E635] to-green-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calories by Day */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <h3 className="text-xl font-bold text-white mb-6">Calories Burned (This Week)</h3>
              <div className="flex items-end justify-around h-64 gap-3">
                {[
                  { day: "Mon", calories: 520 },
                  { day: "Tue", calories: 680 },
                  { day: "Wed", calories: 450 },
                  { day: "Thu", calories: 750 },
                  { day: "Fri", calories: 620 },
                  { day: "Sat", calories: 380 },
                  { day: "Sun", calories: 524 },
                ].map((item) => {
                  const percentage = (item.calories / 800) * 100;
                  return (
                    <div key={item.day} className="flex flex-col items-center flex-1">
                      <div className="w-full bg-white/10 rounded-t-lg overflow-hidden relative group">
                        <div
                          className="w-full bg-gradient-to-t from-[#A3E635] to-green-400 transition-all duration-500 hover:from-green-400 hover:to-green-300"
                          style={{ height: `${percentage}%`, minHeight: "4px" }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-xs text-[#A3E635] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {item.calories} kcal
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-3">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MEAL PLAN SECTION ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="space-y-8">
            {/* Header with Day Selector */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Today's Meal Plan</h2>
              <p className="text-gray-400">
                {mealPlanData[selectedMealDay].day} - {mealPlanData[selectedMealDay].theme}
              </p>
              
              {/* Day Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {mealPlanData.map((dayPlan, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMealDay(idx)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      idx === selectedMealDay
                        ? 'bg-[#A3E635] text-black shadow-lg shadow-[#A3E635]/50'
                        : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {dayPlan.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Breakfast */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  <img
                    src={mealPlanData[selectedMealDay].meals.breakfast.image}
                    alt="Breakfast"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Breakfast</h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-400">{mealPlanData[selectedMealDay].meals.breakfast.items}</p>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Protein</p>
                      <p className="text-sm font-bold text-[#A3E635]">{mealPlanData[selectedMealDay].meals.breakfast.macros.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Carbs</p>
                      <p className="text-sm font-bold text-blue-400">{mealPlanData[selectedMealDay].meals.breakfast.macros.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Fat</p>
                      <p className="text-sm font-bold text-orange-400">{mealPlanData[selectedMealDay].meals.breakfast.macros.fat}g</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{mealPlanData[selectedMealDay].meals.breakfast.calories} kcal</span>
                    <button className="px-4 py-2 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 text-xs">
                      View Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Lunch */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  <img
                    src={mealPlanData[selectedMealDay].meals.lunch.image}
                    alt="Lunch"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Lunch</h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-400">{mealPlanData[selectedMealDay].meals.lunch.items}</p>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Protein</p>
                      <p className="text-sm font-bold text-[#A3E635]">{mealPlanData[selectedMealDay].meals.lunch.macros.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Carbs</p>
                      <p className="text-sm font-bold text-blue-400">{mealPlanData[selectedMealDay].meals.lunch.macros.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Fat</p>
                      <p className="text-sm font-bold text-orange-400">{mealPlanData[selectedMealDay].meals.lunch.macros.fat}g</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{mealPlanData[selectedMealDay].meals.lunch.calories} kcal</span>
                    <button className="px-4 py-2 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 text-xs">
                      View Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Dinner */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  <img
                    src={mealPlanData[selectedMealDay].meals.dinner.image}
                    alt="Dinner"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Dinner</h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-400">{mealPlanData[selectedMealDay].meals.dinner.items}</p>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Protein</p>
                      <p className="text-sm font-bold text-[#A3E635]">{mealPlanData[selectedMealDay].meals.dinner.macros.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Carbs</p>
                      <p className="text-sm font-bold text-blue-400">{mealPlanData[selectedMealDay].meals.dinner.macros.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Fat</p>
                      <p className="text-sm font-bold text-orange-400">{mealPlanData[selectedMealDay].meals.dinner.macros.fat}g</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{mealPlanData[selectedMealDay].meals.dinner.calories} kcal</span>
                    <button className="px-4 py-2 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 text-xs">
                      View Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-6 hover:border-white/20 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4">Daily Totals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Calories</p>
                  <p className="text-2xl font-bold text-[#A3E635]">
                    {mealPlanData[selectedMealDay].meals.breakfast.calories +
                      mealPlanData[selectedMealDay].meals.lunch.calories +
                      mealPlanData[selectedMealDay].meals.dinner.calories}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Protein</p>
                  <p className="text-2xl font-bold text-[#A3E635]">
                    {mealPlanData[selectedMealDay].meals.breakfast.macros.protein +
                      mealPlanData[selectedMealDay].meals.lunch.macros.protein +
                      mealPlanData[selectedMealDay].meals.dinner.macros.protein}g
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Carbs</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {mealPlanData[selectedMealDay].meals.breakfast.macros.carbs +
                      mealPlanData[selectedMealDay].meals.lunch.macros.carbs +
                      mealPlanData[selectedMealDay].meals.dinner.macros.carbs}g
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Fat</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {mealPlanData[selectedMealDay].meals.breakfast.macros.fat +
                      mealPlanData[selectedMealDay].meals.lunch.macros.fat +
                      mealPlanData[selectedMealDay].meals.dinner.macros.fat}g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TIPS & ACHIEVEMENTS SECTION ===================== */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Tips & Achievements</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tips - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <h3 className="text-2xl font-bold text-white mb-6">Daily Tips for Success</h3>
              <div className="space_y-4">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-white/10 last:border-b-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#A3E635]">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed pt-0.5">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      achievement.status === "active"
                        ? "bg-[#A3E635]/10 border-[#A3E635]/30 hover:border-[#A3E635]/50"
                        : achievement.status === "completed"
                        ? "bg-white/5 border-white/10"
                        : "bg-white/5 border-white/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.badge}</span>
                      <div>
                        <p className="font-semibold text-white text-sm">{achievement.label}</p>
                        <p className="text-xs text-gray-400">
                          {achievement.status === "active"
                            ? "In Progress"
                            : achievement.status === "completed"
                            ? "Completed"
                            : "Coming Soon"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WORKOUT MODAL ===================== */}
      {selectedWorkout && workoutDetailsData[selectedWorkout] && (
        <WorkoutDetailsModal
          {...workoutDetailsData[selectedWorkout]}
          onClose={() => setSelectedWorkout(null)}
        />
      )}

      {/* Start Workout Modal */}
      <StartWorkoutModal
        isOpen={isStartWorkoutModalOpen}
        onClose={() => setIsStartWorkoutModalOpen(false)}
        onWorkoutStarted={() => {
          setReportsRefreshKey((prev) => prev + 1);
        }}
      />

      {/* Workout Reports Modal */}
      <WorkoutReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        refreshKey={reportsRefreshKey}
        onWorkoutCompleted={() => setReportsRefreshKey((prev) => prev + 1)}
      />

    </div>
  );
}
