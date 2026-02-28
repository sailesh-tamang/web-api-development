'use client';

import { useState } from 'react';

interface WorkoutStep {
  title: string;
  duration?: string;
  details: string[];
}

interface WorkoutDetailsProps {
  name: string;
  duration: string;
  difficulty: string;
  calories: string;
  steps: WorkoutStep[];
  onClose: () => void;
}

export default function WorkoutDetailsModal({ name, duration, difficulty, calories, steps, onClose }: WorkoutDetailsProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Very Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 to-gray-900/80 border-b border-white/10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300">
                  ⏱️ {duration}
                </span>
                <span className={`px-3 py-1 border rounded-full text-sm font-semibold ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm text-orange-300">
                  🔥 {calories}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-2 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Step */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#A3E635]/20 border border-[#A3E635]/30 rounded-full">
                <span className="text-2xl font-bold text-[#A3E635]">
                  {currentStepIndex + 1}/{steps.length}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentStep.title}</h3>
                {currentStep.duration && (
                  <p className="text-gray-400 mt-1">⏱️ {currentStep.duration}</p>
                )}
              </div>
            </div>

            {/* Step Details */}
            <div className="space-y-3 mt-6">
              {currentStep.details.map((detail, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="mt-1 p-1 bg-[#A3E635] rounded-full flex-shrink-0">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-300 leading-relaxed flex-1">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    idx === currentStepIndex
                      ? 'bg-[#A3E635] text-black shadow-lg shadow-[#A3E635]/50'
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {idx + 1}. {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A3E635] to-green-400 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Previous
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#A3E635] to-green-400 rounded-lg text-black font-semibold hover:shadow-lg hover:shadow-[#A3E635]/50 transition-all duration-200"
              >
                ✓ Complete
              </button>
            ) : (
              <button
                onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#A3E635] to-green-400 rounded-lg text-black font-semibold hover:shadow-lg hover:shadow-[#A3E635]/50 transition-all duration-200"
              >
                Next →
              </button>
            )}
          </div>

          {/* Start Workout Button */}
          <button className="w-full px-6 py-4 bg-gradient-to-r from-[#A3E635] to-green-400 rounded-xl text-black font-bold text-lg hover:shadow-lg hover:shadow-[#A3E635]/50 transition-all duration-200 flex items-center justify-center gap-2">
            <span>▶️</span>
            <span>Start Workout Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
