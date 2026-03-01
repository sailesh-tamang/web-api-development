'use client';

import { useState } from 'react';
import { mealPlanData } from './mealPlanData';

interface MealCardProps {
  mealType: string;
  item: {
    name: string;
    items: string;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    calories: number;
    image?: string;
  };
  onViewPlan: (mealType: string, item: any) => void;
}

function MealCard({ mealType, item, onViewPlan }: MealCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
        <img
          src={item.image}
          alt={mealType}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{mealType}</h3>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-400">{item.items}</p>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
          <div className="text-center">
            <p className="text-xs text-gray-400">Protein</p>
            <p className="text-sm font-bold text-[#A3E635]">{item.macros.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Carbs</p>
            <p className="text-sm font-bold text-blue-400">{item.macros.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Fat</p>
            <p className="text-sm font-bold text-orange-400">{item.macros.fat}g</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">{item.calories} kcal</span>
          <button 
            onClick={() => onViewPlan(mealType, item)}
            className="px-4 py-2 bg-[#A3E635] text-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200 text-xs">
            View Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// Meal Detail Modal Component
interface MealDetailModalProps {
  isOpen: boolean;
  mealType: string;
  item: {
    name: string;
    items: string;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    calories: number;
    image?: string;
  };
  onClose: () => void;
}

function MealDetailModal({ isOpen, mealType, item, onClose }: MealDetailModalProps) {
  if (!isOpen) return null;

  const proteinCalories = item.macros.protein * 4;
  const carbsCalories = item.macros.carbs * 4;
  const fatCalories = item.macros.fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-[#A3E635]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
          <img
            src={item.image}
            alt={mealType}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-white">{mealType}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-white text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Meal Description */}
          <div>
            <h3 className="text-xl font-semibold text-[#A3E635] mb-3">Ingredients</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{item.items}</p>
          </div>

          {/* Detailed Macros */}
          <div>
            <h3 className="text-xl font-semibold text-[#A3E635] mb-4">Nutritional Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Calories</p>
                <p className="text-3xl font-bold text-[#A3E635]">{item.calories}</p>
                <p className="text-xs text-gray-500 mt-2">kcal</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Protein</p>
                <p className="text-3xl font-bold text-[#A3E635]">{item.macros.protein}</p>
                <p className="text-xs text-gray-500 mt-2">grams (4 kcal/g)</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Carbs</p>
                <p className="text-3xl font-bold text-blue-400">{item.macros.carbs}</p>
                <p className="text-xs text-gray-500 mt-2">grams (4 kcal/g)</p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Fat</p>
                <p className="text-3xl font-bold text-orange-400">{item.macros.fat}</p>
                <p className="text-xs text-gray-500 mt-2">grams (9 kcal/g)</p>
              </div>
            </div>
          </div>

          {/* Macro Distribution Chart */}
          <div>
            <h3 className="text-xl font-semibold text-[#A3E635] mb-4">Macro Contribution</h3>
            <div className="space-y-4">
              {/* Protein Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Protein</span>
                  <span className="text-sm font-semibold text-[#A3E635]">{((proteinCalories / totalCalories) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#A3E635]" style={{ width: `${(proteinCalories / totalCalories) * 100}%` }} />
                </div>
              </div>
              {/* Carbs Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Carbs</span>
                  <span className="text-sm font-semibold text-blue-400">{((carbsCalories / totalCalories) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${(carbsCalories / totalCalories) * 100}%` }} />
                </div>
              </div>
              {/* Fat Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-300">Fat</span>
                  <span className="text-sm font-semibold text-orange-400">{((fatCalories / totalCalories) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: `${(fatCalories / totalCalories) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#A3E635] to-green-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#A3E635]/50 transition-all duration-200"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MealPlanDisplay() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<{ mealType: string; item: any } | null>(null);
  const selectedDay = mealPlanData[selectedDayIndex];

  const handleViewPlan = (mealType: string, item: any) => {
    setSelectedMeal({ mealType, item });
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-90" />
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      {/* Header Section */}
      <section className="relative px-4 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                7-Day Meal Plan
              </h1>
              <p className="text-gray-400 text-lg">
                Personalized nutrition to support your fitness goals
              </p>
            </div>

            {/* Day Selector */}
            <div className="flex flex-wrap gap-3">
              {mealPlanData.map((dayPlan, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                    idx === selectedDayIndex
                      ? 'bg-[#A3E635] text-black shadow-lg shadow-[#A3E635]/50'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {dayPlan.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Day Details Section */}
      <section className="relative px-4 py-12">
        <div className="mx-auto w-full max-w-6xl">
          {/* Day Theme Card */}
          <div className="mb-12 rounded-3xl bg-gradient-to-br from-[#A3E635]/10 to-white/5 border border-[#A3E635]/30 backdrop-blur-xl p-8 hover:border-[#A3E635]/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {selectedDay.day} - {selectedDay.theme}
                </h2>
                <p className="text-gray-400">
                  Daily calorie goal: ~{selectedDay.meals.breakfast.calories + selectedDay.meals.lunch.calories + selectedDay.meals.dinner.calories} kcal
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Protein</p>
                  <p className="text-2xl md:text-3xl font-bold text-[#A3E635]">
                    {selectedDay.meals.breakfast.macros.protein +
                      selectedDay.meals.lunch.macros.protein +
                      selectedDay.meals.dinner.macros.protein}
                    g
                  </p>
                </div>
                <div className="w-px h-16 bg-white/10" />
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Carbs</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-400">
                    {selectedDay.meals.breakfast.macros.carbs +
                      selectedDay.meals.lunch.macros.carbs +
                      selectedDay.meals.dinner.macros.carbs}
                    g
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <MealCard
              mealType="Breakfast"
              item={selectedDay.meals.breakfast}
              onViewPlan={handleViewPlan}
            />
            <MealCard
              mealType="Lunch"
              item={selectedDay.meals.lunch}
              onViewPlan={handleViewPlan}
            />
            <MealCard
              mealType="Dinner"
              item={selectedDay.meals.dinner}
              onViewPlan={handleViewPlan}
            />
          </div>

          {/* Nutrition Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
            <h3 className="text-2xl font-bold text-white mb-6">Daily Nutrition Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Calories */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Total Calories</p>
                <p className="text-3xl font-bold text-[#A3E635]">
                  {selectedDay.meals.breakfast.calories +
                    selectedDay.meals.lunch.calories +
                    selectedDay.meals.dinner.calories}
                </p>
                <p className="text-xs text-gray-500 mt-2">kcal</p>
              </div>

              {/* Total Protein */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Total Protein</p>
                <p className="text-3xl font-bold text-[#A3E635]">
                  {selectedDay.meals.breakfast.macros.protein +
                    selectedDay.meals.lunch.macros.protein +
                    selectedDay.meals.dinner.macros.protein}
                </p>
                <p className="text-xs text-gray-500 mt-2">grams</p>
              </div>

              {/* Total Carbs */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Total Carbs</p>
                <p className="text-3xl font-bold text-blue-400">
                  {selectedDay.meals.breakfast.macros.carbs +
                    selectedDay.meals.lunch.macros.carbs +
                    selectedDay.meals.dinner.macros.carbs}
                </p>
                <p className="text-xs text-gray-500 mt-2">grams</p>
              </div>

              {/* Total Fat */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Total Fat</p>
                <p className="text-3xl font-bold text-orange-400">
                  {selectedDay.meals.breakfast.macros.fat +
                    selectedDay.meals.lunch.macros.fat +
                    selectedDay.meals.dinner.macros.fat}
                </p>
                <p className="text-xs text-gray-500 mt-2">grams</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={() =>
                setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))
              }
              disabled={selectedDayIndex === 0}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Previous Day
            </button>

            <button
              onClick={() =>
                setSelectedDayIndex(
                  Math.min(mealPlanData.length - 1, selectedDayIndex + 1)
                )
              }
              disabled={selectedDayIndex === mealPlanData.length - 1}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#A3E635] to-green-400 rounded-xl text-black font-semibold hover:shadow-lg hover:shadow-[#A3E635]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next Day →
            </button>
          </div>
        </div>
      </section>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <MealDetailModal
          isOpen={true}
          mealType={selectedMeal.mealType}
          item={selectedMeal.item}
          onClose={handleCloseModal}
        />
      )}

      {/* Tips Section */}
      <section className="relative px-4 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12">Meal Plan Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💡</span> Prepare Meals in Advance
              </h3>
              <p className="text-gray-400">
                Meal prep on Sundays can save you time and ensure you stay on track throughout the week.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🥗</span> Swap Flexibly
              </h3>
              <p className="text-gray-400">
                Feel free to swap meals between days if you prefer different options, just keep the macros similar.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💧</span> Stay Hydrated
              </h3>
              <p className="text-gray-400">
                Drink at least 8-10 glasses of water daily to support digestion and recovery.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md p-8 hover:border-white/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⏱️</span> Time Your Meals
              </h3>
              <p className="text-gray-400">
                Space out meals 4-5 hours apart and eat within 30-45 minutes after workouts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
