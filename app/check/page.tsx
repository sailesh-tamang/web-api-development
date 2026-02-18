"use client";

import { useEffect, useState } from "react";
import TopBar from "../component/dashboard/TopBar";

export default function CheckBmiPage() {
  const [heightFeet, setHeightFeet] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiValue, setBmiValue] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [recordedAt, setRecordedAt] = useState<string | null>(null);

  const handleCalculate = () => {
    const height = parseFloat(heightFeet);
    const weight = parseFloat(weightKg);
    if (!height || !weight || height <= 0 || weight <= 0) {
      setError("Please enter valid height and weight.");
      setBmi(null);
      return;
    }
    const heightInMeters = height * 0.3048;
    const calculated = weight / (heightInMeters * heightInMeters);
    setBmi(Number(calculated.toFixed(1)));
    setBmiValue(calculated);
    setError("");
    setRecordedAt(new Date().toLocaleString());
  };

  const getBmiCategory = (value: number) => {
    if (value < 18.5)
      return { label: "Underweight", color: "#3b82f6", note: "Consider nutrient-dense meals." };
    if (value < 25)
      return { label: "Normal weight", color: "#22c55e", note: "Maintain balanced habits." };
    if (value < 30)
      return { label: "Overweight", color: "#f59e0b", note: "Add daily activity and portion control." };
    if (value < 35)
      return { label: "Obese", color: "#f97316", note: "Focus on gradual, sustainable changes." };
    return { label: "Extremely obese", color: "#ef4444", note: "Consult a healthcare professional." };
  };

  const getNeedleRotation = (value: number) => {
    const min = 15;
    const max = 35;
    const clamped = Math.max(min, Math.min(max, value));
    return ((clamped - min) / (max - min)) * 180 - 90;
  };

  const getCategoryId = (value: number) => {
    if (value < 18.5) return "underweight";
    if (value < 25) return "normal";
    if (value < 30) return "overweight";
    if (value < 35) return "obese";
    return "extreme";
  };

  useEffect(() => {
    if (bmiValue === null) return;
    const id = getCategoryId(bmiValue);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [bmiValue]);

  return (
    <div className="min-h-screen bg-black">
      <TopBar />
      <main className="px-5 py-12 text-white">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
          <h1 className="text-xl font-semibold">Measure BMI</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your height and weight to calculate BMI.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">
                Height (ft)
              </label>
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                className="mt-2 w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                placeholder="e.g. 5.8"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="mt-2 w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white"
                placeholder="e.g. 65"
                min="0"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black"
              onClick={handleCalculate}
            >
              Calculate BMI
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {bmi !== null && bmiValue !== null && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/70 p-5">
              {recordedAt && (
                <p className="text-xs text-slate-400">Recorded date: {recordedAt}</p>
              )}

              <div className="mt-4 flex items-center justify-center">
                <img
                  src="/images/bmi.jpg"
                  alt="BMI scale"
                  className="h-40 w-auto rounded-xl"
                />
              </div>

              <div className="mt-2 text-center">
                <p className="text-2xl font-semibold text-lime-300">{bmi}</p>
                <span
                  className="mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: getBmiCategory(bmiValue).color, color: "#0b0b0b" }}
                >
                  {getBmiCategory(bmiValue).label}
                </span>
                <p className="mt-2 text-xs text-slate-300">
                  {getBmiCategory(bmiValue).note}
                </p>
                <p className="mt-3 text-xs text-slate-300">
                  Height: {heightFeet} ft • Weight: {weightKg} kg
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div
              id="underweight"
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-200">Underweight</h2>
              <p className="mt-1 text-sm text-slate-300">
                Focus on calorie-dense, nutrient-rich foods and strength training.
              </p>
            </div>
            <div
              id="normal"
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-200">Normal Weight</h2>
              <p className="mt-1 text-sm text-slate-300">
                Maintain balanced meals, hydration, and consistent activity.
              </p>
            </div>
            <div
              id="overweight"
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-200">Overweight</h2>
              <p className="mt-1 text-sm text-slate-300">
                Add daily activity and portion control to support fat loss.
              </p>
            </div>
            <div
              id="obese"
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-200">Obese</h2>
              <p className="mt-1 text-sm text-slate-300">
                Aim for gradual changes: walking, balanced meals, and sleep.
              </p>
            </div>
            <div
              id="extreme"
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-slate-200">Extremely Obese</h2>
              <p className="mt-1 text-sm text-slate-300">
                Consider professional guidance for a safe, sustainable plan.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
